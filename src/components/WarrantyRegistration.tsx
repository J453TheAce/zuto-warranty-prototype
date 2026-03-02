import { useEffect, useState } from "react";
import { Check, Loader2, Shield } from "lucide-react";

interface RegistrationProps {
  plan: string;
  price: number;
  simulateFailure: boolean;
}

const WarrantyRegistration = ({ plan, price, simulateFailure }: RegistrationProps) => {
  const [status, setStatus] = useState<"registering" | "pending" | "confirmed" | "failed">("registering");
  const [confirmationId, setConfirmationId] = useState("");
  const [timestamp, setTimestamp] = useState("");

  const generateId = () => `WRN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const startRegistration = () => {
    setStatus("registering");
    setTimeout(() => {
      if (simulateFailure) {
        setStatus("failed");
        return;
      }
      setStatus("pending");
      setTimeout(() => {
        setConfirmationId(generateId());
        setTimestamp(new Date().toLocaleString("en-GB"));
        setStatus("confirmed");
      }, 2000);
    }, 1000);
  };

  useEffect(() => {
    startRegistration();
  }, [simulateFailure]);

  if (status === "registering") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] animate-fade-in">
        <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
        <h2 className="font-display font-bold text-xl text-foreground mb-2">Registering your warranty…</h2>
        <p className="text-xs text-muted-foreground animate-pulse-subtle">
          Async API: Submitting registration request…
        </p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] animate-fade-in">
        <Loader2 className="w-12 h-12 text-warning animate-spin mb-4" />
        <h2 className="font-display font-bold text-xl text-foreground mb-2">Registration Pending</h2>
        <p className="text-muted-foreground text-sm">Awaiting confirmation from warranty provider…</p>
        <span className="mt-3 inline-block bg-warning/15 text-warning text-xs font-semibold px-3 py-1 rounded-full">
          Status: Pending
        </span>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] animate-fade-in text-center">
        <div className="w-12 h-12 rounded-full bg-destructive/15 flex items-center justify-center mb-4">
          <span className="text-destructive font-bold text-xl">!</span>
        </div>
        <h2 className="font-display font-bold text-xl text-foreground mb-2">Registration Failed</h2>
        <p className="text-muted-foreground text-sm mb-4 max-w-sm">
          We couldn't complete your warranty registration. Don't worry — your finance agreement is unaffected.
        </p>
        <button
          onClick={startRegistration}
          className="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Retry Registration
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] animate-slide-up text-center">
      <div className="animate-check-bounce mb-4">
        <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center">
          <Check className="w-8 h-8 text-success" />
        </div>
      </div>
      <h2 className="font-display font-bold text-2xl text-foreground mb-2">You're covered from today</h2>
      <p className="text-muted-foreground mb-6">
        Your <strong>{plan}</strong> warranty is now active at <strong>£{price.toFixed(2)}/mo</strong>.
      </p>
      <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full text-left space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Confirmation ID</span>
          <span className="text-sm font-mono font-semibold text-foreground">{confirmationId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Registered</span>
          <span className="text-sm text-foreground">{timestamp}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-success">
            <Shield className="w-3.5 h-3.5" /> Confirmed
          </span>
        </div>
      </div>
    </div>
  );
};

export default WarrantyRegistration;
