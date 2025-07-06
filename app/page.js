'use client'
import { Clock, Users, Share2, Zap, Monitor, GraduationCap, Calendar, Focus, ArrowRight, Play, Menu, X } from 'lucide-react'
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Helper for smooth scroll to anchor
  function handleAnchorClick(e, id) {
    e.preventDefault();
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Shared Timer</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 hover:scale-105">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 hover:scale-105">How it Works</a>
              <a href="#use-cases" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 hover:scale-105">Use Cases</a>
              <button className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" onClick={() => router.push('/controller')}>
                Get Started
              </button>
            </nav>
            
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300" onClick={() => setMobileMenuOpen(false)}></div>
          {/* Drawer */}
          <div className="fixed top-0 right-0 z-50 w-72 max-w-full h-full bg-white shadow-2xl border-l border-gray-200 flex flex-col animate-slide-in transition-transform duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Shared Timer</span>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-6 py-6 flex-1">
              <a href="#features" className="py-3 px-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition-colors" onClick={e => handleAnchorClick(e, 'features')}>Features</a>
              <a href="#how-it-works" className="py-3 px-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition-colors" onClick={e => handleAnchorClick(e, 'how-it-works')}>How it Works</a>
              <a href="#use-cases" className="py-3 px-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition-colors" onClick={e => handleAnchorClick(e, 'use-cases')}>Use Cases</a>
              <button
                className="mt-6 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl w-full"
                onClick={() => { setMobileMenuOpen(false); router.push('/controller'); }}
              >
                Get Started
              </button>
            </nav>
          </div>
          {/* Slide-in animation */}
          <style jsx global>{`
            @keyframes slide-in {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            .animate-slide-in {
              animation: slide-in 0.3s cubic-bezier(0.4,0,0.2,1);
            }
          `}</style>
        </>
      )}

      {/* Enhanced Hero Section */}
      <section className="relative px-6 py-20 md:py-28 max-w-7xl mx-auto overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-transparent to-purple-50/40 rounded-3xl"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100 shadow-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Real-time synchronized timers
                <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.05] tracking-tight">
              Share timers
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mt-2">
                  Instantly
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light max-w-lg">
                {/* Real-time timer sharing for teams, events, and classrooms.<br /> */}
                <span className="block mt-3 text-gray-500">Control the timer from your phone. Display it fullscreen anywhere.</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex flex-col items-start w-full">
                <button
                  className="group bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-12 py-6 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 w-full"
                  onClick={() => router.push('/controller')}
                >
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Try for free in the browser
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="block mt-2 text-sm text-gray-500 font-medium">No credit card or sign up required</span>
              </div>
              {/* <button className="bg-white hover:bg-gray-50 text-gray-700 px-12 py-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 w-full sm:w-auto">
                View Demo
              </button> */}
            </div>

            {/* Enhanced Stats */}
            <div className="flex items-center gap-12 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">10K+</div>
                <div className="text-sm text-gray-600 font-medium">Timers Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">50K+</div>
                <div className="text-sm text-gray-600 font-medium">Sessions Shared</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">99.9%</div>
                <div className="text-sm text-gray-600 font-medium">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced Desktop Mockup */}
          <div className="relative lg:ml-12">
            {/* Floating Background Elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full animate-pulse delay-1000"></div>
            
            {/* Desktop Mockup Container */}
            {/* <div className="relative perspective-1000"> */}
              {/* Laptop Base with Enhanced 3D Effect */}
              {/* <div className="bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900 rounded-t-3xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-700 hover:scale-105"> */}
                {/* Screen Bezel */}
                <div className="bg-black rounded-2xl p-5 shadow-inner relative">
                  {/* Screen Content */}
                  <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video relative shadow-2xl">
                    {/* Your Timer Image */}
                    <Image
                      src="/timer-screenshot.png"
                      alt="Timer Interface"
                      className="w-full h-full object-cover rounded-lg"
                      width={800}
                      height={450}
                      priority
                    />
                    
                    {/* Enhanced Overlay Effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 rounded-lg"></div>
                    
                    {/* Live Indicator with Animation */}
                    <div className="absolute top-3 right-6 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>

                    {/* Viewer Count Badge */}
                    {/* <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      <Users className="w-4 h-4 text-green-600" />
                      <span>12 watching</span>
                    </div> */}
                  </div>
                  
                  {/* Screen Reflection Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
                </div>
                
                {/* Laptop Keyboard Area with Details */}
                {/* <div className="mt-6 h-10 bg-gradient-to-b from-gray-700 via-gray-750 to-gray-800 rounded-b-2xl relative">
                  <div className="absolute inset-x-0 top-2 h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent rounded-full"></div>
                </div>
              </div> */}
              
              {/* Laptop Stand with Shadow */}
              {/* <div className="w-40 h-6 bg-gradient-to-b from-gray-600 to-gray-700 rounded-b-xl mx-auto transform rotate-1 shadow-lg"></div>
              <div className="w-32 h-2 bg-gray-300/20 rounded-full mx-auto mt-2 blur-sm"></div> */}
            {/* </div> */}

            {/* Enhanced Floating UI Elements */}
            {/* <div className="absolute top-12 -left-12 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-gray-100 animate-bounce delay-500 hover:scale-105 transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">3 viewers online</span>
              </div>
            </div> */}
            
            {/* <div className="absolute bottom-20 -right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-gray-100 animate-bounce delay-1000 hover:scale-105 transition-transform">
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">Link copied!</span>
              </div>
            </div> */}

            {/* <div className="absolute top-1/2 -right-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-4 shadow-xl animate-bounce delay-700 hover:scale-105 transition-transform">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-bold">Synced!</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Enhanced Additional Hero Content */}
        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-12 bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 group hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-colors">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-base font-semibold text-gray-700">Instant Setup</span>
            </div>
            <div className="flex items-center gap-4 group hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-base font-semibold text-gray-700">Unlimited Viewers</span>
            </div>
            <div className="flex items-center gap-4 group hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-colors">
                <Monitor className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-base font-semibold text-gray-700">Any Device</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-24 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Three Simple Steps
            </h2>
            <p className="text-xl text-gray-600 font-light">Get started in seconds</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group text-center space-y-6 p-8 rounded-3xl bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">
                  Create
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Set your timer duration and customize the display message for your session.
                </p>
              </div>
            </div>
            
            <div className="group text-center space-y-6 p-8 rounded-3xl bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow">
                  <Share2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">
                  Share
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Copy the unique link and send it to anyone who needs to see the timer.
                </p>
              </div>
            </div>
            
            <div className="group text-center space-y-6 p-8 rounded-3xl bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">
                  Sync
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Everyone sees the same timer in real-time. You control, they watch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Built For Teams
            </h2>
            <p className="text-xl text-gray-600 font-light">Perfect for any group activity</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center space-y-4 border border-gray-100">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-blue-100 transition-colors">
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Remote Work</h3>
              <p className="text-gray-600 leading-relaxed">Sync meetings and breaks across time zones</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center space-y-4 border border-gray-100">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-purple-100 transition-colors">
                <GraduationCap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Education</h3>
              <p className="text-gray-600 leading-relaxed">Manage exam times and class activities</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center space-y-4 border border-gray-100">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-green-100 transition-colors">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Events</h3>
              <p className="text-gray-600 leading-relaxed">Coordinate presentations and activities</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center space-y-4 border border-gray-100">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-orange-100 transition-colors">
                <Focus className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Focus</h3>
              <p className="text-gray-600 leading-relaxed">Shared Pomodoro and study sessions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24 bg-gray-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 font-light">Everything you need, nothing you don&apos;t</p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="group flex items-start space-x-6 p-8 rounded-3xl bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Sync</h3>
                <p className="text-gray-600 leading-relaxed">Real-time updates ensure everyone sees the exact same timer, down to the second.</p>
              </div>
            </div>
            
            <div className="group flex items-start space-x-6 p-8 rounded-3xl bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Presets</h3>
                <p className="text-gray-600 leading-relaxed">Quick-start templates for common use cases with custom messaging options.</p>
              </div>
            </div>
            
            <div className="group flex items-start space-x-6 p-8 rounded-3xl bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Zero Friction</h3>
                <p className="text-gray-600 leading-relaxed">No accounts, no downloads, no setup. Just create a timer and share the link.</p>
              </div>
            </div>
            
            <div className="group flex items-start space-x-6 p-8 rounded-3xl bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                <Monitor className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Universal Access</h3>
                <p className="text-gray-600 leading-relaxed">Works flawlessly on any device, any browser, any screen size.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
            <div className="relative space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Ready to sync up?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Create your first shared timer in seconds. No sign up required.
              </p>
              <button className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl" onClick={() => router.push('/controller')}>
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Shared Timer</span>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-500 text-sm">
                © 2025 Shared Timer. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}