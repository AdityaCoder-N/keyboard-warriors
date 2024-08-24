'use client'
import { useEffect,useRef, useState } from "react";
import Image from "next/image";
import bgImage from '../assets/Background_space.png';
import asteroid1 from '../assets/asteroid1.png';
import asteroid2 from '../assets/Asteroid 01 - Base.png';
import spaceship from '../assets/spaceship.png'
import { Button } from "pixel-retroui";
import Link from "next/link";
import { Speaker, Volume2, VolumeX } from "lucide-react";
 
type optionsObject={
  label:string,
  url:string
}

export default function Home() {

  const spaceshipRef = useRef<HTMLImageElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [music,setMusic] = useState(false);

  useEffect(() => {

    const handleMouseMove = (event:MouseEvent) => {
      document.querySelectorAll(".parallax").forEach((element:any) => {
        const speed = parseInt(element.getAttribute("data-speed"));
        
        const x = (window.innerWidth - event.pageX * speed) / 80;
        const y = (window.innerHeight - event.pageY * speed) / 80;

        element.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    setRandomPosition();

    // Update position and restart animation every 3 seconds
    const intervalId = setInterval(setRandomPosition, 3000);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearInterval(intervalId);
    };
  }, []);

  const setRandomPosition = () => {
    const spaceshipElement = spaceshipRef.current;
    if (spaceshipElement) {
      const randomPosition = Math.floor(Math.random() * (90 - 10 + 1)) + 5; // Random value between 10 and 90
      
      spaceshipElement.style.left = `${randomPosition}%`;
      
      // Reset the animation by removing and re-adding the class
      spaceshipElement.classList.remove('spaceship-animation');
      void spaceshipElement.offsetWidth; // Trigger reflow
      spaceshipElement.classList.add('spaceship-animation');
    }
  };

  const toggleMusic=()=>{
    setMusic(prev=>!prev);
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setMusic(true); // Update state to reflect that music is playing
      } else {
        audioRef.current.pause();
        setMusic(false); // Update state to reflect that music is paused
      }
    }  
  }

 const options:optionsObject[] = [
  {
    label:'Home',
    url:'/home'
  },
  {
    label:'Sign Up',
    url:'/sign-up'
  },
  {
    label:'Sign In',
    url:'/sign-in'
  },
 ]


  return (
    <main className="min-h-screen w-full flex flex-col items-center relative overflow-hidden">
      <audio src="/assets/home-sound.mp3" className="opacity-0" ref={audioRef}></audio>
      <Image src={bgImage} alt="space" className="h-screen w-full object-cover absolute top-0 left-0 z-0" />

      <div className="relative z-50 min-h-screen w-full py-12 flex flex-col items-center">
        <div className="font-poxast text-[38px] leading-[60px] sm:text-[60px] sm:leading-[80px] md:text-[80px] md:leading-[120px] font-bold text-white text-center w-fit lg:w-2/3">
          Keyboard Warriors
        </div>

        <div className="w-full mt-20 flex flex-col items-center gap-4 font-minecraft">
        {
          options.map((option,index)=>{
            return(
              <Link 
                key={index} 
                href={option.url}
                className="w-[80%] sm:w-[60%] md:w-[400px] p-1 font-semibold text-xl flex justify-center">
                <Button 
                  bg="#6A7BA2"
                  textColor="white"
                  borderColor="black"
                  shadow="#4E5C79"
                  className="w-full"
                >
                  {option.label}
                </Button>
              </Link>
            )
          })
        }
        <a href="" target="_blank" className="w-[80%] sm:w-[60%] md:w-[400px] p-1 font-semibold text-xl flex justify-center">
          <Button 
            bg="#D87C4A"
            textColor="white"
            borderColor="black"
            shadow="#A6532A"
            className="w-full"
          >
            About Developer
          </Button>
        </a>
          
        </div>
      </div>

      <Image ref={spaceshipRef} src={spaceship} alt="spaceship" className="h-[80px] md:h-[120px] w-[80px] md:w-[120px] absolute bottom-0 spaceship-animation"></Image>

      {/* Asteroids */}
      <Image src={asteroid1} alt="asteroid" className="absolute top-[140px] left-[90px] h-[80px] w-[80px] parallax" data-speed="3" />
      <Image src={asteroid2} alt="asteroid" className="absolute bottom-[140px] left-[90px] h-[150px] w-[150px] parallax" data-speed="4" />
      <Image src={asteroid1} alt="asteroid" className="absolute top-[50px] right-[50px] h-[60px] w-[60px] parallax" data-speed="2" />
      <Image src={asteroid2} alt="asteroid" className="absolute bottom-[200px] right-[100px] h-[100px] w-[100px] parallax" data-speed="4" />
      <Image src={asteroid2} alt="asteroid" className="absolute top-[300px] left-[200px] h-[70px] w-[70px] parallax" data-speed="1"/>
      <Image src={asteroid1} alt="asteroid" className="absolute bottom-[10px] md:bottom-[50px] left-6 md:left-[300px] h-[90px] w-[90px] parallax" data-speed="2" />
      <Image src={asteroid2} alt="asteroid" className="absolute top-[400px] right-[200px] h-[120px] w-[120px] parallax" data-speed="5" />
      <Image src={asteroid1} alt="asteroid" className="absolute bottom-[300px] right-[200px] h-[80px] w-[80px] parallax" data-speed="2" />
      <Image src={asteroid1} alt="asteroid" className="absolute top-[500px] left-[400px] h-[50px] w-[50px] parallax" data-speed="3" />

      { music? 
        <Volume2 className="h-6 w-6 absolute bottom-6 right-8 text-white cursor-pointer z-50" onClick={toggleMusic}/>:
        <VolumeX className="h-6 w-6 absolute bottom-6 right-8 text-white cursor-pointer z-50" onClick={toggleMusic}/>
      }
    </main>
  );
}
