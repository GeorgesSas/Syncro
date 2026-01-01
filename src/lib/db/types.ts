// Database types
export type UserType = 'closer' | 'entrepreneur' | 'admin';
export type MissionStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export type PaymentMethod = 'commission' | 'flat_fee';
export type PaymentStatus = 'pending' | 'held' | 'released' | 'refunded';
export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  name: string;
  user_type: UserType;
  created_at: string;
  updated_at: string;
}

export interface CloserProfile {
  id: string;
  user_id: string;
  bio?: string;
  experience_years: number;
  sectors: string[];
  hourly_rate?: number;
  is_premium: boolean;
  is_verified: boolean;
  portfolio_items: PortfolioItem[];
  availability: AvailabilityStatus;
  total_missions: number;
  success_rate: number;
  average_rating: number;
  stripe_account_id?: string;
  photo_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface PortfolioItem {
  title: string;
  description: string;
  result: string;
  revenue_generated?: number;
  testimonial?: string;
  client_name?: string;
}

export interface EntrepreneurProfile {
  id: string;
  user_id: string;
  company_name: string;
  industry?: string;
  company_size?: string;
  is_premium: boolean;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Mission {
  id: string;
  entrepreneur_id: string;
  closer_id?: string;
  title: string;
  description: string;
  budget: number;
  commission_rate: number;
  commission_amount?: number;
  total_amount?: number;
  duration_months?: number;
  status: MissionStatus;
  start_date?: string;
  end_date?: string;
  payment_method: PaymentMethod;
  flat_fee_amount?: number;
  contract_signed_at?: string;
  contract_url?: string;
  sectors: string[];
  created_at: string;
  updated_at: string;
  entrepreneur?: User;
  closer?: User;
}

export interface MissionApplication {
  id: string;
  mission_id: string;
  closer_id: string;
  message?: string;
  status: string;
  created_at: string;
  mission?: Mission;
  closer?: User;
}

export interface Conversation {
  id: string;
  mission_id?: string;
  entrepreneur_id: string;
  closer_id: string;
  last_message_at: string;
  created_at: string;
  entrepreneur?: User;
  closer?: User;
  mission?: Mission;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
}

export interface Review {
  id: string;
  mission_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  reviewer?: User;
  reviewee?: User;
  mission?: Mission;
}

export interface Payment {
  id: string;
  mission_id: string;
  stripe_payment_intent_id?: string;
  amount: number;
  commission_amount: number;
  status: PaymentStatus;
  released_at?: string;
  created_at: string;
  updated_at: string;
  mission?: Mission;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  plan_type: string;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  created_at: string;
}

// Common sectors/industries
export const SECTORS = [
  'tech',
  'saas',
  'finance',
  'coaching',
  'formation',
  'consulting',
  'e-commerce',
  'immobilier',
  'assurance',
  'marketing',
  'autre',
] as const;

export type Sector = typeof SECTORS[number];

// Company sizes
export const COMPANY_SIZES = [
  'solo',
  '2-10',
  '11-50',
  '51-200',
  '200+',
] as const;

export type CompanySize = typeof COMPANY_SIZES[number];
