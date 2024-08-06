'use client'
import { Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const RoomIdModal = ({setOpenModal}:{
    setOpenModal:React.Dispatch<React.SetStateAction<boolean>>
}) => {

  const router = useRouter();
  const [roomId,setRoomId] = useState<string>('');
  const [loading,setLoading] = useState<boolean>(false)

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setRoomId(e.target.value);
  }

  const handleJoinRoom=async()=>{
    setLoading(true);
    try {
        const response = await fetch(`http://localhost:8000/api/verify-room/${roomId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.exists) {
            router.push(`/play/${roomId}`);
          } else {
            alert('Room ID is incorrect. Please try again.');
          }
        } else {
          alert('Room ID is incorrect. Please try again.');
        }
    } catch (error) {
        console.error('Error verifying room:', error);
        alert('An error occurred. Please try again.');
    } finally{
        setLoading(false);
    }
  }
  return (
    <div className='fixed top-0 left-0 min-h-screen w-full bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50'>
        <div className='bg-white rpunded-lg p-6 flex flex-col gap-3 relative'>
            <X className='absolute top-2 right-2 h-4 w-4 cursor-pointer' onClick={()=>setOpenModal(false)}/>
            <label htmlFor='roomId'>Enter Room Id</label>
            <input 
                className='border-black border rounded-lg px-3 py-2'
                type="text" 
                value={roomId} 
                onChange={handleChange}
            />
            <button className='mt-4 bg-violet-500 rouded-lg' onClick={handleJoinRoom}>
            { loading?
                <div className='flex items-center justify-center gap-2'>
                Please Wait <Loader2 className='h-4 w-4 animate-spin'/>
                </div>:
                "Join Room"
            }
            </button>
        </div>
    </div>
  )
}

export default RoomIdModal