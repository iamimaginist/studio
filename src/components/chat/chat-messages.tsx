"use client";

import React, { useEffect, useRef } from 'react';
import type { Message, User } from '@/lib/data';
import { users } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

interface ChatMessagesProps {
  messages: Message[];
  user: User;
  members: string[];
}

export function ChatMessages({ messages, user, members }: ChatMessagesProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

  const getSender = (senderId: string) => users.find(u => u.id === senderId);

  return (
    <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
      {messages.map((message, index) => {
        const isUserSender = message.senderId === user.id;
        const sender = getSender(message.senderId);
        const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;

        return (
          <div
            key={message.id}
            className={cn('flex items-end gap-2', {
              'justify-end': isUserSender,
            })}
          >
            {!isUserSender && (
              <div className="w-8 flex-shrink-0">
                {showAvatar && (
                  <Avatar className="h-8 w-8" data-ai-hint="person portrait">
                    <AvatarImage src={sender?.avatar} />
                    <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            )}
            <div
              className={cn('max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 text-sm break-words', {
                'bg-primary text-primary-foreground': isUserSender,
                'bg-card text-card-foreground': !isUserSender,
                'rounded-bl-none': !isUserSender && !showAvatar,
              })}
            >
              {!isUserSender && showAvatar && members.length > 2 && (
                <p className="text-xs font-semibold text-primary mb-1">{sender?.name}</p>
              )}
              {message.mediaUrl ? (
                <Image
                  src={message.mediaUrl}
                  alt="Shared media"
                  width={300}
                  height={200}
                  className="rounded-md"
                  data-ai-hint="photo message"
                />
              ) : (
                <p>{message.content}</p>
              )}
              <p className={cn("text-xs mt-1", {
                "text-primary-foreground/70": isUserSender,
                "text-muted-foreground": !isUserSender,
                "text-right": isUserSender,
                "text-left": !isUserSender,
              })}>
                {message.timestamp}
              </p>
            </div>
             {isUserSender && (
              <div className="w-8 flex-shrink-0">
                {showAvatar && (
                  <Avatar className="h-8 w-8" data-ai-hint="person portrait">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
