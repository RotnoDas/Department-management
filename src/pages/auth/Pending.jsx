import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  Clock,
  LogOut,
  Mail,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
} from "lucide-react";

export default function Pending() {
  const { user, logout } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden opacity-30">
        <div className="bg-primary/20 absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-accent/20 absolute top-1/2 -right-24 h-96 w-96 -translate-y-1/2 rounded-full blur-3xl" />
        <div className="bg-secondary/20 absolute -bottom-24 left-1/4 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-white p-1 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50">
          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              {/* Left Column: Header & User Info */}
              <div className="flex flex-col justify-center border-b border-slate-100 pb-10 lg:col-span-5 lg:border-r lg:border-b-0 lg:pr-10 lg:pb-0">
                <header className="text-center lg:text-left">
                  <motion.div
                    variants={itemVariants}
                    className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-amber-50 shadow-inner ring-1 ring-amber-100/50 lg:mx-0"
                  >
                    <div className="pulse-glow absolute inset-0 rounded-[1.75rem] bg-amber-200/20" />
                    <Clock className="relative z-10 h-10 w-10 text-amber-500" />
                  </motion.div>

                  <motion.h1
                    variants={itemVariants}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-5xl"
                  >
                    Approval Pending
                  </motion.h1>

                  <motion.p
                    variants={itemVariants}
                    className="mt-4 text-lg leading-relaxed font-bold text-slate-500"
                  >
                    Hi{" "}
                    <span className="font-black text-indigo-600">
                      {user?.name || "there"}
                    </span>
                    ! Your account is currently under review by our
                    administration team.
                  </motion.p>
                </header>

                <motion.div variants={itemVariants} className="mt-8 space-y-4">
                  <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100 transition-all hover:shadow-md">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 shadow-sm">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
                        Login Identity
                      </p>
                      <p className="truncate font-mono text-xs font-black text-slate-700">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100 transition-all hover:shadow-md">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500 shadow-sm">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
                        Department
                      </p>
                      <p className="text-xs font-black tracking-widest text-slate-700 uppercase">
                        {user?.department || "CSE"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Verification Progress & Actions */}
              <div className="flex flex-col justify-between gap-8 lg:col-span-7">
                {/* Timeline Section */}
                <motion.div
                  variants={itemVariants}
                  className="rounded-[2rem] bg-slate-50/50 p-8 shadow-sm ring-1 ring-slate-100"
                >
                  <div className="mb-8 flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-200/60"></div>
                    <h3 className="text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase">
                      Verification Flow
                    </h3>
                    <div className="h-px flex-1 bg-slate-200/60"></div>
                  </div>

                  <div className="relative space-y-8 px-4 before:absolute before:top-2 before:bottom-2 before:left-[27px] before:w-0.5 before:bg-slate-200/60 lg:px-8 lg:before:left-[43px]">
                    <div className="relative flex items-start gap-6 lg:gap-8">
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg ring-4 shadow-emerald-100 ring-white lg:h-12 lg:w-12 lg:rounded-2xl">
                        <CheckCircle2 className="h-5 w-5 lg:h-6 lg:w-6" />
                      </div>
                      <div className="pt-1.5 lg:pt-2">
                        <h4 className="text-sm font-black text-slate-800">
                          Registration Received
                        </h4>
                        <p className="mt-0.5 text-[11px] font-bold text-slate-400">
                          System logged your application
                        </p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-6 lg:gap-8">
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg ring-4 shadow-amber-100 ring-white lg:h-12 lg:w-12 lg:rounded-2xl">
                        <Clock className="h-5 w-5 animate-pulse lg:h-6 lg:w-6" />
                      </div>
                      <div className="pt-1.5 lg:pt-2">
                        <h4 className="text-sm font-black text-slate-800">
                          Administrator Review
                        </h4>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="inline-flex items-center rounded-lg bg-amber-100/60 px-2 py-1 text-[9px] font-black tracking-widest text-amber-600 uppercase">
                            ETA: 24-48 HOURS
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-6 lg:gap-8">
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-400 ring-4 ring-white lg:h-12 lg:w-12 lg:rounded-2xl">
                        <ShieldCheck className="h-5 w-5 lg:h-6 lg:w-6" />
                      </div>
                      <div className="pt-1.5 opacity-40 lg:pt-2">
                        <h4 className="text-sm font-black text-slate-800">
                          Full Portal Access
                        </h4>
                        <p className="mt-0.5 text-[11px] font-bold text-slate-400">
                          Dashboard & features activation
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom Actions Row */}
                <motion.footer
                  variants={itemVariants}
                  className="mt-auto flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row"
                >
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Support Needed?
                      </p>
                      <a
                        href="mailto:support@cse.edu"
                        className="text-xs font-black text-indigo-600 transition-colors hover:text-indigo-700"
                      >
                        support@cse.edu
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="group/btn relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-rose-50 px-8 text-[10px] font-black tracking-[0.3em] text-rose-600 uppercase ring-1 ring-rose-100 transition-all duration-500 hover:bg-rose-600 hover:text-white hover:shadow-xl hover:shadow-rose-100 active:scale-95 sm:w-auto"
                  >
                    <LogOut className="relative z-10 h-4 w-4 transition-transform group-hover/btn:-translate-x-1" />
                    <span className="relative z-10">Sign Out</span>
                  </button>
                </motion.footer>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Caption */}
        <motion.p
          variants={itemVariants}
          className="mt-10 text-center text-[10px] font-black tracking-[0.5em] text-slate-300 uppercase"
        >
          CSE Department Portal • SECURED ENVIRONMENT
        </motion.p>
      </motion.div>
    </div>
  );
}
