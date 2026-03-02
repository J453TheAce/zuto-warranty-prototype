import { useState } from "react";
import { Check, Star, Shield, Clock } from "lucide-react";

interface WarrantyUpsellProps {
  onContinue: (plan: string, price: number) => void;
}

const plans = [
  {
    name: "Basic",
    price: 14.99,
    features: ["Engine & gearbox cover", "Electrical systems", "24/7 helpline"],
  },
  {
    name: "Plus",
    price: 19.99,
    popular: true,
    features: ["Everything in Basic", "Air conditioning", "Fuel system", "Turbo & supercharger"],
  },
  {
    name: "Premium",
    price: 24.99,
    features: ["Everything in Plus", "Wear & tear items", "MOT test failure cover", "Hire car included"],
  },
];

const WarrantyUpsell = ({ onContinue }: WarrantyUpsellProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("Plus");

  const selected = plans.find((p) => p.name === selectedPlan)!;

  return (
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
          Protect your car from unexpected repair costs
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Add a manufacturer-backed warranty to your finance agreement. Cancel anytime with our 30-day money-back guarantee.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-8">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Star className="w-4 h-4 text-warning fill-warning" />
          <span>4.8/5 rated by customers</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-accent" />
          <span>FCA regulated</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 text-accent" />
          <span>30-day money-back guarantee</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
        {plans.map((plan) => (
          <button
            key={plan.name}
            onClick={() => setSelectedPlan(plan.name)}
            className={`relative bg-card rounded-xl p-6 text-left border-2 transition-all ${
              selectedPlan === plan.name
                ? "border-accent shadow-lg scale-[1.02]"
                : "border-border hover:border-accent/40"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <h3 className="font-display font-bold text-lg text-foreground mb-1">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-display font-bold text-foreground">£{plan.price.toFixed(2)}</span>
              <span className="text-muted-foreground text-sm">/mo</span>
            </div>
            <ul className="space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={() => onContinue(selectedPlan, selected.price)}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
        >
          Check Eligibility
        </button>
      </div>
    </div>
  );
};

export default WarrantyUpsell;
