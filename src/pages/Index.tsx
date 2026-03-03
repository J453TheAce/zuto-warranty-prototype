import { useState } from "react";
import { ArrowLeft, User, Users } from "lucide-react";
import FinanceApproved from "@/components/FinanceApproved";
import WarrantyUpsell from "@/components/WarrantyUpsell";
import VehicleDetailsForm from "@/components/VehicleDetailsForm";
import EligibilityResult from "@/components/EligibilityResult";
import WarrantyRegistration from "@/components/WarrantyRegistration";
import AgentView from "@/components/AgentView";

const steps = ["Approved", "Warranty", "Vehicle Details", "Eligibility", "Registration"];

export interface AutoTraderVehicle {
  vrm: string;
  make: string;
  model: string;
  year: string;
  trim: string;
  mileage: string;
}

export const AUTO_TRADER_VEHICLE: AutoTraderVehicle = {
  vrm: "FD22 XTR",
  make: "Ford",
  model: "Focus",
  year: "2022",
  trim: "ST-Line",
  mileage: "18500",
};

// Mock monthly finance payment — drives ClearScore plan recommendation
// £285/mo → recommends "Plus" plan
export const MOCK_MONTHLY_FINANCE = 285;

const Index = () => {
  const [view, setView] = useState<"customer" | "agent">("customer");
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [experimentMode, setExperimentMode] = useState(false);

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
    setExperimentMode(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {step > 0 && view === "customer" && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="font-display font-bold text-foreground text-base sm:text-lg whitespace-nowrap">
                AutoGuard<span className="text-accent">+</span>
              </h2>
              <div className="flex items-center gap-1.5 border-l border-border pl-2 sm:pl-3">
                <span className="hidden sm:inline text-xs text-muted-foreground whitespace-nowrap">Powered by</span>
                <img
                  src="https://cdn.zuto.cloud/assets/images/zuto-logo.svg"
                  alt="Zuto"
                  className="h-4 w-auto flex-shrink-0"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {(step > 0 || view === "agent") && (
              <button
                onClick={handleReset}
                className="hidden sm:inline text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                Reset Demo
              </button>
            )}
            <button
              onClick={() => setView(view === "customer" ? "agent" : "customer")}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium bg-muted text-muted-foreground hover:text-foreground px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            >
              {view === "customer" ? (
                <>
                  <Users className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="sm:hidden">Agent</span>
                  <span className="hidden sm:inline">Agent View</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="sm:hidden">Customer</span>
                  <span className="hidden sm:inline">Customer View</span>
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
            {step === 1 && (
              <WarrantyUpsell
                onContinue={handlePlanSelected}
                monthlyPayment={MOCK_MONTHLY_FINANCE}
                experimentMode={experimentMode}
                onToggleExperiment={setExperimentMode}
                autoTraderVehicle={AUTO_TRADER_VEHICLE}
              />
            )}
            {step === 2 && (
              <VehicleDetailsForm
                onSubmit={handleVehicleSubmit}
                autoTraderVehicle={AUTO_TRADER_VEHICLE}
              />
            )}
            {step === 3 && selectedPlan && selectedPrice && (
              <EligibilityResult
                plan={selectedPlan}
                price={selectedPrice}
                onAddWarranty={handleAddWarranty}
                simulateFailure={simulateFailure}
                experimentMode={experimentMode}
              />
            )}
            {step === 4 && selectedPlan && selectedPrice && (
              <WarrantyRegistration
                plan={selectedPlan}
                price={selectedPrice}
                simulateFailure={simulateFailure}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
