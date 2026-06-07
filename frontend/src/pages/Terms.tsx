import { Link } from "react-router-dom";
import { Scale, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
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
              <Scale className="h-3.5 w-3.5" />
              Legal
            </div>

            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Terms & Conditions
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Effective date: {effectiveDate}
            </p>

            <div className="mt-8 space-y-8 text-sm leading-7 text-muted-foreground">
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing or using Collab ("the Platform"), you agree to be
                  bound by these Terms & Conditions ("Terms"). If you do not
                  agree to these Terms, please do not use the Platform.
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  2. Eligibility
                </h2>
                <p>
                  You must be at least 16 years old to use the Platform. By
                  registering, you represent and warrant that you meet this age
                  requirement and that all information you provide is accurate
                  and complete.
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  3. User Accounts
                </h2>
                <p>
                  You are responsible for maintaining the confidentiality of
                  your account credentials. You agree to notify us immediately
                  of any unauthorized access or use of your account. Collab is
                  not liable for any loss or damage arising from your failure to
                  secure your account.
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  4. Content & Conduct
                </h2>
                <p>
                  You retain ownership of any content you post on the Platform.
                  By posting content, you grant Collab a non-exclusive,
                  worldwide, royalty-free license to use, display, and
                  distribute that content solely for the purpose of operating
                  the Platform.
                </p>
                <p className="mt-2">
                  You agree not to post content that is illegal, harmful,
                  threatening, abusive, harassing, defamatory, or otherwise
                  objectionable. We reserve the right to remove content that
                  violates these Terms.
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  5. Workspaces & Collaboration
                </h2>
                <p>
                  Workspaces on Collab are created by users and may be public or
                  private. Workspace owners set their own rules for
                  participation. Collab does not mediate disputes between
                  collaborators but may intervene in cases of abuse or Terms
                  violations.
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  6. Intellectual Property
                </h2>
                <p>
                  The Platform and its original content, features, and
                  functionality are owned by Collab and are protected by
                  international copyright, trademark, and other intellectual
                  property laws. You may not copy, modify, distribute, or create
                  derivative works based on the Platform without our express
                  written consent.
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  7. Termination
                </h2>
                <p>
                  We may suspend or terminate your account at any time, with or
                  without notice, for conduct that we believe violates these
                  Terms or is harmful to other users, the Platform, or third
                  parties.
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  8. Limitation of Liability
                </h2>
                <p>
                  Collab is provided "as is" without warranties of any kind. In
                  no event shall Collab be liable for any indirect, incidental,
                  special, consequential, or punitive damages arising out of or
                  related to your use of the Platform.
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  9. Changes to Terms
                </h2>
                <p>
                  We may update these Terms from time to time. We will notify
                  you of any changes by posting the new Terms on this page. Your
                  continued use of the Platform after any changes indicates your
                  acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  10. Contact Us
                </h2>
                <p>
                  If you have any questions about these Terms, please contact us
                  at{" "}
                  <a
                    href="mailto:support@collab.app"
                    className="text-primary hover:underline"
                  >
                    support@collab.app
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
