// app/auth/sign-in/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <SignIn
                path="/auth/sign-in"
                routing="path"
                signUpUrl="/auth/sign-up"
                afterSignInUrl="/dashboard"
                appearance={{
                    elements: {
                        rootBox: "mx-auto max-w-md w-full",
                        card: "shadow-lg rounded-lg", screen
                    },
                }}
            />
        </div>
    );
}