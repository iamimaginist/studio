"use client";

import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import type { User, Conversation } from '@/lib/data';
import { ContactList } from './contact-list';
import { ChatTopbar } from './chat-topbar';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';

interface ChatLayoutProps {
  user: User;
  conversations: Conversation[];
}

export function ChatLayout({ user, conversations: initialConversations }: ChatLayoutProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);

  const handleSendMessage = (messageContent: string) => {
    if (!selectedConversation) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedConversations = conversations.map(convo => {
      if (convo.id === selectedConversation.id) {
        return {
          ...convo,
          messages: [...convo.messages, newMessage]
        };
      }
      return convo;
    });

    setConversations(updatedConversations);
    const updatedSelected = updatedConversations.find(c => c.id === selectedConversation.id);
    setSelectedConversation(updatedSelected || null);
  };

  return (
    <SidebarProvider defaultOpen>
        <Sidebar className="p-2" collapsible="icon">
          <ContactList
            user={user}
            conversations={conversations}
            onSelectConversation={setSelectedConversation}
            selectedConversation={selectedConversation}
          />
        </Sidebar>
        <SidebarInset className="max-h-screen">
          <div className="flex flex-col h-full">
            <ChatTopbar selectedConversation={selectedConversation} user={user} />
            <ChatMessages
              messages={selectedConversation?.messages || []}
              user={user}
              members={selectedConversation?.members || []}
            />
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={!selectedConversation}
            />
          </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
