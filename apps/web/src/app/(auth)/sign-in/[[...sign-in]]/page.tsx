export default function SignInPage() {
  return (
    <div className="w-full max-w-sm space-y-4 text-center">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <p className="text-muted-foreground">
        Auth is disabled by default. Run the setup script to enable Clerk.
      </p>
    </div>
  );
}
