import React from 'react'
import { useAuth } from '../context/AuthContext'

const UserHome = () => {
    const {user} = useAuth();
  return (
    <div>
      <h1>Dashboard page</h1>
      <h2>Name - {user.name}</h2>
      <h2>Username - {user.username}</h2>
      <h2>Email - {user.email}</h2>
    </div>
  )
}

export default UserHome
