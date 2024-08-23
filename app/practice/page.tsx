'use client'
import React, { useState,useRef } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import { Button, Card } from 'pixel-retroui';
import ParagraphDisplay from '@/components/ParagraphDisplay';
import CountDownToast from '@/components/CountDownToast';
import GameOverScreen from '@/components/GameOverScreen';

import useTimer from '@/hooks/useTimer';
import useTyping from '@/hooks/useTyping';

import bgImage from '@/assets/Background_space.png'
import TypingComponent from '@/components/TypingComponent';

const Page = () => {

  const onComplete=()=>{
    setIsTypingStarted(false); // Stop typing
    calculateFinalScore();
    stopTimer();
    setGameOver(true);
  }

  // typing hook to handle typing logic
  const { 
    currentParagraph, 
    handleKeyPress, 
    typedText, 
    isCorrect, 
  } = useTyping(onComplete);
  
  let { data: session, status } = useSession();
  const username = session?.user?.username || session?.user?.name;
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // states to set modal and end screen
  const [countdownModal,setCountdownModal] = useState(false);
  const [gameOver,setGameOver] = useState(false);

  // states to handle game running state and score
  const [isTypingStarted, setIsTypingStarted] = useState<boolean>(false);
  const [finalScore,setFinalScore] = useState<number>(0);

  // timer hook for handling timer logic
  const { elapsedTime, formattedTime, stopTimer } = useTimer(isTypingStarted);

  const calculateFinalScore=()=>{
    const words = currentParagraph.split(" ").length;
    const timeTaken = elapsedTime/60;

    let finalScore = Math.floor(words/timeTaken);
    setFinalScore(finalScore);
  }

  const onModalClose=()=>{
    setIsTypingStarted(true); 
    setCountdownModal(false);
    inputRef.current?.focus();
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center relative">

      {gameOver && <GameOverScreen finalScore={finalScore} username={username} winner={username}/>}

      <Image src={bgImage} alt="space" className="h-screen w-full object-cover absolute top-0 left-0 z-0" />

      <div className="relative z-5 min-h-screen w-[60%] py-4 flex flex-col items-center">
        <Card className='w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#b9d2e1] to-[#6b8595] p-6'>

          <ParagraphDisplay paragraph={currentParagraph} typedText={typedText} isCorrect={isCorrect}/>

          <textarea
            ref={inputRef}
            className="mt-4 p-2 w-full border-2 border-gray-300 rounded-lg"
            onKeyDown={handleKeyPress}
            autoFocus
            disabled={!isTypingStarted}
          />

          <div className={`flex items-center w-full mt-2 ${isTypingStarted?'justify-end':'justify-between'}`}>
            {
              !isTypingStarted &&
              <Button 
                onClick={()=>setCountdownModal(true)} 
                bg='#6A7BA2'
                shadow='#4E5C79'
                className='text-white mt-3'
                disabled={isTypingStarted}
              >Click to Start</Button>
            }

            <span>{formattedTime}</span>
          </div>
        </Card>

      </div>

      {countdownModal && <CountDownToast message='Game starting in' time={5} onCountdownEnd={onModalClose}/>}
    </div>
  );
};

export default Page;
