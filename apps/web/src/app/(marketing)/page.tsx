import { redirect } from "next/navigation";

export default function MarketingPage() {
  // Redirect to landing site or show minimal marketing page
  redirect("/dashboard");
}
