import { Link } from "react-router-dom";
import { Shield, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Policy() {
  const effectiveDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0" />

      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 min-w-0 truncate">
            <img src="/colab-logo-gradient.svg" alt="" className="w-full h-6" />
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link to="/" className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back home
            </Link>
          </Button>
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-6 py-16">
        <div
          className="relative overflow-hidden rounded-2xl border bg-card/80 p-8 backdrop-blur-xl md:p-12"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          <div
            className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, var(--primary-glow), transparent 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, oklch(0.7 0.18 320 / 0.4), transparent 70%)",
            }}
          />

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-accent/50 px-3 py-1 text-xs text-accent-foreground">
              <Shield className="h-3.5 w-3.5" />
              Privacy
            </div>

            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Effective date: {effectiveDate}
            </p>

            <div className="mt-8 space-y-8 text-sm leading-7 text-muted-foreground">
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Lock className="h-5 w-5 text-primary" />
                  1. Introduction
                </h2>
                <p>
                  Collab ("we", "us", "our") is committed to protecting your
                  privacy. This Privacy Policy explains how we collect, use,
                  store, and protect your personal information when you use our
                  Platform.
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Lock className="h-5 w-5 text-primary" />
                  2. Information We Collect
                </h2>
                <ul className="ml-5 list-disc space-y-1">
                  <li>
                    <strong className="text-foreground">
                      Account information:
                    </strong>{" "}
                    name, email address, profile photo, and password (stored
                    securely).
                  </li>
                  <li>
                    <strong className="text-foreground">Profile data:</strong>{" "}
                    skills, bio, location, links, and other details you choose
                    to share.
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Workspace content:
                    </strong>{" "}
                    messages, tasks, files, and project data you create or
                    upload.
                  </li>
                  <li>
                    <strong className="text-foreground">Usage data:</strong> IP
                    address, browser type, device info, and activity logs for
                    analytics and security.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Lock className="h-5 w-5 text-primary" />
                  3. How We Use Your Information
                </h2>
                <ul className="ml-5 list-disc space-y-1">
                  <li>
                    To provide, maintain, and improve the Platform and its
                    features.
                  </li>
                  <li>
                    To personalize your experience and match you with relevant
                    projects and collaborators.
                  </li>
                  <li>
                    To communicate with you about updates, security alerts, and
                    support requests.
                  </li>
                  <li>To ensure the security and integrity of our services.</li>
                  <li>
                    To comply with legal obligations and enforce our Terms &
                    Conditions.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Lock className="h-5 w-5 text-primary" />
                  4. Data Sharing
                </h2>
                <p>
                  We do not sell your personal data. We may share information
                  with:
                </p>
                <ul className="ml-5 mt-2 list-disc space-y-1">
                  <li>
                    <strong className="text-foreground">Other users:</strong>{" "}
                    your public profile and workspace content is visible to
                    participants of shared workspaces.
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Service providers:
                    </strong>{" "}
                    trusted third parties who help us operate the Platform
                    (hosting, analytics, email delivery) under strict
                    confidentiality agreements.
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Legal authorities:
                    </strong>{" "}
                    when required by law or to protect our rights, property, or
                    safety.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Lock className="h-5 w-5 text-primary" />
                  5. Data Security
                </h2>
                <p>
                  We implement industry-standard security measures including
                  encryption in transit (TLS), encrypted storage, and access
                  controls. However, no internet-based platform can be 100%
                  secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Lock className="h-5 w-5 text-primary" />
                  6. Data Retention
                </h2>
                <p>
                  We retain your personal information for as long as your
                  account is active or as needed to provide you with services.
                  You may request deletion of your account and associated data
                  at any time by contacting us.
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Lock className="h-5 w-5 text-primary" />
                  7. Your Rights
                </h2>
                <p>Depending on your location, you may have the right to:</p>
                <ul className="ml-5 mt-2 list-disc space-y-1">
                  <li>Access, correct, or delete your personal data.</li>
                  <li>Object to or restrict certain processing activities.</li>
                  <li>Request a copy of your data in a portable format.</li>
                  <li>
                    Withdraw consent where processing is based on consent.
                  </li>
                </ul>
                <p className="mt-2">
                  To exercise these rights, contact us at{" "}
                  <a
                    href="mailto:privacy@collab.app"
                    className="text-primary hover:underline"
                  >
                    privacy@collab.app
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Lock className="h-5 w-5 text-primary" />
                  8. Cookies & Tracking
                </h2>
                <p>
                  We use cookies and similar technologies to enhance your
                  experience, analyze usage patterns, and remember your
                  preferences. You can manage cookie settings through your
                  browser.
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Lock className="h-5 w-5 text-primary" />
                  9. Children's Privacy
                </h2>
                <p>
                  The Platform is not intended for children under 16. We do not
                  knowingly collect personal information from children. If you
                  believe a child has provided us with personal data, please
                  contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Lock className="h-5 w-5 text-primary" />
                  10. Changes to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. We will
                  notify you of significant changes via email or through the
                  Platform. Your continued use after changes indicates
                  acceptance of the updated Policy.
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Lock className="h-5 w-5 text-primary" />
                  11. Contact Us
                </h2>
                <p>
                  If you have any questions or concerns about this Privacy
                  Policy, please contact us at{" "}
                  <a
                    href="mailto:privacy@collab.app"
                    className="text-primary hover:underline"
                  >
                    privacy@collab.app
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Collab. Built for makers.</span>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
