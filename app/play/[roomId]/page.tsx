'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSocket } from '@/context/SocketProvider'
import TypingComponent from '@/components/TypingComponent'
import CountDownToast from '@/components/CountDownToast'
import { Copy } from 'lucide-react'


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
  
  const [roomUrl,setRoomUrl] = useState('');
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

  useEffect(()=>{
    let roomUrl=''
    if (typeof window !== 'undefined') {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      roomUrl = `${baseUrl}/play/${roomId}`;
    }
    setRoomUrl(roomUrl);
    
  },[])
  
  const copyToClipboard=()=>{
    navigator.clipboard.writeText(roomUrl);
    // toast({
    //   title:"Url Copied!",
    //   description:"Profile Url has been copied to clipboard."
    // })
  }

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
        <div className='w-full bg-slate-500 text-white px-3 py-2 flex items-center justify-between'>
            {roomUrl}
            <Copy className='h-4 w-4 cursor-pointer' onClick={copyToClipboard}/>
        </div>
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