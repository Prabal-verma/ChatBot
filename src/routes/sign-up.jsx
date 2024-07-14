import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp path="/sign-up" signInUrl="/sign-in" signInFallbackRedirectUrl={"./sign-in"}/>
    </div>
  );
}
