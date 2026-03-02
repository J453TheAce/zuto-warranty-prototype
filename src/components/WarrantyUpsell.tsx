import { useState } from "react";
import { Check, Star, Shield, Clock, Info, BadgeCheck, FlaskConical } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { AutoTraderVehicle } from "@/pages/Index";

interface WarrantyUpsellProps {
  onContinue: (plan: string, price: number) => void;
  monthlyPayment: number;
  experimentMode: boolean;
  onToggleExperiment: (val: boolean) => void;
  autoTraderVehicle: AutoTraderVehicle;
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

const TERM_MONTHS = 24;

const getRecommendedPlan = (monthlyPayment: number): string => {
  if (monthlyPayment > 300) return "Premium";
  if (monthlyPayment >= 200) return "Plus";
  return "Basic";
};

const calcConfidenceScore = (year: string, mileage: string): number => {
  const currentYear = new Date().getFullYear();
  const ageFactor = Math.min((currentYear - parseInt(year)) / 10, 1);
  const mileageFactor = Math.min(parseInt(mileage) / 80000, 1);
  return Math.round(40 + ageFactor * 45 + mileageFactor * 20);
};

const WarrantyUpsell = ({
  onContinue,
  monthlyPayment,
  experimentMode,
  onToggleExperiment,
  autoTraderVehicle,
}: WarrantyUpsellProps) => {
  const recommendedPlan = getRecommendedPlan(monthlyPayment);
  const [selectedPlan, setSelectedPlan] = useState<string>(recommendedPlan);
  const confidenceScore = calcConfidenceScore(autoTraderVehicle.year, autoTraderVehicle.mileage);
  const selected = plans.find((p) => p.name === selectedPlan)!;

  const confidenceLabel =
    confidenceScore >= 70 ? "Higher Risk" : confidenceScore >= 50 ? "Moderate" : "Low Risk";
  const confidenceLabelClass =
    confidenceScore >= 70
      ? "bg-warning/15 text-warning"
      : confidenceScore >= 50
      ? "bg-accent/15 text-accent"
      : "bg-success/15 text-success";

  const circumference = 2 * Math.PI * 22;

  return (
    <TooltipProvider>
      <div className="animate-slide-up">

        {/* ── Auto Trader context bar ───────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5 px-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/5 text-primary border border-primary/15 px-2.5 py-1 rounded-full">
              <BadgeCheck className="w-3.5 h-3.5" />
              Vehicle details imported from Auto Trader
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-success/10 text-success border border-success/20 px-2 py-1 rounded-full">
              <Check className="w-3 h-3" />
              Dealer Verified
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="About this data">
                  <Info className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[260px] text-xs leading-relaxed">
                Vehicle data provided via marketplace integration. Make, model, year and mileage have been pre-filled from your Auto Trader listing to reduce friction.
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="text-xs font-mono text-muted-foreground">{autoTraderVehicle.vrm}</span>
        </div>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Protect your car from unexpected repair costs
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Add a manufacturer-backed warranty to your finance agreement. Cancel anytime with our 30-day money-back guarantee.
          </p>
        </div>

        {/* ── Trust signals ────────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
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

        {/* ── ClearScore recommendation banner ────────────────────────── */}
        <div className="max-w-4xl mx-auto mb-4">
          <div className="flex items-start gap-3 bg-accent/10 border border-accent/20 rounded-lg px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Recommended for you based on your monthly finance budget
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Aligned with your finance affordability profile —{" "}
                <span className="font-semibold text-foreground">{recommendedPlan}</span> plan recommended
              </p>
            </div>
            <span className="shrink-0 text-xs font-semibold text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full">
              ClearScore
            </span>
          </div>
        </div>

        {/* ── Experiment Mode toggle ───────────────────────────────────── */}
        <div className="max-w-4xl mx-auto mb-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>A/B Test Simulation</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-muted-foreground">
              {experimentMode ? "Total term framing" : "Monthly framing"}
            </span>
            <span className="text-xs font-medium text-foreground">Experiment Mode</span>
            <button
              onClick={() => onToggleExperiment(!experimentMode)}
              role="switch"
              aria-checked={experimentMode}
              className={`relative w-9 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                experimentMode ? "bg-accent" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-card rounded-full shadow transition-transform ${
                  experimentMode ? "translate-x-4" : ""
                }`}
              />
            </button>
          </label>
        </div>

        {/* ── Plan cards ───────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.name;
            const isRecommended = plan.name === recommendedPlan;

            return (
              <button
                key={plan.name}
                onClick={() => setSelectedPlan(plan.name)}
                className={`relative bg-card rounded-xl p-6 text-left border-2 transition-all ${
                  isSelected
                    ? "border-accent shadow-lg scale-[1.02]"
                    : isRecommended
                    ? "border-accent/35 bg-accent/5 hover:border-accent/60"
                    : "border-border hover:border-accent/40"
                }`}
              >
                {/* Badge — only one label per card */}
                {plan.popular && isRecommended ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    Most Popular · Recommended
                  </span>
                ) : plan.popular ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                ) : isRecommended ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Recommended
                  </span>
                ) : null}

                <h3 className="font-display font-bold text-lg text-foreground mb-1">{plan.name}</h3>

                {/* Price — switches based on experiment mode */}
                <div className="mb-4">
                  {experimentMode ? (
                    <>
                      <span className="text-3xl font-display font-bold text-foreground">
                        £{(plan.price * TERM_MONTHS).toFixed(0)}
                      </span>
                      <span className="text-muted-foreground text-xs"> over {TERM_MONTHS} months</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-display font-bold text-foreground">
                        £{plan.price.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground text-sm">/mo</span>
                    </>
                  )}
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
            );
          })}
        </div>

        {/* ── Protection Confidence Score widget ──────────────────────── */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            {/* Circular progress */}
            <div className="relative w-14 h-14 shrink-0">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
                <circle cx="28" cy="28" r="22" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  fill="none"
                  stroke="hsl(var(--accent))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${circumference}`}
                  strokeDashoffset={`${circumference * (1 - confidenceScore / 100)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                {confidenceScore}%
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Protection Confidence Score: {confidenceScore}%
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Based on vehicle age and mileage risk factors
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {autoTraderVehicle.year} {autoTraderVehicle.make} {autoTraderVehicle.model} ·{" "}
                {parseInt(autoTraderVehicle.mileage).toLocaleString("en-GB")} miles
              </p>
            </div>

            <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${confidenceLabelClass}`}>
              {confidenceLabel}
            </span>
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <div className="text-center">
          <button
            onClick={() => onContinue(selectedPlan, selected.price)}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Check Eligibility
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default WarrantyUpsell;
