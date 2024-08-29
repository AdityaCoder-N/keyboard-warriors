import { useSocket } from '@/context/SocketProvider';
import { Bomb, Rocket, StopCircle } from 'lucide-react'
import React,{useRef,useEffect, useState} from 'react'
import { useToast } from './ui/use-toast';
import CountDownToast from './CountDownToast';

interface PowerUpWindowProps{
  username?:string | null;
  correctCharacters:number;
  paragraph:string;
  typedText:string;
  setCorrectCharacters:React.Dispatch<React.SetStateAction<number>>;
  setTypedText:React.Dispatch<React.SetStateAction<string>>;
  inputRef:React.RefObject<HTMLTextAreaElement>;
  setIsTypingStarted:React.Dispatch<React.SetStateAction<boolean>>;
  roomId?:string;
  onComplete:()=>void
}

const PowerUpWndow = ({
  username,
  correctCharacters,
  setCorrectCharacters,
  paragraph,
  typedText,
  setTypedText,
  inputRef,
  setIsTypingStarted,
  roomId,
  onComplete
  }:PowerUpWindowProps) => {

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const {socket} = useSocket();
  const {toast} = useToast();

  const [countdownToast,setCountdownToast] = useState(false);

  const rocketAudio = useRef<HTMLAudioElement>(null);
  const bombAudio = useRef<HTMLAudioElement>(null);
  const powerDownAudio = useRef<HTMLAudioElement>(null);

  const handleRocket=()=>{
    if (correctCharacters < 20) {
      return;
    }

    if(rocketAudio.current){
      rocketAudio.current.currentTime=0;
      rocketAudio.current.play();
    }

    setCorrectCharacters((prev) => prev - 20);

    const currentIndex = typedText.length;
    const endIndex = Math.min(currentIndex + 20, paragraph.length);
    const stringToAdd = paragraph.substring(currentIndex, endIndex);

    setTypedText((prev) => {
      const updatedTypedText = prev + stringToAdd;

      console.log(updatedTypedText)
      // Checking if the updated typed text matches the entire paragraph
      if (updatedTypedText === paragraph) {
        onComplete();
      }

      return updatedTypedText;
    });

    if (inputRef.current) {
      inputRef.current.value = inputRef.current.value+stringToAdd;
    }
    inputRef.current?.focus();
  }

  const handleBomb = (username:string)=>{
    
    if(bombAudio.current){
      bombAudio.current.currentTime=0;
      bombAudio.current.play();
    }

    toast({
      title:`${username} Bombed You!`,
      description:'You will go 10 characters back.',
      variant:"destructive"
    })
    // Remove the last 10 characters from typedText
    if (inputRef.current) {
      const currentText= inputRef.current.value;
      if (currentText.length <= 10) {
        inputRef.current.value = "";
      } else {
        inputRef.current.value= currentText.slice(0, -10);
      }
    }
    setTypedText((prev) => {
      if (prev.length <= 10) {
        return '';
      } else {
        return prev.slice(0, -10);
      }
    });
    

    inputRef.current?.focus();
  }

  const handleStop=(username:string)=>{

    toast({
      title:`${username} Froze You!`,
      description:'You will wait for 5 seconds.',
      variant:"destructive"
    })

    if(powerDownAudio.current){
      powerDownAudio.current.currentTime=0;
      powerDownAudio.current.play();
    }
    setIsTypingStarted(false);
    setCountdownToast(true);

    timerRef.current = setTimeout(()=>{
      setIsTypingStarted(true);
    },5000);

    inputRef.current?.focus();
  }

  const emitBomb=()=>{

    if (correctCharacters < 30) {
      return;
    }
    setCorrectCharacters((prev) => prev - 30);
    if(socket){
      socket.emit('bombPlayers',{roomId,username})
    }
  }
  const emitStop=()=>{
    console.log("Stop emitted")
    if (correctCharacters < 35) {
      return;
    }
    setCorrectCharacters((prev) => prev - 35);
    if(socket){
      socket.emit('stopPlayers',{roomId,username})
    }
  }

  useEffect(()=>{

    if(socket){
      socket.on('bombPlayers',({username})=>{
        handleBomb(username);
      })
      socket.on('stopPlayers',({username})=>{
        handleStop(username);
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
    <div className='flex w-full p-4 items-center justify-center gap-8 text-black text-xs sm:text-base'>
      {countdownToast && <CountDownToast time={5} message='Player Stopped typing for' onCountdownEnd={()=>setCountdownToast(false)}/>}
      <div className='flex flex-col gap-2 items-center'>
        <button
          disabled={correctCharacters<10}
          onClick={handleRocket}
          className={`transition-all border-black border-4  p-3 cursor-pointer hover:translate-y-[-5px] ${correctCharacters>=20?'box bg-amber-300 border-amber-500 border-solid':'border-dashed'}`}>
          <Rocket className='h-6 w-6 md:h-8 md:w-8'/>
        </button>
        <span>20 Points</span>
      </div>

      <div className='flex flex-col gap-2 items-center'>
        <button 
          onClick={emitBomb}
          disabled={correctCharacters<15}
          className={`border-black border-4 p-3 cursor-pointer hover:translate-y-[-5px] transition-all ${correctCharacters>=30?'box bg-amber-300 border-amber-500 border-solid':'border-dashed'}`}>
          <Bomb className='h-6 w-6 md:h-8 md:w-8'/>
        </button>
        <span>30 Points</span>
      </div>

      <div className='flex flex-col gap-2 items-center'>
        <button
          onClick={emitStop}
          disabled={correctCharacters<20}
          className={`border-black border-4 p-3 cursor-pointer hover:translate-y-[-5px] transition-all ${correctCharacters>=35?'box bg-amber-300 border-amber-500 border-solid':'border-dashed'}`}>
          <StopCircle className='h-6 w-6 md:h-8 md:w-8'/>
        </button>
        <span>35 Points</span>
      </div>

      <audio ref={rocketAudio} src="/assets/smb_powerup.wav" className='opacity-0'></audio>
      <audio ref={bombAudio} src="/assets/ChunkyExplosion.mp3" className='opacity-0'></audio>
      <audio ref={powerDownAudio} src="/assets/smb_bowserfalls.wav" className='opacity-0'></audio>
    </div>
  )
}

export default PowerUpWndow