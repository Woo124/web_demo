"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Bookmark,
  Share,
  Edit,
  Trash2,
  Bot,
  User,
  Settings,
  Info,
  Phone,
  Video,
  Volume2,
  VolumeX,
  Download
} from "lucide-react";

// 메시지 타입
interface Message {
  id: number;
  sessionId: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isEdited?: boolean;
  reactions?: MessageReaction[];
  isLoading?: boolean;
}

// 메시지 반응 타입
interface MessageReaction {
  id: number;
  emoji: string;
  count: number;
}

// 챗봇 프로필 타입 (간소화)
interface ChatbotProfile {
  id: number;
  name: string;
  avatar: string;
  description: string;
  personality: string;
  isActive: boolean;
  isTyping?: boolean;
}

// 대화 세션 타입
interface ChatSession {
  id: number;
  chatbotId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default function ChatInterfacePage({
  params
}: {
  params: { chatbotId: string; sessionId: string }
}) {
  const chatbotId = parseInt(params.chatbotId);
  const sessionId = parseInt(params.sessionId);

  // 상태 관리
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  // refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 더미 챗봇 데이터
  const chatbot: ChatbotProfile = {
    id: chatbotId,
    name: "AI 헬퍼",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=helper",
    description: "일반적인 질문부터 복잡한 문제까지 도와드립니다.",
    personality: "친근하고 도움이 되는",
    isActive: true,
    isTyping: false
  };

  // 더미 세션 데이터
  const session: ChatSession = {
    id: sessionId,
    chatbotId: chatbotId,
    title: "새로운 대화",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // 초기 메시지 로드
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: 1,
        sessionId: sessionId,
        role: 'assistant',
        content: `안녕하세요! 저는 ${chatbot.name}입니다. 무엇을 도와드릴까요?`,
        timestamp: new Date(Date.now() - 1000).toISOString()
      }
    ];
    setMessages(initialMessages);
  }, [sessionId, chatbot.name]);

  // 메시지 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 전송
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      sessionId: sessionId,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // 로딩 메시지 표시
    const loadingMessage: Message = {
      id: Date.now() + 1,
      sessionId: sessionId,
      role: 'assistant',
      content: "",
      timestamp: new Date().toISOString(),
      isLoading: true
    };

    setMessages(prev => [...prev, loadingMessage]);

    // 시뮬레이션된 AI 응답 (실제로는 AI API 호출)
    setTimeout(() => {
      const responses = [
        "좋은 질문이네요! 제가 도와드릴게요.",
        "그 부분에 대해 설명해드리겠습니다.",
        "흥미로운 주제입니다. 자세히 알아보죠.",
        "네, 이해했습니다. 이렇게 접근해보시는 것은 어떨까요?",
        "정확한 정보를 드리겠습니다."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: Message = {
        id: Date.now() + 2,
        sessionId: sessionId,
        role: 'assistant',
        content: `${randomResponse} "${userMessage.content}"에 대한 답변을 준비하고 있습니다. 조금 더 구체적으로 설명해주시면 더 정확한 도움을 드릴 수 있어요!`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => prev.filter(msg => !msg.isLoading).concat(assistantMessage));
      setIsLoading(false);
    }, 1500);
  };

  // 엔터 키로 전송
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 메시지 복사
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  // 메시지 반응 추가
  const addReaction = (messageId: number, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions?.map(r =>
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...(msg.reactions || []), { id: Date.now(), emoji, count: 1 }]
          };
        }
      }
      return msg;
    }));
  };

  // 뒤로 가기
  const goBack = () => {
    window.history.back();
  };

  // 메시지 시간 포맷
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar className="w-10 h-10">
            <AvatarImage src={chatbot.avatar} />
            <AvatarFallback><Bot /></AvatarFallback>
          </Avatar>

          <div>
            <h2 className="font-semibold">{chatbot.name}</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                chatbot.isActive ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-xs text-gray-500">
                {chatbot.isActive ? '온라인' : '오프라인'}
              </span>
              {chatbot.isTyping && (
                <span className="text-xs text-blue-500">입력 중...</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
          >
            {isVoiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="sm">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfo(true)}
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={chatbot.avatar} />
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
              )}

              <div className={`group max-w-xs md:max-w-md lg:max-w-lg ${
                message.role === 'user' ? 'order-first' : ''
              }`}>
                <div
                  className={`p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } ${message.isLoading ? 'animate-pulse' : ''}`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">입력 중...</span>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>

                {!message.isLoading && (
                  <>
                    {/* 메시지 메타데이터 */}
                    <div className={`flex items-center mt-1 space-x-2 text-xs text-gray-500 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.isEdited && <span>편집됨</span>}
                    </div>

                    {/* 메시지 액션 (호버 시 표시) */}
                    <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center mt-2 space-x-1 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyMessage(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>

                      {message.role === 'assistant' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => addReaction(message.id, '👍')}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => addReaction(message.id, '👎')}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setSelectedMessage(message)}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* 반응 표시 */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className={`flex flex-wrap gap-1 mt-2 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        {message.reactions.map((reaction) => (
                          <Badge
                            key={reaction.id}
                            variant="outline"
                            className="text-xs cursor-pointer hover:bg-gray-100"
                            onClick={() => addReaction(message.id, reaction.emoji)}
                          >
                            {reaction.emoji} {reaction.count}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {message.role === 'user' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <Button variant="ghost" size="sm" className="mb-2">
              <Paperclip className="h-5 w-5" />
            </Button>

            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`${chatbot.name}에게 메시지 보내기...`}
                className="min-h-[40px] max-h-[120px] resize-none border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={isLoading}
                rows={1}
              />
            </div>

            <Button variant="ghost" size="sm" className="mb-2">
              <Smile className="h-5 w-5" />
            </Button>

            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="mb-2 bg-blue-500 hover:bg-blue-600 text-white"
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* 빠른 응답 제안 (첫 메시지인 경우) */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "안녕하세요!",
                "도움이 필요해요",
                "질문이 있어요",
                "설명해주세요"
              ].map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setInputMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 챗봇 정보 모달 */}
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={chatbot.avatar} />
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{chatbot.name}</h3>
                <p className="text-sm text-gray-500">{chatbot.personality}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm">{chatbot.description}</p>

            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                chatbot.isActive ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm">
                {chatbot.isActive ? '현재 온라인' : '오프라인'}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">대화 옵션</h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  대화 저장
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  공유하기
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  내보내기
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = `/profile/${chatbotId}`}
              >
                프로필 보기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 메시지 액션 모달 */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-sm">
          {selectedMessage && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle>메시지 옵션</DialogTitle>
              </DialogHeader>

              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => copyMessage(selectedMessage.content)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  복사하기
                </Button>

                {selectedMessage.role === 'user' && (
                  <Button variant="ghost" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    수정하기
                  </Button>
                )}

                <Button variant="ghost" className="w-full justify-start">
                  <Share className="h-4 w-4 mr-2" />
                  공유하기
                </Button>

                {selectedMessage.role === 'assistant' && (
                  <Button variant="ghost" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    다시 생성
                  </Button>
                )}

                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  삭제하기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}