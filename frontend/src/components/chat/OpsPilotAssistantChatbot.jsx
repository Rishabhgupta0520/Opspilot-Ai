import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Zap,
  Minimize2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function OpsPilotAssistantChatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "👋 Hi! I am your **OpsPilot AI Copilot**. I can explain platform policies, inspect live delayed orders, guide you through manager approvals, or help formulate autonomous operational goals. How can I assist you today?",
      suggestedGoal: "Resolve all delayed orders from today. Prioritize VIP customers. Automatically process refunds under ₹5,000. Refunds above ₹5,000 require manager approval.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "How does the ₹5k refund threshold policy work?",
    "What delayed orders exist today?",
    "Who can approve high-risk operations?",
    "Help me write an autonomous goal"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend || textToSend.trim().length === 0 || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({ sender: m.sender, text: m.text }));
      const res = await api.post('/assistant', {
        message: textToSend,
        history: historyPayload
      });

      const replyData = res.data.data;
      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyData.reply,
        suggestedGoal: replyData.suggestedGoal,
        suggestedLink: replyData.suggestedLink,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: "I encountered a transient connection issue. Please make sure the OpsPilot backend engine is active.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRunGoal = (goalText) => {
    setIsOpen(false);
    navigate('/dashboard');
    // Dispatch custom event to autofill goal on dashboard
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.value = goalText;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* FLOATING CHAT BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-brand-blue via-brand-cyan to-indigo-500 text-dark-950 font-bold text-xs shadow-2xl shadow-brand-cyan/40 border border-white/20 cursor-pointer group"
          >
            {/* Glowing Ping Beacon */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-cyan border-2 border-dark-950"></span>
            </span>

            <Sparkles className="h-4 w-4 text-dark-950 animate-pulse" />
            <span className="tracking-wide">AI Copilot</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* CHATBOT CONVERSATIONAL WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="w-[380px] sm:w-[420px] h-[580px] max-h-[85vh] rounded-3xl glass-panel border border-brand-cyan/40 shadow-2xl bg-dark-950/95 flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            {/* Chatbot Header */}
            <div className="p-4 border-b border-slate-800/80 bg-gradient-to-r from-dark-900 via-slate-900 to-dark-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan p-0.5 shadow-md shadow-brand-cyan/20 flex-shrink-0">
                  <div className="h-full w-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                    <Bot className="h-4 w-4 text-brand-cyan" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-white text-xs tracking-tight">OpsPilot Copilot</h3>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[10px] font-mono text-slate-400">Autonomous Operations Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([messages[0]])}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
                  title="Clear conversation"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                  title="Minimize"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800/80 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="text-[10px] font-mono text-slate-300 bg-dark-950 hover:bg-brand-cyan/15 hover:text-brand-cyan border border-slate-800 hover:border-brand-cyan/30 px-2.5 py-1 rounded-full whitespace-nowrap transition-all flex-shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-brand-blue to-indigo-600 text-white rounded-tr-none shadow-md shadow-brand-blue/20'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                    }`}
                  >
                    <div className="whitespace-pre-line space-y-2">
                      {m.text}
                    </div>

                    {/* Interactive Action Shortcuts if available */}
                    {m.suggestedGoal && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col gap-1.5">
                        <span className="text-[10px] font-mono text-brand-cyan uppercase font-bold flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Recommended Autonomous Goal:
                        </span>
                        <p className="text-[11px] text-slate-300 italic bg-dark-950 p-2 rounded-lg border border-slate-800/80">
                          "{m.suggestedGoal}"
                        </p>
                        <button
                          onClick={() => handleRunGoal(m.suggestedGoal)}
                          className="mt-1 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-brand-cyan/15 hover:bg-brand-cyan/25 text-brand-cyan border border-brand-cyan/30 font-mono text-[10px] font-bold transition-all"
                        >
                          <span>Execute Goal in Console</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    {m.suggestedLink && (
                      <button
                        onClick={() => { setIsOpen(false); navigate(m.suggestedLink); }}
                        className="mt-2 text-[10px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <span>Navigate to {m.suggestedLink} &rarr;</span>
                      </button>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono p-2 rounded-xl bg-slate-900/60 border border-slate-800 w-fit">
                  <Bot className="h-3.5 w-3.5 text-brand-cyan animate-spin" />
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[10px]">Analyzing platform telemetry...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-800/80 bg-dark-900/90">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask copilot about policies, orders, or goals..."
                  className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-dark-950 font-bold hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-brand-cyan/20 flex-shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
              <div className="text-[9px] font-mono text-slate-500 text-center mt-2">
                The LLM reasons &bull; Application policies govern authority
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
