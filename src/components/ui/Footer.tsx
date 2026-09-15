
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/70">
      <div className="container mx-auto flex flex-col items-center gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>© {currentYear} EstilosIA. Gestión de Armario.</p>
        <nav aria-label="Enlaces legales" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link
            href="/privacy-policy"
            className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Política de Privacidad
          </Link>
          {/* Add more links here if needed, e.g., Terms of Service */}
        </nav>
      </div>
    </footer>
  );
}
