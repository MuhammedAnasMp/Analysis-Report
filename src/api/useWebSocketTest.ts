import { useEffect, useRef, useState } from 'react';

interface Message {
    type: string;
    [key: string]: any;
}

const useWebSocketTest = (roomName: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket(`ws://${import.meta.env.VITE_API_HOST}/ws/test-chat/${roomName}/`);

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "chat.older_messages") {
                setMessages((prev) => [...data.messages, ...prev]); // prepend
            } else if (data.type === "chat.message") {

                //console.log(data)
                setMessages((prev) => [...prev, data]); // append
            }

        };

        ws.current.onclose = () => {
            //console.log('WebSocket closed');
        };

        return () => {
            ws.current?.close();
        };
    }, [roomName]);

    const sendMessage = (message: string) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ message }));
        }
    };

    // New function to send any command (object) over WS
    const sendCommand = (commandObj: object) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            //console.log(commandObj)
            ws.current.send(JSON.stringify(commandObj));
        }
    };

    return { messages, sendMessage, sendCommand };
};

export default useWebSocketTest;
