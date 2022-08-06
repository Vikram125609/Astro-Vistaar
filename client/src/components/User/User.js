import React, { useEffect, useState } from 'react'
import UserCard from './UserCard';
const User = () => {
  const [user, setUser] = useState([]);
  const allUsers = async () => {
    const res = await fetch("http://localhost:5000/api/getalluser", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    const data = res.json().then((e) => {
      setUser(e);
    }).catch((error) => {
      console.log(error);
    })
    // console.log(data);
  }
  useEffect(() => {
    allUsers();
  }, [])
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>All User </h1>
      {
        (user.map((data, id) => {
          console.log("name :" + data.Name);
          console.log(data.Enrolled)
          return (<UserCard key={id} Name={data.Name} Contact={data.Contact} Email={data.Email} Password={data.Password} Enrolled={data.Enrolled} />)
        }))
      }

    </div>
  )
}

export default User
