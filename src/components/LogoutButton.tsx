'use client'
import { signOut } from 'next-auth/react'
import React from 'react'

export default function LogoutButton() {
    return (
      <div>
        <button onClick={() => {
            signOut()
        }}>
        Logout
        </button>
      </div>
  )
}
