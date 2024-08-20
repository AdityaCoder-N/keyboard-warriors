'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSocket } from '@/context/SocketProvider'
import TypingComponent from '@/components/TypingComponent'
import CountDownToast from '@/components/CountDownToast'
import { Copy } from 'lucide-react'
import { socketUser } from '@/types'

import Image from 'next/image'
import bgImage from '../../../assets/Background_space.png'

import { Card } from 'pixel-retroui'
import { useToast } from '@/components/ui/use-toast'
import GameOverScreen from '@/components/GameOverScreen'

interface RoomParamsInterface{
    params:{
        roomId:string
    }
}


const Page = ({params}:RoomParamsInterface) => {

  let { data: session, status } = useSession();
  const socket = useSocket();  
  const {toast} = useToast();
  
  const roomId = params.roomId;
  
  const [roomUrl,setRoomUrl] = useState('');
  const [users,setUsers] = useState<socketUser[]>([]);
  const [ready,setReady] = useState<boolean>(false);
  const [startGame,setStartGame] = useState<boolean>(false);
  const [openModal,setOpenModal] = useState(false)
  const [gameOver,setGameOver] = useState(false)
  const [winner,setWinner] = useState('');
  
  useEffect(()=>{
    
    if(socket && session){
        socket?.emit('joinRoom',{roomId, username:session?.user?.name || session?.user?.username})

        socket?.on('roomUsers',(roomUsers:socketUser[])=>{
            console.log(roomUsers)
            setUsers(roomUsers)
        });

        socket?.on('startGame',()=>{
            // setStartGame(true);
            setOpenModal(true);
            console.log("Game to be started");
        })

        socket?.on('gameWon',({winner})=>{
          console.log("Game won by",winner);
          setWinner(winner);
          setGameOver(true);
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
    console.log("clicked")
    toast({
      title:"Url Copied!",
      description:"Room Url has been copied to clipboard.",
      variant:"default"
    })
  }

  const handleReadyChange=(event: React.ChangeEvent<HTMLInputElement>)=>{
    const isReady = event.target.checked;
    setReady(isReady);
    if (socket) {
        socket.emit('toggleReady', { roomId, isReady: isReady });
    }
  }

  const beginGame=()=>{
    setStartGame(true); 
    setOpenModal(false)
  }

  if (status === "unauthenticated") {
    return <p>Please Sign In to use this route.</p>
  }
  return (
    <div className='min-h-screen w-full relative'>
      {gameOver && <GameOverScreen winner={winner} users={users} username={session?.user.username} roomUrl={roomUrl}/>}

      <Image src={bgImage} alt="space" className="h-screen w-full object-cover absolute top-0 left-0 z-0" />
      
      <div className='relative z-5 min-h-screen w-full py-6 flex flex-col items-center'>

        <Card>
          <div className='w-full text-black px-3 py-2 flex items-center justify-between gap-4'>
            <span className='font-semibold'>Room URL: </span>
            <span>
              {roomUrl}
            </span>
            <Copy className='h-4 w-4 cursor-pointer' onClick={copyToClipboard}/>
          </div>
        </Card>

        <div className='flex gap-8 md:w-[90%] mt-6'>
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
          <div className='w-4/5 h-full'>
            <TypingComponent isTypingStarted={startGame} setIsTypingStarted={setStartGame} roomId={roomId} username={session?.user?.username}/>
          </div>
        </div>
        
        {openModal && <CountDownToast message='Game starting in' time={5} onCountdownEnd={beginGame}/>}
        
      </div>
    </div>
  )
}

export default Page