import { CheckCircle2, Shield } from "lucide-react";

interface FinanceApprovedProps {
  onContinue: () => void;
}

const FinanceApproved = ({ onContinue }: FinanceApprovedProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="mb-6 animate-check-bounce">
        <CheckCircle2 className="w-20 h-20 text-success" />
      </div>
      <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
        Your car finance is approved
      </h1>
      <p className="text-muted-foreground text-lg mb-2 max-w-md">
        Congratulations! Your application has been successfully processed.
      </p>
      <p className="text-muted-foreground mb-8 max-w-md">
        Before you finalise, there's one more way to give yourself peace of mind.
      </p>
      <button
        onClick={onContinue}
        className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
      >
        <Shield className="w-5 h-5" />
        Continue to protect your vehicle
      </button>
    </div>
  );
};

export default FinanceApproved;
