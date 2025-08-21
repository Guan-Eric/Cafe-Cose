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
  showTermsCondition: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrls?: string[];
  available: boolean;
  index: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  notificationMessage: string;
  imageUrls?: string[];
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
  imageUrls?: string[];
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

export interface Promotion {
  id: string;
  title: string;
  message: string;
  notificationMessage: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface Feedback {
  id: string;
  feedback: string;
  name: string;
  createdAt: Date;
}

export interface Hours {
  defaultHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  holidays: Holiday[];
}

export interface Holiday {
  date: Date;
  open: string;
  close: string;
  name: string;
}
