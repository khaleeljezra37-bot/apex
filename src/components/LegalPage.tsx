import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function LegalPage({ page }: { page: "privacy" | "terms" }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col font-sans relative overflow-hidden selection:bg-white/30 selection:text-white">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-16"
        >
          {page === "privacy" && (
            <section className="space-y-6">
              <h1 className="text-4xl font-black uppercase tracking-tighter">
                Privacy Policy
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                Last Updated: October 2023
              </p>

              <div className="space-y-6 text-white/70 text-sm leading-relaxed max-w-3xl">
                <p>
                  Welcome to Apex. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you use our
                  Roblox development tools and connect your Roblox account.
                </p>

                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider mt-8">
                    1. Information We Collect
                  </h2>
                  <p>
                    When you authenticate via Roblox, we may collect public
                    profile information, your Roblox User ID, and access tokens
                    as permitted by the scopes you authorize. We do not store
                    your Roblox password.
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider mt-8">
                    2. How We Use Your Information
                  </h2>
                  <p>
                    We use the collected information to authenticate your
                    session, deploy scripts to your authorized Roblox
                    experiences, and provide the core functionality of the Apex
                    workspace.
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider mt-8">
                    3. Data Security
                  </h2>
                  <p>
                    We implement industry-standard security measures to protect
                    your access tokens. We do not share your personal data with
                    any third parties except as required to provide the service
                    or by law.
                  </p>
                </div>
              </div>
            </section>
          )}

          {page === "terms" && (
            <section className="space-y-6">
              <h1 className="text-4xl font-black uppercase tracking-tighter">
                Terms of Service
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                Last Updated: October 2023
              </p>

              <div className="space-y-6 text-white/70 text-sm leading-relaxed max-w-3xl">
                <p>
                  By using Apex, you agree to these Terms of Service. Please
                  read them carefully.
                </p>

                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider mt-8">
                    1. Acceptance of Terms
                  </h2>
                  <p>
                    By accessing or using our application, you confirm that you
                    accept these Terms and agree to comply with them. If you do
                    not agree to these Terms, you must not use our application.
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider mt-8">
                    2. Roblox Terms Compliance
                  </h2>
                  <p>
                    Apex is a third-party tool. By utilizing our services to
                    interact with Roblox, you concurrently agree to abide by the
                    official Roblox Terms of Use and Community Standards.
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider mt-8">
                    3. Limitation of Liability
                  </h2>
                  <p>
                    Apex is provided "as is" without warranties of any kind. We
                    are not responsible for any actions taken on your Roblox
                    account, data loss, or moderation actions resulting from the
                    scripts you generate and deploy using this tool.
                  </p>
                </div>
              </div>
            </section>
          )}
        </motion.div>
      </div>
    </div>
  );
}
