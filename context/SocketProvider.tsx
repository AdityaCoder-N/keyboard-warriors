'use client'
import {useEffect, createContext, useContext, useRef, useMemo} from 'react'
import io, { Socket } from 'socket.io-client'

// type for socket context
type SocketContextType = Socket | null;

const SocketContext = createContext<SocketContextType>(null);
const useSocket = ()=>useContext(SocketContext);


const SocketProvider = ({
    children
}:{children:React.ReactNode}) => {
    
    const host = process.env.SOCKET_HOST ||  "http://localhost:8000";

    const socket = useMemo(() => {
        const socketInstance = io(host);

        socketInstance.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });

        return socketInstance;
    }, []);

    
    return (<SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>);
};

export {SocketProvider,useSocket}