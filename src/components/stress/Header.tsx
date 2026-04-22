import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

/** App header with animated logo and brand title */
export const Header = () => {
  return (
    <header className="relative z-10 border-b border-white/5 backdrop-blur-md">
      <div className="container flex items-center justify-between py-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-primary blur-lg opacity-60" />
            <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary shadow-glow-primary">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-display font-bold tracking-tight">
                Stress<span className="text-gradient-accent">AI</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                <Sparkles className="h-3 w-3" /> XAI
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Explainable Student Stress Prediction</p>
          </div>
        </motion.div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          href="#predict"
          className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
          Live model • v1.0
        </motion.a>
      </div>
    </header>
  );
};
