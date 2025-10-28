export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
  messages: TicketMessage[];
  userId?: number;
}

export interface TicketMessage {
  id: string;
  content: string;
  sender: 'user' | 'support';
  sentAt: Date;
  read: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  isActive: boolean;
}

export interface ContactChannel {
  type: 'phone' | 'email' | 'telegram' | 'whatsapp' | 'instagram';
  label: string;
  value: string;
  icon: string;
}

// انواع ثابت برای type safety
export type TicketCategory = 
  | 'technical' 
  | 'payment' 
  | 'reservation' 
  | 'general' 
  | 'suggestion';

export type TicketStatus = 
  | 'open' 
  | 'in_progress' 
  | 'resolved' 
  | 'closed';

export type TicketPriority = 
  | 'low' 
  | 'medium' 
  | 'high' 
  | 'urgent';

export type FAQCategory =
  | 'general'
  | 'payment'
  | 'reservation'
  | 'technical'
  | 'account';