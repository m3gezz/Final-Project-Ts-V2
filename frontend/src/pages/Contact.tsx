import { motion } from "framer-motion";
import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import Navbar from "@/components/slices/Navbar";
import Footer from "@/components/slices/Footer";

const infoCards = [
  {
    icon: Mail,
    title: "Email",
    text: "support@colab.io",
    subtext: "Reponse sous 24h en jours ouvrables",
  },
  {
    icon: MessageCircle,
    title: "Chat en direct",
    text: "Disponible 7j/7, 9h-21h",
    subtext: "Temps d'attente moyen : 2 minutes",
  },
  {
    icon: MapPin,
    title: "Siege social",
    text: "42 Rue de la Republique",
    subtext: "75011 Paris, France",
  },
  {
    icon: Phone,
    title: "Telephone",
    text: "+33 1 23 45 67 89",
    subtext: "Lun-Ven, 9h-18h",
  },
];

const faqItems = [
  {
    question: "CoLab est-il gratuit ?",
    answer:
      "CoLab propose un acces gratuit a une selection de cours et de projets. Pour un acces illimite a tout le catalogue, nos abonnements Premium demarrent a 19€/mois.",
  },
  {
    question: "Puis-je apprendre a mon propre rythme ?",
    answer:
      "Absolument ! Tous les cours CoLab sont accessibles a la demande. Vous avancez quand vous voulez, ou vous voulez, sans contrainte d'horaire.",
  },
  {
    question: "Comment devenir formateur sur CoLab ?",
    answer:
      "Si vous etes expert dans votre domaine et souhaitez partager vos connaissances, rendez-vous sur notre page Devenir formateur. Nous examinons chaque candidature et vous accompagnons dans la creation de votre premier cours.",
  },
  {
    question: "Les cours sont-ils disponibles en francais ?",
    answer:
      "Oui, l'integralite du catalogue CoLab est disponible en francais. Certains cours sont egalement disponibles en anglais, espagnol et allemand.",
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[linear-gradient(180deg,#ffffff_0%,#f7faff_100%)] text-brand-dark"
      >
        <section className="px-4 pt-16 pb-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold tracking-[0.26em] text-brand-primary">
              NOUS CONTACTER
            </p>
            <h1 className="mt-4 font-heading text-5xl font-bold">
              Une question ? On est la.
            </h1>
            <p className="mt-6 text-lg text-brand-muted">
              Notre equipe repond generalement sous 24 heures.
            </p>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-4">
              {infoCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.article
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.45 }}
                    className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="font-heading text-xl font-semibold text-brand-dark">
                          {card.title}
                        </h2>
                        <p className="mt-1 font-medium text-slate-800">
                          {card.text}
                        </p>
                        <p className="mt-1 text-sm text-brand-muted">
                          {card.subtext}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="rounded-4xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-heading text-3xl font-bold text-brand-dark">
                Envoyez-nous un message
              </h2>

              {submitted ? (
                <div className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50 p-6 text-emerald-700">
                  <CheckCircle2 className="h-8 w-8" />
                  <p className="mt-3 font-heading text-2xl font-semibold">
                    Message envoye !
                  </p>
                  <p className="mt-2 text-sm">Nous vous repondrons sous 24h.</p>
                </div>
              ) : (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                  }}
                  className="mt-8 space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-700">
                        Prenom
                      </span>
                      <input
                        type="text"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-primary"
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-700">
                        Nom
                      </span>
                      <input
                        type="text"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-primary"
                      />
                    </label>
                  </div>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">
                      Adresse e-mail
                    </span>
                    <input
                      type="email"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-primary"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">
                      Sujet
                    </span>
                    <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-primary">
                      <option>Question generale</option>
                      <option>Support technique</option>
                      <option>Partenariat</option>
                      <option>Presse</option>
                      <option>Autre</option>
                    </select>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">
                      Message
                    </span>
                    <textarea
                      rows={5}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-primary"
                    />
                  </label>

                  <button
                    type="submit"
                    className="rounded-full bg-brand-primary px-7 py-4 font-medium text-white transition hover:bg-brand-dark"
                  >
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-heading text-4xl font-bold text-brand-dark">
              Questions frequentes
            </h2>

            <div className="mt-10 space-y-4">
              {faqItems.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={item.question}
                    className="rounded-3xl border border-slate-100 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq((current) =>
                          current === index ? null : index,
                        )
                      }
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-heading text-xl font-semibold text-brand-dark">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-brand-primary transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen ? (
                      <div className="px-6 pb-6 text-base leading-7 text-brand-muted">
                        {item.answer}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <Footer />
      </motion.main>
    </>
  );
}
