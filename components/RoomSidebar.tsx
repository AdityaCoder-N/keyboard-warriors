'use client'
import { useSocket } from '@/context/SocketProvider';
import { socketUser } from '@/types';
import { Card } from 'pixel-retroui'
import React, { useState } from 'react'

interface RoomSidebarProps{
    startGame:boolean;
    users:socketUser[];
    roomId:string;
}

const RoomSidebar = ({
    startGame,
    users,
    roomId
}:RoomSidebarProps) => {

  const socket= useSocket();
  const [ready,setReady] = useState<boolean>(false);

  const handleReadyChange=(event: React.ChangeEvent<HTMLInputElement>)=>{
    const isReady = event.target.checked;
    setReady(isReady);
    if (socket) {
        socket.emit('toggleReady', { roomId, isReady: isReady });
    }
  }

  return (
    <Card className='w-1/5 p-3 bg-gradient-to-br from-[#b9d2e1] to-[#8eabbd]'>
        <div className='flex gap-4 items-center'>
            <label htmlFor="ready">Are you Ready? :</label>
            <input
                type="checkbox"
                checked={ready}
                onChange={handleReadyChange}
                disabled={startGame}
            />
        </div>
        <div className='my-4 font-semibold'>Players in the room:</div>
        <div className='max-h-[45vh] overflow-y-auto'>
            {users.map((user,index)=>{
            return(
                <div key={index} className='my-2'>
                    {index+1}.{" "}{user.username} : {user.isReady?'Ready':'Not Ready'}
                </div>
            )
            })}
        </div>
    </Card>
  )
}

export default RoomSidebar