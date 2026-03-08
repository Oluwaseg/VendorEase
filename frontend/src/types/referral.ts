export type ReferralStatus = 'pending' | 'completed';

export interface Referral {
  _id: string;

  referrer: string; // User _id
  referee: string; // User _id

  status: ReferralStatus;

  createdAt: string;
}

export interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  milestonesReached: number;
  nextMilestone: {
    count: number;
    discountPercent: number;
    couponExpiryDays: number;
  };
  referralsRemaining: number;
}

export interface ReferralLink {
  referralCode: string;
  referralLink: string;
}
