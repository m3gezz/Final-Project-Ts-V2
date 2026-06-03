import { Link } from "react-router-dom";
import {
  Layers,
  Link2,
  Camera,
  MessageCircle,
  Square,
} from "lucide-react";

const footerGroups = [
  {
    title: "Apprendre",
    links: ["Cours", "Ateliers", "Projets", "Parcours d'apprentissage"],
  },
  {
    title: "Communauté",
    links: ["Discussion", "Mentors", "Événements", "Témoignages"],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", to: "/about" },
      "Carrières",
      "Blog",
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Ressources",
    links: [
      "Centre d'aide",
      "Guides",
      "Politique de confidentialité",
      "Conditions d'utilisation",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white pt-12 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="space-y-4">
            <Link
              to="/welcome"
              className="flex items-center gap-2 text-brand-dark transition-opacity hover:opacity-90"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-light">
                <Layers className="h-5 w-5 text-brand-primary" />
              </span>
              <span className="font-heading text-2xl font-bold">CoLab</span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-brand-muted">
              La communauté d'apprentissage pour les esprits curieux.
              Apprendre. Collaborer. Progresser Ensemble.
            </p>
            <div className="flex items-center gap-2.5 text-brand-muted">
              {[Square, MessageCircle, Link2, Camera].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="rounded-full border border-slate-200 p-2 transition hover:border-brand-primary hover:text-brand-primary"
                  aria-label="Réseau social CoLab"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title} className="space-y-3.5">
              <h3 className="font-heading text-sm font-semibold text-brand-dark">
                {group.title}
              </h3>
              <ul className="space-y-2.5 text-sm text-brand-muted">
                {group.links.map((link) => {
                  if (typeof link === "string") {
                    return (
                      <li key={link}>
                        <a
                          href="#"
                          className="transition hover:text-brand-primary"
                        >
                          {link}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="transition hover:text-brand-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-slate-100 pt-5 text-center text-sm text-brand-muted">
          © 2025 CoLab. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
