import { useState } from "react";
import { ArrowLeft, User, Users } from "lucide-react";
import FinanceApproved from "@/components/FinanceApproved";
import WarrantyUpsell from "@/components/WarrantyUpsell";
import VehicleDetailsForm from "@/components/VehicleDetailsForm";
import EligibilityResult from "@/components/EligibilityResult";
import WarrantyRegistration from "@/components/WarrantyRegistration";
import AgentView from "@/components/AgentView";

const steps = ["Approved", "Warranty", "Vehicle Details", "Eligibility", "Registration"];

const Index = () => {
  const [view, setView] = useState<"customer" | "agent">("customer");
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);

  const handlePlanSelected = (plan: string, price: number) => {
    setSelectedPlan(plan);
    setSelectedPrice(price);
    setStep(2);
  };

  const handleVehicleSubmit = () => {
    setStep(3);
  };

  const handleAddWarranty = () => {
    setStep(4);
    if (!simulateFailure) {
      setTimeout(() => setRegistrationComplete(true), 3500);
    }
  };

  const handleReset = () => {
    setStep(0);
    setSelectedPlan(null);
    setSelectedPrice(null);
    setRegistrationComplete(false);
    setSimulateFailure(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 0 && view === "customer" && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="font-display font-bold text-foreground text-lg">
              AutoGuard<span className="text-accent">+</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {(step > 0 || view === "agent") && (
              <button
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Reset Demo
              </button>
            )}
            <button
              onClick={() => setView(view === "customer" ? "agent" : "customer")}
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-muted text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-colors"
            >
              {view === "customer" ? (
                <>
                  <Users className="w-3.5 h-3.5" />
                  Agent View
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5" />
                  Customer View
                </>
              )}
            </button>
          </div>
        </div>

        {view === "customer" && (
          <div className="max-w-5xl mx-auto px-4 pb-3">
            <div className="flex gap-1">
              {steps.map((s, i) => (
                <div key={s} className="flex-1">
                  <div
                    className={`h-1 rounded-full transition-colors ${
                      i <= step ? "bg-accent" : "bg-muted"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {view === "agent" ? (
          <AgentView
            selectedPlan={selectedPlan}
            selectedPrice={selectedPrice}
            registrationComplete={registrationComplete}
            simulateFailure={simulateFailure}
            onToggleFailure={setSimulateFailure}
          />
        ) : (
          <>
            {step === 0 && <FinanceApproved onContinue={() => setStep(1)} />}
            {step === 1 && <WarrantyUpsell onContinue={handlePlanSelected} />}
            {step === 2 && <VehicleDetailsForm onSubmit={handleVehicleSubmit} />}
            {step === 3 && selectedPlan && selectedPrice && (
              <EligibilityResult plan={selectedPlan} price={selectedPrice} onAddWarranty={handleAddWarranty} />
            )}
            {step === 4 && selectedPlan && selectedPrice && (
              <WarrantyRegistration plan={selectedPlan} price={selectedPrice} simulateFailure={simulateFailure} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
