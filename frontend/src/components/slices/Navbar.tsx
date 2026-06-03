import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

type NavbarProps = {
  onNavigateFeatures?: () => void;
};

const navLinks = [
  { label: "Fonctionnalités", type: "features" as const },
  { label: "À propos", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar({ onNavigateFeatures }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  const goToFeatures = () => {
    if (onNavigateFeatures) {
      onNavigateFeatures();
      return;
    }

    if (location.pathname === "/welcome") {
      document
        .getElementById("fonctionnalites")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    navigate("/welcome#fonctionnalites");
  };

  return (
    <header className="sticky top-0 z-50 bg-white px-4 pt-3 pb-0 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 h-40 bg-[radial-gradient(circle_at_18%_30%,rgba(96,165,250,0.18),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(196,181,253,0.16),transparent_28%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.88),transparent_64%)] blur-3xl" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-[28px] border border-white/40 bg-white/75 px-4 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 sm:px-5">
        <Link
          to="/welcome"
          className="flex items-center gap-2 text-brand-dark transition-opacity hover:opacity-90"
        >
          <img
            src="/colab-logo-gradient.svg"
            alt="CoLab"
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((item) =>
            item.type === "features" ? (
              <button
                key={item.label}
                type="button"
                onClick={goToFeatures}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-primary"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.label}
                to={item.to!}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-primary"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Link
            to="/sign-in"
            className="rounded-full border border-white/50 bg-white/85 px-4.5 py-2.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary hover:text-brand-primary"
          >
            Se connecter
          </Link>
          <Link
            to="/sign-up"
            className="rounded-full bg-brand-dark px-4.5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary"
          >
            Commencer gratuitement
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/85 text-slate-700 shadow-sm lg:hidden"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen ? (
        <div className="mx-auto mt-3 max-w-6xl rounded-3xl border border-white/40 bg-white/90 shadow-xl backdrop-blur-lg lg:hidden">
          <div className="flex flex-col gap-2 px-4 py-3.5 sm:px-6">
            <button
              type="button"
              onClick={goToFeatures}
              className="rounded-2xl px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50 hover:text-brand-primary"
            >
              Fonctionnalités
            </button>
            <Link
              to="/about"
              className="rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50 hover:text-brand-primary"
            >
              À propos
            </Link>
            <Link
              to="/contact"
              className="rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50 hover:text-brand-primary"
            >
              Contact
            </Link>
            <div className="mt-3 grid gap-3">
              <Link
                to="/sign-in"
                className="rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-medium text-slate-700 transition hover:border-brand-primary hover:text-brand-primary"
              >
                Se connecter
              </Link>
              <Link
                to="/sign-up"
                className="rounded-full bg-brand-dark px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-brand-primary"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
