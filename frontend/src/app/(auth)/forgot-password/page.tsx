"use client";

import { logo } from "@/assets";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/hooks/use-auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const { mutate: forgetPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const emailValue = watch("email");

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgetPassword(
      { email: data.email },
      {
        onSuccess: () => {
          setEmailSent(true);
        },
        onError: (error: any) => {
          console.error("Forgot password error:", error);
        },
      },
    );
  };

  return (
    <main>
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background py-8 sm:py-12">
        <Card className="w-full max-w-sm border-2 border-border shadow-lg">
          <div className="p-6 sm:p-8 space-y-5">
            {!emailSent ? (
              <>
                <div className="text-center space-y-1">
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
                    Forgot Password?
                  </h1>
                  <p className="text-sm text-foreground/60">
                    No worries, we'll send you reset instructions.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 sm:h-11 text-sm"
                  >
                    {isPending ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-xs text-foreground/60">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-accent hover:text-accent/80 font-semibold"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center space-y-3">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      Check your email
                    </h2>
                    <p className="text-foreground/60 text-xs sm:text-sm">
                      We've sent a password reset link to{" "}
                      <span className="font-semibold text-foreground break-all">
                        {emailValue}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-secondary/30 border border-border rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-foreground/70">
                  <p>
                    If you don't see the email, check your spam folder or try
                    sending another reset link.
                  </p>
                </div>

                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="w-full border-2 border-border bg-transparent h-10 sm:h-11 text-sm"
                >
                  Try another email
                </Button>

                <div className="text-center">
                  <p className="text-xs text-foreground/60">
                    Back to{" "}
                    <Link
                      href="/login"
                      className="text-accent hover:text-accent/80 font-semibold"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      </section>
    </main>
  );
}
