'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

const Page = () => {

  const router= useRouter();

  const createRoom = ()=>{
    const uniqueId = uuidv4();
    router.push(`/play/${uniqueId}`)
  }


  return (
    <div className='flex flex-col items-center h-full w-full'>
        <div className='w-[90%] flex flex-col gap-8'>
            <button onClick={createRoom}>Invite Others to Play</button>
            <button>
                <Link href='/play/practice'>Practice Yourself</Link>
            </button>
            <button disabled>Join a room (coming soon)</button>
        </div>
    </div>
  )
}

export default Page