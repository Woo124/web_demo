"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Bot,
  Upload,
  Sparkles,
  Brain,
  Heart,
  Zap,
  Users,
  BookOpen,
  Music,
  Gamepad2,
  Coffee,
  Camera,
  Code,
  Palette,
  Globe,
  Shield,
  Settings,
  Eye,
  EyeOff,
  Save,
  Play,
  RefreshCw,
  Info,
  AlertCircle,
  CheckCircle,
  X,
  Plus
} from "lucide-react";

// 챗봇 폼 데이터 타입
interface ChatbotFormData {
  name: string;
  description: string;
  personality: string;
  category: string;
  avatar?: File | string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  tags: string[];
  isPublic: boolean;
  welcomeMessage: string;
}

// 카테고리 옵션
const categories = [
  { value: "일반", label: "일반", icon: Bot, color: "bg-blue-100 text-blue-800" },
  { value: "교육", label: "교육", icon: Brain, color: "bg-green-100 text-green-800" },
  { value: "엔터테인먼트", label: "엔터테인먼트", icon: Music, color: "bg-purple-100 text-purple-800" },
  { value: "비즈니스", label: "비즈니스", icon: Users, color: "bg-orange-100 text-orange-800" },
  { value: "기술", label: "기술", icon: Code, color: "bg-gray-100 text-gray-800" },
  { value: "창작", label: "창작", icon: Palette, color: "bg-pink-100 text-pink-800" },
  { value: "건강", label: "건강", icon: Heart, color: "bg-red-100 text-red-800" },
  { value: "게임", label: "게임", icon: Gamepad2, color: "bg-indigo-100 text-indigo-800" }
];

// 성격 옵션
const personalities = [
  { value: "친근한", label: "친근한", description: "따뜻하고 접근하기 쉬운 성격" },
  { value: "전문적인", label: "전문적인", description: "정확하고 신뢰할 수 있는 전문가" },
  { value: "유머러스한", label: "유머러스한", description: "재미있고 위트가 있는 성격" },
  { value: "차분한", label: "차분한", description: "침착하고 안정감을 주는 성격" },
  { value: "열정적인", label: "열정적인", description: "에너지 넘치고 동기부여하는 성격" },
  { value: "창의적인", label: "창의적인", description: "독창적이고 혁신적인 사고" },
  { value: "논리적인", label: "논리적인", description: "체계적이고 분석적인 접근" },
  { value: "공감적인", label: "공감적인", description: "이해심 많고 감정을 잘 아는 성격" }
];

