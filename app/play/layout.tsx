
import { SocketProvider } from "@/context/SocketProvider"

export default function HomeLayout({children}:{children:React.ReactNode}){
    return(
        <SocketProvider>
            {children}
        </SocketProvider>
    )
}