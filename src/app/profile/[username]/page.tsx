"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings,
  Grid3X3,
  MessageSquare,
  Bookmark,
  Home,
  Search,
  Compass,
  PlusSquare,
  User,
  Heart,
  MoreHorizontal,
  MessageCircle,
  Send,
  X,
  Bot,
  Star,
  Clock,
  Calendar,
  Zap,
  Brain,
  Users,
  Sparkles,
  Play,
  Pause,
  Edit,
  Share,
  Copy
} from "lucide-react";

// 대화 세션 타입 (기존 포스트를 대체)
interface ChatSession {
  id: number;
  chatbotId: number;
  title: string;
  preview: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  isBookmarked?: boolean;
  tags?: string[];
  thumbnail?: string;
  duration?: string;
  mood?: 'positive' | 'neutral' | 'negative';
}

// 챗봇 프로필 타입
interface ChatbotProfile {
  id: number;
  name: string;
  avatar: string;
  description: string;
  personality: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  sessionCount: number;
  messageCount: number;
  rating: number;
  tags: string[];
  creator: string;
  isOwned?: boolean;
  followers?: number;
  isFollowing?: boolean;
  systemPrompt?: string;
  capabilities: string[];
  limitations: string[];
}

export default function ChatbotDetailPage({ params }: { params: { username: string } }) {
  // URL 파라미터에서 챗봇 ID 추출 (username을 chatbotId로 사용)
  const chatbotId = parseInt(params.username) || 1;

  // 상태 관리
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [activeTab, setActiveTab] = useState<'sessions' | 'info' | 'settings'>('sessions');
  const [bookmarkedSessions, setBookmarkedSessions] = useState<Set<number>>(new Set());
  const [isFollowing, setIsFollowing] = useState(false);

  // 더미 챗봇 데이터 (ID에 따라 다른 챗봇 표시)
  const getChatbotData = (id: number): ChatbotProfile => {
    const chatbots = {
      1: {
        id: 1,
        name: "AI 헬퍼",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=helper",
        description: "일반적인 질문부터 복잡한 문제까지 도와드립니다. 친근하고 도움이 되는 AI 어시스턴트입니다. 24시간 언제든지 궁금한 것을 물어보세요!",
        personality: "친근하고 도움이 되는",
        category: "일반",
        isActive: true,
        createdAt: "2024-01-15",
        sessionCount: 1250,
        messageCount: 15420,
        rating: 4.8,
        tags: ["도움", "친근함", "다재다능", "신뢰성"],
        creator: "ai_team",
        isOwned: false,
        followers: 2840,
        isFollowing: false,
        systemPrompt: "당신은 친근하고 도움이 되는 AI 어시스턴트입니다.",
        capabilities: [
          "일반 질문 답변",
          "문제 해결 도움",
          "정보 검색 및 요약",
          "창작 활동 지원",
          "학습 도움"
        ],
        limitations: [
          "실시간 정보 제한",
          "개인 정보 처리 불가",
          "의료/법률 조언 제한"
        ]
      },
      2: {
        id: 2,
        name: "학습 도우미",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=study",
        description: "학습과 관련된 모든 것을 도와드립니다. 공부 방법, 학습 계획, 과제 도움까지!",
        personality: "차분하고 체계적인",
        category: "교육",
        isActive: true,
        createdAt: "2024-01-10",
        sessionCount: 850,
        messageCount: 12300,
        rating: 4.9,
        tags: ["학습", "교육", "체계적", "도움"],
        creator: "edu_team",
        isOwned: false,
        followers: 1200,
        isFollowing: false,
        systemPrompt: "당신은 학습을 도와주는 전문 튜터입니다.",
        capabilities: [
          "학습 계획 수립",
          "과제 도움",
          "개념 설명",
          "문제 해결",
          "시험 준비"
        ],
        limitations: [
          "숙제 대신 해주지 않음",
          "부정행위 도움 불가",
          "개인 정보 요구 불가"
        ]
      },
      3: {
        id: 3,
        name: "요리 마스터",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cooking",
        description: "맛있는 요리 레시피와 요리 팁을 알려드립니다. 초보자부터 전문가까지!",
        personality: "열정적이고 친근한",
        category: "라이프스타일",
        isActive: true,
        createdAt: "2024-01-05",
        sessionCount: 2100,
        messageCount: 25600,
        rating: 4.7,
        tags: ["요리", "레시피", "맛집", "건강"],
        creator: "cooking_pro",
        isOwned: false,
        followers: 3100,
        isFollowing: true,
        systemPrompt: "당신은 요리를 사랑하는 전문 셰프입니다.",
        capabilities: [
          "레시피 추천",
          "요리 기법 설명",
          "재료 대체 방법",
          "영양 정보 제공",
          "식단 계획"
        ],
        limitations: [
          "개인 알레르기 진단 불가",
          "의학적 조언 제한",
          "상업적 추천 제한"
        ]
      },
      4: {
        id: 4,
        name: "운동 코치",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=fitness",
        description: "건강한 운동과 피트니스를 도와드립니다. 개인 맞춤 운동 계획을 세워보세요!",
        personality: "열정적이고 동기부여하는",
        category: "건강",
        isActive: true,
        createdAt: "2024-01-12",
        sessionCount: 950,
        messageCount: 8900,
        rating: 4.6,
        tags: ["운동", "건강", "피트니스", "다이어트"],
        creator: "fitness_guru",
        isOwned: false,
        followers: 892,
        isFollowing: false,
        systemPrompt: "당신은 전문 피트니스 트레이너입니다.",
        capabilities: [
          "운동 계획 수립",
          "홈트레이닝 가이드",
          "영양 조언",
          "동기부여",
          "부상 예방 팁"
        ],
        limitations: [
          "의학적 진단 불가",
          "개인 건강 상태 판단 제한",
          "약물 관련 조언 불가"
        ]
      },
      5: {
        id: 5,
        name: "코딩 멘토",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=coding",
        description: "프로그래밍 학습과 개발을 도와드립니다. 코딩 문제부터 프로젝트 설계까지!",
        personality: "논리적이고 차근차근",
        category: "기술",
        isActive: true,
        createdAt: "2024-01-08",
        sessionCount: 1800,
        messageCount: 22400,
        rating: 4.8,
        tags: ["프로그래밍", "개발", "코딩", "기술"],
        creator: "dev_master",
        isOwned: false,
        followers: 1500,
        isFollowing: false,
        systemPrompt: "당신은 경험 많은 소프트웨어 개발자입니다.",
        capabilities: [
          "코딩 문제 해결",
          "프로그래밍 언어 교육",
          "프로젝트 설계 도움",
          "디버깅 지원",
          "개발 방법론 안내"
        ],
        limitations: [
          "완성된 프로젝트 대신 작성 불가",
          "상업적 코드 유출 불가",
          "해킹 관련 도움 불가"
        ]
      }
    };

    return chatbots[id as keyof typeof chatbots] || chatbots[1];
  };

  const chatbot = getChatbotData(chatbotId);

  // 더미 대화 세션 데이터
  const sessions: ChatSession[] = [
    {
      id: 1,
      chatbotId: chatbotId,
      title: "프로그래밍 학습 로드맵",
      preview: "안녕하세요! 프로그래밍을 처음 시작하려고 하는데 어떤 언어부터 배우는 게 좋을까요?",
      messageCount: 24,
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
      isBookmarked: true,
      tags: ["프로그래밍", "학습", "조언"],
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop",
      duration: "45분",
      mood: 'positive'
    },
    {
      id: 2,
      chatbotId: chatbotId,
      title: "요리 레시피 추천",
      preview: "간단하면서도 맛있는 저녁 요리 레시피를 추천해주세요!",
      messageCount: 18,
      createdAt: "2024-01-19",
      updatedAt: "2024-01-19",
      tags: ["요리", "레시피", "추천"],
      thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop",
      duration: "32분",
      mood: 'positive'
    },
    {
      id: 3,
      chatbotId: chatbotId,
      title: "영어 학습 방법",
      preview: "영어 회화 실력을 늘리고 싶은데 효과적인 방법이 있을까요?",
      messageCount: 31,
      createdAt: "2024-01-18",
      updatedAt: "2024-01-18",
      tags: ["영어", "학습", "회화"],
      duration: "1시간 12분",
      mood: 'neutral'
    },
    {
      id: 4,
      chatbotId: chatbotId,
      title: "운동 계획 수립",
      preview: "홈트레이닝으로 체력을 기르고 싶어요. 계획을 세워주실 수 있나요?",
      messageCount: 15,
      createdAt: "2024-01-17",
      updatedAt: "2024-01-17",
      tags: ["운동", "건강", "계획"],
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
      duration: "28분",
      mood: 'positive'
    }
  ];

  // 즐겨찾기 토글
  const toggleBookmark = (sessionId: number) => {
    const newBookmarks = new Set(bookmarkedSessions);
    if (newBookmarks.has(sessionId)) {
      newBookmarks.delete(sessionId);
    } else {
      newBookmarks.add(sessionId);
    }
    setBookmarkedSessions(newBookmarks);
  };

  // 새 대화 시작
  const startNewChat = () => {
    const newSessionId = Date.now();
    window.location.href = `/chat/${chatbotId}/${newSessionId}`;
  };

  // 기존 대화 계속하기
  const continueChat = (sessionId: number) => {
    window.location.href = `/chat/${chatbotId}/${sessionId}`;
  };

  // 팔로우 토글
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  // 프로필 네비게이션
  const goToProfile = (username: string) => {
    window.location.href = '/profile/';
  };

  // 카테고리별 아이콘
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "일반": return <Bot className="h-4 w-4" />;
      case "교육": return <Brain className="h-4 w-4" />;
      case "라이프스타일": return <Sparkles className="h-4 w-4" />;
      case "기술": return <Zap className="h-4 w-4" />;
      case "건강": return <Users className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-16 lg:pb-0">
      {/* 메인 레이아웃 */}
      <div className="flex">
        {/* 왼쪽 사이드바 - 데스크톱에서만 표시 */}
        <div className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r border-gray-200 bg-white z-10">
          <div className="p-6">
            {/* 로고 */}
            <h1 className="text-2xl font-bold mb-8">ChatBotHub</h1>

            {/* 네비게이션 메뉴 */}
            <nav className="space-y-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => window.location.href = '/'}
              >
                <Home className="mr-3 h-6 w-6" />
                홈
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => window.location.href = '/chatbots'}
              >
                <Users className="mr-3 h-6 w-6" />
                친구 목록
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                <Search className="mr-3 h-6 w-6" />
                검색
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                <Heart className="mr-3 h-6 w-6" />
                즐겨찾기
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                <Heart className="mr-3 h-6 w-6" />
                알림
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => window.location.href = '/create'}
              >
                <PlusSquare className="mr-3 h-6 w-6" />
                챗봇 만들기
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left bg-gray-100">
                <User className="mr-3 h-6 w-6" />
                프로필
              </Button>
            </nav>
          </div>

          {/* 하단 더보기 */}
          <div className="absolute bottom-8 left-6">
            <Button variant="ghost" className="w-full justify-start text-left">
              <MoreHorizontal className="mr-3 h-6 w-6" />
              더 보기
            </Button>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 lg:ml-64">
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            {/* 챗봇 프로필 헤더 */}
            <div className="flex items-start gap-4 lg:gap-8 mb-6 lg:mb-8">
              {/* 챗봇 아바타 */}
              <div className="flex-shrink-0 relative">
                <Avatar className="w-20 h-20 lg:w-36 lg:h-36 border-4 border-white shadow-lg">
                  <AvatarImage src={chatbot.avatar} />
                  <AvatarFallback className="text-2xl"><Bot /></AvatarFallback>
                </Avatar>

                {/* 활성 상태 표시 */}
                <div className={`absolute bottom-2 right-2 w-4 h-4 lg:w-6 lg:h-6 rounded-full border-2 border-white ${
                  chatbot.isActive ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              </div>

              {/* 챗봇 정보 */}
              <div className="flex-1">
                {/* 이름과 버튼들 */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-xl lg:text-2xl font-bold">{chatbot.name}</h1>
                      <div className="flex items-center space-x-1">
                        {getCategoryIcon(chatbot.category)}
                        <span className="text-sm text-gray-500">{chatbot.category}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm lg:text-base mb-2">{chatbot.description}</p>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <span>by</span>
                      <span
                        className="font-medium cursor-pointer hover:underline"
                        onClick={() => goToProfile(chatbot.creator)}
                      >
                        @{chatbot.creator}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                    {!chatbot.isOwned && (
                      <Button
                        variant={isFollowing ? "outline" : "default"}
                        onClick={toggleFollow}
                        className="px-6"
                      >
                        {isFollowing ? "팔로잉" : "팔로우"}
                      </Button>
                    )}
                    <Button
                      variant="default"
                      onClick={startNewChat}
                      className="px-6"
                    >
                      대화하기
                    </Button>
                    {chatbot.isOwned && (
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* 통계 정보 */}
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div>
                    <p className="text-lg lg:text-xl font-bold">{chatbot.sessionCount.toLocaleString()}</p>
                    <p className="text-xs lg:text-sm text-gray-500">대화 세션</p>
                  </div>
                  <div>
                    <p className="text-lg lg:text-xl font-bold">{chatbot.followers?.toLocaleString()}</p>
                    <p className="text-xs lg:text-sm text-gray-500">팔로워</p>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg lg:text-xl font-bold">{chatbot.rating}</span>
                  </div>
                </div>

                {/* 태그들 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {chatbot.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'sessions'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('sessions')}
                >
                  <Grid3X3 className="inline-block mr-2 h-4 w-4" />
                  대화 목록
                </button>
                <button
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'info'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('info')}
                >
                  <MessageSquare className="inline-block mr-2 h-4 w-4" />
                  정보
                </button>
                {chatbot.isOwned && (
                  <button
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'settings'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="inline-block mr-2 h-4 w-4" />
                    설정
                  </button>
                )}
              </nav>
            </div>

            {/* 탭 내용 */}
            {activeTab === 'sessions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session) => (
                  <Card
                    key={session.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => continueChat(session.id)}
                  >
                    <CardContent className="p-0">
                      {/* 썸네일 또는 기본 이미지 */}
                      <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 relative">
                        {session.thumbnail ? (
                          <img
                            src={session.thumbnail}
                            alt={session.title}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MessageCircle className="h-12 w-12 text-gray-400" />
                          </div>
                        )}

                        {/* 북마크 버튼 */}
                        <button
                          className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(session.id);
                          }}
                        >
                          <Bookmark
                            className={`h-4 w-4 ${
                              bookmarkedSessions.has(session.id) 
                                ? 'fill-black text-black' 
                                : 'text-gray-600'
                            }`}
                          />
                        </button>

                        {/* 지속 시간 */}
                        {session.duration && (
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {session.duration}
                          </div>
                        )}
                      </div>

                      {/* 세션 정보 */}
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{session.title}</h3>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{session.preview}</p>

                        {/* 메타 정보 */}
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{session.messageCount}개</span>
                          </span>
                          <span>{session.duration}</span>
                        </div>

                        {/* 태그들 */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {session.tags?.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="text-xs text-gray-500">
                          {new Date(session.updatedAt).toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* 챗봇 소개 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">소개</h3>
                  <p className="text-gray-700 leading-relaxed">{chatbot.description}</p>
                </div>

                {/* 성격과 특성 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">성격</h3>
                  <Badge variant="secondary" className="text-sm">
                    {chatbot.personality}
                  </Badge>
                </div>

                {/* 가능한 기능 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">가능한 기능</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {chatbot.capabilities.map((capability, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 제한사항 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">제한사항</h3>
                  <div className="space-y-2">
                    {chatbot.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && chatbot.isOwned && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">챗봇 설정</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    이 페이지에서는 챗봇의 설정을 변경할 수 있습니다.
                  </p>
                  <Button>설정 페이지로 이동</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 - 모바일에서만 표시 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex justify-around py-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1"
            onClick={() => window.location.href = '/'}
          >
            <Home className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <Search className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <PlusSquare className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <Heart className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <User className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* 세션 상세 다이얼로그 */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>대화 세션</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={chatbot.avatar} />
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedSession.title}</h3>
                  <p className="text-sm text-gray-500">{chatbot.name}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm">{selectedSession.preview}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>메시지 {selectedSession.messageCount}개</span>
                <span>{selectedSession.duration}</span>
                <span>{new Date(selectedSession.updatedAt).toLocaleDateString('ko-KR')}</span>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => continueChat(selectedSession.id)} className="flex-1">
                  대화 계속하기
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleBookmark(selectedSession.id)}
                >
                  <Bookmark className={`h-4 w-4 ${
                    bookmarkedSessions.has(selectedSession.id) 
                      ? 'fill-current' 
                      : ''
                  }`} />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}