import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn path="/sign-in" signUpUrl="./sign-up" f signUpFallbackRedirectUrl={"./"} signUpForceRedirectUrl={"./sign-up"}/>
    </div>
  );
}
