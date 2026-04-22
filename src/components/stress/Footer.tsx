import { Github, Heart } from "lucide-react";

/** Footer with credit */
export const Footer = () => {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5">
          Built with <Heart className="h-3 w-3 text-accent fill-accent" /> for transparent ML education.
        </p>
        <p>StressAI · Explainable Behavioral Stress Prediction · v1.0</p>
      </div>
    </footer>
  );
};
