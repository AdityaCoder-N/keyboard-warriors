'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSocket } from '@/context/SocketProvider'
import { socketUser } from '@/types'

import Image from 'next/image'
import bgImage from '../../../assets/Background_space.png'

import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

import CountDownToast from '@/components/CountDownToast'
import TypingComponent from '@/components/TypingComponent'
import GameOverScreen from '@/components/GameOverScreen'
import RoomHeader from '@/components/RoomHeader'
import RoomSidebar from '@/components/RoomSidebar'

interface RoomParamsInterface{
    params:{
        roomId:string
    }
}

const Page = ({params}:RoomParamsInterface) => {

  const router = useRouter();
  let { data: session, status } = useSession();
  const socket = useSocket();  
  const {toast} = useToast();
  
  const roomId = params.roomId;
  const username = session?.user?.username || session?.user?.name;
  
  // users in room
  const [users,setUsers] = useState<socketUser[]>([]);
  
  // states to handle game running state
  const [startGame,setStartGame] = useState<boolean>(false);
  const [countdownModal,setCountdownModal] = useState(false)
  const [gameOver,setGameOver] = useState(false)
  const [winner,setWinner] = useState('');
  
  useEffect(()=>{
    
    if(socket && session){

        socket?.emit('joinRoom',{roomId,username})

        socket.on('gameInProgress', (inProgress: boolean) => {
          if (inProgress) {
            toast({
              title: 'Game In Progress',
              description: 'You cannot join this room as a game is already in progress.',
              variant: 'destructive'
            });
            router.replace('/home');
          }
        });

        socket?.on('roomUsers',(roomUsers:socketUser[])=>{
            console.log(roomUsers)
            setUsers(roomUsers)
        });

        socket?.on('startGame',()=>{
            // setStartGame(true);
            setCountdownModal(true);
            console.log("Game to be started");
        })

        socket?.on('gameWon',({winner})=>{
          console.log("Game won by",winner);
          setWinner(winner);
          setGameOver(true);
        })
    }

  },[socket, roomId, session, username])

  const beginGame=()=>{
    setStartGame(true); 
    setCountdownModal(false);
  }

  if (status === "unauthenticated") {
    return <p>Please Sign In to use this route.</p>
  }
  return (
    <div className='min-h-screen w-full relative'>

      {gameOver && <GameOverScreen winner={winner} users={users} username={username} />}

      <Image src={bgImage} alt="space" className="h-screen w-full object-cover absolute top-0 left-0 z-0" />
      
      <div className='relative z-5 min-h-screen w-full py-4 flex flex-col items-center'>

        <RoomHeader roomId={roomId}/>

        <div className='flex gap-8 md:w-[90%] mt-4'>
          
          <RoomSidebar users={users} startGame={startGame} roomId={roomId}/>

          <div className='w-4/5 h-full'>
            <TypingComponent isTypingStarted={startGame} setIsTypingStarted={setStartGame} roomId={roomId} username={session?.user?.username}/>
          </div>
        </div>
        
        {countdownModal && <CountDownToast message='Game starting in' time={5} onCountdownEnd={beginGame}/>}
        
      </div>
    </div>
  )
}

export default Page