// AI 챗봇 프로필 타입
export interface ChatbotProfile {
  id: number;
  name: string;
  avatar: string;
  description: string;
  personality: string; // 챗봇의 성격/특성 (예: "친근한", "전문적인", "유머러스한")
  category: string; // 카테고리 (예: "일반", "학습", "엔터테인먼트", "비즈니스")
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sessionCount: number; // 총 대화 세션 수
  messageCount: number; // 총 메시지 수
}

// 대화 세션 타입 (기존 포스트를 대체)
export interface ChatSession {
  id: number;
  chatbotId: number;
  title: string; // 대화 제목 (첫 번째 메시지나 자동 생성)
  preview: string; // 대화 미리보기 (마지막 메시지나 요약)
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  isBookmarked?: boolean;
  tags?: string[]; // 대화 태그
}

// 메시지 타입 (기존 댓글을 대체)
export interface Message {
  id: number;
  sessionId: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isEdited?: boolean;
  reactions?: MessageReaction[];
}

// 메시지 반응 타입
export interface MessageReaction {
  id: number;
  emoji: string;
  count: number;
}

// 스토리를 챗봇 상태로 변경
export interface ChatbotStatus {
  id: number;
  chatbotId: number;
  content: string; // 상태 메시지
  type: 'text' | 'image' | 'video';
  media?: string; // 미디어 URL (이미지/비디오인 경우)
  isViewed: boolean;
  createdAt: string;
  expiresAt: string; // 24시간 후 만료
}

// 사용자 프로필 (기존 유지하되 챗봇 관련 정보 추가)
export interface UserProfile {
  id: number;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  createdChatbotsCount: number; // 생성한 챗봇 수
  favoriteChatbots: number[]; // 즐겨찾기한 챗봇 ID 목록
  isVerified?: boolean;
}

// 챗봇 생성/편집을 위한 폼 타입
export interface ChatbotFormData {
  name: string;
  description: string;
  personality: string;
  category: string;
  avatar?: File | string;
  systemPrompt?: string; // AI 모델에 전달할 시스템 프롬프트
  temperature?: number; // AI 응답의 창의성 조절 (0-1)
  maxTokens?: number; // 최대 토큰 수
}

// API 응답 타입들
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

// 챗봇 검색/필터 타입
export interface ChatbotFilter {
  category?: string;
  personality?: string;
  sortBy?: 'popular' | 'recent' | 'name' | 'messageCount';
  sortOrder?: 'asc' | 'desc';
  searchQuery?: string;
}

// 채팅 관련 설정 타입
export interface ChatSettings {
  autoSave: boolean;
  showTimestamps: boolean;
  enableNotifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  enterToSend: boolean;
}

// 알림 타입
export interface Notification {
  id: number;
  type: 'new_message' | 'chatbot_update' | 'system';
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string; // 클릭 시 이동할 URL
}