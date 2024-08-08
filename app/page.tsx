'use client'
import { useEffect,useRef } from "react";
import Image from "next/image";
import bgImage from '../assets/Background_space.png';
import asteroid1 from '../assets/asteroid1.png';
import asteroid2 from '../assets/Asteroid 01 - Base.png';
import spaceship from '../assets/spaceship.png'
export default function Home() {

  const spaceshipRef = useRef<HTMLImageElement>(null);

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

  return (
    <main className="min-h-screen w-full relative overflow-hidden">
      <Image src={bgImage} alt="space" className="h-screen w-full object-cover absolute top-0 left-0 z-0" />

      <div className="relative z-50 min-h-screen w-full py-12 flex flex-col items-center">
        <div className="font-poxast md:text-[80px] md:leading-[120px] font-bold text-white text-center w-2/3">
          Keyboard Warriors
        </div>

        <div className="mt-20 flex flex-col gap-8 font-minecraft">
          <div className="clip w-[400px] p-4 bg-emerald-600 hover:bg-emerald-700 text-center text-xl font-semibold cursor-pointer">Sign Up</div>
          <div className="clip w-[400px] p-4 bg-emerald-600 hover:bg-emerald-700 text-center text-xl font-semibold cursor-pointer">Log In</div>
          <div className="clip w-[400px] p-4 bg-amber-600 hover:bg-amber-700 text-center text-xl font-semibold cursor-pointer"><a href="https://aditya-negi-portfolio.vercel.app/" target="_blank"> About Developer</a></div>
        </div>
      </div>

      <Image ref={spaceshipRef} src={spaceship} alt="spaceship" className="h-[120px] w-[120px] absolute bottom-0 spaceship-animation"></Image>

      {/* Asteroids */}
      <Image src={asteroid1} alt="asteroid" className="absolute top-[140px] left-[90px] h-[80px] w-[80px] parallax" data-speed="3" />
      <Image src={asteroid2} alt="asteroid" className="absolute bottom-[140px] left-[90px] h-[150px] w-[150px] parallax" data-speed="4" />
      <Image src={asteroid1} alt="asteroid" className="absolute top-[50px] right-[50px] h-[60px] w-[60px] parallax" data-speed="2" />
      <Image src={asteroid2} alt="asteroid" className="absolute bottom-[200px] right-[100px] h-[100px] w-[100px] parallax" data-speed="4" />
      <Image src={asteroid2} alt="asteroid" className="absolute top-[300px] left-[200px] h-[70px] w-[70px] parallax" data-speed="1"/>
      <Image src={asteroid1} alt="asteroid" className="absolute bottom-[50px] left-[300px] h-[90px] w-[90px] parallax" data-speed="2" />
      <Image src={asteroid2} alt="asteroid" className="absolute top-[400px] right-[200px] h-[120px] w-[120px] parallax" data-speed="5" />
      <Image src={asteroid1} alt="asteroid" className="absolute bottom-[300px] right-[200px] h-[80px] w-[80px] parallax" data-speed="2" />
      <Image src={asteroid1} alt="asteroid" className="absolute top-[500px] left-[400px] h-[50px] w-[50px] parallax" data-speed="3" />

      <div className="absolute top-8 left-8 h-10 w-10 bg-white rounded-full blur-md opacity-50 parallax" data-speed="5"></div>
      <div className="absolute top-8 left-8 h-10 w-10 bg-white rounded-full blur-md opacity-50 parallax" data-speed="3"></div>
      <div className="absolute top-12 left-40 h-8 w-8 bg-white rounded-full blur-md opacity-50 parallax" data-speed="1"></div>
      <div className="absolute top-20 right-20 h-6 w-6 bg-white rounded-full blur-md opacity-50 parallax" data-speed="4"></div>
      <div className="absolute bottom-12 right-40 h-10 w-10 bg-white rounded-full blur-md opacity-50 parallax" data-speed="2"></div>
      <div className="absolute bottom-20 left-20 h-6 w-6 bg-white rounded-full blur-md opacity-50 parallax" data-speed="3"></div>
      <div className="absolute top-1/4 left-1/4 h-4 w-4 bg-white rounded-full blur-md opacity-50 parallax" data-speed="6"></div>
      <div className="absolute top-1/2 left-1/2 h-6 w-6 bg-white rounded-full blur-md opacity-50 parallax" data-speed="1"></div>
      <div className="absolute top-1/3 left-2/3 h-8 w-8 bg-white rounded-full blur-md opacity-50 parallax" data-speed="3"></div>
      <div className="absolute top-1/4 right-1/4 h-10 w-10 bg-white rounded-full blur-md opacity-50 parallax" data-speed="4"></div>
      <div className="absolute bottom-1/4 left-1/4 h-6 w-6 bg-white rounded-full blur-md opacity-50 parallax" data-speed="5"></div>
      <div className="absolute bottom-1/3 right-1/3 h-8 w-8 bg-white rounded-full blur-md opacity-50 parallax" data-speed="2"></div>
      <div className="absolute bottom-1/2 left-1/2 h-4 w-4 bg-white rounded-full blur-md opacity-50 parallax" data-speed="3"></div>
      <div className="absolute bottom-1/4 right-1/4 h-10 w-10 bg-white rounded-full blur-md opacity-50 parallax" data-speed="4"></div>
      <div className="absolute top-2/3 right-2/3 h-6 w-6 bg-white rounded-full blur-md opacity-50 parallax" data-speed="6"></div>
      <div className="absolute top-3/4 left-3/4 h-8 w-8 bg-white rounded-full blur-md opacity-50 parallax" data-speed="3"></div>
    </main>
  );
}
