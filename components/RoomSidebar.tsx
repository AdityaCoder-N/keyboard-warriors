'use client'
import { useSocket } from '@/context/SocketProvider';
import { socketUser } from '@/types';
import { Button, Card } from 'pixel-retroui'
import React, { useEffect, useState } from 'react'
import GameInfoModal from './GameInfoModal';

interface RoomSidebarProps{
    startGame:boolean;
    roomId:string;
}

const RoomSidebar = ({
    startGame,
    roomId
}:RoomSidebarProps) => {

  const {socket}= useSocket();
  const [ready,setReady] = useState<boolean>(false);
  const [users,setUsers] = useState<socketUser[]>([]);

  // state to toggle game info modal
  const [gameInfoModal,setGameInfoModal] = useState(false);
  

  const handleReadyChange=(event: React.ChangeEvent<HTMLInputElement>)=>{
    const isReady = event.target.checked;
    setReady(isReady);
    if (socket) {
        socket.emit('toggleReady', { roomId, isReady: isReady });
    }
  }

  useEffect(()=>{
    if(socket){
      socket?.on('roomUsers',(roomUsers:socketUser[])=>{
        setUsers(roomUsers)
      });
    }
  },[socket])

  return (
    <Card className='w-full md:w-1/5 p-3 bg-gradient-to-br from-[#b9d2e1] to-[#8eabbd] text-sm md:text-base flex flex-col'>
        <div className='flex gap-2 md:gap-4 items-center '>
            <label htmlFor="ready">Are you Ready? :</label>
            <input
                type="checkbox"
                checked={ready}
                onChange={handleReadyChange}
                disabled={startGame}
            />
        </div>
        <div className='mt-8 md:mt-4 my-2 md:my-4 font-semibold'>Players in the room:</div>
        <div className='max-h-[45vh] overflow-y-auto'>
            {users.map((user,index)=>{
            return(
                <div key={index} className='my-2'>
                    {index+1}.{" "}{user.username} : {user.isReady?'Ready':'Not Ready'}
                </div>
            )
            })}
        </div>

        {gameInfoModal && <GameInfoModal onClose={()=>setGameInfoModal(false)}/>}
        <Button onClick={()=>setGameInfoModal(true)} className='md:mt-auto w-[95%] md:w-[90%] mt-4'>How to play?</Button>
    </Card>
  )
}

export default RoomSidebar