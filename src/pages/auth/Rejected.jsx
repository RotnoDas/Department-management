import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  XCircle,
  LogOut,
  Mail,
  HelpCircle,
  AlertTriangle,
  FileX,
  ShieldAlert,
} from "lucide-react";

export default function Rejected() {
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
        <div className="bg-error/20 absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-warning/20 absolute top-1/2 -right-24 h-96 w-96 -translate-y-1/2 rounded-full blur-3xl" />
        <div className="bg-accent/20 absolute -bottom-24 left-1/4 h-96 w-96 rounded-full blur-3xl" />
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
                    className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-rose-50 shadow-inner ring-1 ring-rose-100/50 lg:mx-0"
                  >
                    <XCircle className="relative z-10 h-10 w-10 text-rose-500" />
                  </motion.div>

                  <motion.h1
                    variants={itemVariants}
                    className="bg-gradient-to-r from-rose-600 to-red-800 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-5xl"
                  >
                    Access Denied
                  </motion.h1>

                  <motion.p
                    variants={itemVariants}
                    className="mt-4 text-lg leading-relaxed font-bold text-slate-500"
                  >
                    Hi{" "}
                    <span className="font-black text-rose-600">
                      {user?.name || "there"}
                    </span>
                    , we're sorry to inform you that your application has been
                    rejected.
                  </motion.p>
                </header>

                <motion.div variants={itemVariants} className="mt-8 space-y-4">
                  <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100 transition-all hover:shadow-md">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 shadow-sm">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
                        Registered Email
                      </p>
                      <p className="truncate font-mono text-xs font-black text-slate-700">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100 transition-all hover:shadow-md">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500 shadow-sm">
                      <FileX className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
                        Final Status
                      </p>
                      <p className="text-xs font-black tracking-widest text-rose-600 uppercase">
                        Rejected
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Rejection Reason & Actions */}
              <div className="flex flex-col justify-between gap-8 lg:col-span-7">
                {/* Reason Section */}
                <motion.div
                  variants={itemVariants}
                  className="rounded-[2rem] bg-rose-50/50 p-8 shadow-sm ring-1 ring-rose-100"
                >
                  <div className="mb-8 flex items-center gap-4">
                    <div className="h-px flex-1 bg-rose-200/60"></div>
                    <h3 className="text-[10px] font-black tracking-[0.4em] text-rose-600 uppercase">
                      Application Feedback
                    </h3>
                    <div className="h-px flex-1 bg-rose-200/60"></div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex items-start gap-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg ring-4 shadow-rose-100 ring-white">
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800">
                          Review Outcome
                        </h4>
                        <p className="mt-2 text-xs leading-relaxed font-bold text-slate-500">
                          Your credentials or profile information did not meet
                          the department's requirements at this time. This may
                          be due to missing documentation, mismatched records,
                          or security policy constraints.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 ring-1 ring-rose-100/50">
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="h-4 w-4 text-rose-500" />
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          Next Steps
                        </p>
                      </div>
                      <p className="mt-2 text-[11px] font-bold text-slate-600">
                        Please contact the administration office to clarify the
                        reason or to submit a fresh application with corrected
                        information.
                      </p>
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
                        Need Clarification?
                      </p>
                      <a
                        href="mailto:admin@cse.edu"
                        className="text-xs font-black text-indigo-600 transition-colors hover:text-indigo-700"
                      >
                        admin@cse.edu
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="group/btn relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-slate-900 px-8 text-[10px] font-black tracking-[0.3em] text-white uppercase shadow-xl shadow-slate-200 transition-all duration-500 hover:bg-indigo-600 hover:shadow-indigo-100 active:scale-95 sm:w-auto"
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
