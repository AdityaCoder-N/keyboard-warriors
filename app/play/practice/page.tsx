'use client'
import React, { useState, useEffect,useRef } from 'react';
import ParagraphDisplay from '../../../components/ParagraphDisplay';

const Page = () => {
  const paragraphs = [
    "Sarah watched.",
    "Waiting and watching."
  ];

  const inputRef = useRef<HTMLInputElement>(null);

  const [countdown, setCountdown] = useState<number>(5);
  const [currentParagraph, setCurrentParagraph] = useState<string>(paragraphs[0]);
  const [typedText, setTypedText] = useState<string>('');
  const [isTypingStarted, setIsTypingStarted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(true);

  const [correctCharacters,setCorrectCharacters] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [finalScore,setFinalScore] = useState<number>(0);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setIsTypingStarted(true);
          startTimer();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    if (!isTypingStarted || key==='CapsLock') return;
  
    const nextTypedTextLength = typedText.length + 1;
    if (key === currentParagraph[typedText.length]) {
      setTypedText((prev) => prev + key);
      setIsCorrect(true);
      setCorrectCharacters((prev)=>prev+1);

      if (nextTypedTextLength === currentParagraph.length) {
        setIsTypingStarted(false); // Stop typing
        stopTimer();

      }
    } else {
      setIsCorrect(false)
      // play sound
      e.preventDefault();
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    calculateFinalScore();
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const calculateFinalScore=()=>{
    const words = currentParagraph.split(" ").length;
    const timeTaken = elapsedTime/60;

    let finalScore = Math.floor(words/timeTaken);
    setFinalScore(finalScore);
  }
  return (
    <div className="min-h-screen bg-blue-500 w-full h-full flex flex-col items-center">
      <div className="w-[60%]">
        <div className='mt-12 my-4 flex items-center justify-between'>
          <h1 className=" text-3xl font-bold">{
          countdown>0?`Start Typing in: ${countdown}`:'Start Typing'} </h1>
          <h3 className='text-xl font-semibold'>{formatTime(elapsedTime)}</h3>
        </div>

        <ParagraphDisplay paragraph={currentParagraph} typedText={typedText} isCorrect={isCorrect}/>

        <input
          ref={inputRef}
          type="text"
          className="mt-4 p-2 w-full border-2 border-gray-300 rounded-lg opacity-0 h-0"
          onKeyDown={handleKeyPress}
          autoFocus
        />

        {finalScore!==0 && <div className='mt-8'>
          Final Score : {finalScore} WPM
        </div>}
      </div>
    </div>
  );
};

export default Page;
