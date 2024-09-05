import React from 'react'
import "./main.css"
function Main({children}) {
  return (
    <div className='main' id='main'>
        {children} 
    </div>
  )
}

export default Main