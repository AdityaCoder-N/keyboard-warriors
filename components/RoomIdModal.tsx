'use client'
import { Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from 'pixel-retroui';
import React, { useState } from 'react'
import { useToast } from './ui/use-toast';

const RoomIdModal = ({setOpenModal}:{
    setOpenModal:React.Dispatch<React.SetStateAction<boolean>>
}) => {

  const host = process.env.SOCKET_HOST || "http://localhost:8000"

  const router = useRouter();
  const {toast} = useToast();

  const [roomId,setRoomId] = useState<string>('');
  const [loading,setLoading] = useState<boolean>(false)

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setRoomId(e.target.value);
  }

  const handleJoinRoom=async()=>{
    setLoading(true);
    try {
      const response = await fetch(`${host}/api/verify-room/${roomId}`);
      const data = await response.json();
      
      if (data.exists && !data.gameInProgress) {
        router.push(`/play/${roomId}`);
      } 
      else if(data.exists && data.gameInProgress){
        toast({
          variant:"destructive",
          title:"Room In Progress",
          description:"The room is already in progress, try joining in again later."
        })
      }
      else if(!data.exists){
        toast({
          variant:"destructive",
          title:"Room Not Found",
          description:"No room exists with that room Id."
        })
      }
      
    } catch (error) {
      console.error('Error verifying room:', error);
      toast({
        variant:"destructive",
        title:"Error",
        description:"No room exists with that room Id."
      })
    } finally{
        setLoading(false);
    }
  }
  return (
    <div className='fixed top-0 left-0 min-h-screen w-full bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50'>
        <Card className='p-6 flex flex-col items-center gap-3 relative'>
            <X className='absolute top-2 right-3 h-5 w-5 cursor-pointer bg-red-500 text-white' onClick={()=>setOpenModal(false)}/>
            <label htmlFor='roomId' className='text-xl'>Enter Room Id</label>
            <Input 
                className=''
                type="text" 
                value={roomId} 
                onChange={handleChange}
                placeholder='Room Id'
            />
            <Button 
              className='mt-4 w-full' 
              onClick={handleJoinRoom}
              bg="#6A7BA2"
              textColor="white"
              borderColor="black"
              shadow="#4E5C79"
            >
            { loading?
                <div className='flex items-center justify-center gap-2'>
                Please Wait <Loader2 className='h-4 w-4 animate-spin'/>
                </div>:
                "Join Room"
            }
            </Button>
        </Card>
    </div>
  )
}

export default RoomIdModal