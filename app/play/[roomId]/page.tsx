'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSocket } from '@/context/SocketProvider'
import TypingComponent from '@/components/TypingComponent'
import CountDownToast from '@/components/CountDownToast'


interface RoomParamsInterface{
    params:{
        roomId:string
    }
}
type socketUser={
    id:string,
    username:string
}

const Page = ({params}:RoomParamsInterface) => {

  let { data: session, status } = useSession();
  const socket = useSocket();   
  const roomId = params.roomId;
  
  const [users,setUsers] = useState<string[]>([]);
  const [ready,setReady] = useState<boolean>(false);
  const [startGame,setStartGame] = useState<boolean>(false)
  
  useEffect(()=>{
    console.log(session);
    
    if(socket && session){
        socket?.emit('joinRoom',{roomId, username:session?.user?.name})

        socket?.on('roomUsers',(roomUsers:socketUser[])=>{
            console.log(roomUsers)
            setUsers(roomUsers.map((user:socketUser) => user.username))
        });

        socket?.on('startGame',()=>{
            setStartGame(true);
            console.log("Game to be started");
        })
    }

  },[socket, roomId, session])

  const handleReadyChange=(event: React.ChangeEvent<HTMLInputElement>)=>{
    const isReady = event.target.checked;
    setReady(isReady);
    if (socket) {
        socket.emit('toggleReady', { roomId, isReady: isReady });
    }
  }

  if (status === "unauthenticated") {
    return <p>Please Sign In to use this route.</p>
  }
  return (
    <div>
        {users.map((user,index)=>{
            return(
                <div key={index} className='bg-violet-500 text-white my-4'>
                    {user}
                </div>
            )
        })}

        <div className='flex gap-4 items-center'>
            <label htmlFor="ready">Ready? :</label>
            <input
                type="checkbox"
                checked={ready}
                onChange={handleReadyChange}
            />
        </div>
        
        <TypingComponent isTypingStarted={startGame} setIsTypingStarted={setStartGame} roomId={roomId} username={session?.user?.name}/>
        
    </div>
  )
}

export default Page