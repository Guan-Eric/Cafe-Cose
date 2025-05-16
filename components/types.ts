export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  url: string;
  announcements: boolean;
  runs: boolean;
  admin: boolean;
  tokens: string[];
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
  notificationMessage: string;
  imageUrl?: string;
  createdAt: Date;
}

export type RSVPStatus = 'yes' | 'no' | 'maybe' | undefined;

export interface Participant {
  id: string;
  name: string;
  status: RSVPStatus;
  url: string;
}

export interface Run {
  id: string;
  title: string;
  message: string;
  notificationMessage: string;
  date: Date;
  imageUrl?: string;
  isRSVP: boolean;
  participants?: Participant[];
}

export enum Category {
  Coffee = 'Coffee',
  Tea = 'Tea',
  Specialty = 'Specialty',
  Smoothie = 'Smoothie',
  Food = 'Food',
  Pastry = 'Pastry',
}
