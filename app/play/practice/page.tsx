'use client'
import React, { useState, useEffect,useRef } from 'react';
import ParagraphDisplay from '../../../components/ParagraphDisplay';
import PowerUpWindow from '../../../components/PowerUpWndow'
const Page = () => {
  const paragraphs = [
    "Sarah watched the whirlpool mesmerized. She couldn't take her eyes off the water swirling around and around. She stuck in small twigs and leaves to watch the whirlpool catch them and then suck them down. It bothered her more than a little bit that this could also be used as a metaphor for her life.",
    "Waiting and watching. It was all she had done for the past weeks. When you’re locked in a room with nothing but food and drink, that’s about all you can do anyway. She watched as birds flew past the window bolted shut. She couldn’t reach it if she wanted too, with that hole in the floor. She thought she could escape through it but three stories is a bit far down."
  ];

  const inputRef = useRef<HTMLInputElement>(null);

  const [countdown, setCountdown] = useState<number>(5);
  const [currentParagraph, setCurrentParagraph] = useState<string>(paragraphs[0]);
  const [typedText, setTypedText] = useState<string>('');
  const [isTypingStarted, setIsTypingStarted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(true);

  const [correctCharacters,setCorrectCharacters] = useState<number>(0);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setIsTypingStarted(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>) => {
    
    const { key } = e;
    if (!isTypingStarted || key==='CapsLock') return;
    
    
    if (key === currentParagraph[typedText.length]) {
      setTypedText((prev) => prev + key);
      setIsCorrect(true);
      setCorrectCharacters((prev)=>prev+1);
    } else {
      setIsCorrect(false)
      // play sound
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-blue-500 w-full h-full flex flex-col items-center">
      <div className="w-[60%]">
        <h1 className="mt-12 my-4 text-3xl font-bold">Start Typing in: {countdown}</h1>

        <ParagraphDisplay paragraph={currentParagraph} typedText={typedText} isCorrect={isCorrect}/>

        <input
          ref={inputRef}
          type="text"
          className="mt-4 p-2 w-full border-2 border-gray-300 rounded-lg opacity-0 h-0"
          onKeyDown={handleKeyPress}
          autoFocus
        />

        <PowerUpWindow correctCharacters={correctCharacters} paragraph={currentParagraph} typedText={typedText} setCorrectCharacters={setCorrectCharacters} setTypedText={setTypedText} inputRef={inputRef} setIsTypingStarted={setIsTypingStarted}/>
      </div>
    </div>
  );
};

export default Page;
