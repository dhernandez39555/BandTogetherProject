import React from 'react'
import { useParams } from 'react-router-dom'

function ReadProfile() {
  const params = useParams();

  return (
    <div>ReadProfile{params.user_id}</div>
  )
}

export default ReadProfile