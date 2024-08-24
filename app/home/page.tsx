'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import bgImage from '../../assets/Background_space.png'

import RoomIdModal from '@/components/RoomIdModal';
import { ArrowBigRight } from 'lucide-react';
import { signOut } from 'next-auth/react';


const Page = () => {

  const audioRef = useRef<HTMLAudioElement>(null);
  const router= useRouter();

  const [openModal,setOpenModal] = useState<boolean>(false);
  const [currentIndex,setCurrentIndex] = useState<number>(0);

  const menuOptions = [
    { label: "Single Player", action: () => router.push('/practice') },
    { label: "Mulitplayer", action: () => createRoom() },
    { label: "Join a Private Room", action: () => setOpenModal(!openModal) },
    { label: "Join a Public Room (Coming Soon)", action: () => alert("Feature coming soon!") },
    { label: "Log Out", action: () => signOut({ callbackUrl: '/' }) }
  ];

  const createRoom = ()=>{
    const uniqueId = uuidv4();
    router.push(`/play/${uniqueId}`)
  }

  const playAudio=()=>{
    if(audioRef.current){
      audioRef.current.currentTime=0;
      audioRef.current.play();
    }
  }
 
  const moveDown = () => {
    playAudio();
    setCurrentIndex(prev => (prev < menuOptions.length - 1) ? prev + 1 : prev);
  }

  const moveUp = () => {
    playAudio();
    setCurrentIndex(prev => (prev > 0) ? prev - 1 : prev);
  }

  const selectOption = () => {
    setCurrentIndex((prev)=>{
      menuOptions[prev].action();
      return prev;
    })
  }
  
  useEffect(() => {

    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          moveUp();
          break;
        case 'Enter':
          selectOption();
          break;
        default:
          break;
      }
    }

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    }
  }, []);

  return (
    <div className='min-h-screen w-full flex flex-col items-center relative overflow-hidden'>
      <audio src="/assets/gameboy-pluck-41265.mp3" className='opacity-0' ref={audioRef}></audio>
      <Image src={bgImage} alt="space" className="h-screen w-full object-cover absolute top-0 left-0 z-0" />

      <div className='relative z-50 min-h-screen w-full py-12 flex flex-col items-center'>
        <div className="font-poxast text-[38px] leading-[60px] sm:text-[60px] sm:leading-[80px] md:text-[80px] md:leading-[120px] font-bold text-white text-center w-fit lg:w-2/3">
          Keyboard Warriors
        </div>

        <div className='flex flex-col items-center gap-8 text-white sm:text-xl md:text-2xl mt-12 font-minecraft font-semibold transition-all'>
          {menuOptions.map((option, index) => (
            <button 
              key={index} 
              onClick={option.action}
              className='flex gap-2 items-center'
            > 
              <ArrowBigRight className={`${currentIndex === index ? 'opacity-100' : 'opacity-0'}`} /> 
              <span className={`${index==3?'text-zinc-400':''}`}>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
      {openModal && <RoomIdModal setOpenModal={setOpenModal}/>}
    </div>
  )
}

export default Page
