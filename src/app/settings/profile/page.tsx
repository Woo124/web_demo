"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Camera,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar
} from "lucide-react";

export default function ProfileSettingsPage() {
  const [formData, setFormData] = useState({
    username: "my_username",
    displayName: "내 이름",
    email: "user@example.com",
    phone: "",
    bio: "안녕하세요! 챗봇과 대화하는 것을 좋아합니다.",
    location: "",
    website: "",
    birthDate: ""
  });

  const [avatarPreview, setAvatarPreview] = useState("/api/placeholder/150/150");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    // 실제로는 API 호출
    alert("프로필이 저장되었습니다!");
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={goBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">프로필 편집</h1>
            </div>
            <Button onClick={saveProfile} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 프로필 사진 */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback><User /></AvatarFallback>
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
                <h3 className="font-medium mb-1">프로필 사진</h3>
                <p className="text-sm text-gray-500">
                  JPG, PNG 파일을 업로드하세요.
                </p>
              </div>
            </div>

            {/* 사용자명 */}
            <div>
              <label className="block text-sm font-medium mb-2">사용자명</label>
              <Input
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="사용자명을 입력하세요"
              />
            </div>

            {/* 표시 이름 */}
            <div>
              <label className="block text-sm font-medium mb-2">표시 이름</label>
              <Input
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="표시할 이름을 입력하세요"
              />
            </div>

            {/* 소개 */}
            <div>
              <label className="block text-sm font-medium mb-2">소개</label>
              <Textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="자신을 소개해보세요"
                className="min-h-[80px]"
              />
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium mb-2">이메일</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="이메일 주소"
              />
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-medium mb-2">전화번호</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="전화번호"
              />
            </div>

            {/* 위치 */}
            <div>
              <label className="block text-sm font-medium mb-2">위치</label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="위치"
              />
            </div>

            {/* 웹사이트 */}
            <div>
              <label className="block text-sm font-medium mb-2">웹사이트</label>
              <Input
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            {/* 생년월일 */}
            <div>
              <label className="block text-sm font-medium mb-2">생년월일</label>
              <Input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 계정 설정 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>계정 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              비밀번호 변경
            </Button>
            <Button variant="outline" className="w-full justify-start">
              개인정보 설정
            </Button>
            <Button variant="outline" className="w-full justify-start">
              알림 설정
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              계정 삭제
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}