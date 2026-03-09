import {
  getReferralLink,
  getReferralStats,
  inviteFriend,
} from '@/services/referrals.service';
import { ReferralLink, ReferralStats } from '@/types/referral';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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

  return useMutation<string, unknown, string[]>({
    mutationFn: (emails) => inviteFriend(emails),

    onSuccess: (message) => {
      toast.success(message || 'Invite sent successfully!');
      queryClient.invalidateQueries({ queryKey: ['referralStats'] });
    },

    onError: (error: any) => {
      toast.error(error?.message || 'Could not send invite. Please try again.');
    },
  });
};
