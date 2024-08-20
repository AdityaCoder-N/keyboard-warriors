
'use client'
import React, { useState, useEffect,useRef } from 'react';
import ParagraphDisplay from './ParagraphDisplay';
import PowerUpWindow from './PowerUpWndow'
import { Button, Card } from 'pixel-retroui';
import { useSocket } from '@/context/SocketProvider';

interface TypingComponentProps{
  isTypingStarted:boolean;
  setIsTypingStarted:React.Dispatch<React.SetStateAction<boolean>>;
  roomId?:string;
  username?:string | null;
}

const TypingComponent = ({isTypingStarted,setIsTypingStarted,roomId,username=""}:TypingComponentProps) => {
  const paragraphs = [
    "Sarah watched the whirlpool mesmerized.",
    "Waiting and watching. It was all she had done for the past weeks. When you’re locked in a room with nothing but food and drink, that’s about all you can do anyway. She watched as birds flew past the window bolted shut. She couldn’t reach it if she wanted too, with that hole in the floor. She thought she could escape through it but three stories is a bit far down."
  ];

  const socket = useSocket();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [currentParagraph, setCurrentParagraph] = useState<string>(paragraphs[0]);
  const [typedText, setTypedText] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(true);

  const [correctCharacters,setCorrectCharacters] = useState<number>(0);

  const handleKeyPress = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
    
    const { key } = e;
    if (!isTypingStarted || key==='CapsLock') return;
    
    const nextTypedTextLength = typedText.length + 1;

    if (key === currentParagraph[typedText.length]) {
      setTypedText((prev) => prev + key);
      setIsCorrect(true);
      setCorrectCharacters((prev)=>prev+1);

        // Check if the next length matches the paragraph length
      if (nextTypedTextLength === currentParagraph.length) {
        setIsTypingStarted(false); // Stop typing
        console.log(socket);
        console.log(roomId);
        console.log(username);
        socket?.emit('gameWon',{roomId,username});
        return;
      }
    } else {
      setIsCorrect(false)
      // play sound
      e.preventDefault();
    }
  };

  return (
    <Card className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#b9d2e1] to-[#6b8595]">
      <div className="w-[80%] mt-8">
      
        <ParagraphDisplay paragraph={currentParagraph} typedText={typedText} isCorrect={isCorrect}/>

        <textarea
          ref={inputRef}
          className="mt-4 p-2 w-full border-2 border-gray-300 rounded-lg"
          onKeyDown={handleKeyPress}
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
        <PowerUpWindow correctCharacters={correctCharacters} paragraph={currentParagraph} typedText={typedText} setCorrectCharacters={setCorrectCharacters} setTypedText={setTypedText} inputRef={inputRef} setIsTypingStarted={setIsTypingStarted} roomId={roomId}/>
      </div>
    </Card>
  );
};

export default TypingComponent;
