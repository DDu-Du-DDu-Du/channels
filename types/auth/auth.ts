export type ProviderType = "KAKAO" | "NAVER" | "GOOGLE";

export interface SocialLoginRequest {
  socialToken: string;
  providerType: ProviderType;
}

export interface SocialLoginResponse {
  accessToken: string;
  refreshToken: string;
}
