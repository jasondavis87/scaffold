export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-bold">Terms of Service</h1>
      <p className="text-muted-foreground mt-4">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="prose mt-8">
        <p>Your terms of service content goes here.</p>
      </div>
    </div>
  );
}
