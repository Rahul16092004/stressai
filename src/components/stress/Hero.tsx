import { motion } from "framer-motion";
import { ArrowDown, Brain, LineChart, Lightbulb } from "lucide-react";

/** Hero section with gradient title + animated background orbs */
export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb h-[500px] w-[500px] -top-40 -left-40 bg-primary/30 animate-float" />
      <div className="orb h-[400px] w-[400px] top-20 right-0 bg-accent/30 animate-float" style={{ animationDelay: "2s" }} />

      <div className="container relative z-10 py-20 md:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          Powered by Explainable AI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          Predict student stress
          <br />
          <span className="text-gradient-accent">before it breaks them.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground"
        >
          A transparent AI model that analyzes daily behavioral patterns —
          sleep, study, screen time and attendance — and explains exactly
          <em className="not-italic text-foreground"> why </em>
          a stress level was predicted.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#predict"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-medium text-primary-foreground shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Try the model
            <ArrowDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
          </a>
          <a
            href="#dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-6 py-3 font-medium text-foreground hover:border-accent/40 transition-colors"
          >
            View insights
          </a>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {[
            { icon: Brain, title: "Real-time prediction", desc: "Decision-tree model" },
            { icon: Lightbulb, title: "Explainable AI", desc: "Per-feature reasoning" },
            { icon: LineChart, title: "Visual insights", desc: "Interactive charts" },
          ].map((f, i) => (
            <div key={i} className="glass rounded-2xl p-4 text-left">
              <f.icon className="h-5 w-5 text-primary mb-2" />
              <div className="text-sm font-semibold">{f.title}</div>
              <div className="text-xs text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
