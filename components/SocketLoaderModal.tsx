import { Loader2 } from 'lucide-react'
import React from 'react'

const SocketLoaderModal = () => {
  return (
    <div className='fixed z-50 top-0 left-0 min-h-screen w-full bg-[rgba(0,0,0,0.7)]'>
        <div className='z-50 absolute top-6 left-1/2 -translate-x-1/2 rounded-lg p-4 border-white border-2 bg-gray-400 w-[200px] sm:w-[300px] md:w-[420px] h-fit text-center'>
            <p className='text-sm sm:text-lg md:text-xl font-minecraft text-white font-semibold flex items-center gap-2 justify-center'>
                <Loader2 className='h-5 w-5 animate-spin'/>
                Connecting To Room...
            </p>
        </div>
    </div>
  )
}

export default SocketLoaderModal