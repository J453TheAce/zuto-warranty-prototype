import { useState, useMemo } from "react";
import { Car, Loader2, BadgeCheck } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { AutoTraderVehicle } from "@/pages/Index";

const carData: Record<string, string[]> = {
  "Audi": ["A1", "A3", "A4", "A5", "A6", "Q3", "Q5", "Q7", "TT"],
  "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "X1", "X3", "X5"],
  "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Mustang Mach-E", "Ranger"],
  "Honda": ["Civic", "Jazz", "HR-V", "CR-V", "ZR-V"],
  "Hyundai": ["i10", "i20", "i30", "Tucson", "Kona", "Ioniq 5"],
  "Kia": ["Picanto", "Rio", "Ceed", "Sportage", "Niro", "EV6"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "GLA", "GLC", "GLE"],
  "Nissan": ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf"],
  "Peugeot": ["208", "308", "2008", "3008", "5008"],
  "Toyota": ["Yaris", "Corolla", "C-HR", "RAV4", "Yaris Cross"],
  "Vauxhall": ["Corsa", "Astra", "Mokka", "Grandland", "Crossland"],
  "Volkswagen": ["Polo", "Golf", "T-Roc", "Tiguan", "ID.3", "ID.4"],
};

const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Plug-in Hybrid", "Electric"];
const transmissionTypes = ["Manual", "Automatic"];
const engineSizes = ["1.0L", "1.2L", "1.4L", "1.5L", "1.6L", "1.8L", "2.0L", "2.5L", "3.0L", "Electric"];

interface VehicleDetailsFormProps {
  onSubmit: () => void;
  autoTraderVehicle: AutoTraderVehicle;
}

const VehicleDetailsForm = ({ onSubmit, autoTraderVehicle }: VehicleDetailsFormProps) => {
  // Pre-fill from Auto Trader mock data
  const [vrm, setVrm] = useState(autoTraderVehicle.vrm);
  const [make, setMake] = useState(autoTraderVehicle.make);
  const [model, setModel] = useState(autoTraderVehicle.model);
  const [trim, setTrim] = useState(autoTraderVehicle.trim);
  const [year, setYear] = useState(autoTraderVehicle.year);
  const [regDate, setRegDate] = useState<Date | undefined>(
    new Date(`${autoTraderVehicle.year}-03-15`)
  );
  const [mileage, setMileage] = useState(autoTraderVehicle.mileage);
  const [fuel, setFuel] = useState("Petrol");
  const [transmission, setTransmission] = useState("Manual");
  const [engineSize, setEngineSize] = useState("1.5L");
  const [vehicleValue, setVehicleValue] = useState("12500");
  const [submitting, setSubmitting] = useState(false);

  const models = useMemo(() => (make ? carData[make] || [] : []), [make]);
  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 15 }, (_, i) => String(current - i));
  }, []);

  const isValid =
    vrm.trim().length >= 2 &&
    make &&
    model &&
    year &&
    regDate &&
    mileage &&
    fuel &&
    transmission &&
    engineSize &&
    vehicleValue;

  const handleSubmit = () => {
    if (!isValid) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSubmit();
    }, 1500);
  };

  return (
    <div className="animate-slide-up max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Car className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          Vehicle Details
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          We need a few details about your vehicle to check warranty eligibility and confirm your pricing.
        </p>
      </div>

      {/* Auto Trader pre-fill notice */}
      <div className="flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-lg px-4 py-2.5 mb-4">
        <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
        <p className="text-xs text-primary font-medium">
          Key fields have been pre-filled from your Auto Trader listing. Please review and confirm.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        {/* VRM */}
        <FieldGroup label="Vehicle Registration (VRM)">
          <input
            type="text"
            value={vrm}
            onChange={(e) => setVrm(e.target.value.toUpperCase())}
            placeholder="e.g. AB12 CDE"
            maxLength={8}
            className="w-full bg-muted rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground font-mono text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
        </FieldGroup>

        {/* Make & Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup label="Make">
            <SelectField
              value={make}
              onChange={(v) => { setMake(v); setModel(""); }}
              placeholder="Select make"
              options={Object.keys(carData)}
            />
          </FieldGroup>
          <FieldGroup label="Model">
            <SelectField
              value={model}
              onChange={setModel}
              placeholder={make ? "Select model" : "Select make first"}
              options={models}
              disabled={!make}
            />
          </FieldGroup>
        </div>

        {/* Trim & Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup label="Trim (optional)">
            <input
              type="text"
              value={trim}
              onChange={(e) => setTrim(e.target.value)}
              placeholder="e.g. S Line, Sport, SE"
              className="w-full bg-muted rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </FieldGroup>
          <FieldGroup label="Year of Manufacture">
            <SelectField
              value={year}
              onChange={setYear}
              placeholder="Select year"
              options={years}
            />
          </FieldGroup>
        </div>

        {/* First Registration Date */}
        <FieldGroup label="First Registration Date">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full bg-muted rounded-lg px-4 py-3 text-left text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow",
                  regDate ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {regDate ? format(regDate, "dd MMMM yyyy") : "Select date"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={regDate}
                onSelect={setRegDate}
                disabled={(d) => d > new Date() || d < new Date("2000-01-01")}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </FieldGroup>

        {/* Mileage & Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup label="Mileage">
            <div className="relative">
              <input
                type="number"
                min={0}
                max={999999}
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g. 34000"
                className="w-full bg-muted rounded-lg px-4 py-3 pr-16 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">miles</span>
            </div>
          </FieldGroup>
          <FieldGroup label="Vehicle Value">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">£</span>
              <input
                type="number"
                min={0}
                max={999999}
                value={vehicleValue}
                onChange={(e) => setVehicleValue(e.target.value)}
                placeholder="e.g. 12000"
                className="w-full bg-muted rounded-lg pl-8 pr-4 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </FieldGroup>
        </div>

        {/* Fuel, Transmission, Engine */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FieldGroup label="Fuel Type">
            <SelectField value={fuel} onChange={setFuel} placeholder="Select" options={fuelTypes} />
          </FieldGroup>
          <FieldGroup label="Transmission">
            <SelectField value={transmission} onChange={setTransmission} placeholder="Select" options={transmissionTypes} />
          </FieldGroup>
          <FieldGroup label="Engine Size">
            <SelectField value={engineSize} onChange={setEngineSize} placeholder="Select" options={engineSizes} />
          </FieldGroup>
        </div>
      </div>

      {/* Submit */}
      <div className="text-center mt-6">
        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Checking eligibility…
            </>
          ) : (
            "Check Eligibility"
          )}
        </button>
        {submitting && (
          <p className="text-xs text-muted-foreground mt-3 animate-pulse-subtle">
            Sync API: Verifying vehicle eligibility & confirming pricing…
          </p>
        )}
      </div>
    </div>
  );
};

const FieldGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
    {children}
  </div>
);

const SelectField = ({
  value,
  onChange,
  placeholder,
  options,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
  disabled?: boolean;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className={cn(
      "w-full bg-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
      value ? "text-foreground" : "text-muted-foreground"
    )}
  >
    <option value="" disabled>{placeholder}</option>
    {options.map((o) => (
      <option key={o} value={o} className="text-foreground">{o}</option>
    ))}
  </select>
);

export default VehicleDetailsForm;
