import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../hooks/useAI';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  FileText, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your Warehouse AI. I can answer questions about inventory levels, safety protocols, or shipping manuals. How can I help you today?' }
  ]);
  
  const { askAI, isAsking } = useAI();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAsking) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    askAI(userMessage, {
      onSuccess: (data) => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.answer,
          sources: data.sources 
        }]);
      },
      onError: () => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later."
        }]);
      }
    });
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          Knowledge Assistant
          <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-500" />
        </h1>
        <p className="text-slate-500 mt-1">Ask questions about warehouse documents using RAG.</p>
      </div>

      <div className="card flex-1 flex flex-col p-0 overflow-hidden bg-slate-900 border-slate-800">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={clsx(
              "flex gap-4 max-w-4xl",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}>
              <div className={clsx(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                msg.role === 'assistant' ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-300"
              )}>
                {msg.role === 'assistant' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <div className="space-y-4">
                <div className={clsx(
                  "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.role === 'assistant' 
                    ? "bg-slate-800 text-slate-100 border border-slate-700" 
                    : "bg-indigo-600 text-white font-medium"
                )}>
                  {msg.content}
                </div>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
                    <p className="w-full text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Sources</p>
                    {msg.sources.map((src, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-slate-800/50 text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700/50 hover:bg-slate-800 transition-colors cursor-pointer">
                        <FileText className="w-3 h-3" />
                        {src}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isAsking && (
            <div className="flex gap-4 max-w-2xl animate-pulse">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/50 flex items-center justify-center text-white">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div className="p-4 bg-slate-800 rounded-2xl h-12 w-48 border border-slate-700"></div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-slate-800/50 border-t border-slate-800 backdrop-blur-md">
          <div className="relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the warehouse..."
              className="w-full bg-slate-900 text-white rounded-2xl py-4 pl-6 pr-16 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600 border border-slate-700 group-hover:border-slate-600"
            />
            <button 
              disabled={!input.trim() || isAsking}
              className="absolute right-2 top-2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-6 px-2">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Suggested</p>
            {["Safety protocols?", "Low stock inventory?", "Hazardous materials?"].map(suggest => (
              <button 
                key={suggest}
                type="button"
                onClick={() => setInput(suggest)}
                className="text-[10px] font-bold text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors uppercase tracking-widest"
              >
                {suggest}
                <ChevronRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
