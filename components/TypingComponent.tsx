
'use client'
import React, { useState, useEffect,useRef } from 'react';
import ParagraphDisplay from './ParagraphDisplay';
import PowerUpWindow from './PowerUpWndow'
import { Button, Card } from 'pixel-retroui';
import { useSocket } from '@/context/SocketProvider';
import useTyping from '@/hooks/useTyping';

interface TypingComponentProps{
  isTypingStarted:boolean;
  setIsTypingStarted:React.Dispatch<React.SetStateAction<boolean>>;
  roomId?:string;
  username?:string | null;
}

const TypingComponent = ({isTypingStarted,setIsTypingStarted,roomId,username=""}:TypingComponentProps) => {

  const onComplete=()=>{
    setIsTypingStarted(false); // Stop typing
    socket?.emit('gameWon',{roomId,username});
  }

  const { 
    currentParagraph, 
    handleKeyPress, 
    typedText, 
    isCorrect, 
    correctCharacters,
    setCorrectCharacters,
    setTypedText,
    setCurrentParagraph
  } = useTyping(onComplete);

  const {socket} = useSocket();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(()=>{

    socket?.on('paragraph',(paragraph:string)=>{
      setCurrentParagraph(paragraph);
    })

  },[socket])

  useEffect(()=>{
    if(inputRef.current && isTypingStarted){
      inputRef.current.focus();
    }
  },[isTypingStarted]);

  return (
    <Card className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#b9d2e1] to-[#6b8595]">

      <div className="w-[95%] md:w-[80%] mt-4 sm:mt-8">
        <ParagraphDisplay paragraph={currentParagraph} typedText={typedText} isCorrect={isCorrect}/>

        <textarea
          ref={inputRef}
          className="mt-4 p-2 w-full border-2 border-gray-300 rounded-lg"
          onChange={handleKeyPress}
          autoFocus
          disabled={!isTypingStarted}
        />
        <div className='flex justify-between items-center'>
          <Button 
            onClick={()=>{inputRef.current?.focus()}} 
            bg='#6A7BA2'
            shadow='#4E5C79'
            className='text-white mt-3'
          >Click to type</Button>
          <span>
            Points: {correctCharacters}
          </span>
        </div>

        <PowerUpWindow 
          username={username}
          correctCharacters={correctCharacters} 
          paragraph={currentParagraph} 
          typedText={typedText} 
          setCorrectCharacters={setCorrectCharacters} 
          setTypedText={setTypedText} 
          inputRef={inputRef} 
          setIsTypingStarted={setIsTypingStarted} 
          roomId={roomId}
          onComplete={onComplete}
        />

      </div>
    </Card>
  );
};

export default TypingComponent;
