
import { CountryCode, User, Video, NewsArticle, Chat, Gift, MusicTrack, Comment, Status, Post, Notification, AnalyticsData, Transaction } from './types';

export const COUNTRIES: CountryCode[] = [
  // North America
  { code: 'US', name: 'United States', dialCode: '+1', legalAge: 18 },
  { code: 'CA', name: 'Canada', dialCode: '+1', legalAge: 18 },
  { code: 'MX', name: 'Mexico', dialCode: '+52', legalAge: 18 },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', legalAge: 18 },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', legalAge: 18 },
  { code: 'PA', name: 'Panama', dialCode: '+507', legalAge: 18 },
  { code: 'JM', name: 'Jamaica', dialCode: '+1-876', legalAge: 18 },
  { code: 'CU', name: 'Cuba', dialCode: '+53', legalAge: 18 },
  { code: 'DO', name: 'Dominican Republic', dialCode: '+1-809', legalAge: 18 },
  { code: 'HT', name: 'Haiti', dialCode: '+509', legalAge: 18 },

  // South America
  { code: 'BR', name: 'Brazil', dialCode: '+55', legalAge: 18 },
  { code: 'AR', name: 'Argentina', dialCode: '+54', legalAge: 18 },
  { code: 'CO', name: 'Colombia', dialCode: '+57', legalAge: 18 },
  { code: 'PE', name: 'Peru', dialCode: '+51', legalAge: 18 },
  { code: 'CL', name: 'Chile', dialCode: '+56', legalAge: 18 },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', legalAge: 18 },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', legalAge: 18 },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', legalAge: 18 },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', legalAge: 18 },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', legalAge: 18 },

  // Europe
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', legalAge: 18 },
  { code: 'DE', name: 'Germany', dialCode: '+49', legalAge: 16 },
  { code: 'FR', name: 'France', dialCode: '+33', legalAge: 16 },
  { code: 'IT', name: 'Italy', dialCode: '+39', legalAge: 18 },
  { code: 'ES', name: 'Spain', dialCode: '+34', legalAge: 18 },
  { code: 'RU', name: 'Russia', dialCode: '+7', legalAge: 18 },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', legalAge: 18 },
  { code: 'SE', name: 'Sweden', dialCode: '+46', legalAge: 18 },
  { code: 'PL', name: 'Poland', dialCode: '+48', legalAge: 18 },
  { code: 'UA', name: 'Ukraine', dialCode: '+380', legalAge: 18 },
  { code: 'RO', name: 'Romania', dialCode: '+40', legalAge: 18 },
  { code: 'BE', name: 'Belgium', dialCode: '+32', legalAge: 18 },
  { code: 'GR', name: 'Greece', dialCode: '+30', legalAge: 18 },
  { code: 'PT', name: 'Portugal', dialCode: '+351', legalAge: 18 },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', legalAge: 18 },
  { code: 'IE', name: 'Ireland', dialCode: '+353', legalAge: 18 },
  { code: 'NO', name: 'Norway', dialCode: '+47', legalAge: 18 },
  { code: 'DK', name: 'Denmark', dialCode: '+45', legalAge: 18 },
  { code: 'FI', name: 'Finland', dialCode: '+358', legalAge: 18 },

  // Asia
  { code: 'CN', name: 'China', dialCode: '+86', legalAge: 18 },
  { code: 'IN', name: 'India', dialCode: '+91', legalAge: 18 },
  { code: 'JP', name: 'Japan', dialCode: '+81', legalAge: 20 },
  { code: 'KR', name: 'South Korea', dialCode: '+82', legalAge: 19 },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', legalAge: 21 },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', legalAge: 18 },
  { code: 'AE', name: 'UAE', dialCode: '+971', legalAge: 21 },
  { code: 'TH', name: 'Thailand', dialCode: '+66', legalAge: 20 },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', legalAge: 18 },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', legalAge: 18 },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', legalAge: 18 },
  { code: 'PH', name: 'Philippines', dialCode: '+63', legalAge: 18 },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', legalAge: 18 },
  { code: 'SG', name: 'Singapore', dialCode: '+65', legalAge: 21 },
  { code: 'IL', name: 'Israel', dialCode: '+972', legalAge: 18 },
  { code: 'TR', name: 'Turkey', dialCode: '+90', legalAge: 18 },
  { code: 'IR', name: 'Iran', dialCode: '+98', legalAge: 18 },

  // Africa
  { code: 'NG', name: 'Nigeria', dialCode: '+234', legalAge: 18 },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', legalAge: 18 },
  { code: 'EG', name: 'Egypt', dialCode: '+20', legalAge: 18 },
  { code: 'KE', name: 'Kenya', dialCode: '+254', legalAge: 18 },
  { code: 'GH', name: 'Ghana', dialCode: '+233', legalAge: 18 },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251', legalAge: 18 },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255', legalAge: 18 },
  { code: 'MA', name: 'Morocco', dialCode: '+212', legalAge: 18 },
  { code: 'UG', name: 'Uganda', dialCode: '+256', legalAge: 18 },
  { code: 'DZ', name: 'Algeria', dialCode: '+213', legalAge: 18 },
  { code: 'SD', name: 'Sudan', dialCode: '+249', legalAge: 18 },
  { code: 'AO', name: 'Angola', dialCode: '+244', legalAge: 18 },
  { code: 'CI', name: 'Ivory Coast', dialCode: '+225', legalAge: 18 },
  { code: 'CM', name: 'Cameroon', dialCode: '+237', legalAge: 18 },
  { code: 'SN', name: 'Senegal', dialCode: '+221', legalAge: 18 },

  // Oceania
  { code: 'AU', name: 'Australia', dialCode: '+61', legalAge: 18 },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', legalAge: 18 },
  { code: 'FJ', name: 'Fiji', dialCode: '+679', legalAge: 18 },
  { code: 'PG', name: 'Papua New Guinea', dialCode: '+675', legalAge: 18 },

  // Antarctica
  { code: 'AQ', name: 'Antarctica', dialCode: '+672', legalAge: 18 },
];

