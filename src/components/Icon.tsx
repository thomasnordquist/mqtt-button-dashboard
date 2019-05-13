import * as React from 'react'

export function Icon(props: {id?: string, color: string}) {
  const iconContainerStyle = {
    overflow: 'hidden',
    height: '40px',
    width: '40px',
    display: 'inline-block',
    zIndex: 1,
    filter: 'opacity(1)', // fix render bug where icon is not renderd
  }
  const iconStyle = {
    height: '40px',
    width: '40px',
    display: 'inline-block',
    filter: `opacity(1) drop-shadow(${props.color} 44px 0px 0px) brightness(100%)`,
    transform: 'translate(-44px)',
  }

  const selector = `?id=${props.id}`

  return <div style={iconContainerStyle}>
    {props.id ? <img style={iconStyle} src={`/img/${selector}`} /> : null}
  </div>
}
