'use client'
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"

const Page = () => {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
      </>
    )
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn(null, { callbackUrl: '/home' })}>Sign in</button>
    </>
  )
}

export default Page
