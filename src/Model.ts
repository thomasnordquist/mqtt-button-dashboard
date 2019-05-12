import { Map, Record } from 'immutable'

export interface ButtonModel {
  state: boolean
  name: string
  baseTopic: string
  frecencyDates: Array<number>
  frecency: number
  iconId: string
}

export type ButtonRecord = Record<ButtonModel>

export const ButtonRecordFactory = Record<ButtonModel>({
  state: false,
  frecencyDates: [],
  frecency: Number.MAX_SAFE_INTEGER,
  name: "",
  baseTopic: "",
  iconId: "",
})

export function calculateFrecency(dates: Array<number>) {
  const now = Date.now()

  if (dates.length === 0 || !dates) {
    return Number.MAX_SAFE_INTEGER
  }
  const timeSpreadSum = dates
    .map(date => now - date)
    .reduce((a, b) => a + b)

  return Math.floor(Math.log(timeSpreadSum / dates.length))
}