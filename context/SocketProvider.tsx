'use client'
import {useEffect, createContext, useContext, useRef} from 'react'
import io, { Socket } from 'socket.io-client'

// type for socket context
type SocketContextType = Socket | null;

const SocketContext = createContext<SocketContextType>(null);
export const useSocket = ()=>useContext(SocketContext);


export const SocketProvider = ({
    children
}:{children:React.ReactNode}) => {
    
    const socket = useRef<Socket | null>(null);

    useEffect(()=>{
        socket.current = io('http://localhost:8000');

        socket.current?.on('connect', () => {
            console.log('Connected to Socket.IO server');
          });
      
          socket.current?.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
          });

        return ()=>{
            socket.current?.disconnect();
        }
    },[])

    return (<SocketContext.Provider value={socket.current}>
        {children}
    </SocketContext.Provider>);

};