import { useEffect, useRef, useState } from "react";

export default function useTimer(isRunning:boolean){

    const [elapsedTime,setElapsedTime] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>();

    useEffect(()=>{
      if(isRunning){
        startTimer();
      }
      else{
        stopTimer();
      }

      return ()=>{
        stopTimer();
      }
    },[isRunning])

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
    };

    const formatTime = () => {
      const minutes = Math.floor(elapsedTime / 60);
      const remainingSeconds = elapsedTime % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
        .toString()
        .padStart(2, '0')}`;
    };

    return { elapsedTime, formattedTime:formatTime(), stopTimer };
}