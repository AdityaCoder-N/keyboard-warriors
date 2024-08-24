'use client'

import React, { useState,useEffect } from 'react'
import Image from 'next/image'
import crown from '../assets/crown.png'
import { ArrowBigRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { socketUser } from '@/types';

interface GameOverScreenProps{
  users?:socketUser[],
  winner:string|undefined|null,
  username:string|undefined|null,
  finalScore?:number
}

const GameOverScreen = ({users,winner,username,finalScore}:GameOverScreenProps) => {

  const router = useRouter();
  const [currentIndex,setCurrentIndex] = useState<number>(0);

  const menuOptions = [
    { label: "Go Back", action: () =>{ window?.location?.reload() }},
    { label: "Exit Room", action: () => router.replace('/home') }
  ];

  let optionAudio = new Audio('/assets/gameboy-pluck-41265.mp3');
  const moveDown = () => {
    optionAudio.currentTime=0;
    optionAudio.play();
    setCurrentIndex(prev => (prev < menuOptions.length - 1) ? prev + 1 : prev);
  }

  const moveUp = () => {
    optionAudio.currentTime=0;
    optionAudio.play();
    setCurrentIndex(prev => (prev > 0) ? prev - 1 : prev);
  }

  const selectOption = () => {
    setCurrentIndex(prev=>{
      menuOptions[prev].action();
      return prev;
    })
  }

  useEffect(() => {

    const losingAudio = new Audio('/assets/8-bit-video-game-lose-sound-version-1-145828.mp3')
    const winningAudio = new Audio('/assets/winneris.ogg')

    if(username===winner){
      winningAudio.play();
    }
    else{
      losingAudio.play();
    }

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
    <div className='fixed z-50 top-0 left-0 min-h-screen w-full bg-[rgba(0,0,0,0.95)]'>
        <div className='z-50 min-h-screen w-full font-minecraft'>
            <div className='mt-20 text-center'>
              <h2 className='text-[rgb(171,52,86)] text-[40px] sm:text-[50px] md:text-[60px] leading-[45px] font-bold'>Game Over</h2>
              {
                winner===username?
                <h1 className='text-[70px] sm:text-[100px] md:text-[120px] text-[rgb(35,105,33)] font-bold'>You Won</h1>:
                <h1 className='text-[70px] sm:text-[100px] md:text-[120px] text-[rgb(35,105,33)] font-bold'>You Lost</h1>
              }  
            </div>

            <div className='mt-12 relative text-center'>
                <Image src={crown} alt='crown' className='h-12 w-12 absolute left-1/2 -translate-x-1/2 -top-12 crown' />
                <h3 className='text-yellow-400 font-semibold text-xl md:text-3xl'>{winner}</h3>
            </div>

            {finalScore && <div className='mt-12 text-xl text-white text-center'>
              Score : {finalScore} wpm
            </div>}

            {users && <div className='mt-20 flex gap-6 justify-center items-center text-white'>
            {
              users.map((user:socketUser)=>{
                if(user.username!==winner){
                  return(
                      <span key={user.id}>{user.username}</span>
                    )
                }
              })
            }
            </div>}

            <div className='flex flex-col items-center gap-6 text-white mt-12 font-semibold transition-all'>
            {menuOptions.map((option, index) => (
                <button 
                key={index} 
                onClick={option.action}
                className='flex gap-2 items-center'
                > 
                <ArrowBigRight className={`${currentIndex === index ? 'opacity-100' : 'opacity-0'}`} /> 
                <span >{option.label}</span>
                </button>
            ))}
            </div>

        </div>
    </div>
  )
}

export default GameOverScreen