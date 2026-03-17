import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import {
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '@/types/auth';
import { UserDashboardPayload } from '@/types/user-dashboard';

// ---------------- LOGIN ----------------
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = (await axiosInstance.post<ApiResponse<LoginResponse>>(
    ApiRoutes.auth.login,
    data
  )) as unknown as ApiResponse<LoginResponse>;
  return unwrap(res);
};

// ---------------- REGISTER ----------------
export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const res = (await axiosInstance.post<ApiResponse<RegisterResponse>>(
    ApiRoutes.auth.register,
    data
  )) as unknown as ApiResponse<RegisterResponse>;
  return unwrap(res);
};

// ---------------- LOGOUT ----------------
export const logout = async (): Promise<null> => {
  const res = (await axiosInstance.post<ApiResponse<null>>(
    ApiRoutes.auth.logout
  )) as unknown as ApiResponse<null>;
  return unwrap(res);
};

// ---------------- FORGOT PASSWORD ----------------
export const forgetPassword = async (email: string): Promise<null> => {
  const res = (await axiosInstance.post<ApiResponse<null>>(
    ApiRoutes.auth.forgetPassword,
    { email }
  )) as unknown as ApiResponse<null>;
  return unwrap(res);
};

// ---------------- VERIFY EMAIL ----------------
export const verifyEmail = async (data: VerifyEmailRequest): Promise<null> => {
  const res = (await axiosInstance.post<ApiResponse<null>>(
    ApiRoutes.auth.verifyEmail,
    data
  )) as unknown as ApiResponse<null>;
  return unwrap(res);
};

// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<null> => {
  const res = (await axiosInstance.post<ApiResponse<null>>(
    ApiRoutes.auth.resetPassword,
    data
  )) as unknown as ApiResponse<null>;
  return unwrap(res);
};

// ---------------- GOOGLE LOGIN ----------------
export const googleAuth = async (token: string): Promise<LoginResponse> => {
  const res = (await axiosInstance.post<ApiResponse<LoginResponse>>(
    ApiRoutes.auth.googleAuth,
    { token }
  )) as unknown as ApiResponse<LoginResponse>;
  return unwrap(res);
};

// ---------------- RESEND VERIFICATION EMAIL ----------------
export const resendVerification = async (
  data: ResendVerificationRequest
): Promise<null> => {
  const res = (await axiosInstance.post<ApiResponse<null>>(
    ApiRoutes.auth.resendVerification,
    data
  )) as unknown as ApiResponse<null>;
  return unwrap(res);
};

// ---------------- GET CURRENT USER ----------------
export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const res = (await axiosInstance.get<ApiResponse<CurrentUserResponse>>(
    ApiRoutes.auth.me
  )) as unknown as ApiResponse<CurrentUserResponse>;
  return unwrap(res);
};

// ---------------- USER DASHBOARD ----------------
export const getUserDashboard = async (): Promise<UserDashboardPayload> => {
  const res = (await axiosInstance.get<ApiResponse<UserDashboardPayload>>(
    ApiRoutes.auth.dashboard
  )) as unknown as ApiResponse<UserDashboardPayload>;

  return unwrap(res);
};
