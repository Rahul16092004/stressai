import { motion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis, ReferenceDot } from "recharts";
import { buildScreenVsStress, buildSleepVsStress, buildStudyVsStress, StudentInput } from "@/lib/stressEngine";
import { BookOpen, LineChart, Moon, Smartphone } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Props {
  values: StudentInput;
}

interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  data: { value: number; stress: number }[];
  unit: string;
  current: number;
  gradientId: string;
  color: string;
}

const ChartCard = ({ title, subtitle, icon: Icon, data, unit, current, gradientId, color }: ChartCardProps) => {
  const currentStress = data.find((d) => d.value === Math.round(current))?.stress ?? null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="glass-strong rounded-3xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 border border-white/10">
            <Icon className="h-4 w-4" style={{ color }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {currentStress !== null && (
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">You</div>
            <div className="font-display text-lg font-bold tabular-nums" style={{ color }}>{currentStress}</div>
          </div>
        )}
      </div>

      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="value"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              label={{ value: unit, position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <RTooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              formatter={(v: number) => [`${v}`, "Stress"]}
              labelFormatter={(l) => `${l} ${unit}`}
            />
            <Area
              type="monotone"
              dataKey="stress"
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              animationDuration={900}
            />
            {currentStress !== null && (
              <ReferenceDot
                x={Math.round(current)}
                y={currentStress}
                r={6}
                fill={color}
                stroke="hsl(var(--background))"
                strokeWidth={3}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

/** Dashboard with three charts showing how each variable maps to predicted stress */
export const Dashboard = ({ values }: Props) => {
  return (
    <section id="dashboard" className="container py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
          <LineChart className="h-3.5 w-3.5" /> Behavioral Insights Dashboard
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          How each habit shapes <span className="text-gradient-accent">your stress</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Each chart isolates one variable, holding the others at healthy defaults.
          The dot marks where <span className="text-foreground font-medium">you</span> land.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Study vs Stress"
          subtitle="Both too little and too much study raise stress"
          icon={BookOpen}
          data={buildStudyVsStress()}
          unit="hours"
          current={values.studyHours}
          gradientId="grad-study"
          color="hsl(187 100% 60%)"
        />
        <ChartCard
          title="Sleep vs Stress"
          subtitle="Sleep is the single strongest protective factor"
          icon={Moon}
          data={buildSleepVsStress()}
          unit="hours"
          current={values.sleepHours}
          gradientId="grad-sleep"
          color="hsl(145 100% 60%)"
        />
        <ChartCard
          title="Screen Time impact"
          subtitle="High recreational screen time amplifies stress"
          icon={Smartphone}
          data={buildScreenVsStress()}
          unit="hours"
          current={values.screenTime}
          gradientId="grad-screen"
          color="hsl(295 100% 70%)"
        />
      </div>
    </section>
  );
};
