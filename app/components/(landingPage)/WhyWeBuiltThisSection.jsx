
import React from 'react';
import { Timer, Users, Zap, Share2, Palette, MessageSquare, Monitor, QrCode, ArrowRight, Clock, AlertCircle, CheckCircle, Code, Eye, Smartphone, Settings } from 'lucide-react';

function ProblemSolution() {
  /* shared classes for both cards */
  const cardBase =
    "group relative overflow-hidden rounded-2xl border border-gray-100 " +
    "p-6 sm:p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl";

  /* helper that builds the dot-pattern background */
  const pattern = (hex) =>
    `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${hex}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    /* grid now stacks at <640 px, 2-cols above */
    <div className="grid gap-8 mb-20 sm:grid-cols-1 md:grid-cols-2">
      {/* ───────── Problem ───────── */}
      <div
        className={`${cardBase} bg-gradient-to-br from-gray-50 to-red-50 hover:from-red-50 hover:to-red-100 hover:border-red-200`}
      >
        {/* dots */}
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10">
          <div
            className="absolute inset-0 bg-[length:60px_60px] sm:bg-[length:48px_48px]"
            style={{ backgroundImage: pattern("%23ef4444") }}
          />
        </div>

        {/* content */}
        <div className="relative z-10 flex flex-col h-full">
          <header className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200">
              <AlertCircle className="w-6 sm:w-7 h-6 sm:h-7 text-red-500 group-hover:scale-110" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-red-900">
              The Timing Problem
            </h2>
          </header>

          <div className="space-y-4 text-gray-600 group-hover:text-red-700 text-base sm:text-lg">
            <p>
              <strong>Ever hosted a live session where timers didn&apos;t sync?</strong>
            </p>

            <ul className="space-y-3">
              {[
                "One device lags, someone starts early",
                "Complex setup kills the momentum",
                "No way to communicate with participants",
                "Coordination becomes chaos",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 w-2 h-2 rounded-full bg-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ───────── Solution ───────── */}
      <div
        className={`${cardBase} bg-gradient-to-br from-gray-50 to-green-50 hover:from-green-50 hover:to-green-100 hover:border-green-200`}
      >
        {/* dots */}
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10">
          <div
            className="absolute inset-0 bg-[length:60px_60px] sm:bg-[length:48px_48px]"
            style={{ backgroundImage: pattern("%2310b981") }}
          />
        </div>

        {/* content */}
        <div className="relative z-10 flex flex-col h-full">
          <header className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200">
              <CheckCircle className="w-6 sm:w-7 h-6 sm:h-7 text-green-500 group-hover:scale-110" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-green-900">
              Our Perfect Solution
            </h2>
          </header>

          <div className="space-y-4 text-gray-600 group-hover:text-green-700 text-base sm:text-lg">
            <p>
              <strong className="text-blue-600 group-hover:text-green-600">
                ShareMyTimer
              </strong>{" "}
              keeps everyone synchronized in perfect real-time.
            </p>

            <ul className="space-y-3">
              {[
                ["Instant sharing", "with links or QR codes"],
                ["Zero setup", "no logins, no downloads"],
                ["Live messaging", "to all connected viewers"],
                ["Perfect coordination", "every single time"],
              ].map(([title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-2 w-2 h-2 rounded-full bg-green-400" />
                  <span>
                    <strong>{title}</strong> – {desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function WhyWeBuiltThis({ router }) {
  const keyFeatures = [
    {
      icon: Share2,
      title: "One-Click Sharing",
      description: "Share instantly with a link or QR code. No accounts, no hassle.",
      highlight: "Instant Access"
    },
    {
      icon: Palette,
      title: "10+ Beautiful Themes",
      description: "Choose from stunning themes that match your mood and event style.",
      highlight: "Visual Variety"
    },
    {
      icon: MessageSquare,
      title: "Real-Time Messages",
      description: "Send live updates to all connected viewers instantly.",
      highlight: "Live Communication"
    },
    {
      icon: Monitor,
      title: "Zoom & OBS Ready",
      description: "Perfect integration for streaming, meetings, and broadcasts.",
      highlight: "Pro Integration"
    }
  ];

  const additionalFeatures = [
    { icon: Users, text: "Unlimited viewers on one timer" },
    { icon: Code, text: "Join with simple room codes" },
    { icon: Eye, text: "Control viewer UI remotely" },
    { icon: Timer, text: "Count up & count down modes" },
    { icon: Settings, text: "Multiple timers, one controller" },
    { icon: Smartphone, text: "Works on any device, anywhere" }
  ];

  return (
    <section className="px-6 py-24 bg-white relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-100 rounded-full opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-100 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-yellow-100 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-red-100 rounded-full opacity-15 animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/3 right-10 w-28 h-28 bg-indigo-100 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Headline */}
        <div className="text-center mb-16">
          {/* <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Timer className="w-4 h-4" />
            Perfect Synchronization for Everyone
          </div> */}
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Why We Built This
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            We built the world's most intuitive shared timer because timing should unite people, not divide them. 
            <span className="text-blue-600 font-semibold"> One timer, infinite possibilities, zero friction.</span>
          </p>
        </div>

        {/* Problem and Solution - Enhanced Design */}
        <ProblemSolution/>

        {/* Key Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need, Nothing You Don't
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four core features that make ShareMyTimer the most powerful shared timing tool ever built.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group bg-white hover:bg-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                  {/* <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg font-medium">
                    {feature.highlight}
                  </div> */}
                  
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 group-hover:scale-110 transition-all">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Features */}
        <div className="bg-gray-900 rounded-2xl p-8 md:p-12 mb-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Plus These Powerful Features
              </h3>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Every detail designed to make shared timing effortless and professional.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-4 bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all duration-300 hover:scale-105">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-gray-200 font-medium">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center">
          <div className="inline-block relative group">
            <button
              className="group bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-4 md:px-12 md:py-6 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg shadow-lg md:shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
              onClick={() => router.push('/controller')}
            >
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Start Your First Timer
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