export default function ChatbotCreatePage() {
  // 상태 관리
  const [formData, setFormData] = useState<ChatbotFormData>({
    name: "",
    description: "",
    personality: "",
    category: "",
    avatar: "",
    systemPrompt: "",
    temperature: 0.7,
    maxTokens: 2048,
    tags: [],
    isPublic: true,
    welcomeMessage: ""
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 총 단계 수
  const totalSteps = 4;

  // 폼 검증
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "챗봇 이름을 입력해주세요.";
        if (!formData.description.trim()) newErrors.description = "설명을 입력해주세요.";
        if (!formData.category) newErrors.category = "카테고리를 선택해주세요.";
        break;
      case 2:
        if (!formData.personality) newErrors.personality = "성격을 선택해주세요.";
        if (!formData.welcomeMessage.trim()) newErrors.welcomeMessage = "환영 메시지를 입력해주세요.";
        break;
      case 3:
        if (!formData.systemPrompt.trim()) newErrors.systemPrompt = "시스템 프롬프트를 입력해주세요.";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 다음 단계
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  // 이전 단계
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // 입력값 변경
  const handleInputChange = (field: keyof ChatbotFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // 태그 추가
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  // 태그 제거
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 아바타 업로드
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 챗봇 생성
  const createChatbot = async () => {
    if (!validateStep(currentStep)) return;

    setIsCreating(true);

    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 성공 후 생성된 챗봇 페이지로 이동
    const newChatbotId = Date.now();
    window.location.href = `/profile/${newChatbotId}`;
  };

  // 뒤로 가기
  const goBack = () => {
    window.history.back();
  };

  // 선택된 카테고리 정보
  const selectedCategory = categories.find(cat => cat.value === formData.category);

  // 선택된 성격 정보
  const selectedPersonality = personalities.find(p => p.value === formData.personality);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={goBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">새 챗봇 만들기</h1>
                <p className="text-sm text-gray-500">
                  단계 {currentStep} / {totalSteps}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
                disabled={!formData.name}
              >
                <Eye className="h-4 w-4 mr-2" />
                미리보기
              </Button>

              {currentStep === totalSteps ? (
                <Button
                  onClick={createChatbot}
                  disabled={isCreating}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isCreating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      생성하기
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  다음
                </Button>
              )}
            </div>
          </div>

          {/* 진행 표시기 */}
          <div className="flex items-center space-x-2 mt-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded ${
                  i + 1 <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 단계 1: 기본 정보 */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-6 w-6" />
                <span>기본 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 아바타 업로드 */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarPreview || `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.name}`} />
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-lg"
                  >
                    <Camera className="h-4 w-4" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-1">프로필 이미지</h3>
                  <p className="text-sm text-gray-500">
                    챗봇의 아바타를 설정하세요. 업로드하지 않으면 자동으로 생성됩니다.
                  </p>
                </div>
              </div>

              {/* 이름 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  챗봇 이름 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="예: AI 헬퍼, 학습 도우미"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  설명 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="챗봇이 무엇을 도와줄 수 있는지 설명해주세요..."
                  className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = formData.category === category.value;
                    return (
                      <div
                        key={category.value}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleInputChange('category', category.value)}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <Icon className="h-6 w-6 text-gray-600" />
                          <span className="text-sm font-medium">{category.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 단계 2: 성격과 톤 */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-6 w-6" />
                <span>성격과 톤</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 성격 선택 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  성격 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {personalities.map((personality) => {
                    const isSelected = formData.personality === personality.value;
                    return (
                      <div
                        key={personality.value}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleInputChange('personality', personality.value)}
                      >
                        <div className="space-y-1">
                          <h3 className="font-medium">{personality.label}</h3>
                          <p className="text-sm text-gray-600">{personality.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.personality && (
                  <p className="text-red-500 text-sm mt-1">{errors.personality}</p>
                )}
              </div>

              {/* 환영 메시지 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  환영 메시지 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.welcomeMessage}
                  onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                  placeholder="사용자가 처음 대화를 시작할 때 보여줄 메시지를 작성하세요..."
                  className={`min-h-[80px] ${errors.welcomeMessage ? 'border-red-500' : ''}`}
                />
                {errors.welcomeMessage && (
                  <p className="text-red-500 text-sm mt-1">{errors.welcomeMessage}</p>
                )}
              </div>

              {/* 태그 */}
              <div>
                <label className="block text-sm font-medium mb-2">태그</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 cursor-pointer hover:bg-gray-200"
                      onClick={() => removeTag(tag)}
                    >
                      #{tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="태그 입력"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  엔터 키를 누르거나 + 버튼을 클릭하여 태그를 추가하세요.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 단계 3: AI 설정 */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-6 w-6" />
                <span>AI 설정</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 시스템 프롬프트 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  시스템 프롬프트 <span className="text-red-500">*</span>
                  <Info className="inline h-4 w-4 ml-1 text-gray-400" />
                </label>
                <Textarea
                  value={formData.systemPrompt}
                  onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                  placeholder="당신은 친근하고 도움이 되는 AI 어시스턴트입니다. 사용자의 질문에 정확하고 유용한 답변을 제공하세요..."
                  className={`min-h-[120px] ${errors.systemPrompt ? 'border-red-500' : ''}`}
                />
                {errors.systemPrompt && (
                  <p className="text-red-500 text-sm mt-1">{errors.systemPrompt}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  AI가 어떻게 행동해야 하는지 지시하는 명령어입니다.
                </p>
              </div>

              {/* 창의성 설정 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  창의성 (Temperature): {formData.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>일관성 (0.0)</span>
                  <span>창의성 (1.0)</span>
                </div>
              </div>

              {/* 최대 토큰 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  최대 응답 길이 (토큰)
                </label>
                <Input
                  type="number"
                  value={formData.maxTokens}
                  onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value))}
                  min="100"
                  max="4096"
                  step="100"
                />
                <p className="text-sm text-gray-500 mt-1">
                  응답의 최대 길이를 설정합니다. (100-4096)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 단계 4: 최종 확인 */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6" />
                <span>최종 확인</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 공개 설정 */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">공개 설정</h3>
                  <p className="text-sm text-gray-600">
                    다른 사용자들이 이 챗봇을 검색하고 사용할 수 있도록 하시겠습니까?
                  </p>
                </div>
                <Button
                  variant={formData.isPublic ? "default" : "outline"}
                  onClick={() => handleInputChange('isPublic', !formData.isPublic)}
                >
                  {formData.isPublic ? "공개" : "비공개"}
                </Button>
              </div>

              {/* 요약 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">기본 정보</h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><span className="text-gray-600">이름:</span> {formData.name}</p>
                      <p><span className="text-gray-600">카테고리:</span> {selectedCategory?.label}</p>
                      <p><span className="text-gray-600">성격:</span> {selectedPersonality?.label}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">AI 설정</h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><span className="text-gray-600">창의성:</span> {formData.temperature}</p>
                      <p><span className="text-gray-600">최대 토큰:</span> {formData.maxTokens}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">설명</h4>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                      {formData.description}
                    </p>
                  </div>

                  {formData.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900">태그</h4>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 주의사항 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">주의사항</h4>
                    <ul className="mt-1 text-sm text-yellow-700 space-y-1">
                      <li>• 생성 후에도 대부분의 설정을 수정할 수 있습니다.</li>
                      <li>• 공개 챗봇은 다른 사용자들이 검색할 수 있습니다.</li>
                      <li>• 부적절한 콘텐츠는 신고 대상이 될 수 있습니다.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            이전
          </Button>

          <div className="text-sm text-gray-500">
            단계 {currentStep} / {totalSteps}
          </div>

          {currentStep < totalSteps ? (
            <Button onClick={nextStep}>
              다음
            </Button>
          ) : (
            <Button
              onClick={createChatbot}
              disabled={isCreating}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  챗봇 생성하기
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* 미리보기 모달 */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>챗봇 미리보기</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 챗봇 카드 */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={avatarPreview || `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.name}`} />
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{formData.name || "챗봇 이름"}</h3>
                    <div className="flex items-center space-x-2">
                      {selectedCategory && (
                        <Badge className={selectedCategory.color} variant="secondary">
                          {selectedCategory.label}
                        </Badge>
                      )}
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {formData.description || "챗봇 설명이 여기에 표시됩니다."}
                </p>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 대화 미리보기 */}
            {formData.welcomeMessage && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">첫 메시지</h4>
                <div className="flex items-start space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={avatarPreview || `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.name}`} />
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                  <div className="bg-white p-3 rounded-lg text-sm">
                    {formData.welcomeMessage}
                  </div>
                </div>
              </div>
            )}

            <Button className="w-full" onClick={() => setShowPreview(false)}>
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}