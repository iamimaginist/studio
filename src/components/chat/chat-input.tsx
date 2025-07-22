"use client";

import { useState, useRef, useEffect } from 'react';
import { Paperclip, SendHorizonal } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getSmartSuggestion } from '@/ai/flows/smart-suggestions';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (value.trim().length > 3) {
      setIsLoadingSuggestions(true);
      debounceTimeout.current = setTimeout(async () => {
        try {
          const result = await getSmartSuggestion({ message: value });
          if (result && result.suggestion) {
            // Let's create a few variations for more choice
            const baseSuggestion = result.suggestion;
            const suggestionsArray = [
                baseSuggestion,
                baseSuggestion.split(' ')[0], // first word
            ].filter((v, i, a) => a.indexOf(v) === i && v.trim() !== ''); // unique and not empty
             setSuggestions(suggestionsArray.slice(0, 3));
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.error("Failed to get smart suggestions:", error);
          setSuggestions([]);
        } finally {
            setIsLoadingSuggestions(false);
        }
      }, 500);
    } else {
      setSuggestions([]);
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      setSuggestions([]);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setMessage(prev => `${prev} ${suggestion} `.trimStart());
    setSuggestions([]);
  }

  return (
    <div className="p-4 border-t bg-card">
        {(!isLoadingSuggestions && suggestions.length > 0) && (
             <div className="flex gap-2 mb-2 flex-wrap">
                <span className="text-sm text-muted-foreground self-center">Suggestions:</span>
                {suggestions.map((s, i) => (
                    <Button key={i} variant="outline" size="sm" onClick={() => handleSuggestionClick(s)}>
                        {s}
                    </Button>
                ))}
            </div>
        )}
        {isLoadingSuggestions && (
            <div className="text-sm text-muted-foreground mb-2 animate-pulse">
                Getting suggestions...
            </div>
        )}
      <div className="relative">
        <Textarea
          placeholder="Type a message..."
          value={message}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="pr-24 min-h-[50px] resize-none"
          disabled={disabled}
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 flex gap-1">
          <Button variant="ghost" size="icon" disabled={disabled}>
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button size="icon" onClick={handleSend} disabled={disabled || !message.trim()}>
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
