import React, { useEffect, useState } from 'react';
import chatPng from '../assets/chat_icon.png';

const ChatScreen = ({ selectedUser, socket, recieveMessages, setRecieveMessages }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [sendMessages, setSendMessages] = useState([]);


    const handleMessage = (e) => {
        setMessage(e.target.value);
    };

    const sendMessage = () => {
        if (message === '' || !currentUser) return;

        const senderUsername = localStorage.getItem('username');
        const newMessage = {
            message,
            id: currentUser.id,
            senderUsername,
            receiver: currentUser.username,
            timestamp: Date.now(),
        };

        socket.emit('send-message', newMessage);
        setSendMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage('');
    };

    useEffect(() => {
        if (selectedUser) {
            setCurrentUser(selectedUser);
            setLoading(false);
        }
    }, [selectedUser]);

    useEffect(() => {
        const handleReceiveMessage = (newMessage) => {
            if (
                newMessage.sender === currentUser?.username ||
                newMessage.receiver === currentUser?.username
            ) {
                setRecieveMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        };

        socket.on('receive-message', handleReceiveMessage);

        return () => {
            socket.off('receive-message', handleReceiveMessage);
        };
    }, [socket, setRecieveMessages, currentUser]);

    const allMessages = [...recieveMessages, ...sendMessages]
        .filter(
            (msg) =>
                msg.sender === currentUser?.username ||
                msg.receiver === currentUser?.username
        )
        .sort((a, b) => a.timestamp - b.timestamp);

    useEffect(() => {
        const chatbox = document.getElementById('chatbox')
        if (chatbox) {
            chatbox.scrollTop = chatbox.scrollHeight;
        }
    }, [sendMessage, recieveMessages])

    return (
        <>
            {loading ? (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <img src={chatPng} alt="Chat Icon" style={{ width: '20vw' }} />
                    <h1
                        style={{
                            fontSize: '5vw',
                            fontWeight: 800,
                            color: 'gray',
                            userSelect: 'none',
                            textAlign: 'center',
                        }}
                    >
                        Send and receive messages
                    </h1>
                </div>
            ) : (
                <div className="chatScreen">
                    <div className="topBar">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                                alt="Profile"
                                width={50}
                            />
                            <h2>{currentUser?.username}</h2>
                        </div>
                    </div>
                    <div className="chatbox" id='chatbox'>
                        {allMessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.senderUsername === localStorage.getItem('username')
                                        ? 'sender'
                                        : 'receiver'
                                    }`}
                            >
                                
                                {msg.message}
                            </div>
                        ))}
                    </div>
                    <div className="bottom">
                        <div className="chatBox">
                            <input
                                type="text"
                                placeholder="Type a message here..."
                                value={message}
                                onChange={handleMessage}
                            />
                            <i className="fa-regular fa-paper-plane" onClick={sendMessage}></i>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatScreen;
