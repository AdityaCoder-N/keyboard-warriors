import { Bomb, Rocket, StopCircle } from 'lucide-react'
import React,{useRef,useEffect} from 'react'

interface PowerUpWindowProps{
  correctCharacters:number;
  paragraph:string;
  typedText:string;
  setCorrectCharacters:React.Dispatch<React.SetStateAction<number>>;
  setTypedText:React.Dispatch<React.SetStateAction<string>>;
  inputRef:React.RefObject<HTMLInputElement>;
  setIsTypingStarted:React.Dispatch<React.SetStateAction<boolean>>
}

const PowerUpWndow = ({
  correctCharacters,
  setCorrectCharacters,
  paragraph,
  typedText,
  setTypedText,
  inputRef,
  setIsTypingStarted
  }:PowerUpWindowProps) => {

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleRocket=()=>{
    if (correctCharacters < 10) {
      return;
    }
    setCorrectCharacters((prev) => prev - 10);

    const currentIndex = typedText.length;
    const endIndex = Math.min(currentIndex + 10, paragraph.length);
    const stringToAdd = paragraph.substring(currentIndex, endIndex);
    setTypedText((prev) => prev + stringToAdd);

    inputRef.current?.focus();
  }

  const handleBomb = ()=>{
    if (correctCharacters < 15) {
      return;
    }
    setCorrectCharacters((prev) => prev - 15);
    // Remove the last 10 characters from typedText
    setTypedText((prev) => prev.slice(0, -10));

    inputRef.current?.focus();
  }

  const handleStop=()=>{
    if (correctCharacters < 20) {
      return;
    }
    setIsTypingStarted(false);
    setCorrectCharacters((prev) => prev - 20);

    timerRef.current = setTimeout(()=>{
      setIsTypingStarted(true);
    },5000);

    inputRef.current?.focus();
  }

  useEffect(()=>{
    return ()=>{
      if(timerRef.current)
        clearTimeout(timerRef.current);
    }
  },[])

  return (
    <div className='flex w-full mt-4 items-center justify-center gap-8 text-white'>
      <button
        disabled={correctCharacters<10}
        onClick={handleRocket}
        className='rounded-full border-white border-4 border-dashed p-3 cursor-pointer'>
        <Rocket className='h-8 w-8'/>
      </button>
      <button 
        onClick={handleBomb}
        disabled={correctCharacters<15}
        className='rounded-full border-white border-4 border-dashed p-3 cursor-pointer'>
        <Bomb className='h-8 w-8'/>
      </button>
      <button
        onClick={handleStop}
        disabled={correctCharacters<20}
        className='rounded-full border-white border-4 border-dashed p-3 cursor-pointer'>
        <StopCircle className='h-8 w-8'/>
      </button>
    </div>
  )
}

export default PowerUpWndow