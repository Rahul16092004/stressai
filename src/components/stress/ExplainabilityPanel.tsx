import { motion } from "framer-motion";
import { PredictionResult } from "@/lib/stressEngine";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip as RTooltip } from "recharts";
import { Lightbulb, TrendingDown, TrendingUp, Minus } from "lucide-react";

interface Props {
  result: PredictionResult | null;
}

/** Explainable AI section: feature importance bar chart + per-feature reasons */
export const ExplainabilityPanel = ({ result }: Props) => {
  if (!result) {
    return (
      <div className="glass-strong rounded-3xl p-8 text-center text-muted-foreground">
        <Lightbulb className="h-8 w-8 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Run a prediction to see why the model made its decision.</p>
      </div>
    );
  }

  const chartData = result.contributions.map((c) => ({
    name: c.label,
    importance: Math.round(c.importance * 100),
    impact: c.impact,
  }));

  const impactColor = (impact: string) =>
    impact === "raises" ? "hsl(var(--stress-high))" : impact === "lowers" ? "hsl(var(--stress-low))" : "hsl(var(--muted-foreground))";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="glass-strong rounded-3xl p-6 md:p-8"
    >
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-accent mb-2">
        <Lightbulb className="h-3.5 w-3.5" /> Explainable AI
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-bold mb-1">Why this prediction?</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Each behavior contributes a different amount to your final stress score. Here's the breakdown.
      </p>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Feature importance chart */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Feature importance</h3>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">% of total</span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <RTooltip
                  cursor={{ fill: "hsl(var(--primary) / 0.05)" }}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Contribution"]}
                />
                <Bar dataKey="importance" radius={[0, 8, 8, 0]} barSize={22}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={impactColor(entry.impact)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-stress-high" /> Raises stress
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-stress-low" /> Lowers stress
            </span>
          </div>
        </div>

        {/* Per-feature reasoning */}
        <div className="lg:col-span-3 space-y-3">
          {result.contributions.map((c, i) => {
            const Icon = c.impact === "raises" ? TrendingUp : c.impact === "lowers" ? TrendingDown : Minus;
            const color =
              c.impact === "raises" ? "text-stress-high border-stress-high/30 bg-stress-high/5" :
              c.impact === "lowers" ? "text-stress-low border-stress-low/30 bg-stress-low/5" :
              "text-muted-foreground border-white/10 bg-white/5";
            return (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-start gap-4 rounded-2xl border p-4 ${color}`}
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-background/40 shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">{c.label}</span>
                    <span className="text-xs font-mono tabular-nums text-muted-foreground">
                      {Math.round(c.importance * 100)}% impact
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{c.reason}</p>
                </div>
              </motion.div>
            );
          })}

          {/* Insights callout */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-accent/30 bg-accent/5 p-4"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent mb-2">
              <Lightbulb className="h-3.5 w-3.5" /> Key insights
            </div>
            <ul className="space-y-1.5">
              {result.insights.map((insight, i) => (
                <li key={i} className="text-xs text-foreground/90 flex gap-2">
                  <span className="text-accent shrink-0">›</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
