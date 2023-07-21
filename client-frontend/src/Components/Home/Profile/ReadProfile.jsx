import React from 'react'

function ReadProfile() {

  const token = localStorage.getItem("token") 
  console.log(token)

  return (
    <div>ReadProfile</div>
  )
}

export default ReadProfile