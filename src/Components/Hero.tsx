import React from 'react'
import logo from '/images/logo.webp'

export default function Hero() {
  return (
    <div className='bg-black flex justify-center items-center h-[200px]'>
        <img src={logo} alt="logo"/>
    </div>
  )
}
