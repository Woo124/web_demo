"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Home,
  Search,
  Compass,
  Video,
  MessageSquare,
  PlusSquare,
  User,
  Users,
  MoreHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Bot,
  Clock,
  ArrowLeft
} from "lucide-react";

// 챗봇 메시지 타입
interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// 포스트 타입 (챗봇 대화로 변경)
interface ChatPost {
  id: number;
  chatbotId: number;
  chatbotName: string;
  chatbotAvatar: string;
  sessionTitle: string;
  timeAgo: string;
  images: string[];
  likes: number;
  sessionSummary: string;
  messages: ChatMessage[];
  tags: string[];
}

// 스토리 타입 (최근 대화한 챗봇)
interface ChatbotStory {
  id: number;
  chatbotName: string;
  avatar: string;
  hasNewMessage: boolean;
  lastChatImage?: string;
}

export default function InstagramStyleChatbotHome() {
  // 상태 관리
  const [selectedPost, setSelectedPost] = useState<ChatPost | null>(null);
  const [selectedStory, setSelectedStory] = useState<ChatbotStory | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: number]: number}>({});
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [newMessage, setNewMessage] = useState("");

  // 검색 관련 상태
  const [showSearchSidebar, setShowSearchSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 채팅 관련 상태
  const [postMessages, setPostMessages] = useState<{[key: number]: ChatMessage[]}>({});
  const [currentInput, setCurrentInput] = useState("");

  // 더미 챗봇 스토리 데이터
  const chatbotStories: ChatbotStory[] = [
    {
      id: 1,
      chatbotName: "AI 헬퍼",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=helper",
      hasNewMessage: true,
      lastChatImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop"
    },
    {
      id: 2,
      chatbotName: "학습 도우미",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=study",
      hasNewMessage: false,
      lastChatImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&h=150&fit=crop"
    },
    {
      id: 3,
      chatbotName: "요리 마스터",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cooking",
      hasNewMessage: true,
      lastChatImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop"
    },
    {
      id: 4,
      chatbotName: "운동 코치",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=fitness",
      hasNewMessage: false
    },
    {
      id: 5,
      chatbotName: "코딩 멘토",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=coding",
      hasNewMessage: true
    }
  ];

  // 더미 채팅 포스트 데이터
  const chatPosts: ChatPost[] = [
    {
      id: 1,
      chatbotId: 1,
      chatbotName: "AI 헬퍼",
      chatbotAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=helper",
      sessionTitle: "프로그래밍 학습 로드맵 상담",
      timeAgo: "2시간",
      images: [
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=500&fit=crop"
      ],
      likes: 24,
      sessionSummary: "프로그래밍을 처음 시작하는 방법에 대해 AI 헬퍼와 상담했습니다. Python부터 시작하라는 조언을 받았어요!",
      messages: [
        {
          id: 1,
          role: 'user',
          content: "안녕하세요! 프로그래밍을 처음 시작하려고 하는데 어떤 언어부터 배우는 게 좋을까요?",
          timestamp: "2시간 전"
        },
        {
          id: 2,
          role: 'assistant',
          content: "안녕하세요! 프로그래밍을 처음 시작하신다면 Python을 추천드립니다. 문법이 직관적이고 배우기 쉬워서 초보자에게 적합해요.",
          timestamp: "2시간 전"
        }
      ],
      tags: ["프로그래밍", "Python", "학습"]
    },
    {
      id: 2,
      chatbotId: 3,
      chatbotName: "요리 마스터",
      chatbotAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cooking",
      sessionTitle: "집에서 만드는 간단한 파스타",
      timeAgo: "4시간",
      images: [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=500&h=500&fit=crop"
      ],
      likes: 156,
      sessionSummary: "재료가 부족한 상황에서도 맛있는 파스타를 만드는 방법을 배웠어요. 정말 간단하고 맛있더라구요!",
      messages: [
        {
          id: 1,
          role: 'user',
          content: "집에 토마토와 마늘만 있는데 파스타를 만들 수 있을까요?",
          timestamp: "4시간 전"
        },
        {
          id: 2,
          role: 'assistant',
          content: "네! 아글리오 올리오 스타일로 만들 수 있어요. 올리브오일에 마늘을 볶고 토마토를 추가하면 됩니다.",
          timestamp: "4시간 전"
        }
      ],
      tags: ["요리", "파스타", "간단요리"]
    }
  ];

  // 내가 만든 챗봇 더미 데이터
  const myChatbots = [
    { id: 1, name: "개인 비서", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=assistant", description: "일정 관리와 업무 도움" },
    { id: 2, name: "영어 튜터", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=english", description: "영어 회화 연습" },
    { id: 3, name: "독서 친구", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=book", description: "책 추천과 토론" }
  ];

  // 메시지 전송 함수
  const handleSendMessage = (postId: number, message: string) => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: message.trim(),
      timestamp: '방금 전'
    };

    setPostMessages(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || selectedPost?.messages || []), newMessage]
    }));

    setCurrentInput("");

    // 챗봇 응답 시뮬레이션
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `"${message}"에 대한 답변드립니다. 더 궁금한 것이 있으시면 언제든 물어보세요!`,
        timestamp: '방금 전'
      };

      setPostMessages(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), botResponse]
      }));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white pb-16 lg:pb-0">
      {/* 메인 레이아웃 */}
      <div className="flex">
        {/* 왼쪽 사이드바 - 데스크톱에서만 표시 */}
        <div className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r border-gray-200 bg-white z-10">
          <div className="p-6">
            {/* 로고 */}
            <h1 className="text-2xl font-bold mb-8">Instagram</h1>

            {/* 네비게이션 메뉴 */}
            <nav className="space-y-4">
              <Button variant="ghost" className="w-full justify-start text-left bg-gray-100">
                <Home className="mr-3 h-6 w-6" />
                홈
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => setShowSearchSidebar(true)}
              >
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
                만들기
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => window.location.href = '/settings/profile'}
              >
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
          <div className="flex justify-center xl:mr-80">
            {/* 중앙 피드 영역 */}
            <div className="w-full max-w-2xl">
              {/* 스토리 영역 */}
              <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <ScrollArea className="w-full">
                  <div className="flex space-x-4 p-4">
                    {chatbotStories.map((story, index) => (
                      <div
                        key={story.id}
                        className="flex flex-col items-center space-y-1 cursor-pointer flex-shrink-0"
                      >
                        <div className={`p-0.5 rounded-full ${
                          story.hasNewMessage
                            ? 'bg-gradient-to-r from-yellow-400 to-pink-500'
                            : 'bg-gray-300'
                        }`}>
                          <Avatar className="w-14 h-14 border-2 border-white">
                            <AvatarImage src={story.avatar} />
                            <AvatarFallback><Bot /></AvatarFallback>
                          </Avatar>
                        </div>
                        <span className="text-xs text-center max-w-[60px] truncate">
                          {story.chatbotName}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* 포스트 피드 */}
              <div className="space-y-6 p-4">
                {chatPosts.map((post) => (
                  <Card key={post.id} className="border-0 shadow-none">
                    <CardContent className="p-0">
                      {/* 포스트 헤더 */}
                      <div className="flex items-center justify-between p-4 pb-2">
                        <div
                          className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
                          onClick={() => window.location.href = `/profile/${post.chatbotId}`}
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={post.chatbotAvatar} />
                            <AvatarFallback><Bot /></AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">{post.chatbotName}</p>
                            <p className="text-xs text-gray-500">{post.timeAgo}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* 이미지 영역 */}
                      {post.images.length > 0 && (
                        <div className="relative">
                          <img
                            src={post.images[currentImageIndex[post.id] || 0]}
                            alt="Chat visualization"
                            className="w-full aspect-square object-cover"
                          />
                          {post.images.length > 1 && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 h-8 w-8"
                                onClick={() => {
                                  const newIndex = Math.max(0, (currentImageIndex[post.id] || 0) - 1);
                                  setCurrentImageIndex(prev => ({ ...prev, [post.id]: newIndex }));
                                }}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 h-8 w-8"
                                onClick={() => {
                                  const newIndex = Math.min(post.images.length - 1, (currentImageIndex[post.id] || 0) + 1);
                                  setCurrentImageIndex(prev => ({ ...prev, [post.id]: newIndex }));
                                }}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      )}

                      {/* 액션 버튼들 */}
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() => {
                              const newLiked = new Set(likedPosts);
                              if (newLiked.has(post.id)) {
                                newLiked.delete(post.id);
                              } else {
                                newLiked.add(post.id);
                              }
                              setLikedPosts(newLiked);
                            }}
                          >
                            <Heart className={`h-6 w-6 ${likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() => setSelectedPost(post)}
                          >
                            <MessageCircle className="h-6 w-6" />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-0 h-auto">
                            <Send className="h-6 w-6" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <Bookmark className="h-6 w-6" />
                        </Button>
                      </div>

                      {/* 좋아요 수와 설명 */}
                      <div className="px-4 pb-4">
                        <p className="font-semibold text-sm mb-1">
                          즐겨찾기 {(post.likes + (likedPosts.has(post.id) ? 1 : 0)).toLocaleString()}개
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold cursor-pointer hover:underline">
                            {post.chatbotName}
                          </span> {post.sessionSummary}
                        </p>
                        <button
                          className="text-sm text-gray-500 mt-1 hover:text-gray-700"
                          onClick={() => setSelectedPost(post)}
                        >
                          채팅 내역 {post.messages.length}개 모두 보기
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 우측 추천 영역 - 고정 위치 */}
        <div className="hidden xl:block fixed right-0 top-0 w-80 h-full">
          <div className="pt-8 pl-8 pr-4 h-full overflow-y-auto">
            <div className="sticky top-8">
              {/* 현재 사용자 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src="/api/placeholder/56/56" />
                    <AvatarFallback>나</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">my_username</p>
                    <p className="text-sm text-gray-500">내 이름</p>
                  </div>
                </div>
                <Button variant="ghost" className="text-blue-500 text-sm font-semibold">
                  전환
                </Button>
              </div>

              {/* 추천 챗봇 프로필 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500">챗봇 목록</h3>
                  <Button variant="ghost" className="text-xs text-blue-500">
                    모두 보기
                  </Button>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 1,
                      name: "AI 헬퍼",
                      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=helper",
                      description: "일반적인 질문 답변",
                      followers: "2.8k명",
                      isFollowing: false
                    },
                    {
                      id: 2,
                      name: "학습 도우미",
                      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=study",
                      description: "학습 관련 도움",
                      followers: "1.2k명",
                      isFollowing: false
                    },
                    {
                      id: 3,
                      name: "요리 마스터",
                      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cooking",
                      description: "요리 레시피 추천",
                      followers: "3.1k명",
                      isFollowing: true
                    },
                    {
                      id: 4,
                      name: "운동 코치",
                      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=fitness",
                      description: "운동 계획 및 조언",
                      followers: "892명",
                      isFollowing: false
                    },
                    {
                      id: 5,
                      name: "코딩 멘토",
                      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=coding",
                      description: "프로그래밍 학습",
                      followers: "1.5k명",
                      isFollowing: false
                    }
                  ].map((chatbot) => (
                    <div key={chatbot.id} className="flex items-center justify-between">
                      <div
                        className="flex items-center space-x-3 cursor-pointer hover:opacity-80 flex-1"
                        onClick={() => window.location.href = `/profile/${chatbot.id}`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={chatbot.avatar} />
                          <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{chatbot.name}</p>
                          <p className="text-xs text-gray-500 truncate">{chatbot.description}</p>
                          <p className="text-xs text-gray-400">팔로워 {chatbot.followers}</p>
                        </div>
                      </div>
                      <Button
                        variant={chatbot.isFollowing ? "outline" : "default"}
                        size="sm"
                        className="text-xs px-3 py-1 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          // 팔로우 토글 로직
                        }}
                      >
                        {chatbot.isFollowing ? "팔로잉" : "팔로우"}
                      </Button>
                    </div>
                  ))}
                </div>

                {/* 하단 링크들 */}
                <div className="mt-8 text-xs text-gray-400 space-y-1">
                  <div className="space-x-2">
                    <span className="cursor-pointer hover:underline">소개</span>
                    <span className="cursor-pointer hover:underline">도움말</span>
                    <span className="cursor-pointer hover:underline">홍보 센터</span>
                  </div>
                  <div className="space-x-2">
                    <span className="cursor-pointer hover:underline">API</span>
                    <span className="cursor-pointer hover:underline">채용 정보</span>
                    <span className="cursor-pointer hover:underline">개인정보처리방침</span>
                  </div>
                  <div className="space-x-2">
                    <span className="cursor-pointer hover:underline">약관</span>
                    <span className="cursor-pointer hover:underline">위치</span>
                    <span className="cursor-pointer hover:underline">언어</span>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-400">© 2024 CHATBOTHUB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 - 모바일에서만 표시 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex justify-around py-2">
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
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

      {/* 채팅 다이얼로그 */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          {selectedPost && (
            <div className="flex h-[70vh]">
              {/* 왼쪽: 이미지 */}
              <div className="flex-1 bg-black flex items-center justify-center">
                {selectedPost.images.length > 0 ? (
                  <img
                    src={selectedPost.images[currentImageIndex[selectedPost.id] || 0]}
                    alt="Chat visualization"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-white">이미지 없음</div>
                )}
              </div>

              {/* 오른쪽: 채팅 영역 */}
              <div className="w-80 flex flex-col">
                {/* 헤더 */}
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={selectedPost.chatbotAvatar} />
                      <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{selectedPost.chatbotName}</p>
                      <p className="text-xs text-gray-500">{selectedPost.sessionTitle}</p>
                    </div>
                  </div>
                </div>

                {/* 채팅 메시지들 */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {(postMessages[selectedPost.id] || selectedPost.messages).map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`rounded-2xl px-3 py-2 max-w-[80%] ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* 메시지 입력창 */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      placeholder="메시지를 입력하세요..."
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage(selectedPost.id, currentInput);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSendMessage(selectedPost.id, currentInput)}
                      disabled={!currentInput.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 검색 사이드바 오버레이 */}
      {showSearchSidebar && (
        <div className="fixed inset-0 z-50 flex">
          {/* 왼쪽 사이드바 공간 유지 */}
          <div className="w-64"></div>

          {/* 검색 사이드바 */}
          <div className="w-80 bg-white h-full shadow-xl border-r border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearchSidebar(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold">검색</h1>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색"
                  className="pl-10 pr-10 bg-gray-100 border-0 rounded-lg"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="p-4">
                {/* 대화 포스트 검색 */}
                <h2 className="text-base font-semibold mb-4">대화 포스트 검색</h2>

                {/* 검색 결과 표시 */}
                {searchQuery ? (
                  <div className="space-y-3">
                    {chatPosts
                      .filter(post =>
                        post.sessionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        post.sessionSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        post.chatbotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                      )
                      .map((post) => (
                        <div
                          key={post.id}
                          className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() => setSelectedPost(post)}
                        >
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={post.chatbotAvatar} />
                            <AvatarFallback><Bot /></AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{post.sessionTitle}</p>
                            <p className="text-xs text-gray-500">{post.chatbotName}</p>
                            <p className="text-xs text-gray-400 truncate">{post.sessionSummary}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {post.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">대화 포스트를 검색해보세요</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* 오버레이 백그라운드 */}
          <div
            className="flex-1 bg-black/20"
            onClick={() => setShowSearchSidebar(false)}
          />
        </div>
      )}
    </div>
  );
}