import * as React from 'react'

export function Icon(props: {id?: string, color: string}) {
  const iconContainerStyle = {
    overflow: 'hidden',
    height: '24px',
    width: '24px',
    display: 'inline-block',
  }
  const iconStyle = {
    height: '24px',
    width: '24px',
    filter: `opacity(1) drop-shadow(${props.color} 30px 0px 0px) brightness(100%)`,
    transform: 'translate(-30px)',
  }

  const selector = `?id=${props.id}`

  return <div style={iconContainerStyle}>
    {props.id ? <img style={iconStyle} src={`/img/${selector}`} /> : null}
  </div>
}
