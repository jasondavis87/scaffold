"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@packages/backend/convex/_generated/api";
import { Button } from "@packages/ui/button";

const hasConvex = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);

export function CTA() {
  if (!hasConvex) {
    return (
      <CTASection>
        <form className="mt-8 flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            disabled
            className="bg-background focus:ring-ring flex-1 rounded-md border px-4 py-2 text-sm opacity-60 focus:ring-2 focus:outline-none"
          />
          <Button type="button" disabled>
            Configure Convex
          </Button>
        </form>
      </CTASection>
    );
  }

  return <SubscribeForm />;
}

function SubscribeForm() {
  const subscribe = useMutation(api.emails.subscribe);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await subscribe({ email });
      toast.success("You're on the list!");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CTASection>
      <form onSubmit={handleSubmit} className="mt-8 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="bg-background focus:ring-ring flex-1 rounded-md border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </CTASection>
  );
}

interface CTASectionProps {
  children: ReactNode;
}

function CTASection({ children }: CTASectionProps) {
  return (
    <section id="cta" className="bg-muted px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-3xl font-bold">Stay Updated</h2>
        <p className="text-muted-foreground mt-4">
          Get notified when we launch. No spam, unsubscribe anytime.
        </p>
        {children}
      </div>
    </section>
  );
}
