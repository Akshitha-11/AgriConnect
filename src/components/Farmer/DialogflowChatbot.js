import React from 'react';

export default function DialogflowChatbot() {
  return (
    <div className="fixed bottom-4 right-4 w-80 h-[480px] border border-gray-300 rounded-xl shadow-lg overflow-hidden z-50">
      <iframe
        title="Dialogflow Chatbot"
        allow="microphone;"
        width="100%"
        height="100%"
        src="https://console.dialogflow.com/api-client/demo/embedded/8074075d-ab7b-4f92-8ae9-cf6499bde21e"
      ></iframe>
    </div>
  );
} 