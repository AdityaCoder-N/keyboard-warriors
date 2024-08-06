import { useSocket } from '@/context/SocketProvider';
import { Bomb, Rocket, StopCircle } from 'lucide-react'
import React,{useRef,useEffect} from 'react'

interface PowerUpWindowProps{
  correctCharacters:number;
  paragraph:string;
  typedText:string;
  setCorrectCharacters:React.Dispatch<React.SetStateAction<number>>;
  setTypedText:React.Dispatch<React.SetStateAction<string>>;
  inputRef:React.RefObject<HTMLTextAreaElement>;
  setIsTypingStarted:React.Dispatch<React.SetStateAction<boolean>>;
  roomId?:string
}

const PowerUpWndow = ({
  correctCharacters,
  setCorrectCharacters,
  paragraph,
  typedText,
  setTypedText,
  inputRef,
  setIsTypingStarted,
  roomId
  }:PowerUpWindowProps) => {

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const socket = useSocket();

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
    console.log("Bomb received");
    // Remove the last 10 characters from typedText
    setTypedText((prev) => {
      if (prev.length <= 10) {
        return '';
      } else {
        return prev.slice(0, -10);
      }
    });

    inputRef.current?.focus();
  }

  const handleStop=()=>{
    console.log("Typing halted");
    setIsTypingStarted(false);
    
    timerRef.current = setTimeout(()=>{
      setIsTypingStarted(true);
    },10000);

    inputRef.current?.focus();
  }

  const emitBomb=()=>{
    console.log("room id",roomId)
    if (correctCharacters < 15) {
      return;
    }
    setCorrectCharacters((prev) => prev - 15);
    if(socket){
      socket.emit('bombPlayers',{roomId})
    }
  }
  const emitStop=()=>{
    console.log("Stop emitted")
    if (correctCharacters < 10) {
      return;
    }
    setCorrectCharacters((prev) => prev - 10);
    if(socket){
      socket.emit('stopPlayers',{roomId})
    }
  }

  useEffect(()=>{

    if(socket){
      socket.on('bombPlayers',()=>{
        handleBomb();
      })
      socket.on('stopPlayers',()=>{
        handleStop();
      })
    }

  },[socket])

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
        onClick={emitBomb}
        disabled={correctCharacters<15}
        className='rounded-full border-white border-4 border-dashed p-3 cursor-pointer'>
        <Bomb className='h-8 w-8'/>
      </button>
      <button
        onClick={emitStop}
        disabled={correctCharacters<20}
        className='rounded-full border-white border-4 border-dashed p-3 cursor-pointer'>
        <StopCircle className='h-8 w-8'/>
      </button>
    </div>
  )
}

export default PowerUpWndow