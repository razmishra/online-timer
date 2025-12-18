import React from 'react';
import { Twitter, ExternalLink, MessageCircle } from 'lucide-react';
import Image from 'next/image';

export default function FounderSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 relative overflow-hidden">
      {/* Background decoration matching feedback form */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-4 left-4 sm:top-10 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-blue-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-4 right-4 sm:bottom-10 sm:right-10 w-24 h-24 sm:w-40 sm:h-40 bg-purple-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 border border-white/50 hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row items-center gap-10 md:gap-16 mx-2 sm:mx-0">
          
          {/* Founder Image/Avatar Section */}
          <div className="relative flex-shrink-0">
            <div className="relative group">
              {/* Decorative Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              
              {/* Circular Image Container */}
              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl transition-transform duration-500 group-hover:scale-105 z-10">
                  <Image
                    src="/Founder.jpeg"
                    alt="Rajneesh - Founder of ShareMyTimer"
                    fill
                    className="object-cover scale-140"
                    sizes="(max-width: 768px) 128px, 192px"
                  />
              </div>

              {/* Active Status Indicator */}
              <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-green-500 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-white shadow-lg animate-pulse z-20"></div>
              
              {/* Decorative Ring */}
              <div className="absolute -inset-2 border border-blue-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                Connect with the Founder
              </h2>
              <p className="text-lg text-blue-600 font-medium">Building in public at ShareMyTimer</p>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg max-w-xl">
              Hi! I&apos;m Rajneesh. I built ShareMyTimer to solve real-world timing friction. 
              I love hearing how you use the app and what we should build next. 
              Let&apos;s connect and grow together!
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a 
                href="https://x.com/Razm143" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-200 w-full sm:w-auto justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Follow on X</span>
                <ExternalLink className="w-4 h-4 opacity-50" />
              </a>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-2">
                <MessageCircle className="w-4 h-4 text-green-500" />
                Typically replies within a few hours on X
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

