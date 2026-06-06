import { useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BarChart2,
  BookOpen,
  Briefcase,
  Home,
  Layers,
  Mail,
  Music2,
  Square,
  Users,
  MessageCircle,
  CheckSquare,
  LayoutDashboard,
  FolderOpen,
} from "lucide-react";
import Navbar from "@/components/slices/Navbar";
import Footer from "@/components/slices/Footer";
import StatsBanner from "@/components/slices/StatsBanner";
import studentImage from "@/assets/christian.jpg";

// Animation configuration constants
const ANIMATION_CONFIG = {
  fadeInUp: {
    initial: { y: 24, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  slideInLeft: {
    initial: { x: -24, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
  slideInRight: {
    initial: { x: 24, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
  float: {
    y: [0, -6, 0],
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: "easeInOut",
      repeatType: "loop" as const,
    },
  },
  pageTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
} as const;

const TESTIMONIAL_AUTO_ROTATE_INTERVAL = 4200;

const trustBrands = [
  { name: "Université Paris-Saclay", icon: Square },
  { name: "CentraleSupélec", icon: Layers },
  { name: "Sorbonne Université", icon: Music2 },
  { name: "EM Lyon", icon: Home },
  { name: "HEC Paris", icon: BookOpen },
  { name: "École Polytechnique", icon: Briefcase },
] as const;

const features = [
  {
    icon: FolderOpen,
    title: "Espaces de travail partagés",
    description:
      "Un espace dédié par projet. Fichiers, notes, ressources — accessibles à tous les membres, à tout moment.",
    cta: "Explorer les espaces →",
    iconClass: "bg-blue-100 text-brand-primary",
  },
  {
    icon: MessageCircle,
    title: "Messagerie d'équipe intégrée",
    description:
      "Canaux thématiques, messages directs et notifications ciblées. Plus de confusion, plus de messages noyés.",
    cta: "Ouvrir une discussion →",
    iconClass: "bg-blue-100 text-brand-primary",
  },
  {
    icon: CheckSquare,
    title: "Gestion des tâches claire",
    description:
      "Assignez, priorisez, suivez. Chaque membre sait ce qu'il doit faire — et pour quand.",
    cta: "Organiser mon projet →",
    iconClass: "bg-teal-100 text-teal-600",
  },
  {
    icon: LayoutDashboard,
    title: "Tableau de bord de progression",
    description:
      "Visualisez l'avancement de chaque membre. Identifiez les blocages avant qu'ils deviennent des problèmes.",
    cta: "Voir le tableau de bord →",
    iconClass: "bg-violet-100 text-violet-600",
  },
] as const;

const testimonials = [
  {
    quote:
      "Avant CoLab, on passait plus de temps à s'organiser qu'à travailler. Maintenant tout est au même endroit — les tâches, les fichiers, les discussions. Le gain de temps est réel.",
    name: "Sarah J.",
    role: "Étudiante en Master Informatique, Paris",
    image: "https://picsum.photos/seed/person1/96/96",
  },
  {
    quote:
      "Notre projet de fin d'études impliquait six personnes dans trois villes. Sans CoLab, ça aurait été ingérable. La coordination était fluide du début à la soutenance.",
    name: "Daniel K.",
    role: "Étudiant en Génie Logiciel, Lyon",
    image: "https://picsum.photos/seed/person2/96/96",
  },
  {
    quote:
      "Ce que j'apprécie, c'est la simplicité. Pas besoin de formation — en dix minutes, toute l'équipe était à bord et on travaillait déjà sur le projet.",
    name: "Priya M.",
    role: "Étudiante en Management de Projet, Casablanca",
    image: "https://picsum.photos/seed/person3/96/96",
  },
] as const;

const dashboardItems = [
  { title: "Design Systems", date: "30 mai" },
  { title: "User Research", date: "30 mai" },
] as const;

type FeatureType = (typeof features)[number];

const AvatarRow = memo(({ seeds }: { seeds: readonly number[] }) => {
  return (
    <div
      className="flex items-center -space-x-2"
      role="group"
      aria-label="Membres de l'équipe"
    >
      {seeds.map((seed) => (
        <img
          key={seed}
          src={`https://picsum.photos/seed/${seed}/48/48`}
          alt=""
          className="h-9 w-9 rounded-full border-2 border-white object-cover"
          loading="lazy"
        />
      ))}
    </div>
  );
});

AvatarRow.displayName = "AvatarRow";

const Sparkline = memo(() => {
  return (
    <svg
      viewBox="0 0 120 36"
      className="h-10 w-full text-brand-primary"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 28 C 18 27, 22 30, 32 24 S 54 10, 64 15 S 86 6, 96 12 S 110 8, 116 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
});

Sparkline.displayName = "Sparkline";

function FeatureCard({
  feature,
  index,
}: {
  feature: FeatureType;
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <div
        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.iconClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-xl font-bold text-slate-900">{feature.title}</h3>
      <p className="mt-2 text-sm leading-6 text-brand-muted">
        {feature.description}
      </p>
      <button
        type="button"
        className="mt-4 text-sm font-medium text-brand-primary transition-all duration-300 hover:translate-x-1 hover:text-brand-dark"
      >
        {feature.cta}
      </button>
    </motion.div>
  );
}

function TestimonialCard({
  testimonial,
  index,
  active,
}: {
  testimonial: (typeof testimonials)[number];
  index: number;
  active: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      animate={
        active ? { scale: 1.02, transition: { duration: 0.3 } } : { scale: 1 }
      }
      className={`rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 ${
        active
          ? "border-brand-primary/20 shadow-[0_18px_50px_-28px_rgba(37,99,235,0.35)]"
          : "border-slate-100 opacity-80"
      }`}
    >
      <div className="text-3xl leading-none text-brand-primary">“</div>
      <p className="mt-2.5 text-sm leading-6 text-slate-700">
        {testimonial.quote}
      </p>
      <div className="mt-5 flex items-center gap-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-sm"
          loading="lazy"
        />
        <div>
          <p className="font-semibold text-slate-900">{testimonial.name}</p>
          <p className="text-sm text-brand-muted">{testimonial.role}</p>
        </div>
      </div>
    </motion.article>
  );
}

function HeroImageComposition() {
  const floatCard =
    "rounded-3xl border border-white/70 bg-white/92 p-3.5 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.24)] backdrop-blur-xl";

  return (
    <div className="relative mx-auto w-full max-w-[640px] pt-8 lg:h-[640px]">
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[42px] bg-[radial-gradient(circle_at_28%_18%,rgba(254,228,147,0.45),transparent_18%),radial-gradient(circle_at_70%_24%,rgba(154,129,255,0.34),transparent_20%),radial-gradient(circle_at_82%_74%,rgba(108,216,178,0.24),transparent_18%),linear-gradient(135deg,rgba(226,232,240,0.24),rgba(255,255,255,0.12))] blur-3xl" />

      <div className="absolute left-[8%] top-[2%] h-28 w-28 rounded-full bg-yellow-200/45 blur-2xl" />
      <div className="absolute right-[9%] top-[18%] h-36 w-36 rounded-full bg-violet-200/45 blur-3xl" />

      <motion.div
        animate={ANIMATION_CONFIG.float.animate}
        transition={ANIMATION_CONFIG.float.transition}
        className="relative mx-auto w-full max-w-[420px] rounded-[42px] bg-white/72 p-3 shadow-[0_30px_80px_rgba(67,97,238,0.18)] backdrop-blur-sm overflow-visible"
      >
        <img
          src={studentImage}
          alt="Apprenante CoLab"
          className="h-[30rem] w-full rounded-[36px] object-cover object-[center_18%] lg:h-[36rem] "
          loading="eager"
        />
      </motion.div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
          repeatType: "loop",
        }}
        className={`mt-3 w-[204px] ${floatCard} lg:absolute lg:left-0 lg:top-[10%] lg:mt-0`}
      >
        <p className="text-xs font-semibold text-slate-500">Projets actifs</p>
        <p className="mt-1.5 text-[2.45rem] font-bold leading-none text-slate-900">
          82%
        </p>
        <p className="mt-1.5 text-xs leading-5 text-brand-muted">
          120+ équipes en collaboration ce mois
        </p>
        <div className="mt-1.5">
          <Sparkline />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          repeat: Infinity,
          duration: 5.5,
          ease: "easeInOut",
          delay: 0.2,
          repeatType: "loop",
        }}
        className={`mt-3 w-[214px] ${floatCard} lg:absolute lg:right-0 lg:top-[5%] lg:mt-0`}
      >
        <p className="text-xs font-semibold text-slate-500">Équipes créées</p>
        <p className="mt-1.5 text-[2.45rem] font-bold leading-none text-slate-900">
          450+
        </p>
        <div className="mt-2.5 flex items-center justify-between">
          <AvatarRow seeds={[21, 22, 23, 24, 25, 26]} />
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            +12
          </span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
          delay: 0.35,
          repeatType: "loop",
        }}
        className={`mt-3 w-[220px] overflow-hidden ${floatCard} lg:absolute lg:left-0 lg:bottom-[5%] lg:mt-0`}
      >
        <div className="flex items-center gap-3">
          <img
            src="https://picsum.photos/seed/course-preview/240/180"
            alt=""
            className="h-16 w-20 rounded-2xl object-cover"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">
              Projet collaboratif
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              UX Research Team
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-white">
            ?
          </span>
          Projet collaboratif
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 5.8,
          ease: "easeInOut",
          delay: 0.5,
          repeatType: "loop",
        }}
        className={`mt-3 w-[214px] ${floatCard} lg:absolute lg:right-0 lg:bottom-[9%] lg:mt-0`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Espace actif</p>
            <p className="mt-1 text-sm leading-6 text-brand-muted">
              Messages et mises à jour en temps réel.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MockDashboard() {
  return (
    <div className="rounded-[1.75rem] bg-white/10 p-3 shadow-2xl ring-1 ring-white/20 backdrop-blur-sm">
      <div className="rounded-[1.5rem] bg-white p-3 text-slate-900">
        <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-light">
              <Layers className="h-4 w-4 text-brand-primary" />
            </span>
            <span className="font-heading text-lg font-bold">CoLab</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-slate-200" />
            <span className="h-2 w-2 rounded-full bg-slate-200" />
            <img
              src="https://picsum.photos/seed/alex/48/48"
              alt="Alex"
              className="h-8 w-8 rounded-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <p className="font-semibold text-slate-900">Bienvenue, Alex ! 👋</p>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.55fr_0.95fr]">
          <div className="space-y-3 rounded-2xl border border-slate-100 p-3.5">
            <p className="text-sm font-medium text-slate-500">
              Continuer l'apprentissage
            </p>
            <div className="rounded-2xl border border-slate-100 p-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://picsum.photos/seed/course/120/90"
                  alt=""
                  className="h-16 w-20 rounded-xl object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">
                    Fondamentaux UX/UI Design
                  </p>
                  <p className="mt-1 text-sm text-brand-muted">70% terminé</p>
                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div className="h-2 w-[70%] rounded-full bg-brand-primary" />
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="mt-3 rounded-full bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-dark"
              >
                Continuer
              </button>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">À venir</p>
              <div className="mt-2.5 space-y-2.5">
                {dashboardItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 px-3.5 py-2.5"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-sm text-brand-muted">Parcours bleu</p>
                    </div>
                    <p className="text-sm text-brand-muted">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-100 p-3.5">
            <div className="rounded-2xl bg-brand-light p-3.5">
              <p className="text-sm font-medium text-slate-500">
                Ma progression
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-900">18</p>
              <p className="text-sm text-brand-muted">cours terminés</p>
              <div className="mt-3 rounded-xl bg-white p-2.5">
                <svg
                  viewBox="0 0 140 48"
                  className="h-14 w-full"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 36 C 18 35, 26 30, 38 28 S 56 20, 68 22 S 90 14, 102 18 S 122 8, 138 10"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const scrollTimer = window.setTimeout(() => {
      if (window.location.hash === "#fonctionnalites") {
        scrollTo("fonctionnalites");
      }
    }, 100);

    const testimonialTimer = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, TESTIMONIAL_AUTO_ROTATE_INTERVAL);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearInterval(testimonialTimer);
    };
  }, []);

  return (
    <>
      <Navbar onNavigateFeatures={() => scrollTo("fonctionnalites")} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7faff_45%,#ffffff_100%)] text-brand-dark"
      >
        <section className="relative px-4 pt-2 pb-10 sm:px-6 lg:px-8 lg:pt-3 lg:pb-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_20%_20%,rgba(67,97,238,0.12),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(72,149,239,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(67,97,238,0.08),transparent_32%)] blur-3xl" />

          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-sm font-semibold uppercase tracking-[0.34em] text-brand-primary"
              >
                PLATEFORME COLLABORATIVE POUR ÉTUDIANTS
              </motion.p>
              <h1 className="mt-4 max-w-xl font-heading text-6xl font-bold tracking-tight leading-[0.92] text-slate-900 xl:text-7xl">
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  Travaillez ensemble.
                </motion.span>
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  Avancez plus vite. Réussissez vos projets.
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-5 max-w-[540px] text-[1.03rem] leading-7 text-brand-muted"
              >
                Fini les fils de discussion perdus, les fichiers dispersés et
                les réunions inutiles. CoLab centralise vos espaces de travail,
                vos tâches et vos échanges pour que votre équipe se concentre
                sur ce qui compte : le projet.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-6 flex flex-col gap-3.5 sm:flex-row"
              >
                <Link
                  to="/sign-up"
                  className="inline-flex items-center justify-center rounded-full bg-brand-primary px-7 py-4 text-[0.98rem] font-medium text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-dark hover:shadow-xl"
                >
                  Créer mon espace d'équipe →
                </Link>
                <button
                  type="button"
                  onClick={() => scrollTo("fonctionnalites")}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-4 text-[0.98rem] font-medium text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary hover:text-brand-primary"
                >
                  Voir comment ça fonctionne →
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-7 flex items-center gap-3.5"
              >
                <div className="flex -space-x-2.5">
                  {[11, 12, 13].map((seed) => (
                    <img
                      key={seed}
                      src={`https://picsum.photos/seed/${seed}/72/72`}
                      alt=""
                      className="h-[34px] w-[34px] rounded-full border-2 border-white object-cover shadow-sm"
                      loading="lazy"
                    />
                  ))}
                </div>
                <p className="max-w-sm text-sm leading-6 text-brand-muted">
                  Déjà 100 000+ étudiants qui coordonnent leurs projets d'équipe
                  sur CoLab
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="relative w-full lg:ml-auto"
            >
              <HeroImageComposition />
            </motion.div>
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="border-y border-slate-100 bg-white px-4 py-7 sm:px-6 lg:px-8"
        >
          <p className="text-center text-sm text-brand-muted">
            Utilisé dans les meilleures universités et écoles partenaires
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-8 sm:gap-y-4">
            {trustBrands.map((brand, idx) => {
              const Icon = brand.icon;
              return (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="flex items-center gap-2 text-slate-400 transition hover:text-slate-600"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-sm font-semibold">{brand.name}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <section
          id="fonctionnalites"
          className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary"
              >
                VOS OUTILS, RÉUNIS EN UN SEUL ENDROIT
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-2 font-heading text-4xl font-bold text-slate-900 sm:text-5xl"
              >
                Une plateforme conçue pour que les équipes étudiantes avancent
                sans friction
              </motion.h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  feature={feature}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 lg:px-8">
          <StatsBanner />
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary"
              >
                ILS L'UTILISENT, ILS EN PARLENT
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-2 font-heading text-4xl font-bold text-slate-900 sm:text-5xl"
              >
                Ce que disent les équipes qui l'utilisent au quotidien
              </motion.h2>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.name}
                  testimonial={testimonial}
                  index={index}
                  active={activeTestimonial === index}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2.5">
              {testimonials.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  animate={
                    activeTestimonial === idx ? { scale: [1, 1.2, 1] } : {}
                  }
                  transition={{ duration: 0.5 }}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    activeTestimonial === idx
                      ? "bg-brand-primary w-6"
                      : "bg-slate-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-primary to-brand-accent lg:grid-cols-2">
            <div className="p-8 sm:p-9 lg:p-10">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="max-w-lg font-heading text-4xl font-bold text-white sm:text-[2.6rem] sm:leading-tight"
              >
                Votre prochain projet mérite un meilleur espace de travail.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-3.5 max-w-md text-base leading-7 text-white/80"
              >
                Rejoignez des milliers d'équipes étudiantes qui livrent leurs
                projets à temps, sans le chaos habituel.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-7 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  to="/sign-up"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 font-medium text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
                >
                  Créer mon espace gratuitement →
                </Link>
                <button
                  type="button"
                  onClick={() => {}}
                  className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-3.5 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Voir les fonctionnalités équipes →
                </button>
              </motion.div>
            </div>

            <div className="p-5 sm:p-7 lg:p-8">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                  repeatType: "loop",
                }}
              >
                <MockDashboard />
              </motion.div>
            </div>
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-5 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:px-7 sm:py-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand-primary">
              <Mail className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                Restez dans la boucle
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-brand-muted">
                Nouvelles fonctionnalités, conseils de collaboration et
                ressources académiques — directement dans votre boîte mail, une
                fois par semaine.
              </p>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setNewsletterSent(true);
              }}
              className="flex w-full flex-col gap-3 sm:flex-[1.6] sm:flex-row"
            >
              <input
                type="email"
                placeholder="Votre adresse e-mail universitaire"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-primary sm:min-w-[28rem]"
              />
              <button
                type="submit"
                className="rounded-xl bg-brand-primary px-6 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                S'inscrire
              </button>
            </form>
          </div>
          {newsletterSent && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-4 max-w-2xl text-center text-sm text-emerald-600"
            >
              Merci, votre inscription est bien prise en compte.
            </motion.p>
          )}
        </motion.section>

        <Footer />
      </motion.main>
    </>
  );
}
