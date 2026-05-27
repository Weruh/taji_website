import { useEffect } from 'react';

const ChatbaseWidget = () => {
  useEffect(() => {
    const chatbaseId = import.meta.env.VITE_CHATBASE_ID;
    if (!chatbaseId) {
      console.warn('[ChatbaseWidget] Missing VITE_CHATBASE_ID. Chat widget will not load.');
      return;
    }

    window.chatbaseConfig = {
      chatbotId: chatbaseId,
    };

    if (document.getElementById(chatbaseId)) return;

    const script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.id = chatbaseId;
    script.defer = true;
    
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById(chatbaseId);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      delete window.chatbaseConfig;
    };
  },[]); 

  return null; 
};

export default ChatbaseWidget; 