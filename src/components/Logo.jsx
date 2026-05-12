import { GraduationCap, Sparkles } from "lucide-react";

export default function Logo({ className = "", size = "md", withText = true }) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
    xl: "w-10 h-10"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-5xl"
  };

  const subTextSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
    xl: "text-base"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg ${sizes[size]}`}>
        <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
        <GraduationCap className={`relative z-10 ${iconSizes[size]}`} />
        <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-spin-slow" />
      </div>
      {withText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1.5">
            <h1 className={`font-black tracking-tighter text-slate-800 leading-none drop-shadow-sm ${textSizes[size]}`}>
              PUST
            </h1>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          </div>
          <p className={`font-bold text-slate-500 tracking-[0.15em] uppercase leading-snug mt-1 opacity-80 ${size === 'sm' || size === 'md' ? 'max-w-[150px]' : 'max-w-xs'} ${subTextSizes[size]}`}>
            Pabna University of Science & Technology
          </p>
        </div>
      )}
    </div>
  );
}
