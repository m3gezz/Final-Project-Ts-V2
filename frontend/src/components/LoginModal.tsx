import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type LoginModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignup: () => void;
};

export default function LoginModal({
  open,
  onOpenChange,
  onSwitchToSignup,
}: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md rounded-[28px] bg-white p-0 shadow-2xl ring-0"
      >
        <div className="rounded-[28px]">
          <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand-primary">
                Connexion
              </p>
              <DialogTitle className="mt-2 font-heading text-2xl text-brand-dark">
                Heureux de vous revoir
              </DialogTitle>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-2xl leading-none text-slate-400 transition hover:text-slate-700"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="space-y-4 px-6 py-6"
          >
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                placeholder="vous@exemple.com"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-primary"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Mot de passe
              </span>
              <input
                type="password"
                placeholder="Votre mot de passe"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-primary"
              />
            </label>

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-brand-primary px-5 py-3 font-medium text-white transition hover:bg-brand-dark"
            >
              Se connecter
            </button>
          </form>

          <div className="border-t border-slate-100 px-6 py-5 text-center text-sm text-brand-muted">
            Pas encore de compte ?{" "}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="font-medium text-brand-primary transition hover:text-brand-dark"
            >
              S'inscrire
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
