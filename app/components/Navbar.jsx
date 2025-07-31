import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser
} from "@clerk/nextjs";
import {
  ArrowRight,
  Clock,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useState } from "react";
import { BRAND_NAME } from "../constants";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleGetStarted = (location) => {
    if (posthog.__initialized) {
      posthog.capture("get_started_clicked", { location });
    }
    router.push("/controller");
  };

  const { isSignedIn, user, isLoaded } = useUser();
  
  return (
    <>
      {/* Enhanced Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 transition-all duration-200"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {BRAND_NAME}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { href: "#features", label: "Features" },
                { href: "#how-it-works", label: "How it Works" },
                { href: "#use-cases", label: "Use Cases" },
                ...(
                  isSignedIn
                    ? [{ href: "/payment", label: "Pricing" }]
                    : []
                )
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-all duration-200 rounded-lg hover:bg-gray-50/80 group"
                  onClick={(e) => handleAnchorClick(e, item.href.slice(1))}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300 rounded-full"></span>
                </a>
              ))}
            </nav>

            {/* Desktop Auth & CTA */}
            <div className="hidden md:flex items-center space-x-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-gray-600 hover:text-gray-900 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-gray-50/80 border border-transparent hover:border-gray-200">
                    Sign In
                  </button>
                </SignInButton>
                <button
                  onClick={() => handleGetStarted("desktop_header")}
                  className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </SignedOut>

              <SignedIn>
                <button
                  onClick={() => handleGetStarted("desktop_header_signed_in")}
                  className="group relative bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-gray-900 font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 flex items-center space-x-2 border border-gray-200 hover:border-blue-200"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <div className="flex items-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-9 h-9 rounded-full ring-2 ring-gray-200 hover:ring-blue-300 transition-all duration-200",
                        userButtonTrigger:
                          "focus:shadow-none rounded-full hover:scale-105 transition-transform duration-200",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-50/80 transition-all duration-200 border border-transparent hover:border-gray-200"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-all duration-300"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="fixed top-0 right-0 z-50 w-80 max-w-full h-full bg-white shadow-2xl border-l border-gray-100 flex flex-col animate-slide-in">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {BRAND_NAME}
                </span>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col px-4 py-6 space-y-1">
              {[
                { href: "#features", label: "Features", icon: "✨" },
                { href: "#how-it-works", label: "How it Works", icon: "⚡" },
                { href: "#use-cases", label: "Use Cases", icon: "🎯" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium rounded-xl transition-all duration-200 group"
                  onClick={(e) => handleAnchorClick(e, item.href.slice(1))}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>

            {/* Mobile Auth Section */}
            <div className="mt-auto px-4 py-6 border-t border-gray-50 bg-gray-50/50">
              <SignedOut>
                <div className="space-y-3">
                  <SignInButton>
                    <button className="w-full py-3 px-4 text-gray-700 hover:text-gray-900 hover:bg-white font-medium rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-sm">
                      Sign In
                    </button>
                  </SignInButton>
                  <button
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleGetStarted("mobile_menu");
                    }}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center">
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox:
                              "w-9 h-9 rounded-full ring-2 ring-gray-200 hover:ring-blue-300 transition-all duration-200",
                            userButtonTrigger:
                              "focus:shadow-none rounded-full hover:scale-105 transition-transform duration-200",
                          },
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        Welcome back, {user?.firstName || "User"}!
                      </p>
                      <p className="text-xs text-gray-500">
                        Ready to countdown?
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleGetStarted("mobile_menu_signed_in");
                    }}
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </div>
              </SignedIn>
            </div>
          </div>

          {/* Animation Styles */}
          <style jsx global>{`
            @keyframes slide-in {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
            .animate-slide-in {
              animation: slide-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
          `}</style>
        </>
      )}
    </>
  );
};

export default Navbar;
