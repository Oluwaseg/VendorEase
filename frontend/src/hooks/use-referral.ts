import {
  getReferralLink,
  getReferralStats,
  inviteFriend,
} from '@/services/referrals.service';
import { ReferralLink, ReferralStats } from '@/types/referral';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ---------------- GET REFERRAL STATS ----------------
export const useReferralStats = () => {
  return useQuery<ReferralStats>({
    queryKey: ['referralStats'],
    queryFn: getReferralStats,
  });
};

// ---------------- GET REFERRAL LINK ----------------
export const useReferralLink = () => {
  return useQuery<ReferralLink>({
    queryKey: ['referralLink'],
    queryFn: getReferralLink,
  });
};

// ---------------- INVITE FRIEND ----------------
export const useInviteFriend = () => {
  const queryClient = useQueryClient();
  return useMutation<null, unknown, string>({
    mutationFn: (email) => inviteFriend(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referralStats'] });
    },
  });
};
