'use client'
import {useEffect, createContext, useContext, useRef, useMemo, useState} from 'react'
import io, { Socket } from 'socket.io-client'

// type for socket context
type SocketContextType = {
    socket: Socket | null;
    isConnected: boolean;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);
const useSocket = ()=>{
    const context = useContext(SocketContext);
    if(!context){
        throw new Error('useSocket must be used within a Socket Provider')
    }
    return context;
}


const SocketProvider = ({
    children
}:{children:React.ReactNode}) => {
    
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const host = process.env.NEXT_PUBLIC_SOCKET_HOST || 'http://localhost:8000';

    useEffect(() => {
        
        const socketInstance = io(host);
    
        socketInstance.on('connect', () => {
          console.log('Connected to Socket.IO server');
          setIsConnected(true);
        });
    
        socketInstance.on('disconnect', () => {
          console.log('Disconnected from Socket.IO server');
          setIsConnected(false);
        });
    
        setSocket(socketInstance);
    
        return () => {
          socketInstance.disconnect();
        };
      }, [host]);

    useEffect(()=>{
        return()=>{
            socket?.disconnect();
        }
    },[socket])

    
    return (<SocketContext.Provider value={{socket,isConnected}}>
        {children}
    </SocketContext.Provider>);
};

export {SocketProvider,useSocket}