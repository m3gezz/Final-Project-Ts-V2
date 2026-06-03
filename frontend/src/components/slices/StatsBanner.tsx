import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { BookOpen, GraduationCap, Star, Users } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 100,
    suffix: "K+",
    label: "Apprenants actifs",
  },
  {
    icon: GraduationCap,
    value: 1200,
    suffix: "+",
    label: "Formateurs experts",
  },
  {
    icon: BookOpen,
    value: 2500,
    suffix: "+",
    label: "Cours & ateliers",
  },
  {
    icon: Star,
    value: 95,
    suffix: "%",
    label: "Taux de satisfaction",
  },
];

function CountUp({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

export default function StatsBanner() {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="marketing-stats-bg mx-auto max-w-5xl overflow-hidden rounded-[2rem]">
        <div className="grid grid-cols-2 gap-6 bg-slate-900/70 px-6 py-6 text-center text-white sm:px-8 sm:py-7 lg:grid-cols-4 lg:px-10 lg:py-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="space-y-2.5">
                <Icon className="mx-auto h-5 w-5 text-white/85" />
                <div className="font-heading text-3xl font-bold tracking-tight">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm leading-6 text-white/75">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