export const VIRTUAL_GIFTS: Gift[] = [
  { id: 'g1', name: 'Rose', icon: '🌹', cost: 10 },
  { id: 'g2', name: 'Heart', icon: '❤️', cost: 50 },
  { id: 'g3', name: 'Fire', icon: '🔥', cost: 100 },
  { id: 'g4', name: 'Diamond', icon: '💎', cost: 500 },
  { id: 'g5', name: 'Rocket', icon: '🚀', cost: 1000 },
  { id: 'g6', name: 'Crown', icon: '👑', cost: 5000 },
  { id: 'g7', name: 'Planet', icon: '🪐', cost: 10000 },
];

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: 'm1', title: 'Viral Beats', artist: 'DJ Verse', duration: '0:60', cover: 'https://picsum.photos/seed/music1/100' },
  { id: 'm2', title: 'Neon Dreams', artist: 'Synthwave King', duration: '3:45', cover: 'https://picsum.photos/seed/music2/100' },
  { id: 'm3', title: 'Hype Mode', artist: 'Trap Star', duration: '2:30', cover: 'https://picsum.photos/seed/music3/100' },
  { id: 'm4', title: 'Chill Vibes', artist: 'LoFi Girl', duration: '4:20', cover: 'https://picsum.photos/seed/music4/100' },
  { id: 'm5', title: 'Epic Score', artist: 'Orchestra X', duration: '1:50', cover: 'https://picsum.photos/seed/music5/100' },
];

export const FILTERS = [
  { name: 'Normal', class: '' },
  { name: 'Vibrant', class: 'saturate-150 contrast-110' },
  { name: 'B&W', class: 'grayscale contrast-125' },
  { name: 'Vintage', class: 'sepia contrast-90 brightness-90' },
  { name: 'Cyber', class: 'hue-rotate-90 contrast-125 saturate-150' },
  { name: 'Dreamy', class: 'brightness-110 contrast-90 blur-[0.5px]' },
];

// --- DATA GENERATORS ---

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Quinn', 'Avery', 'Skyler', 'Dakota', 'Reese', 'Rowan', 'Sage', 'Eden', 'Kai', 'River', 'Zion', 'Phoenix', 'Ash'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore'];
const ADJECTIVES = ['Viral', 'Epic', 'Cool', 'Chill', 'Crazy', 'Funny', 'Insane', 'Cute', 'Amazing', 'Wild', 'Happy', 'Sad', 'Fast', 'Slow', 'Neon', 'Dark', 'Bright', 'Loud'];
const NOUNS = ['Cat', 'Dog', 'Car', 'Dance', 'Food', 'Travel', 'Tech', 'Life', 'Vibes', 'Squad', 'Goals', 'Meme', 'Prank', 'Challenge', 'Hack', 'Style', 'Art', 'Music'];
const INTERESTS = ['Gaming', 'Music', 'Dancing', 'Tech', 'Fashion', 'Travel', 'Fitness', 'Food', 'Art', 'Photography'];
const RELATIONSHIP_STATUS = ['Single', 'In a Relationship', 'It\'s Complicated', 'Married', 'Looking for Friends'];

