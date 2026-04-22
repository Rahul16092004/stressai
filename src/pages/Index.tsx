import { useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/stress/Header";
import { Hero } from "@/components/stress/Hero";
import { InputForm } from "@/components/stress/InputForm";
import { PredictionResultCard } from "@/components/stress/PredictionResultCard";
import { ExplainabilityPanel } from "@/components/stress/ExplainabilityPanel";
import { Dashboard } from "@/components/stress/Dashboard";
import { Footer } from "@/components/stress/Footer";
import { predictStress, PredictionResult, StudentInput } from "@/lib/stressEngine";

const DEFAULT_INPUT: StudentInput = {
  studyHours: 5,
  sleepHours: 6,
  screenTime: 5,
  attendance: 80,
};

/**
 * StressAI — main page.
 * Orchestrates the input form, the AI prediction, the explainability
 * panel, and the behavioral insights dashboard.
 */
const Index = () => {
  const [values, setValues] = useState<StudentInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Simulate model thinking time so the loading animation feels intentional.
  const handlePredict = () => {
    setLoading(true);
    setTimeout(() => {
      const r = predictStress(values);
      setResult(r);
      setLoading(false);
      toast(`Stress level: ${r.level}`, {
        description: r.headline,
      });
      // Smooth-scroll to results on small screens
      requestAnimationFrame(() => {
        document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }, 1100);
  };

  const handleReset = () => {
    setValues(DEFAULT_INPUT);
    setResult(null);
  };

  return (
    <div className="relative min-h-screen">
      <Header />
      <main>
        <Hero />

        {/* Predict + Result */}
        <section id="predict" className="container py-10 md:py-16">
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <InputForm
                values={values}
                onChange={setValues}
                onPredict={handlePredict}
                onReset={handleReset}
                loading={loading}
              />
            </div>
            <div id="result" className="lg:col-span-2">
              <PredictionResultCard result={result} loading={loading} />
            </div>
          </div>

          {/* Explainability */}
          <div className="mt-6">
            <ExplainabilityPanel result={result} />
          </div>
        </section>

        <Dashboard values={values} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
