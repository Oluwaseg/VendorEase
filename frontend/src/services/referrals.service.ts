import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types/api-response';

import { ReferralLink, ReferralStats } from '@/types/referral';

// ---------------- GET REFERRAL STATS ----------------
export const getReferralStats = async (): Promise<ReferralStats> => {
  const res: ApiResponse<ReferralStats> = await axiosInstance.get(
    ApiRoutes.referrals.stats
  );

  if (res.status === 'success') {
    return res.payload;
  }

  throw new Error(res.message || 'Failed to fetch referral stats');
};

// ---------------- GET REFERRAL LINK ----------------
export const getReferralLink = async (): Promise<ReferralLink> => {
  const res: ApiResponse<ReferralLink> = await axiosInstance.get(
    ApiRoutes.referrals.get_referral_link
  );

  if (res.status === 'success') {
    return res.payload; // ✅ correct
  }

  throw new Error(res.message || 'Failed to fetch referral link');
};
// ---------------- INVITE FRIEND ----------------
export const inviteFriend = async (emails: string[]): Promise<string> => {
  const res: ApiResponse<null> = await axiosInstance.post(
    ApiRoutes.referrals.invite,
    { emails }
  );

  if (res.status !== 'success') {
    throw new Error(res.message);
  }

  return res.message;
};
