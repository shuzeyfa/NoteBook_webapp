'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Zap, Copy, Check } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  note: Note | undefined;
}

export default function AIAssistant({ note }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI assistant. I can help you understand, summarize, or explain your notes. Try clicking one of the quick actions below!",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !note) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // TODO: Replace with your actual AI API endpoint
    // For now, we'll show a demo response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'd love to help with "${message}", but the AI integration is not yet configured. Connect your preferred AI service (OpenAI, Anthropic, etc.) to enable this feature.`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    if (!note || !note.content.trim()) {
      alert('Please add some content to your note first!');
      return;
    }

    const prompts = {
      explain: `Please explain the following note in simple terms:\n\n${note.content}`,
      summarize: `Please summarize the following note:\n\n${note.content}`,
      expand: `Please expand on the following note with more details:\n\n${note.content}`,
    };

    const prompt = prompts[action as keyof typeof prompts];
    handleSendMessage(prompt);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="hidden lg:flex h-screen bg-secondary/10 flex-col">
      {/* Header */}
      <div className="border-b border-secondary p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Zap size={16} className="text-black" />
          </div>
          <h2 className="font-semibold">AI Assistant</h2>
        </div>
        <p className="text-xs text-gray-400">
          {note?.title ? `Helping with "${note.title}"` : 'Select a note to get started'}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-lg text-sm ${
                message.role === 'user'
                  ? 'bg-primary text-black'
                  : 'bg-secondary/50 text-foreground'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
              {message.role === 'assistant' && (
                <button
                  onClick={() => copyToClipboard(message.content, message.id)}
                  className="mt-2 inline-flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
                >
                  {copiedId === message.id ? (
                    <>
                      <Check size={14} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary/50 text-foreground px-4 py-2 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {note && note.content.trim() && (
        <div className="border-t border-secondary bg-secondary/5 p-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => handleQuickAction('explain')}
            disabled={isLoading}
            className="px-3 py-2 text-xs bg-secondary/50 hover:bg-secondary rounded transition-colors disabled:opacity-50"
          >
            Explain
          </button>
          <button
            onClick={() => handleQuickAction('summarize')}
            disabled={isLoading}
            className="px-3 py-2 text-xs bg-secondary/50 hover:bg-secondary rounded transition-colors disabled:opacity-50"
          >
            Summarize
          </button>
          <button
            onClick={() => handleQuickAction('expand')}
            disabled={isLoading}
            className="px-3 py-2 text-xs bg-secondary/50 hover:bg-secondary rounded transition-colors disabled:opacity-50"
          >
            Expand
          </button>
          <button
            onClick={() => {
              if (!inputValue.trim()) setInputValue('Ask anything...');
            }}
            className="px-3 py-2 text-xs bg-secondary/50 hover:bg-secondary rounded transition-colors"
          >
            Ask anything
          </button>
        </div>
      )}

      {/* Input */}
      {note ? (
        <div className="border-t border-secondary p-4 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
            placeholder="Ask anything about your note..."
            className="flex-1 bg-secondary/50 border border-secondary rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            className="bg-primary text-black p-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      ) : (
        <div className="border-t border-secondary p-4 text-center text-sm text-gray-400">
          Select a note to chat
        </div>
      )}
    </div>
  );
}
