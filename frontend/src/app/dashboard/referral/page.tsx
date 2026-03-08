'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
  useInviteFriend,
  useReferralLink,
  useReferralStats,
} from '@/hooks/use-referral';
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Gift,
  Mail,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const ReferralPage = () => {
  const { data: stats, isPending: statsLoading } = useReferralStats();
  const { data: referralLinkData, isPending: linkLoading } = useReferralLink();
  const inviteFriendMutation = useInviteFriend();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInvite = () => {
    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }

    inviteFriendMutation.mutate(email, {
      onSuccess: () => {
        toast.success(`Invite sent to ${email}!`);
        setEmail('');
      },
      onError: () => {
        toast.error('Could not send invite. Please try again.');
      },
    });
  };

  const handleCopy = () => {
    if (referralLinkData?.referralLink) {
      navigator.clipboard.writeText(referralLinkData.referralLink);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const referralsRemaining = stats?.referralsRemaining || 0;
  const totalReferrals = stats?.totalReferrals || 0;
  const nextMilestoneCount = stats?.nextMilestone?.count || 1;
  const discountPercent = stats?.nextMilestone?.discountPercent || 0;
  const couponExpiryDays = stats?.nextMilestone?.couponExpiryDays || 0;

  const progressPercentage =
    nextMilestoneCount > 0
      ? Math.min((totalReferrals / nextMilestoneCount) * 100, 100)
      : 0;

  if (statsLoading || linkLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <Spinner className='w-10 h-10' />
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-gradient-to-b from-background via-background to-accent/5'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground py-20 md:py-32 px-4'>
        {/* Animated background elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-40 -right-40 w-80 h-80 bg-primary-foreground/10 rounded-full blur-3xl'></div>
          <div className='absolute -bottom-20 -left-40 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl'></div>
        </div>

        <div className='max-w-5xl mx-auto text-center relative z-10'>
          <div className='inline-flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary-foreground/20'>
            <Sparkles className='w-4 h-4' />
            <span className='text-sm font-semibold'>
              Exclusive Rewards Program
            </span>
          </div>
          <h1 className='text-5xl md:text-6xl font-bold mb-6 tracking-tight'>
            Unlock Rewards
            <br />
            <span className='bg-gradient-to-r from-primary-foreground via-primary-foreground/90 to-primary-foreground text-transparent bg-clip-text'>
              Together
            </span>
          </h1>
          <p className='text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed'>
            Share your unique link with friends and earn exclusive discounts.
            Every referral brings you closer to amazing rewards.
          </p>
        </div>
      </section>

      <div className='max-w-5xl mx-auto px-4 py-16 md:py-20'>
        {/* Referral Stats Grid - Enhanced Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-16'>
          {/* Total Referrals Card */}
          <div className='group relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300'></div>
            <Card className='relative bg-gradient-to-br from-card to-card/80 border-primary/20 hover:border-primary/40 transition-all duration-300 backdrop-blur-sm'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                    Total Referrals
                  </CardTitle>
                  <div className='p-2.5 bg-primary/10 rounded-lg'>
                    <Users className='w-5 h-5 text-primary' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-4xl font-bold bg-gradient-to-br from-primary to-primary/70 text-transparent bg-clip-text'>
                  {totalReferrals}
                </div>
                <p className='text-xs text-muted-foreground/80 mt-3 font-medium'>
                  Friends you've invited
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Milestones Card */}
          <div className='group relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300'></div>
            <Card className='relative bg-gradient-to-br from-card to-card/80 border-accent/20 hover:border-accent/40 transition-all duration-300 backdrop-blur-sm'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                    Rewards Unlocked
                  </CardTitle>
                  <div className='p-2.5 bg-accent/10 rounded-lg'>
                    <TrendingUp className='w-5 h-5 text-accent' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-4xl font-bold bg-gradient-to-br from-accent to-accent/70 text-transparent bg-clip-text'>
                  {stats?.milestonesReached}
                </div>
                <p className='text-xs text-muted-foreground/80 mt-3 font-medium'>
                  Milestone rewards earned
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Next Reward Card */}
          <div className='group relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300'></div>
            <Card className='relative bg-gradient-to-br from-card to-card/80 border-primary/20 hover:border-primary/40 transition-all duration-300 backdrop-blur-sm'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                    Next Milestone
                  </CardTitle>
                  <div className='p-2.5 bg-primary/10 rounded-lg'>
                    <Gift className='w-5 h-5 text-primary' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-4xl font-bold bg-gradient-to-br from-primary to-primary/70 text-transparent bg-clip-text'>
                  {discountPercent}%
                </div>
                <p className='text-xs text-muted-foreground/80 mt-3 font-medium'>
                  Discount waiting
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progress Section - Enhanced */}
        <Card className='bg-gradient-to-br from-card/50 to-card/20 border-primary/10 hover:border-primary/20 transition-all duration-300 mb-16 backdrop-blur-sm'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-xl'>Path to Next Reward</CardTitle>
                <CardDescription className='mt-2'>
                  {referralsRemaining > 0
                    ? `Just ${referralsRemaining} more referral${referralsRemaining !== 1 ? 's' : ''} to unlock ${discountPercent}% off!`
                    : "You're all caught up! Keep sharing to unlock more rewards."}
                </CardDescription>
              </div>
              <Zap className='w-8 h-8 text-primary/60' />
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-semibold text-foreground'>
                    {totalReferrals} of {nextMilestoneCount} Referrals
                  </p>
                  <p className='text-xs text-muted-foreground/70 mt-1'>
                    Progress
                  </p>
                </div>
                <div className='flex items-baseline gap-1'>
                  <span className='text-2xl font-bold text-primary'>
                    {Math.round(progressPercentage)}%
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    {' '}
                    complete
                  </span>
                </div>
              </div>
              <div className='w-full bg-muted/50 rounded-full h-2.5 overflow-hidden'>
                <div
                  className='h-full bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full transition-all duration-700 ease-out shadow-lg shadow-primary/20'
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            <div className='flex items-center justify-between text-xs'>
              <span className='text-muted-foreground/70'>
                Coupon expires in {couponExpiryDays} days
              </span>
              {progressPercentage === 100 && (
                <span className='inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full font-medium'>
                  <CheckCircle2 className='w-3 h-3' /> Ready to Claim
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16'>
          {/* Referral Link Section - Enhanced */}
          <Card className='bg-gradient-to-br from-card/50 to-card/20 border-primary/10 hover:border-primary/20 transition-all duration-300 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Copy className='w-5 h-5 text-primary' />
                Share Your Link
              </CardTitle>
              <CardDescription>Your unique referral code</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                  Referral Code
                </Label>
                <div className='relative'>
                  <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl'></div>
                  <div className='relative bg-muted/60 border border-primary/10 rounded-xl px-4 py-3 font-mono text-lg font-semibold text-foreground tracking-wider'>
                    {stats?.referralCode}
                  </div>
                </div>
              </div>
              <div className='space-y-2'>
                <Label className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                  Full Link
                </Label>
                <div className='flex gap-2'>
                  <Input
                    value={referralLinkData?.referralLink || ''}
                    readOnly
                    className='bg-muted/60 text-sm font-mono border-primary/10 text-foreground/80'
                  />
                  <Button
                    onClick={handleCopy}
                    size='icon'
                    className='flex-shrink-0 gap-2 transition-all duration-300'
                    variant={copied ? 'outline' : 'default'}
                  >
                    {copied ? (
                      <CheckCircle2 className='w-4 h-4' />
                    ) : (
                      <Copy className='w-4 h-4' />
                    )}
                  </Button>
                </div>
              </div>
              <p className='text-xs text-muted-foreground/70 leading-relaxed'>
                💡 Tip: Share this link on social media, via email, or send it
                directly to friends
              </p>
            </CardContent>
          </Card>

          {/* Invite Section - Enhanced */}
          <Card className='bg-gradient-to-br from-card/50 to-card/20 border-primary/10 hover:border-primary/20 transition-all duration-300 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Mail className='w-5 h-5 text-primary' />
                Invite Friends
              </CardTitle>
              <CardDescription>
                Send personalized invites via email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='email'
                    className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'
                  >
                    Friend's Email
                  </Label>
                  <div className='relative flex gap-2'>
                    <Input
                      id='email'
                      type='email'
                      placeholder='friend@example.com'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleInvite();
                        }
                      }}
                      className='bg-muted/60 border-primary/10 text-foreground placeholder:text-muted-foreground/50'
                    />
                    <Button
                      onClick={handleInvite}
                      disabled={inviteFriendMutation.isPending || !email}
                      className='flex-shrink-0 gap-2'
                    >
                      {inviteFriendMutation.isPending ? (
                        <>
                          <Spinner className='w-4 h-4' />
                          <span className='hidden sm:inline'>Sending</span>
                        </>
                      ) : (
                        <>
                          <Mail className='w-4 h-4' />
                          <span className='hidden sm:inline'>Invite</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <p className='text-xs text-muted-foreground/70 leading-relaxed'>
                  ✨ Your friend will receive a personalized invitation and your
                  referral link
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className='mt-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-3'>
              How It Works
            </h2>
            <p className='text-muted-foreground/80 max-w-2xl mx-auto'>
              Three simple steps to start earning rewards together
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              {
                step: '01',
                title: 'Share Your Link',
                description:
                  'Copy your referral link and share it with friends via email, social media, or messenger.',
                icon: Copy,
              },
              {
                step: '02',
                title: 'Friends Sign Up',
                description:
                  'Your friends create an account using your link. You both get credited automatically.',
                icon: Users,
              },
              {
                step: '03',
                title: 'Earn Together',
                description:
                  'After their first purchase, you both unlock exclusive discounts and rewards.',
                icon: Gift,
              },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={item.step} className='relative group'>
                  <div className='absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  <div className='relative p-8 rounded-2xl border border-primary/10 group-hover:border-primary/30 transition-all duration-300 h-full'>
                    <div className='flex items-start gap-4 mb-4'>
                      <div className='flex-shrink-0'>
                        <div className='flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20'>
                          <span className='text-sm font-bold text-primary'>
                            {item.step}
                          </span>
                        </div>
                      </div>
                      <div className='flex-shrink-0 p-3 bg-primary/5 rounded-lg'>
                        <IconComponent className='w-6 h-6 text-primary' />
                      </div>
                    </div>
                    <h3 className='font-bold text-lg text-foreground mb-2'>
                      {item.title}
                    </h3>
                    <p className='text-sm text-muted-foreground/80 leading-relaxed'>
                      {item.description}
                    </p>
                  </div>

                  {index !== 2 && (
                    <div className='hidden md:flex absolute top-1/2 -right-5 w-10 h-0.5 bg-gradient-to-r from-primary/40 to-transparent'>
                      <ArrowRight className='w-5 h-5 absolute right-0 top-1/2 -translate-y-1/2 text-primary/40 ml-2' />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className='mt-20 pt-16 border-t border-primary/10'>
          <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 p-8 md:p-12 text-center'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='absolute -top-32 -right-32 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl'></div>
            </div>
            <div className='relative z-10'>
              <Sparkles className='w-8 h-8 text-primary-foreground/80 mx-auto mb-4' />
              <h3 className='text-2xl md:text-3xl font-bold text-primary-foreground mb-3'>
                Start Growing Your Rewards
              </h3>
              <p className='text-primary-foreground/90 mb-6 max-w-2xl mx-auto'>
                Your referral code is ready to share. Every friend you invite
                brings you closer to bigger rewards!
              </p>
              <Button
                onClick={handleCopy}
                className='bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold gap-2'
              >
                <Copy className='w-4 h-4' />
                Copy Link Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ReferralPage;
