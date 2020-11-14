import React from 'react'
import loaderIcon from '../assets/loaderIcon.gif'

const Loader = () => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img src={loaderIcon} alt='Loader' width='25' height='25' />
    </div>
  )
}

export default Loader
