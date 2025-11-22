
export interface User {
  id: string;
  username: string;
  avatar: string;
  country: string;
  age: number;
  followers: number;
  following: number;
  bio: string;
  // Monetization
  coins: number;
  isCreator: boolean;
  subscriptionPrice?: number; // Cost in coins per month
  earnings: number;
  subscribers?: number;
  // Profile Details
  joinDate?: string;
  interests?: string[];
  relationshipStatus?: string;
}

export interface Video {
  id: string;
  url: string;
  thumbnail: string;
  author: User;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  type: 'short' | 'long';
  duration: string; 
  // Monetization
  isAd?: boolean;
  adLink?: string;
  isExclusive?: boolean; // Requires subscription
}

export interface Post {
  id: string;
  author: User;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likes: number;
  comments: number;
  timestamp: string; // ISO string or display string
  isAd?: boolean;
  isReshare?: boolean;
  originalPost?: Post;
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  timestamp: number;
  likes: number;
  replies: Comment[];
  isLiked?: boolean;
}

export interface Status {
  id: string;
  author: User;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  timestamp: number;
  viewed: boolean;
  duration?: number; // For videos, max 120s
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: 'Politics' | 'Science' | 'Celebrity' | 'Novel';
  likes: number;
  comments: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: 'audio' | 'video' | 'image';
  timestamp: number;
}

export interface Chat {
  id: string;
  participants: User[];
  messages: ChatMessage[];
  type: 'private' | 'group';
  lastMessage?: string;
  lastMessageTime?: number;
}

export interface CountryCode {
  code: string;
  name: string;
  dialCode: string;
  legalAge: number;
}

export interface Gift {
  id: string;
  name: string;
  icon: string;
  cost: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  cover: string;
}

export interface LiveComment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  isSystem?: boolean;
  gift?: Gift;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'reply' | 'gift';
  user: User;
  text: string;
  timestamp: number;
  read: boolean;
  targetId?: string; // ID of post/video/comment
}

export interface AnalyticsData {
  views: number[]; // Last 7 days
  likes: number[];
  shares: number[];
  revenue: number[];
  demographics: { ageGroup: string, percentage: number }[];
  topCountries: { code: string, percentage: number }[];
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'gift_sent' | 'gift_received' | 'subscription';
  amount: number;
  date: string;
  description: string;
}
