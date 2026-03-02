import { useState } from "react";
import { Check, Shield } from "lucide-react";

interface EligibilityResultProps {
  plan: string;
  price: number;
  onAddWarranty: () => void;
}

const EligibilityResult = ({ plan, price, onAddWarranty }: EligibilityResultProps) => {
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
          Great news — your vehicle qualifies for warranty cover. Here's your confirmed pricing for the <strong>{plan}</strong> plan:
        </p>
        <span className="text-4xl font-display font-bold text-foreground">
          £{price.toFixed(2)}
        </span>
        <span className="text-muted-foreground text-sm">/mo</span>
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
