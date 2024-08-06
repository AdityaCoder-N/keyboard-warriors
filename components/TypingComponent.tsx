
'use client'
import React, { useState, useEffect,useRef } from 'react';
import ParagraphDisplay from './ParagraphDisplay';
import PowerUpWindow from './PowerUpWndow'

interface TypingComponentProps{
  isTypingStarted:boolean;
  setIsTypingStarted:React.Dispatch<React.SetStateAction<boolean>>;
  roomId?:string;
  username?:string | null;
}

const TypingComponent = ({isTypingStarted,setIsTypingStarted,roomId,username=""}:TypingComponentProps) => {
  const paragraphs = [
    "Sarah watched the whirlpool mesmerized. She couldn't take her eyes off the water swirling around and around. She stuck in small twigs and leaves to watch the whirlpool catch them and then suck them down. It bothered her more than a little bit that this could also be used as a metaphor for her life.",
    "Waiting and watching. It was all she had done for the past weeks. When you’re locked in a room with nothing but food and drink, that’s about all you can do anyway. She watched as birds flew past the window bolted shut. She couldn’t reach it if she wanted too, with that hole in the floor. She thought she could escape through it but three stories is a bit far down."
  ];

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // const [countdown, setCountdown] = useState<number>(5);
  const [currentParagraph, setCurrentParagraph] = useState<string>(paragraphs[0]);
  const [typedText, setTypedText] = useState<string>('');
  // const [isTypingStarted, setIsTypingStarted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(true);

  const [correctCharacters,setCorrectCharacters] = useState<number>(0);
  const [winner,setWinner] = useState<string>('');

  // useEffect(() => {
  //   const countdownInterval = setInterval(() => {
  //     setCountdown((prev) => {
  //       if (prev === 1) {
  //         clearInterval(countdownInterval);
  //         setIsTypingStarted(true);
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(countdownInterval);
  // }, []);

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
        setWinner(username as string); // Set the winner to the current user
        setIsTypingStarted(false); // Stop typing
        alert("user won");
      }
    } else {
      setIsCorrect(false)
      // play sound
      e.preventDefault();
    }
  };

  return (
    <div className=" bg-blue-500 w-full h-full flex flex-col items-center">
      <div className="w-[60%] mt-12">
        {/* <h1 className="mt-12 my-4 text-3xl font-bold">Start Typing in: {countdown}</h1> */}

        <ParagraphDisplay paragraph={currentParagraph} typedText={typedText} isCorrect={isCorrect}/>

        <textarea
          ref={inputRef}
          className="mt-4 p-2 w-full border-2 border-gray-300 rounded-lg"
          onKeyDown={handleKeyPress}
          autoFocus
        />
        <button onClick={()=>{inputRef.current?.focus()}} >Click to type</button>
        <PowerUpWindow correctCharacters={correctCharacters} paragraph={currentParagraph} typedText={typedText} setCorrectCharacters={setCorrectCharacters} setTypedText={setTypedText} inputRef={inputRef} setIsTypingStarted={setIsTypingStarted} roomId={roomId}/>
      </div>
    </div>
  );
};

export default TypingComponent;