const VIDEO_URLS = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
];

const generateUser = (id: string): User => {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${Math.floor(Math.random() * 1000)}`;
  
  return {
    id,
    username,
    avatar: `https://picsum.photos/seed/${id}/200`,
    country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)].code,
    age: Math.floor(Math.random() * 30) + 18,
    followers: Math.floor(Math.random() * 1000000),
    following: Math.floor(Math.random() * 1000),
    bio: `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${NOUNS[Math.floor(Math.random() * NOUNS.length)]} lover 🚀`,
    coins: Math.floor(Math.random() * 5000),
    isCreator: Math.random() > 0.7,
    subscriptionPrice: Math.random() > 0.8 ? Math.floor(Math.random() * 90) + 10 : undefined,
    earnings: Math.random() * 10000,
    subscribers: Math.floor(Math.random() * 5000),
    joinDate: new Date(Date.now() - Math.random() * 31536000000).toLocaleDateString(),
    interests: Array.from({length: 3}, () => INTERESTS[Math.floor(Math.random() * INTERESTS.length)]),
    relationshipStatus: RELATIONSHIP_STATUS[Math.floor(Math.random() * RELATIONSHIP_STATUS.length)]
  };
};

const generateVideo = (id: string, users: User[]): Video => {
  const author = users[Math.floor(Math.random() * users.length)];
  const isShort = Math.random() > 0.3;
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  
  return {
    id,
    url: VIDEO_URLS[Math.floor(Math.random() * VIDEO_URLS.length)],
    thumbnail: `https://picsum.photos/seed/${id}/400/600`,
    author,
    description: `${adj} ${noun} moment! #${adj.toLowerCase()} #${noun.toLowerCase()} #viral`,
    likes: Math.floor(Math.random() * 50000),
    comments: Math.floor(Math.random() * 2000),
    shares: Math.floor(Math.random() * 1000),
    type: isShort ? 'short' : 'long',
    duration: isShort ? '0:59' : `${Math.floor(Math.random() * 10) + 2}:00`,
    isExclusive: author.isCreator && Math.random() > 0.9,
    isAd: Math.random() > 0.95,
    adLink: Math.random() > 0.95 ? 'https://google.com' : undefined
  };
};

const generateNews = (id: string): NewsArticle => {
    const cats: any[] = ['Politics', 'Science', 'Celebrity', 'Novel'];
    return {
        id,
        title: `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} News about ${NOUNS[Math.floor(Math.random() * NOUNS.length)]}`,
        summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
        content: 'Full content of the article goes here...',
        imageUrl: `https://picsum.photos/seed/news${id}/600/300`,
        category: cats[Math.floor(Math.random() * cats.length)],
        likes: Math.floor(Math.random() * 10000),
        comments: Math.floor(Math.random() * 500)
    };
};

// Generate Massive Datasets
const USER_COUNT = 100; // Generating 100 realistic users to act as the "10,000" pool via reuse
const VIDEO_COUNT = 500; 

export const USERS_POOL = Array.from({ length: USER_COUNT }, (_, i) => generateUser(`u_${i}`));
export const VIDEOS_POOL = Array.from({ length: VIDEO_COUNT }, (_, i) => generateVideo(`v_${i}`, USERS_POOL));
export const NEWS_POOL = Array.from({ length: 50 }, (_, i) => generateNews(`n_${i}`));

export const MOCK_USER: User = USERS_POOL[0]; // Main user
MOCK_USER.username = "viral_king";
MOCK_USER.coins = 1000;
MOCK_USER.isCreator = true;

// Helper to get chats
export const generateChats = (currentUser: User, count: number): Chat[] => {
    return Array.from({ length: count }, (_, i) => {
        const other = USERS_POOL[Math.floor(Math.random() * USERS_POOL.length)];
        return {
            id: `c_${i}`,
            participants: [currentUser, other],
            messages: [
                {
                    id: `m_${i}_1`,
                    senderId: other.id,
                    text: `Hey, loved your recent ${NOUNS[Math.floor(Math.random() * NOUNS.length)]} video!`,
                    timestamp: Date.now() - Math.floor(Math.random() * 10000000)
                }
            ],
            type: 'private',
            lastMessage: `Hey, loved your recent...`,
            lastMessageTime: Date.now() - Math.floor(Math.random() * 10000000)
        };
    });
};

