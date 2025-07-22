"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  SidebarHeader,
  SidebarInput,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { User, Conversation } from '@/lib/data';
import { users } from '@/lib/data';
import { MessageSquare, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface ContactListProps {
  user: User;
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

export function ContactList({ user, conversations, selectedConversation, onSelectConversation }: ContactListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const getConversationDetails = (convo: Conversation) => {
    if (convo.type === 'direct') {
      const otherUserId = convo.members.find(id => id !== user.id);
      const otherUser = users.find(u => u.id === otherUserId);
      return {
        name: otherUser?.name || 'Unknown User',
        avatar: otherUser?.avatar,
        fallback: otherUser?.name?.charAt(0) || 'U',
      };
    }
    return {
      name: convo.name || 'Group Chat',
      avatar: 'https://placehold.co/100x100/6A5ACD/E6E6FA?text=G',
      fallback: 'G',
    };
  };

  const filteredConversations = useMemo(() => {
    return conversations.filter(convo => {
      const details = getConversationDetails(convo);
      return details.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [conversations, searchTerm, user.id]);

  return (
    <div className="flex flex-col h-full">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold font-headline text-foreground group-data-[collapsible=icon]:hidden">
            WhisperNet
          </h1>
        </div>
        <SidebarInput
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-4"
        />
      </SidebarHeader>

      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {filteredConversations.map(convo => {
            const details = getConversationDetails(convo);
            const lastMessage = convo.messages[convo.messages.length - 1];

            return (
              <SidebarMenuItem key={convo.id}>
                <SidebarMenuButton
                  onClick={() => onSelectConversation(convo)}
                  isActive={selectedConversation?.id === convo.id}
                  className="h-auto py-3 px-2 flex items-start gap-3"
                >
                  <Avatar className="h-10 w-10 flex-shrink-0" data-ai-hint="person portrait">
                    <AvatarImage src={details.avatar} alt={details.name} />
                    <AvatarFallback>{details.fallback}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow overflow-hidden group-data-[collapsible=icon]:hidden">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold truncate">{details.name}</p>
                      {lastMessage && (
                        <p className="text-xs text-muted-foreground">{lastMessage.timestamp}</p>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground truncate w-40">
                            {lastMessage?.content}
                        </p>
                        {convo.unread && convo.unread > 0 ? (
                        <Badge className="flex-shrink-0">{convo.unread}</Badge>
                        ) : null}
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <div className="p-4 border-t group-data-[collapsible=icon]:p-2">
         <div className="flex items-center gap-3">
             <Avatar className="h-10 w-10" data-ai-hint="person portrait">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
             </Avatar>
             <div className="flex-grow overflow-hidden group-data-[collapsible=icon]:hidden">
                <p className="font-semibold truncate">{user.name}</p>
                <p className="text-sm text-muted-foreground">Online</p>
             </div>
             <Link href="/login" className="group-data-[collapsible=icon]:hidden">
                <Button variant="ghost" size="icon">
                    <LogOut className="h-5 w-5" />
                </Button>
             </Link>
         </div>
      </div>
    </div>
  );
}
