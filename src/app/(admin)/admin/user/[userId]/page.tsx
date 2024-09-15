import React from 'react'
import EditUser from '../../components/EditUser'

export default function page({ params }: any) {
    const { userId } = params
  return (
    <div>
      <EditUser userId={userId} />
    </div>
  )
}
