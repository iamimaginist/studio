import { ChatLayout } from '@/components/chat/chat-layout';
import { users, conversations } from '@/lib/data';

export default function ChatPage() {
  const loggedInUser = users.find(user => user.id === 'user1');

  if (!loggedInUser) {
    // Handle case where logged-in user is not found
    return <div>Error: User not found</div>;
  }
  
  return (
    <main className="h-screen w-full bg-background">
      <ChatLayout
        user={loggedInUser}
        conversations={conversations}
      />
    </main>
  );
}
