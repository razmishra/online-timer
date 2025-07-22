'use client'
import { Clock, Users, Share2, Zap, Monitor, GraduationCap, Calendar, Focus, ArrowRight, Play, Menu, X, Send, MessageCircle, Heart, CheckCircle2, AlertCircle, CheckCircle  } from 'lucide-react'
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BRAND_NAME } from "./constants";
import posthog from 'posthog-js';
import TutorialSection from './components/TutorialSection';

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
      {/* Enhanced Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl transition-shadow">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:underline border-0 outline-none">{BRAND_NAME}</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 hover:scale-105">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 hover:scale-105">How it Works</a>
              <a href="#use-cases" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 hover:scale-105">Use Cases</a>
              <button className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" onClick={() => { if(posthog.__initialized){posthog.capture('get_started_clicked', {location: 'header'});} router.push('/controller'); }}>
                Get Started
              </button>
            </nav>
            
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>feedbackRef

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300" onClick={() => setMobileMenuOpen(false)}></div>
          {/* Drawer */}
          <div className="fixed top-0 right-0 z-50 w-72 max-w-full h-full bg-white shadow-2xl border-l border-gray-200 flex flex-col animate-slide-in transition-transform duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Share My Timer</span>
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
                onClick={() => { setMobileMenuOpen(false); if(posthog.__initialized){posthog.capture('get_started_clicked', {location: 'mobile_menu'});} router.push('/controller'); }}
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
        
        <div className="relative flex flex-col md:flex-row md:items-center gap-12 md:gap-20">
          {/* Left Content */}
          <div className="space-y-12 flex-1">
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
                  className="group bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-4 md:px-12 md:py-6 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg shadow-lg md:shadow-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 w-full"
                  onClick={() => { if(posthog.__initialized){posthog.capture('try_for_free_clicked');} router.push('/controller'); }}
                >
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Try for free in the browser
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="block mt-2 text-sm text-gray-500 font-medium">No credit card or sign up required</span>
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
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">130+</div>
                <div className="text-sm text-gray-600 font-medium">Timers Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">1K+</div>
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
      <section className="px-6 py-24 bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-100 rounded-full opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-100 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-yellow-100 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Headline with Gradient Text */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Why We Built This
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We're a real-time, multi-device timer that syncs moments, people, and screens instantly. 
            Whether you're alone or managing a group, timing should just work.
          </p>
        </div>

        {/* Problem and Solution Boxes with Cool Effects */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Problem Box */}
          <div className="group bg-gray-50 hover:bg-red-50 rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden border border-transparent hover:border-red-100">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ef4444' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 group-hover:bg-red-200 rounded-lg transition-colors">
                  <AlertCircle className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-red-900 transition-colors">One of The Problems</h2>
              </div>
              <p className="text-lg text-gray-600 group-hover:text-red-700 leading-relaxed mb-4 transition-colors">
                Ever hosted a live session where timers just didn't match across screens?
              </p>
              <p className="text-gray-600 group-hover:text-red-600 leading-relaxed transition-colors">
                One device lags, someone starts early, and it throws off the entire flow of your workout, 
                game, exam, or online event. Coordination becomes chaos.
              </p>
              
              {/* Decorative Element */}
              {/* <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-red-100 rounded-full opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500"></div> */}
            </div>
          </div>

          {/* Solution Box */}
          <div className="group bg-gray-50 hover:bg-green-50 rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden border border-transparent hover:border-green-100">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 group-hover:bg-green-200 rounded-lg transition-colors">
                  <CheckCircle className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-green-900 transition-colors">Our Solution</h2>
              </div>
              <p className="text-lg text-gray-600 group-hover:text-green-700 leading-relaxed mb-4 transition-colors">
                <strong className="text-blue-600 group-hover:text-green-600 transition-colors">ShareMyTimer</strong> keeps everyone on the same countdown, in perfect real-time synchronization.
              </p>
              <p className="text-gray-600 group-hover:text-green-600 leading-relaxed transition-colors">
                No installations, no logins, no hassle. Just one timer, shared through a link — 
                perfect for event organizers, study partners, or anyone who wants consistent time sync.
              </p>
              
              {/* Decorative Element */}
              {/* <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-green-100 rounded-full opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500"></div> */}
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center">
          <div className="inline-block relative group">
            <div className=""></div>
            <button
                className="group bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-4 md:px-12 md:py-6 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg shadow-lg md:shadow-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 w-full"
                onClick={()=>router.push('/controller')}
            >
               <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Try ShareMyTimer Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </section>

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
              Who's It For?
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