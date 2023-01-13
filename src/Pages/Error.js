import React, { Component, useEffect, useState, useRef } from 'react';


const Error = () => {

  useEffect(()=>{

    setTimeout(() => {
      window.open('/','_self')
    }, 2000);
  },[])

  return (
    <div>
      {/* <h1>Error Page</h1> */}
      <h3><i className="fas fa-exclamation-triangle text-danger" /> Oops! Page not found.</h3>
    </div>
  )
}

export default Error
