import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BookOpen, Moon, Smartphone, GraduationCap, Info, Sparkles, Loader2, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { StudentInput } from "@/lib/stressEngine";

interface Field {
  key: keyof StudentInput;
  label: string;
  icon: LucideIcon;
  unit: string;
  min: number;
  max: number;
  step: number;
  tooltip: string;
  hint: (v: number) => string;
}

const FIELDS: Field[] = [
  {
    key: "studyHours",
    label: "Study Hours",
    icon: BookOpen,
    unit: "hrs/day",
    min: 0, max: 12, step: 0.5,
    tooltip: "Average hours spent studying per day, including classes & assignments.",
    hint: (v) => v >= 8 ? "Heavy load" : v >= 4 ? "Healthy" : v >= 2 ? "Light" : "Very low",
  },
  {
    key: "sleepHours",
    label: "Sleep Hours",
    icon: Moon,
    unit: "hrs/night",
    min: 0, max: 12, step: 0.5,
    tooltip: "Average hours of sleep per night over the past week.",
    hint: (v) => v >= 8 ? "Excellent" : v >= 7 ? "Good" : v >= 6 ? "Borderline" : v >= 4 ? "Sleep deprived" : "Critical",
  },
  {
    key: "screenTime",
    label: "Screen Time",
    icon: Smartphone,
    unit: "hrs/day",
    min: 0, max: 16, step: 0.5,
    tooltip: "Recreational screen time — phone, social media, gaming, streaming.",
    hint: (v) => v >= 10 ? "Excessive" : v >= 7 ? "High" : v >= 5 ? "Moderate" : v >= 2 ? "Balanced" : "Minimal",
  },
  {
    key: "attendance",
    label: "Attendance",
    icon: GraduationCap,
    unit: "%",
    min: 0, max: 100, step: 1,
    tooltip: "Class attendance percentage over the current semester.",
    hint: (v) => v >= 90 ? "Excellent" : v >= 75 ? "Good" : v >= 60 ? "At risk" : "Critical",
  },
];

interface Props {
  values: StudentInput;
  onChange: (v: StudentInput) => void;
  onPredict: () => void;
  onReset: () => void;
  loading: boolean;
}

/** User input form with sliders, icons and tooltips */
export const InputForm = ({ values, onChange, onPredict, onReset, loading }: Props) => {
  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="glass-strong rounded-3xl p-6 md:p-8 glow-border"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary mb-2">
              <Sparkles className="h-3.5 w-3.5" /> Behavioral inputs
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Tell us about your week</h2>
            <p className="text-sm text-muted-foreground mt-1">Adjust the sliders to match your typical day.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {FIELDS.map((f) => {
            const v = values[f.key];
            return (
              <div
                key={f.key}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 border border-primary/20">
                      <f.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold">{f.label}</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[240px]">
                            <p className="text-xs">{f.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="text-xs text-muted-foreground">{f.hint(v)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-bold text-gradient-accent tabular-nums">
                      {v}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.unit}</div>
                  </div>
                </div>

                <Slider
                  value={[v]}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  onValueChange={([nv]) => onChange({ ...values, [f.key]: nv })}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-2 tabular-nums">
                  <span>{f.min}</span>
                  <span>{f.max}{f.unit === "%" ? "%" : ""}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onPredict}
            disabled={loading}
            className="group relative w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-6 py-4 font-semibold text-primary-foreground shadow-glow-primary hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-70 disabled:cursor-wait"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing patterns...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                Predict my stress level
              </>
            )}
          </button>
          <button
            onClick={onReset}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium hover:border-accent/40 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};
