import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const removeChatbaseElements = (chatbaseId) => {
  if (chatbaseId) {
    const existingScript = document.getElementById(chatbaseId);
    if (existingScript) existingScript.remove();
  }

  document
    .querySelectorAll('iframe[src*="chatbase"], [id*="chatbase"], [class*="chatbase"]')
    .forEach((element) => element.remove());

  delete window.chatbaseConfig;
};

const ChatbaseWidget = () => {
  const location = useLocation();

  useEffect(() => {
    const envId = import.meta.env.VITE_CHATBASE_ID;
    const globalId = typeof window !== 'undefined' && (window.__CHATBASE_ID__ || window.__CHATBASE_ID);
    const meta = typeof document !== 'undefined' && document.querySelector('meta[name="chatbase-id"]');
    const chatbaseId = envId || globalId || (meta && meta.getAttribute('content'));

    if (location.pathname === '/gallery') {
      removeChatbaseElements(chatbaseId);
      return undefined;
    }

    if (!chatbaseId) {
      console.warn('[ChatbaseWidget] Missing chatbase ID (VITE_CHATBASE_ID / window.__CHATBASE_ID__ / meta[name="chatbase-id"]). Chat widget will not load.');
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
      removeChatbaseElements(chatbaseId);
    };
  },[location.pathname]); 

  return null; 
};

export default ChatbaseWidget; 
