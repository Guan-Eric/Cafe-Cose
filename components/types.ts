export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  qrCode: string;
  imageUrl?: string;
  announcements: boolean;
  runs: boolean;
  admin: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  available: boolean;
  index: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface Run {
  id: string;
  title: string;
  message: string;
  date: Date;
  imageUrl?: string;
  participants: User[];
}

export enum Category {
  Coffee = 'Coffee',
  Tea = 'Tea',
  Specialty = 'Specialty',
  Smoothie = 'Smoothie',
  Food = 'Food',
  Pastry = 'Pastry',
}
