'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import RoomIdModal from '@/components/RoomIdModal';

const Page = () => {

  const router= useRouter();

  const createRoom = ()=>{
    const uniqueId = uuidv4();
    router.push(`/play/${uniqueId}`)
  }

  const [openModal,setOpenModal] = useState<boolean>(false);

  return (
    <div className='flex flex-col items-center h-full w-full'>
        <div className='w-[90%] flex flex-col gap-8'>
            <button onClick={createRoom}>Invite Others to Play</button>
            <button>
                <Link href='/play/practice'>Practice Yourself</Link>
            </button>
            <button onClick={()=>setOpenModal(!openModal)}>Join private Room</button>
            <button disabled>Join a Public room (coming soon)</button>
        </div>
        {openModal && <RoomIdModal setOpenModal={setOpenModal}/>}
    </div>
  )
}

export default Page