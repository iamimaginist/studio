"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { Conversation, User } from '@/lib/data';
import { users } from '@/lib/data';
import { Info, Lock, Users, Video } from 'lucide-react';
import React from 'react';

interface ChatTopbarProps {
  selectedConversation: Conversation | null;
  user: User;
}

export function ChatTopbar({ selectedConversation, user }: ChatTopbarProps) {
  const getConversationDetails = (convo: Conversation | null) => {
    if (!convo) return { name: '', avatar: '', fallback: '', online: false, membersCount: 0 };
    if (convo.type === 'direct') {
      const otherUserId = convo.members.find(id => id !== user.id);
      const otherUser = users.find(u => u.id === otherUserId);
      return {
        name: otherUser?.name || 'Unknown User',
        avatar: otherUser?.avatar,
        fallback: otherUser?.name?.charAt(0) || 'U',
        online: otherUser?.online,
        membersCount: 2
      };
    }
    return {
      name: convo.name || 'Group Chat',
      avatar: 'https://placehold.co/100x100/6A5ACD/E6E6FA?text=G',
      fallback: 'G',
      online: false, // Group online status can be complex, skipping for now
      membersCount: convo.members.length
    };
  };

  const details = getConversationDetails(selectedConversation);

  return (
    <div className="flex items-center justify-between p-4 border-b h-20 bg-card">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        {selectedConversation ? (
          <>
            <Avatar className="h-10 w-10" data-ai-hint="person portrait">
              <AvatarImage src={details.avatar} alt={details.name} />
              <AvatarFallback>{details.fallback}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{details.name}</span>
              {selectedConversation.type === 'direct' ? (
                 <span className="text-xs text-muted-foreground">{details.online ? 'Online' : 'Offline'}</span>
              ) : (
                <span className="text-xs text-muted-foreground">{details.membersCount} members</span>
              )}
            </div>
          </>
        ) : (
            <div className="font-semibold text-foreground">Select a chat</div>
        )}
      </div>
      <div className="flex items-center gap-2">
         {selectedConversation ? (
          <>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Info className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Lock size={14} />
                <span>End-to-end encrypted</span>
            </div>
          </>
         ) : null}
      </div>
    </div>
  );
}
