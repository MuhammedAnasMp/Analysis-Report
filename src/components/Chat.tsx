import React, { useState, useEffect, useRef } from 'react';
import useWebSocketTest from '../api/useWebSocketTest';

const Chat: React.FC<{ roomName: string }> = ({ roomName }) => {
    const { messages, sendMessage, sendCommand } = useWebSocketTest(roomName);
    const [input, setInput] = useState('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const prevScrollHeight = useRef<number>(0);
    const prevMessageCount = useRef<number>(0);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // NEW: track if user just sent a message
    const userJustSentMessage = useRef(false);

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container || loadingOlder) return;

        // Show "scroll to bottom" if user is far from bottom
        const nearBottom = isUserNearBottom();
        setShowScrollButton(!nearBottom);

        if (container.scrollTop === 0) {
            const oldestMessage = messages[0];
            if (oldestMessage) {
                prevScrollHeight.current = container.scrollHeight;
                prevMessageCount.current = messages.length;
                setLoadingOlder(true);

                sendCommand({
                    type: 'load_older',
                    before: oldestMessage.timestamp,
                });
            }
        }
    };
    const scrollToBottom = () => {
        const container = scrollContainerRef.current;
        if (container) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            setShowScrollButton(false);
        }
    };


    const isUserNearBottom = () => {
        const container = scrollContainerRef.current;
        if (!container) return false;
        return container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    };
    const firstLoad = useRef(true);
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        if (loadingOlder) {
            const newMessagesAdded = messages.length > prevMessageCount.current;
            if (newMessagesAdded) {
                const newScrollHeight = container.scrollHeight;
                const scrollOffset = newScrollHeight - prevScrollHeight.current;
                container.scrollTop = scrollOffset;
            }
            setLoadingOlder(false);
            userJustSentMessage.current = false;
        } else {
            if (firstLoad.current && messages.length > 0) {
                setTimeout(() => {
                    if (container) {
                        container.scrollTop = container.scrollHeight;
                        firstLoad.current = false;
                    }
                }, 50);
            } else if (userJustSentMessage.current || isUserNearBottom()) {
                container.scrollTop = container.scrollHeight;
                userJustSentMessage.current = false;
            }
        }
    }, [messages]);

    const handleSend = () => {
        if (input.trim()) {
            userJustSentMessage.current = true;  // mark user sent message
            sendMessage(input.trim());
            setInput('');
        }
    };

    const handleSend120 = () => {
        userJustSentMessage.current = true;
        for (let i = 1; i <= 120; i++) {
            sendMessage(`Message ${i}`);
        }
    };
    return (
       <div style={{ position: 'relative', margin: 'auto' }}>
            <h2>Room: {roomName}</h2>

            <div
                ref={scrollContainerRef}
                style={{
                    height: '300px',
                    width: '600px',
                    overflowY: 'auto',
                    border: '1px solid #ccc',
                    padding: '10px',
                    backgroundColor: '#fafafa',
                }}
                onScroll={handleScroll}
                >
                {loadingOlder && (
                    <div style={{ textAlign: 'center', marginBottom: 10 }}>
                        Loading older messages...
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={`${msg.timestamp}-${i}`}
                        style={{
                            padding: '6px 10px',
                            borderBottom: '1px solid #eee',
                            wordWrap: 'break-word',
                        }}
                    >
                        <strong>{msg.user}:</strong> {msg.message}
                        <br />
                        <small style={{ color: '#888' }}>
                          {new Date(msg.timestamp || Date.now()).toLocaleTimeString()} <br />
                        </small>
                    </div>
                ))}
                {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    style={{
                        position: 'absolute',
                        bottom: '80px',
                        right: '30px',
                        padding: '8px 12px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        zIndex: 1,
                    }}
                >
                    ⬇ Scroll to Bottom
                </button>
                )}
            </div>

            <input
                type="text"
                className='border w-full'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                style={{ padding: '8px', marginTop: '10px' }}
            />
            <div style={{ marginTop: '10px' }}>
                <button className='rounded border border-amber-500'
                    onClick={handleSend}
                    style={{ width: '48%', padding: '8px', marginRight: '4%', cursor: 'pointer' }}
                >
                    Send
                </button>
                <button className="rounded border border-red-500"
                    onClick={handleSend120}
                    style={{ width: '48%', padding: '8px', cursor: 'pointer' }}
                >
                    Send 120
                </button>
            </div>
        </div>
    );
};

export default Chat;
