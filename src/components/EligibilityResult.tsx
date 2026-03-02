import { Check, Shield, Clock, AlertCircle } from "lucide-react";

interface EligibilityResultProps {
  plan: string;
  price: number;
  onAddWarranty: () => void;
  simulateFailure: boolean;
  experimentMode: boolean;
}

const TERM_MONTHS = 24;

const EligibilityResult = ({
  plan,
  price,
  onAddWarranty,
  simulateFailure,
  experimentMode,
}: EligibilityResultProps) => {

  // ── Failure fallback ────────────────────────────────────────────────
  if (simulateFailure) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-slide-up text-center px-4">
        <div className="w-14 h-14 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center mb-5">
          <Clock className="w-7 h-7 text-warning" />
        </div>
        <h2 className="font-display font-bold text-2xl text-foreground mb-3">
          Confirming your eligibility
        </h2>
        <p className="text-muted-foreground max-w-sm mb-2">
          We're confirming your eligibility. We'll notify you shortly.
        </p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Your finance agreement is unaffected. This typically resolves within a few minutes.
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 border border-border rounded-lg px-4 py-2.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Eligibility API is temporarily unavailable. Our team has been notified.</span>
        </div>
      </div>
    );
  }

  // ── Success ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-slide-up text-center">
      <div className="bg-success/10 border border-success/30 rounded-xl p-8 max-w-md mx-auto mb-6">
        <div className="inline-flex animate-check-bounce">
          <Check className="w-12 h-12 text-success" />
        </div>
        <h2 className="font-display font-bold text-2xl text-foreground mt-4 mb-2">
          You're eligible
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          Great news — your vehicle qualifies for warranty cover. Here's your confirmed pricing for the{" "}
          <strong>{plan}</strong> plan:
        </p>

        {experimentMode ? (
          <div>
            <span className="text-4xl font-display font-bold text-foreground">
              £{(price * TERM_MONTHS).toFixed(0)}
            </span>
            <span className="text-muted-foreground text-sm"> over {TERM_MONTHS} months</span>
            <p className="text-xs text-muted-foreground mt-1">
              (£{price.toFixed(2)}/mo equivalent)
            </p>
          </div>
        ) : (
          <div>
            <span className="text-4xl font-display font-bold text-foreground">
              £{price.toFixed(2)}
            </span>
            <span className="text-muted-foreground text-sm">/mo</span>
          </div>
        )}
      </div>

      <button
        onClick={onAddWarranty}
        className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
      >
        <Shield className="w-5 h-5" />
        Add Warranty
      </button>
    </div>
  );
};

export default EligibilityResult;
