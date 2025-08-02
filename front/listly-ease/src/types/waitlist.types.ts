// Service and waitlist related types
export interface Service {
  id: string;
  organizerId: string;
  name: string;
  description?: string;
  slug: string;
  waitlistTitle?: string;
  waitlistDescription?: string;
  waitlistBackground?: string;
  waitlistUrl: string;
  participantCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  slug: string;
  waitlistTitle?: string;
  waitlistDescription?: string;
  waitlistBackground?: string;
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  slug?: string;
  waitlistTitle?: string;
  waitlistDescription?: string;
  waitlistBackground?: string;
}

// Public waitlist types
export interface WaitlistDetails {
  title: string;
  description: string;
  background: string;
  currentParticipants: number;
}

export interface JoinWaitlistRequest {
  email: string;
}

export interface JoinWaitlistResponse {
  message: string;
  waitlistEntryId: string;
}

export interface ParticipantCountResponse {
  currentParticipants: number;
}

// Form and UI state types
export interface ServiceFormData {
  name: string;
  description: string;
  slug: string;
  waitlistTitle: string;
  waitlistDescription: string;
  waitlistBackground: string;
}

export interface DashboardStats {
  totalServices: number;
  totalParticipants: number;
  averageParticipantsPerService: number;
  recentServices: Service[];
}

// Error types
export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ServiceLoadingState extends LoadingState {
  services: Service[];
}

export interface ServiceDetailLoadingState extends LoadingState {
  service: Service | null;
}