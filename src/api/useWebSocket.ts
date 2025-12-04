import { useEffect, useRef, useState } from 'react';

interface Message {
    payload_type: string;
    [key: string]: any;
}


type SentingMessageBody = {
    type: string;
    message: string;
    created_by: number;
    meeting: number;

    description?: string;
    status?: 'pending' | 'in_progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    deadline?: string;
    assignee?: number;
    assigned_by?: number;
};

const useWebSocket = (roomName: string | undefined) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket(`ws://${import.meta.env.VITE_API_HOST}/ws/chat/${roomName}/`);

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.payload_type === "chat.older_messages") {
                setMessages((prev) => [...data.messages, ...prev]); // prepend
            } else if (data.payload_type === "chat.message") {
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

    const sendMessage = (message: SentingMessageBody) => {

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {

            ws.current.send(JSON.stringify( message ));
            // ws.current.send(JSON.stringify({
            //     type: "task",
            //     created_by :63,
            //     message: "Finish writing the report",
            //     description: "The final report for Q4 needs to be submitted.",
            //     status: "in_progress",
            //     priority: "high",
            //     deadline: "2025-10-22T09:50:18.624Z",
            //     assignee: 63,
            //     assigned_by: 63
            // }));
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

export default useWebSocket;






