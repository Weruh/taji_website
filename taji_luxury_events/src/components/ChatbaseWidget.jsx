import { useEffect } from 'react';

const ChatbaseWidget = () => {
  useEffect(() => {
    
    window.chatbaseConfig = {
      chatbotId: import.meta.env.VITE_CHATBASE_ID,
    };

    if (document.getElementById(import.meta.env.VITE_CHATBASE_ID)) return;

    const script = document.createElement('script');
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = import.meta.env.VITE_CHATBASE_ID;
    script.defer = true;
    
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById(import.meta.env.VITE_CHATBASE_ID);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      delete window.chatbaseConfig;
    };
  },[]); 

  return null; 
};

export default ChatbaseWidget; 