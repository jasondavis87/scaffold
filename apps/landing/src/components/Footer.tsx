import { APP_NAME } from "@packages/shared";

export function Footer() {
  return (
    <footer className="border-t px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
        <nav className="flex gap-6">
          <a href="/privacy" className="text-muted-foreground hover:text-foreground text-sm">
            Privacy
          </a>
          <a href="/terms" className="text-muted-foreground hover:text-foreground text-sm">
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
}
