import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaCommentDots } from 'react-icons/fa';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', content: 'Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://glp-pharma-ai-chatbot.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.success || data.answer) {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: data.answer,
          product: data.product,
          related_products: data.related_products
        }]);
      } else {
        setMessages(prev => [...prev, { type: 'bot', content: "Sorry, I couldn't understand that." }]);
      }
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages(prev => [...prev, { type: 'bot', content: "Sorry, there was an error communicating with the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-4 z-50 flex flex-col items-end">

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] w-[90vw] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col mb-4 overflow-hidden border border-gray-100 transform transition-all duration-300 origin-bottom-right">
          {/* Header */}
          <div className="bg-[#1AA3B6] text-white p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <FaRobot className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">GLP Assistant</h3>
                <p className="text-xs text-white opacity-90">Online & ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col max-w-[85%] ${msg.type === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                <div className={`p-3 rounded-2xl ${msg.type === 'user' ? 'bg-[#1AA3B6] text-white rounded-tr-none' : 'bg-white shadow-sm border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                  <div className="text-[15px] whitespace-pre-wrap break-words leading-relaxed">{msg.content}</div>
                </div>

                {/* Product Card if exists */}
                {msg.product && (
                  <a
                    href={`/products-view/${msg.product.product_name.replace(/\s+/g, '-')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 bg-white p-3 rounded-xl shadow-sm border border-[#1AA3B6]/20 w-full text-sm hover:shadow-md transition-shadow block group"
                  >
                    <p className="font-bold text-[#1AA3B6] mb-1 group-hover:underline">{msg.product.product_name}</p>
                    <p className="text-xs text-gray-500">Cat No: {msg.product.catalogue_number}</p>
                  </a>
                )}

                {/* Related Products */}
                {msg.related_products && msg.related_products.length > 0 && (
                  <div className="mt-3 w-full">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Related Products:</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.related_products.map((rp, i) => (
                        <a
                          key={i}
                          href={rp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-full transition-colors flex flex-col"
                        >
                          <span className="font-semibold line-clamp-1">{rp.product_name}</span>
                          <span className="text-[9px] opacity-70">{rp.catalogue_number}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="self-start max-w-[85%] bg-white shadow-sm border border-gray-100 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our products..."
                className="flex-1 bg-gray-50 text-sm border border-gray-200 rounded-full px-4 py-2.5 focus:outline-none focus:border-[#1AA3B6] focus:ring-1 focus:ring-[#1AA3B6] transition-shadow min-w-0"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-[#1AA3B6] text-white p-3.5 rounded-full hover:bg-[#0B7285] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#1AA3B6] text-white p-2 sm:p-3 rounded-full shadow-[0_4px_14px_0_rgba(26,163,182,0.39)] hover:shadow-[0_6px_20px_rgba(26,163,182,0.5)] hover:-translate-y-1 hover:scale-110 transition-all duration-300 flex items-center justify-center group relative"
          aria-label="Open AI Chatbot"
        >
          <FaCommentDots className="text-[20px] sm:text-[24px]" />

          {/* Tooltip on hover (desktop only) */}
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-[#1AA3B6] text-sm font-bold py-2 px-4 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
            Ask AI!
            <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 border-y-8 border-y-transparent border-l-8 border-l-white"></div>
          </span>
        </button>
      )}
    </div>
  );
}