// Helper for Statuses
export const generateStatuses = (count: number): Status[] => {
  return Array.from({ length: count }, (_, i) => {
    const author = USERS_POOL[Math.floor(Math.random() * USERS_POOL.length)];
    const isVideo = Math.random() > 0.6;
    return {
      id: `s_${i}`,
      author,
      mediaType: isVideo ? 'video' : 'image',
      mediaUrl: isVideo ? VIDEO_URLS[Math.floor(Math.random() * VIDEO_URLS.length)] : `https://picsum.photos/seed/status${i}/400/800`,
      timestamp: Date.now() - Math.floor(Math.random() * 86400000), // Last 24h
      viewed: false,
      duration: isVideo ? 15 : undefined
    }
  });
}
export const STATUS_POOL = generateStatuses(20);

// Helper for Comments
export const generateComments = (count: number): Comment[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `com_${i}`,
    author: USERS_POOL[Math.floor(Math.random() * USERS_POOL.length)],
    text: `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} content!`,
    timestamp: Date.now() - Math.floor(Math.random() * 10000000),
    likes: Math.floor(Math.random() * 100),
    replies: []
  }));
};

export const INITIAL_POSTS: Post[] = USERS_POOL.slice(10, 25).map(user => ({
    id: `p_${user.id}`,
    author: user,
    content: `Just living my best ${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} life!`,
    mediaUrl: `https://picsum.photos/seed/post${user.id}/600/400`,
    mediaType: 'image',
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    timestamp: '2 hrs ago'
}));

export const NOTIFICATIONS_POOL: Notification[] = Array.from({length: 15}, (_, i) => ({
    id: `notif_${i}`,
    type: ['like', 'comment', 'follow', 'reply', 'gift'][Math.floor(Math.random() * 5)] as any,
    user: USERS_POOL[Math.floor(Math.random() * USERS_POOL.length)],
    text: 'interacted with your content',
    timestamp: Date.now() - Math.floor(Math.random() * 86400000 * 2),
    read: Math.random() > 0.3
}));

export const MOCK_ANALYTICS: AnalyticsData = {
    views: [1200, 1500, 1100, 1800, 2200, 2500, 3000],
    likes: [100, 120, 90, 150, 200, 210, 280],
    shares: [10, 15, 8, 20, 25, 30, 45],
    revenue: [5, 8, 6, 12, 15, 18, 25],
    demographics: [
        { ageGroup: '13-17', percentage: 15 },
        { ageGroup: '18-24', percentage: 45 },
        { ageGroup: '25-34', percentage: 30 },
        { ageGroup: '35+', percentage: 10 }
    ],
    topCountries: [
        { code: 'US', percentage: 40 },
        { code: 'UK', percentage: 15 },
        { code: 'IN', percentage: 10 },
        { code: 'BR', percentage: 8 },
        { code: 'Other', percentage: 27 }
    ]
};

export const PURCHASE_HISTORY: Transaction[] = [
    { id: 't1', type: 'purchase', amount: 500, date: '2023-10-01', description: 'Coin Pack (500)' },
    { id: 't2', type: 'gift_sent', amount: -50, date: '2023-10-02', description: 'Sent Rose to @user1' },
    { id: 't3', type: 'subscription', amount: -20, date: '2023-10-05', description: 'Subscribed to @creatorX' },
    { id: 't4', type: 'gift_received', amount: 100, date: '2023-10-06', description: 'Received Fire from @fan1' },
];

export const COMMUNITY_GUIDELINES = `
**ViralVerse Community Guidelines**

1. **Respect Everyone**: No hate speech, bullying, or harassment.
2. **Safety First**: No violent, dangerous, or illegal content.
3. **Originality**: Respect copyright and intellectual property.
4. **Authenticity**: No spam, misleading metadata, or scams.
5. **Nudity & Sexual Content**: Not allowed. We are a safe space for diverse ages.
6. **Privacy**: Do not share others' private information without consent.

Violations may result in content removal or account suspension.
`;

export const HELP_CENTER = `
**ViralVerse Help Center**

**Account Issues**
- Reset Password: Go to login > Forgot Password.
- Delete Account: Settings > Account > Delete.

**Monetization**
- Creator Fund: Apply in Settings > Monetization once you hit 10k followers.
- Payouts: Processed on the 1st of every month via PayPal/Stripe.

**Safety**
- Reporting: Click the '...' on any video or profile to report violations.
- Blocking: Go to user profile > Block to stop interactions.

**Contact Us**
support@viralverse.app
`;
