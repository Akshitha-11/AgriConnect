import React, { useState, useRef, useEffect } from 'react';

function Messages() {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your farming assistant. How can I help you today?",
      sender: 'bot'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: inputMessage, sender: 'user' }];
    setMessages(newMessages);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 1000);
  };

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('product') || lowerMessage.includes('upload')) {
      return "To upload a product, go to the 'Upload Product' section. You'll need to provide the product name, price, quantity, and an image. Make sure to fill in all the required fields.";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "You can set your product prices based on market rates. Consider factors like quality, demand, and your production costs when setting prices.";
    } else if (lowerMessage.includes('quantity') || lowerMessage.includes('amount')) {
      return "The quantity should be entered in kilograms (kg). Make sure to update the quantity when you sell products to keep your inventory accurate.";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help! You can ask me about:\n- Uploading products\n- Managing prices\n- Tracking inventory\n- Understanding the platform\n- Farming best practices";
    } else if (lowerMessage.includes('market') || lowerMessage.includes('demand')) {
      return "You can check market trends in the Overview section. It shows you analytics about your products and sales patterns.";
    } else {
      return "I'm not sure I understand. Could you please rephrase your question? You can ask about product management, pricing, or any other farming-related queries.";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>
        {/* Add your messages content here */}
      </div>
    </div>
  );
}

export default Messages;