import { useState } from "react";
import { AlertTriangle, Check, RefreshCw, ChevronDown, ChevronUp, BarChart3, Activity } from "lucide-react";

interface AgentViewProps {
  selectedPlan: string | null;
  selectedPrice: number | null;
  registrationComplete: boolean;
  simulateFailure: boolean;
  onToggleFailure: (val: boolean) => void;
}

const AgentView = ({
  selectedPlan,
  selectedPrice,
  registrationComplete,
  simulateFailure,
  onToggleFailure,
}: AgentViewProps) => {
  const [showIntegration, setShowIntegration] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const eligibilityStatus = simulateFailure ? "Error" : "Success";
  const registrationStatus = simulateFailure
    ? "Failed"
    : registrationComplete
    ? "Confirmed"
    : "Pending";

  const apiLog = simulateFailure
    ? {
        eligibility: { status: 500, error: "PROVIDER_TIMEOUT", message: "Upstream warranty provider did not respond" },
        registration: { status: 500, error: "REGISTRATION_FAILED", message: "Could not submit registration" },
      }
    : {
        eligibility: { status: 200, eligible: true, plan: selectedPlan || "N/A", price: selectedPrice || 0 },
        registration: registrationComplete
          ? { status: 200, confirmationId: `WRN-${Date.now().toString(36).toUpperCase()}`, status_text: "confirmed" }
          : { status: "awaiting", message: "Customer has not yet completed registration" },
      };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-display font-bold text-foreground">Agent Dashboard</h1>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Simulate API Failure</span>
          <button
            onClick={() => onToggleFailure(!simulateFailure)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              simulateFailure ? "bg-destructive" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-card rounded-full transition-transform shadow ${
                simulateFailure ? "translate-x-5" : ""
              }`}
            />
          </button>
        </label>
      </div>

      {/* Customer Info */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-display font-semibold text-foreground mb-3">Customer Details</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Name</span>
            <p className="font-medium text-foreground">James Thompson</p>
          </div>
          <div>
            <span className="text-muted-foreground">Finance Ref</span>
            <p className="font-medium text-foreground font-mono">FIN-2026-00482</p>
          </div>
          <div>
            <span className="text-muted-foreground">Selected Plan</span>
            <p className="font-medium text-foreground">{selectedPlan || "—"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Monthly Price</span>
            <p className="font-medium text-foreground">
              {selectedPrice ? `£${selectedPrice.toFixed(2)}` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* API Status */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-display font-semibold text-foreground mb-3">API Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Eligibility API (Sync)</span>
            <StatusBadge status={eligibilityStatus} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Registration API (Async)</span>
            <StatusBadge status={registrationStatus} />
          </div>
        </div>
        {simulateFailure && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">API Error Detected</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upstream warranty provider timed out. Customer shown fallback message. Manual retry available.
                </p>
                <button
                  onClick={() => { setRetrying(true); setTimeout(() => setRetrying(false), 1500); }}
                  disabled={retrying}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold bg-destructive text-destructive-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  <RefreshCw className={`w-3 h-3 ${retrying ? "animate-spin" : ""}`} />
                  {retrying ? "Retrying…" : "Retry Registration"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* API Log */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-display font-semibold text-foreground mb-3">API Response Log</h3>
        <pre className="bg-primary text-primary-foreground rounded-lg p-4 text-xs overflow-x-auto font-mono leading-relaxed">
          {JSON.stringify(apiLog, null, 2)}
        </pre>
      </div>

      {/* Metrics */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-accent" />
          Live Product Metrics (Example)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Attach Rate" value="18%" target="25%" />
          <MetricCard label="Target" value="25%" />
          <MetricCard label="Margin / Policy" value="£120" />
          <MetricCard label="API Failure Rate" value="2.1%" alert />
        </div>
      </div>

      {/* Integration Overview */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setShowIntegration(!showIntegration)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
        >
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            Integration Overview
          </h3>
          {showIntegration ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        {showIntegration && (
          <div className="px-5 pb-5 animate-fade-in">
            <div className="space-y-4">
              <IntegrationStep
                step={1}
                title="Sync API — Eligibility & Pricing"
                description="Synchronous call to the warranty provider's eligibility endpoint. Returns vehicle eligibility status and confirmed pricing in real time. Timeout: 5s with circuit breaker."
              />
              <IntegrationStep
                step={2}
                title="Async API — Registration"
                description="Asynchronous call to register the warranty. Returns a pending status immediately, then confirms via webhook callback. Polling fallback after 30s."
              />
              <IntegrationStep
                step={3}
                title="Monitoring & Fallback"
                description="All API calls are logged and monitored. Failed eligibility calls show a friendly fallback message. Failed registrations can be retried by agents via the operational dashboard."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Success: "bg-success/15 text-success",
    Confirmed: "bg-success/15 text-success",
    Pending: "bg-warning/15 text-warning",
    Error: "bg-destructive/15 text-destructive",
    Failed: "bg-destructive/15 text-destructive",
  };
  const icons: Record<string, React.ReactNode> = {
    Success: <Check className="w-3 h-3" />,
    Confirmed: <Check className="w-3 h-3" />,
    Error: <AlertTriangle className="w-3 h-3" />,
    Failed: <AlertTriangle className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] || "bg-muted text-muted-foreground"}`}>
      {icons[status]}
      {status}
    </span>
  );
};

const MetricCard = ({ label, value, target, alert }: { label: string; value: string; target?: string; alert?: boolean }) => (
  <div className="bg-muted/50 rounded-lg p-3">
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className={`text-xl font-display font-bold ${alert ? "text-destructive" : "text-foreground"}`}>{value}</p>
    {target && <p className="text-xs text-muted-foreground mt-1">Target: {target}</p>}
  </div>
);

const IntegrationStep = ({ step, title, description }: { step: number; title: string; description: string }) => (
  <div className="flex gap-3">
    <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-accent">{step}</span>
    </div>
    <div>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  </div>
);

export default AgentView;
