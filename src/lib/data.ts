export type User = {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
};

export type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  mediaUrl?: string;
};

export type Conversation = {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  members: string[];
  messages: Message[];
  unread?: number;
};

export const users: User[] = [
  { id: 'user1', name: 'You', avatar: 'https://placehold.co/100x100/E6E6FA/6A5ACD?text=Y', online: true },
  { id: 'user2', name: 'Alice', avatar: 'https://placehold.co/100x100/6A5ACD/E6E6FA?text=A', online: true },
  { id: 'user3', name: 'Bob', avatar: 'https://placehold.co/100x100/6A5ACD/E6E6FA?text=B', online: false },
  { id: 'user4', name: 'Charlie', avatar: 'https://placehold.co/100x100/6A5ACD/E6E6FA?text=C', online: true },
  { id: 'user5', name: 'Diana', avatar: 'https://placehold.co/100x100/6A5ACD/E6E6FA?text=D', online: false },
  { id: 'user6', name: 'Ethan', avatar: 'https://placehold.co/100x100/6A5ACD/E6E6FA?text=E', online: true },
];

export const conversations: Conversation[] = [
  {
    id: 'convo1',
    type: 'direct',
    members: ['user1', 'user2'],
    unread: 2,
    messages: [
      { id: 'msg1', senderId: 'user2', content: 'Hey! How are you?', timestamp: '10:00 AM' },
      { id: 'msg2', senderId: 'user1', content: 'I am good, thanks! How about you?', timestamp: '10:01 AM' },
      { id: 'msg3', senderId: 'user2', content: 'Doing great! Just working on the new project.', timestamp: '10:02 AM' },
      { id: 'msg4', senderId: 'user2', content: "It's going to be awesome.", timestamp: '10:02 AM' },
    ],
  },
  {
    id: 'convo2',
    type: 'group',
    name: 'Project Team',
    members: ['user1', 'user3', 'user4'],
    unread: 5,
    messages: [
      { id: 'msg5', senderId: 'user3', content: 'Hey team, any updates on the design?', timestamp: '11:30 AM' },
      { id: 'msg6', senderId: 'user4', content: 'I have shared the latest mockups in the drive.', timestamp: '11:35 AM' },
      { id: 'msg7', senderId: 'user1', content: 'Looks great! I will review them now.', timestamp: '11:36 AM' },
      { id: 'msg8', senderId: 'user3', content: 'Perfect!', timestamp: '11:37 AM' },
      { id: 'msg9', senderId: 'user4', content: 'This is an example of a shared image:', timestamp: '11:38 AM' },
      { id: 'msg10', senderId: 'user4', content: '', mediaUrl: 'https://placehold.co/600x400', timestamp: '11:38 AM' },
    ],
  },
  {
    id: 'convo3',
    type: 'direct',
    members: ['user1', 'user5'],
    messages: [
      { id: 'msg11', senderId: 'user5', content: 'Lunch today?', timestamp: '12:00 PM' },
      { id: 'msg12', senderId: 'user1', content: 'Sure, where to?', timestamp: '12:01 PM' },
    ],
  },
    {
    id: 'convo4',
    type: 'direct',
    members: ['user1', 'user6'],
    messages: [
      { id: 'msg13', senderId: 'user6', content: 'Can you check my PR?', timestamp: '01:15 PM' },
    ],
  },
];
