import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Direct() {

  const params = useParams();
  const [ directs, setDirects ] = useState([])

  useEffect(() => {
    const options = {
      headers: new Headers({
        "Content-Type": "application/json",
        "authorization": localStorage.getItem("token")
      })
    }

    fetch(`http://127.0.0.1:4000/message/readAllFrom/${params.otherUser_id}`, options)
      .then(res => res.json())
      .then(data => console.log(data))
  }, [])

  
  return (
    <div>{params.otherUser_id}</div>
  )
}

export default Direct