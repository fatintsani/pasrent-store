"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { sendChatMessage } from "@/app/actions/chat";
import { MessageCircle, X, Send, User, Sparkles, Minus } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Halo! Saya **Renty**, asisten virtual Pasrent Store. Ada yang bisa saya bantu seputar penyewaan PlayStation?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // Hide pulse after first open
  useEffect(() => {
    if (isOpen) setShowPulse(false);
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await sendChatMessage(trimmed, history);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: res.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi admin via WhatsApp. 🙏",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: "Cara Booking", message: "Bagaimana cara booking?" },
    { label: "Harga Sewa", message: "Berapa harga sewa PS?" },
    { label: "Metode Bayar", message: "Apa saja metode pembayaran?" },
    { label: "Hubungi Admin", message: "Bagaimana cara menghubungi admin?" },
  ];

  const formatContent = (text: string) => {
    // Bold
    let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Newlines
    formatted = formatted.replace(/\n/g, "<br/>");
    return formatted;
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-4 sm:right-6 z-[60] w-[calc(100vw-2rem)] sm:w-[400px] transition-all duration-300 ease-out ${
            isMinimized ? "h-[60px] overflow-hidden" : "h-[550px] max-h-[80vh]"
          }`}
          style={{
            animation: "chatSlideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5000ef] to-[#00c3cb] p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                  <Image
                    src="/imgs/profile-pare.jpg"
                    alt="Renty"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">
                    Renty (Customer Service)
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white/80 text-xs">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
                  aria-label="Minimize"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsMinimized(false);
                  }}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950/50">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center shrink-0 mt-0.5 ${
                          msg.role === "assistant"
                            ? ""
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <Image
                            src="/imgs/profile-pare.jpg"
                            alt="Renty"
                            width={28}
                            height={28}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                        )}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.role === "assistant"
                            ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-md"
                            : "bg-gradient-to-r from-[#5000ef] to-[#6b21d4] text-white rounded-tr-md"
                        }`}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formatContent(msg.content),
                          }}
                        />
                        <div
                          className={`text-[10px] mt-1.5 ${
                            msg.role === "assistant"
                              ? "text-gray-400"
                              : "text-white/60"
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                        <Image
                          src="/imgs/profile-pare.jpg"
                          alt="Renty"
                          width={28}
                          height={28}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-md px-4 py-3">
                        <div className="flex gap-1.5">
                          <div
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions (only when minimal messages) */}
                {messages.length <= 1 && !isTyping && (
                  <div className="px-4 pb-2 pt-1 flex flex-wrap gap-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => {
                          setInputValue(action.message);
                          setTimeout(() => {
                            setInputValue(action.message);
                            handleSendQuick(action.message);
                          }, 50);
                        }}
                        className="text-xs px-3 py-1.5 rounded-full border border-[#5000ef]/20 dark:border-[#00c3cb]/20 text-[#5000ef] dark:text-[#00c3cb] hover:bg-[#5000ef]/5 dark:hover:bg-[#00c3cb]/5 transition font-medium"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-1.5 border border-gray-200 dark:border-gray-700 focus-within:border-[#5000ef] dark:focus-within:border-[#00c3cb] transition-colors">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ketik pesan..."
                      disabled={isTyping}
                      className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none py-2 disabled:opacity-50"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isTyping}
                      className="p-2 rounded-xl bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-center text-[10px] text-gray-400 mt-2">
                    Pasrent Store © 2026
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => {
          if (isOpen && isMinimized) {
            setIsMinimized(false);
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className="fixed bottom-6 right-4 sm:right-6 z-[60] group print:hidden"
        aria-label="Chat dengan Renty"
      >
        <div
          className={`relative w-14 h-14 rounded-full bg-gradient-to-r from-[#5000ef] to-[#00c3cb] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ${isOpen ? "rotate-0" : ""}`}
        >
          {isOpen ? (
            <MessageCircle className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Pulse ring */}
        {showPulse && !isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#5000ef] to-[#00c3cb] opacity-30 animate-ping" />
          </>
        )}

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium px-3 py-2 rounded-xl whitespace-nowrap shadow-lg">
              Chat dengan Renty 💬
              <div className="absolute top-full right-5 w-2.5 h-2.5 bg-gray-900 dark:bg-gray-700 rotate-45 -translate-y-1" />
            </div>
          </div>
        )}
      </button>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes chatSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );

  // Helper for quick action buttons
  async function handleSendQuick(message: string) {
    if (isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await sendChatMessage(message, history);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: res.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Maaf, terjadi kesalahan. Silakan coba lagi. 🙏",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }
}
