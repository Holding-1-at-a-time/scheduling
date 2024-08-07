// app/auth/sign-up/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignUp
        path="/auth/sign-up"
        routing="path"
        signInUrl="/auth/sign-in"
        afterSignUpUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "mx-auto max-w-md w-full",
            card: "shadow-lg rounded-lg",
          },
        }}
      >
        <SignUp.OrganizationProfile />
      </SignUp>
    </div>
  );
}