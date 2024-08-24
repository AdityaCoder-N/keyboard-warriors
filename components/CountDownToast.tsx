'use client'
import React,{useState,useEffect} from 'react'

interface CountDownToastProps{
    message:string,
    time:number,
    onCountdownEnd:()=>void
}

const CountDownToast = ({
    message,
    time,
    onCountdownEnd
}:CountDownToastProps) => {

    const [timeLeft, setTimeLeft] = useState(time);

    useEffect(() => {
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
  
        return () => clearTimeout(timer);
      } else {
        onCountdownEnd();
      }
    }, [timeLeft, onCountdownEnd]);

  return (
    <div className='fixed top-0 left-0 min-h-screen w-full bg-[rgba(0,0,0,0.7)]'>
        <div className='z-50 absolute top-6 left-1/2 -translate-x-1/2 rounded-lg p-4 border-white border-2 bg-[#B22222] w-[200px] sm:w-[300px] md:w-[420px] h-fit text-center'>
            <p className='text-sm sm:text-lg md:text-xl font-minecraft text-white font-semibold'>{message}: {timeLeft} seconds</p>
        </div>
    </div>
  )
}

export default CountDownToast