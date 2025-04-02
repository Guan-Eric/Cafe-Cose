interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  qrCode: string;
  imageUrl?: string;
  announcements: boolean;
  runs: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
}

interface Run {
  id: string;
  title: string;
  message: string;
  date: Date;
  participants: string[];
}
