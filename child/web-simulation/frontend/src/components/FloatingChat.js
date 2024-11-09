import React, { useState, useEffect } from 'react';
import '../styles/FloatingChat.css';

const FloatingChat = () => {
    // Sample messages - replace with your actual messages
    const messages = [
        "السلام عليكم، أنا معين، مساعدك الذكي للقرآن",
        "كيف يمكنني مساعدتك اليوم؟",
        "يمكنني الإجابة على الأسئلة حول القرآن",
    ];

    const [currentMessage, setCurrentMessage] = useState(0);

    // Cycle through messages
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessage((prev) => (prev + 1) % messages.length);
        }, 4000); // Change message every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="floating-chat">
            <div className="message-container">
                <p className="message">{messages[currentMessage]}</p>
            </div>
        </div>
    );
};

export default FloatingChat;