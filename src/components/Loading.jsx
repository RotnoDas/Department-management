import { Sparkles } from "lucide-react";

export default function Loading({ text = "Loading...", fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center py-16 w-full">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing aura */}
        <div className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-tr from-primary via-secondary to-accent opacity-30 animate-pulse scale-150"></div>
        
        {/* Spinning Rings */}
        <div className="relative flex h-32 w-32 items-center justify-center">
          {/* Ring 1 - Primary */}
          <div className="absolute inset-0 rounded-full border-t-[5px] border-r-[5px] border-primary border-opacity-70 animate-[spin_3s_linear_infinite]"></div>
          
          {/* Ring 2 - Secondary (reverse) */}
          <div className="absolute inset-3 rounded-full border-b-[5px] border-l-[5px] border-secondary border-opacity-80 animate-[spin_2s_linear_infinite_reverse]"></div>
          
          {/* Ring 3 - Accent */}
          <div className="absolute inset-6 rounded-full border-t-[4px] border-accent animate-[spin_1.5s_linear_infinite]"></div>
          
          {/* Center icon */}
          <div className="bg-base-100 rounded-full p-2 shadow-inner">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Loading Text & Dots */}
      <div className="mt-10 flex flex-col items-center z-10 relative">
        <h3 className="text-xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent drop-shadow-sm">
          {text}
        </h3>
        <div className="flex gap-2 mt-3">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-bounce shadow-lg" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce shadow-lg" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
