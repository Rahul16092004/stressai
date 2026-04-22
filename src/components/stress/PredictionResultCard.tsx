import { motion, AnimatePresence } from "framer-motion";
import { PredictionResult } from "@/lib/stressEngine";
import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

interface Props {
  result: PredictionResult | null;
  loading: boolean;
}

const colorClasses = {
  low:    { ring: "from-stress-low to-secondary", text: "text-stress-low",    bar: "bg-gradient-stress-low",    badge: "bg-stress-low/15 text-stress-low border-stress-low/30",  icon: CheckCircle2 },
  medium: { ring: "from-stress-medium to-warning", text: "text-stress-medium", bar: "bg-gradient-stress-medium", badge: "bg-stress-medium/15 text-stress-medium border-stress-medium/30", icon: Activity },
  high:   { ring: "from-stress-high to-accent",    text: "text-stress-high",   bar: "bg-gradient-stress-high",   badge: "bg-stress-high/15 text-stress-high border-stress-high/30", icon: AlertTriangle },
};

/** Animated prediction result card with emoji indicator + stress intensity bar */
export const PredictionResultCard = ({ result, loading }: Props) => {
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 h-full flex flex-col">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-accent mb-2">
        <Activity className="h-3.5 w-3.5" /> Live Prediction
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">Your stress level</h2>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center py-10"
          >
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-accent animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              <div className="absolute inset-0 grid place-items-center text-3xl">🧠</div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground animate-pulse">Running explainable AI model...</p>
          </motion.div>
        ) : result ? (
          <motion.div
            key={result.level}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col"
          >
            {(() => {
              const c = colorClasses[result.color];
              const Icon = c.icon;
              return (
                <>
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 180, damping: 14 }}
                      className="relative"
                    >
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${c.ring} blur-2xl opacity-50`} />
                      <div className="relative grid h-32 w-32 place-items-center rounded-full glass-strong border-2 border-white/20">
                        <span className="text-6xl">{result.emoji}</span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`mt-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${c.badge}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {result.level} stress
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className={`mt-3 font-display text-5xl md:text-6xl font-bold tabular-nums ${c.text}`}
                      style={{ textShadow: `0 0 30px hsl(var(--stress-${result.color}) / 0.5)` }}
                    >
                      {result.score}
                      <span className="text-2xl text-muted-foreground">/100</span>
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-2 text-sm text-muted-foreground max-w-xs"
                    >
                      {result.headline}
                    </motion.p>
                  </div>

                  {/* Intensity progress bar */}
                  <div className="mt-8">
                    <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                      <span>Low</span><span>Medium</span><span>High</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score}%` }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full ${c.bar} animate-shimmer`}
                        style={{
                          backgroundImage: `linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.2), transparent), var(--gradient-stress-${result.color})`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5 tabular-nums">
                      <span>0</span><span>35</span><span>65</span><span>100</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-10"
          >
            <div className="grid h-24 w-24 place-items-center rounded-full bg-white/5 border border-white/10 mb-4">
              <span className="text-4xl opacity-40">🤖</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Adjust the sliders and click <span className="text-foreground font-medium">Predict</span> to see your AI-generated stress analysis.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
