export type UserRole = 'guest' | 'employee' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyId: string;
  companyName: string;
  role: UserRole;
  isTenantVerified: boolean;
}

export type NoticeCategory = 'operations' | 'construction' | 'urgent';

export interface Notice {
  id: string;
  title: string;
  category: NoticeCategory;
  content: string;
  targetBuilding: string;
  startDate: string;
  endDate: string;
  isUrgent: boolean;
  attachmentUrl?: string;
  imageUrl?: string;
  contactPhone?: string;
  createdAt: string;
}

export type BenefitCategory = 'fnb' | 'shopping' | 'hotel' | 'leisure' | 'service';

export interface Benefit {
  id: string;
  title: string;
  brandName: string;
  category: BenefitCategory;
  description: string;
  discountText: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  couponId?: string;
  isActive: boolean;
  usageMethod: string;
  notes: string;
}

export type CouponStatus = 'available' | 'used' | 'expired';

export interface Coupon {
  id: string;
  title: string;
  benefitId: string;
  brandName: string;
  code: string;
  qrUrl?: string;
  barcodeUrl?: string;
  startDate: string;
  endDate: string;
  status: CouponStatus;
  downloadedAt?: string;
  usedAt?: string;
}

export interface CoexEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  imageUrl: string;
  description: string;
  officialUrl: string;
  isActive: boolean;
  hasTenantDiscount: boolean;
}

export type PostCategory =
  | 'recruitment'
  | 'secondhand'
  | 'event'
  | 'partnership'
  | 'brand'
  | 'poll';

export type PostStatus =
  | 'published'
  | 'draft'
  | 'hidden'
  | 'reported'
  | 'deleted'
  | 'completed';

export interface CommunityPost {
  id: string;
  userId: string;
  authorName: string;
  companyName: string;
  category: PostCategory;
  title: string;
  content: string;
  imageUrl?: string;
  contact?: string;
  email?: string;
  link?: string;
  status: PostStatus;
  viewCount: number;
  commentCount: number;
  createdAt: string;
}

export type ParkingStatus = 'free' | 'busy' | 'full' | 'unknown';

export interface ParkingInfo {
  parkingName: string;
  status: ParkingStatus;
  updatedAt: string;
}

export interface ContactDept {
  id: string;
  name: string;
  phone: string;
  icon: string;
}

// ── Poll / Survey ──────────────────────────────────────────

export type QuestionType = 'single' | 'multiple' | 'text' | 'score' | 'rating';

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

export interface PollQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: PollOption[];
  required: boolean;
  minScore?: number;
  maxScore?: number;
}

export type PollStatus = 'upcoming' | 'ongoing' | 'ended';

export interface Poll {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  isAnonymous: boolean;
  allowMultiple: boolean;
  questions: PollQuestion[];
  showResults: boolean;
  totalParticipants: number;
  status: PollStatus;
  createdAt: string;
}

// 사용자 응답 (로컬 상태용)
export type AnswerMap = Record<string, string | string[] | number>;

