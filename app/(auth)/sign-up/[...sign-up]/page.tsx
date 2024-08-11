// File: app/(auth)/sign-up/page.tsx

"use client";

import { SignUp } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";

const SignUpPage = () => {
  const { toast } = useToast();

  const handleSignUpError = (error: Error) => {
    console.error("Sign up error:", error);
    toast({
      title: "Sign Up Failed",
      description:
        "There was an error creating your account. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignUp
        appearance={{
          elements: {
            rootBox: "shadow-xl rounded-lg",
            card: "p-8",
          },
        }}
        signInUrl="/sign-in"
        onError={handleSignUpError}
      />
    </div>
  );
};

export default SignUpPage;
