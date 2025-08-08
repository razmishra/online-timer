'use client'
import { AlertCircle, ArrowRight, Calendar, CheckCircle, CheckCircle2, Clock, Focus, GraduationCap, Heart, MessageCircle, Monitor, Play, Send, Share2, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { useRef, useState } from 'react';
import TutorialSection from './components/(landingPage)/TutorialSection';
import Navbar from './components/Navbar';
import { BRAND_NAME } from "./constants";
import WhyWeBuiltThis from './components/(landingPage)/WhyWeBuiltThisSection';
import Testimonials from './components/(landingPage)/TestimonialsSections';
import HeroJoinInput from './components/(landingPage)/HeroInput';
export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const feedbackRef = useRef(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Helper for smooth scroll to anchor
  function handleAnchorClick(e, id) {
    e.preventDefault();
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }

  // Feedback form submit
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackError('');
    setFeedbackSuccess('');
    if (!feedback.trim()) {
      setFeedbackError('Please enter your feedback.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback }),
      });
      if (res.ok) {
        setFeedback('');
        setFeedbackSuccess('Thank you for your valuable feedback!');
      } else {
        const data = await res.json();
        setFeedbackError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setFeedbackError('Could not send feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      {/* Enhanced Hero Section */}
      <section className="relative px-6 py-20 md:py-28 max-w-7xl mx-auto overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-transparent to-purple-50/40 rounded-3xl"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center gap-12 md:gap-20">
          {/* Left Content */}
          <div className="space-y-12 flex-1">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100 shadow-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Syncing is our responsibility
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
                  className="group bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-4 md:px-12 md:py-6 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg shadow-lg md:shadow-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 w-full"
                  onClick={() => { if(posthog.__initialized){posthog.capture('try_for_free_clicked');} router.push('/controller'); }}
                >
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Try for free in the browser
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="block mt-2 text-sm text-gray-500 font-medium">No credit card or sign up required</span>
                <div className="mt-6">
                  <HeroJoinInput router={router} />
                </div>
              </div>
            </div>
            {/* Timer Mockup Image for mobile (below CTA) */}
            <div className="block md:hidden mt-8">
              <div className="bg-black rounded-2xl p-5 shadow-inner relative">
                <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video relative shadow-2xl">
                  <Image
                    src="/timer-screenshot.png"
                    alt="Timer Interface"
                    className="w-full h-full object-cover rounded-lg"
                    width={800}
                    height={450}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 rounded-lg"></div>
                  <div className="absolute top-3 right-6 flex items-center gap-2 bg-red-500 text-white px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="flex items-center gap-12 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">250+</div>
                <div className="text-sm text-gray-600 font-medium">Timers Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">3K+</div>
                <div className="text-sm text-gray-600 font-medium">Sessions Shared</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">99.9%</div>
                <div className="text-sm text-gray-600 font-medium">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced Desktop Mockup (desktop only) */}
          <div className="relative flex-1 mb-10 md:mb-0 md:ml-12 hidden md:block">
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

          </div>
        </div>
      </section>

      {/* Tutorial Section */}
      <TutorialSection isPlaying ={isVideoPlaying} isHovered={isVideoHovered} setIsPlaying={setIsVideoPlaying} setIsHovered={setIsVideoHovered} hasError={hasError} setHasError={setHasError} isLoading={isLoading} setIsLoading={setIsLoading} />

      {/* Who're we */}
    <WhyWeBuiltThis router={router}/>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-24 sm:py-10 bg-gray-50/50">
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
              Who&apos;s It For?
            </h2>
            <p className="text-xl text-gray-600 font-light">Perfect for any group activity</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center space-y-4 border border-gray-100">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-blue-100 transition-colors">
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Remote Work</h3>
              <p className="text-gray-600 leading-relaxed">Sync meetings and breaks across time zones or use it solo across your devices</p>
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
              <h3 className="text-xl font-bold text-gray-900">Events & Workshops</h3>
              <p className="text-gray-600 leading-relaxed">Coordinate presentations and activities</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center space-y-4 border border-gray-100">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-orange-100 transition-colors">
                <Focus className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Group Focus </h3>
              <p className="text-gray-600 leading-relaxed">Shared Pomodoro and study sessions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
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

      <Testimonials/>

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

      {/* Feedback Form Section */}
      <section id="feedback" className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-4 left-4 sm:top-10 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-4 right-4 sm:bottom-10 sm:right-10 w-24 h-24 sm:w-40 sm:h-40 bg-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto relative">
        {/* Header section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
          What should we improve?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed px-4">
            Your thoughts help us create better experiences. Every message matters to us!
          </p>
        </div>

        {/* Feedback form */}
        <div 
          ref={feedbackRef} 
          className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-10 border border-white/50 hover:shadow-2xl transition-all duration-300 mx-2 sm:mx-0"
        >
          <form onSubmit={handleFeedbackSubmit} className="space-y-4 sm:space-y-6">
            {/* Textarea with enhanced styling */}
            <div className="relative">
              <textarea
                className={`w-full border-2 rounded-2xl px-6 py-4 text-lg resize-none transition-all duration-200 bg-white text-gray-900 focus:bg-white placeholder-gray-400 ${
                  feedbackError 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
                } focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl`}
                placeholder="Share your thoughts, suggestions, or experiences..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={submitting}
                required
                rows={3}
              />
            </div>

            {/* Status messages */}
            {feedbackError && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-red-200 text-sm sm:text-base">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-medium">{feedbackError}</span>
              </div>
            )}
            
            {feedbackSuccess && (
              <div className="flex items-center gap-2 sm:gap-3 text-green-700 bg-green-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-green-200 text-sm sm:text-base">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <span className="font-medium">{feedbackSuccess}</span>
              </div>
            )}

            {/* Submit button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className={`group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-200 w-full sm:w-auto justify-center ${
                  submitting || !feedback.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:scale-105 active:scale-95'
                }`}
                disabled={submitting || !feedback.trim()}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    <span>Send Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Appreciation note */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-xs sm:text-sm">Made with care by our team</span>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-500 px-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="hidden sm:inline">Read by Real People</span>
            <span className="sm:hidden">Real People</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="hidden sm:inline">Quick Response</span>
            <span className="sm:hidden">Quick Response</span>
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
              <span className="text-2xl font-bold text-gray-900">{BRAND_NAME}</span>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-500 text-sm">
                © 2025 {BRAND_NAME}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}