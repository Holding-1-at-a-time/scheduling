// File: app/(auth)/sign-in/page.tsx

"use client";

import { SignIn } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";

const SignInPage = () => {
  const { toast } = useToast();

  const handleSignInError = (error: Error) => {
    console.error("Sign in error:", error);
    toast({
      title: "Sign In Failed",
      description: "There was an error signing in. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignIn
        appearance={{
          elements: {
            rootBox: "shadow-xl rounded-lg",
            card: "p-8",
          },
        }}
        signUpUrl="/sign-up"
        onError={handleSignInError}
      />
    </div>
  );
};

export default SignInPage;
