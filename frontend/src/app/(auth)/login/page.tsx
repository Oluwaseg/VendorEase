"use client";

import { logo } from "@/assets";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useGoogleAuth,
  useLogin,
  useResendVerification,
} from "@/hooks/use-auth";
import { loginSchema, type LoginFormData } from "@/lib/schemas";
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

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const { mutate: resendVerification, isPending: isResendPending } =
    useResendVerification();
  const { mutate: googleAuth, isPending: isGooglePending } = useGoogleAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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
          console.error("Google login error:", error);
        },
      });
    }
  };

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        setTimeout(() => router.push("/dashboard"), 2500);
      },
      onError: (error: any) => {
        console.error(
          "Login error:",
          error.message || "Login failed. Please try again.",
        );

        // If server says user must verify email, show resend option
        if (
          error?.message &&
          /verify|verification|not verified|please verify/i.test(error.message)
        ) {
          setShowResend(true);
          setResendEmail(data.email);
        }
      },
    });
  };

  return (
    <main>
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background py-8 sm:py-12">
        <Card className="w-full max-w-sm border-2 border-border shadow-lg">
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <Image
                  src={logo}
                  alt="VendorEase Logo"
                  width={60}
                  height={30}
                  priority
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Welcome Back
              </h1>
              <p className="text-sm text-foreground/60">
                Sign in to your VendorEase account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="bg-secondary/50 border-border h-9 sm:h-10 text-sm"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 line-clamp-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-secondary/50 border-border h-9 sm:h-10 text-sm pr-10"
                    {...register("password")}
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
              {/* Resend Verification */}
              {showResend && (
                <div className="space-y-2">
                  <p className="text-xs text-amber-500">
                    Your email is not verified. Please verify your email.
                  </p>

                  <Button
                    type="button"
                    onClick={() =>
                      resendVerification(
                        { email: resendEmail || "" },
                        {
                          onSuccess: () => {
                            setShowResend(false);
                            setResendEmail(null);
                          },
                        },
                      )
                    }
                    disabled={isResendPending}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-9 sm:h-10 text-sm"
                  >
                    {isResendPending
                      ? "Resending..."
                      : "Resend Verification Email"}
                  </Button>
                </div>
              )}
              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-xs py-1">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-foreground/70">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-accent hover:text-accent/80"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 sm:h-11 text-sm"
              >
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-foreground/60">
                  Or continue with
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

            {/* Sign Up Link */}
            <p className="text-center text-xs text-foreground/60">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-accent hover:text-accent/80 font-semibold"
              >
                Create one
              </Link>
            </p>
          </div>
        </Card>
      </section>
    </main>
  );
}
