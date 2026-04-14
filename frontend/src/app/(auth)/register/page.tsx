"use client";

import { logo } from "@/assets";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGoogleAuth, useRegister } from "@/hooks/use-auth";
import { registerSchema, type RegisterFormData } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

declare global {
  interface Window {
    google: any;
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();
  const { mutate: googleAuth, isPending: isGooglePending } = useGoogleAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
          callback: handleGoogleSuccess,
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleSuccess = (response: any) => {
    if (response.credential) {
      googleAuth(response.credential, {
        onSuccess: () => {
          setTimeout(() => router.push("/dashboard"), 2500);
        },
        onError: (error: any) => {
          console.error("Google authentication error:", error);
        },
      });
    }
  };

  const onSubmit = (data: RegisterFormData) => {
    register(
      {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        referralCode: data.referralCode,
      },
      {
        onSuccess: () => {
          setTimeout(() => router.push("/login"), 2500);
        },
        onError: (error: any) => {
          console.error("Registration error:", error);
        },
      },
    );
  };

  return (
    <main>
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background py-8 sm:py-12">
        <Card className="w-full max-w-sm border-2 border-border shadow-lg">
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-3">
              {/* Logo */}
              <div className="flex justify-center">
                <Image
                  src={logo}
                  alt="VendorEase Logo"
                  width={80}
                  height={80}
                  priority
                  className="object-contain"
                />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Create Account
              </h1>

              <p className="text-sm text-foreground/60">
                Join VendorEase for curated shopping
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Names Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    First Name
                  </label>
                  <Input
                    type="text"
                    placeholder="John"
                    className="bg-secondary/50 border-border h-9 sm:h-10 text-sm"
                    {...registerField("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 line-clamp-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Doe"
                    className="bg-secondary/50 border-border h-9 sm:h-10 text-sm"
                    {...registerField("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 line-clamp-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="bg-secondary/50 border-border h-9 sm:h-10 text-sm"
                  {...registerField("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 line-clamp-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-secondary/50 border-border h-9 sm:h-10 text-sm pr-10"
                    {...registerField("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 line-clamp-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-secondary/50 border-border h-9 sm:h-10 text-sm pr-10"
                    {...registerField("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 line-clamp-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Referral Code */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-foreground">
                  Referral Code{" "}
                  <span className="text-foreground/50">(Optional)</span>
                </label>
                <Input
                  type="text"
                  placeholder="Enter referral code"
                  className="bg-secondary/50 border-border h-9 sm:h-10 text-sm"
                  {...registerField("referralCode")}
                />
                {errors.referralCode && (
                  <p className="text-xs text-red-500 line-clamp-1">
                    {errors.referralCode.message}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 py-1">
                <input
                  type="checkbox"
                  className="mt-1"
                  {...registerField("agreeToTerms")}
                />
                <span className="text-xs text-foreground/70 leading-tight">
                  I agree to the{" "}
                  <Link href="#" className="text-accent hover:text-accent/80">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-accent hover:text-accent/80">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-xs text-red-500">
                  {errors.agreeToTerms.message}
                </p>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 sm:h-11 text-sm"
              >
                {isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-foreground/60">
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Google Button */}
            <div className="flex justify-center">
              <div
                ref={googleButtonRef}
                style={{ display: "flex", justifyContent: "center" }}
              />
            </div>

            {/* Sign In Link */}
            <p className="text-center text-xs text-foreground/60">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-accent hover:text-accent/80 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </section>
    </main>
  );
}
