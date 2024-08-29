import React from 'react'

import { Card } from 'pixel-retroui'
import { Bomb, Rocket, StopCircle, X } from 'lucide-react'


const GameInfoModal = ({
    onClose
}:{onClose:()=>void}) => {
  return (
    <div className='fixed z-50 top-0 left-0 min-h-screen w-full bg-[rgba(0,0,0,0.6)] flex items-center justify-center'>
        <Card className='z-50 flex flex-col w-[400px] md:min-w-[400px] md:w-1/3 p-4 relative'>

            <X 
              className='bg-red-400 absolute top-2 right-3 cursor-pointer'
              onClick={onClose}  
            />
            <h1 className='text-2xl font-bold mb-2'>How to Play?</h1>
            <p className='mb-4 text-gray-500'>Just Be the fastest typer among your friends and don&apos;t forget to use the power-ups to your advantage. What do they do you ask?</p>

            <div className='flex items-center gap-4 mb-3'>
                <div className='border-4 p-2 border-dashed border-black'>
                    <Rocket className='h-8 w-8 border-0'/>
                </div>
                <p>Adds 20 correct characters to your typed text, costs 20 points</p>
            </div>
            <div className='flex items-center gap-4 mb-3'>
                <div className='border-4 p-2 border-dashed border-black'>
                    <Bomb className='h-8 w-8 border-0'/>
                </div>
                <p>Removes 15 characters from your opponent&apos;s typed text, costs 30 points</p>
            </div>
            <div className='flex items-center gap-4 mb-3'>
                <div className='border-4 p-2 border-dashed border-black'>
                    <StopCircle className='h-8 w-8 border-0'/>
                </div>
                <p>Stops your opponents typing for 5 seconds, costs 35 points</p>
            </div>
        </Card>
    </div>
  )
}

export default GameInfoModal