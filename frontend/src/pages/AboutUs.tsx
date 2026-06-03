import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Users, Zap } from "lucide-react";
import Navbar from "@/components/slices/Navbar";
import Footer from "@/components/slices/Footer";
import StatsBanner from "@/components/slices/StatsBanner";

const values = [
  {
    icon: Heart,
    title: "Apprentissage accessible",
    body: "Nous croyons que la connaissance ne doit avoir aucune barriere. C'est pourquoi CoLab propose des contenus gratuits et premium pour tous les niveaux.",
  },
  {
    icon: Users,
    title: "Communaute avant tout",
    body: "Nos apprenants ne sont jamais seuls. Chaque parcours est enrichi par des echanges, des collaborations et un reseau de soutien mondial.",
  },
  {
    icon: Zap,
    title: "Impact concret",
    body: "Chaque cours, chaque projet a ete concu pour etre directement applicable. 82% de nos apprenants rapportent un benefice concret dans leur carriere.",
  },
];

const team = [
  {
    image: "https://picsum.photos/seed/p1/400/400",
    name: "Marie Lefebvre",
    role: "Co-fondatrice & CEO",
  },
  {
    image: "https://picsum.photos/seed/p2/400/400",
    name: "Thomas Girard",
    role: "Co-fondateur & CTO",
  },
  {
    image: "https://picsum.photos/seed/p3/400/400",
    name: "Amina Benali",
    role: "Directrice des Partenariats",
  },
  {
    image: "https://picsum.photos/seed/p4/400/400",
    name: "Lucas Moreau",
    role: "Responsable Pedagogie",
  },
];

export default function AboutUs() {
  return (
    <>
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[linear-gradient(180deg,#ffffff_0%,#f7faff_100%)] text-brand-dark"
      >
        <section className="px-4 pt-16 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm font-semibold tracking-[0.26em] text-brand-primary">
              NOTRE HISTOIRE
            </p>
            <h1 className="mt-4 font-heading text-5xl font-bold text-balance">
              Nous croyons que l'apprentissage change tout
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-brand-muted">
              CoLab est ne d'une conviction simple : tout le monde merite
              d'acceder a une education de qualite, peu importe d'ou l'on vient.
              Fondee en 2021 par une equipe de passionnes d'education et de
              technologie, CoLab rassemble aujourd'hui plus de 100 000
              apprenants dans 60 pays.
            </p>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
            <img
              src="https://picsum.photos/seed/team-office/600/400"
              alt="Equipe CoLab au bureau"
              className="w-full rounded-4xl object-cover shadow-xl shadow-blue-100"
            />
            <div>
              <p className="text-sm font-semibold tracking-[0.26em] text-brand-primary">
                NOTRE MISSION
              </p>
              <h2 className="mt-3 font-heading text-4xl font-bold">
                Apprendre ensemble, progresser plus vite
              </h2>
              <div className="mt-6 space-y-5 text-lg leading-8 text-brand-muted">
                <p>
                  Chez CoLab, nous pensons que l'apprentissage est toujours
                  meilleur quand il est partage. Notre plateforme connecte des
                  apprenants ambitieux avec des formateurs experts et des pairs
                  motives pour creer une experience d'apprentissage
                  veritablement collaborative.
                </p>
                <p>
                  Nous concevons chaque cours, chaque projet et chaque
                  interaction avec un seul objectif : vous aider a developper
                  des competences reelles, applicables des aujourd'hui dans
                  votre vie professionnelle.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-3">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.article
                    key={value.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand-primary">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 font-heading text-2xl font-semibold">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-brand-muted">
                      {value.body}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="font-heading text-4xl font-bold text-brand-dark">
              L'equipe derriere CoLab
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-brand-muted">
              Des passionnes qui ont quitte leurs postes dans les plus grandes
              entreprises tech pour construire la plateforme d'apprentissage
              qu'ils auraient aime avoir.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
              {team.map((member, index) => (
                <motion.article
                  key={member.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-52 w-full rounded-[1.25rem] object-cover"
                  />
                  <h3 className="mt-4 font-heading text-xl font-semibold text-brand-dark">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm text-brand-muted">{member.role}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <div className="pb-24">
          <StatsBanner />
        </div>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-4xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-100">
            <h2 className="font-heading text-4xl font-bold text-brand-dark">
              Envie de rejoindre l'aventure ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-brand-muted">
              Que vous soyez apprenant, formateur ou entreprise, CoLab a quelque
              chose pour vous.
            </p>
            <Link
              to="/sign-up"
              className="mt-8 inline-flex rounded-full bg-brand-primary px-7 py-4 font-medium text-white transition hover:bg-brand-dark"
            >
              Commencer gratuitement
            </Link>
          </div>
        </section>

        <Footer />
      </motion.main>
    </>
  );
}
