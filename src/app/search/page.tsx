"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Search,
  X,
  Bot
} from "lucide-react";

// 챗봇 프로필 타입
interface ChatbotProfile {
  id: number;
  name: string;
  avatar: string;
  description: string;
  creator: string;
  isOwned: boolean;
}

export default function InstagramSearchPage() {
  // 상태 관리
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChatbotProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 유저가 만든 챗봇들 (내 챗봇들)
  const myChatbots: ChatbotProfile[] = [
    {
      id: 3,
      name: "요리 마스터",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cooking",
      description: "요리 레시피와 조리 방법을 알려드립니다",
      creator: "chef_bot",
      isOwned: true
    },
    {
      id: 5,
      name: "운동 코치",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=fitness",
      description: "개인 맞춤형 운동 계획과 건강 관리 팁을 제공합니다",
      creator: "fitness_pro",
      isOwned: true
    },
    {
      id: 7,
      name: "여행 가이드",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=travel",
      description: "전 세계 여행 정보와 팁을 제공합니다",
      creator: "travel_bot",
      isOwned: true
    },
    {
      id: 8,
      name: "음악 친구",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=music",
      description: "음악 추천과 감상평을 나누는 친구",
      creator: "music_lover",
      isOwned: true
    }
  ];

  // 전체 챗봇 데이터 (검색용)
  const allChatbots: ChatbotProfile[] = [
    ...myChatbots,
    {
      id: 1,
      name: "AI 헬퍼",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=helper",
      description: "일반적인 질문부터 복잡한 문제까지 도와드립니다",
      creator: "ai_team",
      isOwned: false
    },
    {
      id: 2,
      name: "학습 도우미",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=study",
      description: "학습과 교육에 특화된 AI입니다",
      creator: "edu_master",
      isOwned: false
    },
    {
      id: 4,
      name: "코딩 멘토",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=coding",
      description: "프로그래밍 질문과 코드 리뷰를 도와드립니다",
      creator: "dev_guru",
      isOwned: false
    },
    {
      id: 6,
      name: "창작 도우미",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=creative",
      description: "글쓰기, 그림, 음악 등 다양한 창작 활동을 도와드립니다",
      creator: "creative_mind",
      isOwned: false
    }
  ];

  // 검색 실행
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // 검색 로직
    const results = allChatbots.filter(chatbot =>
      chatbot.name.toLowerCase().includes(query.toLowerCase()) ||
      chatbot.description.toLowerCase().includes(query.toLowerCase()) ||
      chatbot.creator.toLowerCase().includes(query.toLowerCase())
    );

    setTimeout(() => {
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  // 검색어 변경 처리
  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery]);

  // 검색어 클리어
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // 뒤로 가기
  const goBack = () => {
    window.location.href = '/';
  };

  // 챗봇 상세 페이지로 이동
  const goToChatbot = (chatbotId: number) => {
    window.location.href = `/profile/${chatbotId}`;
  };

  return (
    <div className="h-screen bg-white flex">
      {/* 메인 콘텐츠 영역 (인스타그램 피드 유지) */}
      <div className="flex-1 bg-gray-50">
        {/* 여기에 원래 인스타그램 피드가 표시됨 */}
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <Search className="h-16 w-16 mx-auto mb-4" />
            <p className="text-lg">검색을 사용하여 챗봇을 찾아보세요</p>
          </div>
        </div>
      </div>

      {/* 검색 사이드바 */}
      <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
        {/* 헤더 */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Button variant="ghost" size="sm" onClick={goBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">검색</h1>
          </div>

          {/* 검색 입력 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색"
              className="pl-10 pr-10 bg-gray-100 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-gray-300"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {/* 검색 결과가 없을 때 - 내 챗봇들 표시 */}
            {!searchQuery && (
              <div>
                <h2 className="text-base font-semibold mb-4 text-gray-900">내가 만든 챗봇</h2>
                <div className="space-y-0">
                  {myChatbots.map((chatbot) => (
                    <div
                      key={chatbot.id}
                      className="flex items-center space-x-3 py-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => goToChatbot(chatbot.id)}
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={chatbot.avatar} />
                        <AvatarFallback><Bot /></AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{chatbot.name}</p>
                        <p className="text-sm text-gray-500 truncate">{chatbot.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 검색 결과 */}
            {searchQuery && (
              <div>
                {isSearching ? (
                  <div className="text-center py-8">
                    <div className="animate-pulse text-gray-500">검색 중...</div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-0">
                    <h2 className="text-base font-semibold mb-4 text-gray-900">검색 결과</h2>
                    {searchResults.map((chatbot) => (
                      <div
                        key={chatbot.id}
                        className="flex items-center space-x-3 py-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => goToChatbot(chatbot.id)}
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={chatbot.avatar} />
                          <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{chatbot.name}</p>
                          <p className="text-sm text-gray-500 truncate">{chatbot.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">검색 결과가 없습니다</p>
                    <p className="text-sm text-gray-400">다른 검색어를 시도해보세요</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}