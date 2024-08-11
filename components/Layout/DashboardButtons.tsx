// File: components/layout/DashboardButtons.tsx

"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import {
  ClerkLoading,
  ClerkProvider,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardButtons() {
  const { toast } = useToast();

  const handleAuthError = (error: Error) => {
    console.error("Authentication error:", error);
    toast({
      title: "Authentication Error",
      description: "There was an error with authentication. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <ErrorBoundary fallback={<AuthErrorFallback />}>
      <ClerkProvider>
        <ClerkLoading>
          <Skeleton className="w-40 h-9" />
        </ClerkLoading>
        <SignedIn>
          <OpenDashboardLinkButton />
        </SignedIn>
        <SignedOut>
          <div className="flex gap-4 animate-[fade-in_0.2s]">
            <SignInButton
              mode="modal"
              redirectUrl="/dashboard"
              onError={handleAuthError}
            >
              <Button variant="ghost">Sign in</Button>
            </SignInButton>
            <SignUpButton
              mode="modal"
              redirectUrl="/dashboard"
              onError={handleAuthError}
            >
              <Button>Sign up</Button>
            </SignUpButton>
          </div>
        </SignedOut>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

function OpenDashboardLinkButton() {
  return (
    <Link href="/dashboard" className="animate-[fade-in_0.2s]">
      <Button>Dashboard</Button>
    </Link>
  );
}

function AuthErrorFallback() {
  return (
    <div className="text-red-500">
      An error occurred with authentication. Please refresh the page and try
      again.
    </div>
  );
}
