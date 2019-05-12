import * as fs from 'fs'
import * as Koa from 'koa'
import * as path from 'path'
import axios from 'axios'
import { noCase } from 'change-case'
let NounProject = require('the-noun-project')
const sha1 = require('sha1')
const serve = require('koa-static');
require('dotenv').config()

let nounProject = new NounProject({
  key: process.env.NOUN_PROJECT_KEY,
  secret: process.env.NOUN_PROJECT_SECRET,
})

const app = new Koa();
app.use(serve('build/'));

function readCache() {
  let file = './cache/data.json'
  if(fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file).toString())
  }

  return {}
}
const searchResults: {[s: string]: SearchResult} = readCache()

async function searchForTerm(term: string): Promise<Array<Icon>> {
  return new Promise((resolve, reject) => {
    let cachedResult = searchResults[term]
    if (cachedResult) {
      resolve(cachedResult.result ? cachedResult.result.icons : [])
      return
    }

    nounProject.getIconsByTerm(term, function (err: string, data: ResultContainer) {
      const is404 = err && JSON.stringify(err) == '404 HTTP response code'
      if (!err || is404) {
        searchResults[term] = {
          term,
          date: Date.now(),
          result: is404 ? undefined : data
        }
        fs.writeFileSync('./cache/data.json', JSON.stringify(searchResults))
        resolve(data.icons)
      } else {
        reject(Error(err))
      }
    })
  })
}

async function resolveWithImage(url: string, ctx: Koa.ParameterizedContext<any, {}>) {
  let extension = path.extname(url)
  const hashedName = `./cache/${sha1(url)}${extension}`

  if (fs.existsSync(hashedName)) {
    ctx.body = fs.readFileSync(hashedName)
  } else {
    const response = await axios.get(url, {responseType: 'arraybuffer'})
    ctx.body = response.data
    if (response.headers['content-type'] !== 'image/png') {
      throw Error("Unexpected content type")
    }
  
    fs.writeFileSync(hashedName, response.data)
  }
  ctx.set('content-type', 'image/png')

}

// Image ids for query
app.use(async (ctx, next) => {
  const {query} = ctx.query
  if (!query) {
    await next()
    return
  }

  const result = await searchForTerm(query)
  if (result) {
    ctx.body = result.map(r => r.id)
  } else {
    ctx.status = 404
    ctx.body = ''
  }
});

// Image by id
app.use(async (ctx, next) => {
  const { id } = ctx.query
  if (!id) {
    await next()
    return
  }

  let icon = Object.values(searchResults).map(result => result.result)
    .map(result => result ? result.icons : [])
    .reduce((a, b) => a.concat(b), [])
    .find(icon => icon.id === id)

  if (icon) {
    await resolveWithImage(icon.preview_url, ctx)
  }
});

// By name
app.use(async (ctx, next) => {
  const term = noCase(ctx.query.term)
  const result = await searchForTerm(term)

  if (result[0]) {
    await resolveWithImage(result[0].preview_url, ctx)
  } else {
    console.log('not found')
    ctx.status = 404
    ctx.body = ''
  }
});
 
app.listen(3001);

interface SearchResult {
  term: string,
  date: number,
  result?: ResultContainer
}

interface ResultContainer {
  generated_at: string
  icons: Array<Icon>
}

interface Icon {
  attribution: string,
  attribution_preview_url: string
  collections: [],
  date_uploaded: string // '2013-04-05',
  id: string // '14916',
  is_active: string // '1',
  is_explicit: string // '0',
  license_description: 'creative-commons-attribution' | string,
  nounji_free: string // '0',
  permalink: string // relative
  icon_url?: string
  preview_url: string
  preview_url_42: string
  preview_url_84: string
 // sponsor: {},
 // sponsor_campaign_link: null,
 // sponsor_id: '',
 //  tags: [ [Object], [Object], [Object], [Object] ],
  term: string
  term_id: number
  term_slug: string
  updated_at:  string // '2019-04-22 19:22:17',
  uploader: { 
    location: string // 'São Paulo, SP, BR',
    name: string // 'Rafael Eidelwein',
    permalink: string // '/reidelwein',
    username: string // 'reidelwein' },
    uploader_id:  string // '49612',
    year: number// 2013
  }
}
