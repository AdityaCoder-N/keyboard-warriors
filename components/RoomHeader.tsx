'use client'
import { Copy } from 'lucide-react'
import { Card } from 'pixel-retroui'
import React, { useState, useEffect } from 'react'
import { useToast } from './ui/use-toast'

const RoomHeader = ({roomId}:{
    roomId:string
}) => {

    const {toast} = useToast();

    const [roomUrl,setRoomUrl] = useState('');

    const copyToClipboard = (type: 'roomUrl' | 'roomId') => {
        let textToCopy: string = '';
        let toastTitle: string = '';
        let toastDescription: string = '';
        
        if (type === 'roomUrl') {
            textToCopy = roomUrl;
            toastTitle = 'URL Copied!';
            toastDescription = 'Room URL has been copied to clipboard.';
        } else if (type === 'roomId') {
            textToCopy = roomId;
            toastTitle = 'Room ID Copied!';
            toastDescription = 'Room ID has been copied to clipboard.';
        }
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
            console.log('Text copied to clipboard');
            toast({
                title: toastTitle,
                description: toastDescription,
                variant: 'default'
            });
        });
    };

  useEffect(()=>{
    let roomUrl=''
    if (typeof window !== 'undefined') {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        roomUrl = `${baseUrl}/play/${roomId}`;
    }
    setRoomUrl(roomUrl);
    
  },[roomId])
    

  return (
    <Card className='w-[90%] md:w-fit flex flex-col gap-2 p-2 md:text-base text-xs text-black'>
      <div className='w-full  flex flex-col md:flex-row items-center justify-between gap-1 md:gap-4'>
        <span className='font-semibold'>Room URL: </span>
        <div className='flex items-center justify-between gap-2'>
          <span className='flex-1'>
              {roomUrl}
          </span>
          <Copy className='h-4 w-4 cursor-pointer' onClick={()=>copyToClipboard('roomUrl')}/>
        </div>
      </div>
      <div className='w-full flex flex-col md:flex-row items-center justify-between gap-1 md:gap-4'>
        <span className='font-semibold'>Room ID: </span>
        <div className='flex items-center justify-between gap-2 flex-1'>
          <span className='text-center w-full'>
              {roomId}
          </span>
          <Copy className='h-4 w-4 cursor-pointer' onClick={()=>copyToClipboard('roomId')}/>
        </div>
      </div>
    </Card>

  )
}

export default RoomHeader