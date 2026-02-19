"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Buy", href: "/search?type=sale" },
  { name: "Rent", href: "/search?type=rent" },
  { name: "Sell", href: "/sell" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-accent-200/50">
      <nav className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              {/* Castello Logo Mark */}
              <div className="w-8 h-8 bg-primary-900 flex items-center justify-center">
                <span className="text-white font-light text-base tracking-tight">C</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-[11px] font-normal tracking-[0.3em] text-primary-900 uppercase">
                  Castello
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="nav-link text-primary-700 hover:text-primary-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link
              href="/search"
              className="p-2 text-primary-600 hover:text-primary-900 transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Link>

            <Link
              href="/favorites"
              className="p-2 text-primary-600 hover:text-primary-900 transition-colors"
              aria-label="Favorites"
            >
              <Heart className="h-4 w-4" />
            </Link>

            <Link
              href="/sign-in"
              className="nav-link text-primary-700 hover:text-primary-900"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="btn-text px-5 py-2 bg-primary-900 text-white hover:bg-primary-800 transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="p-2 text-primary-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden",
            mobileMenuOpen ? "block" : "hidden"
          )}
        >
          <div className="py-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 nav-link text-primary-700 hover:text-primary-900 border-b border-accent-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="flex gap-4 pt-6 mt-4">
              <Link
                href="/sign-in"
                className="flex-1 py-3 border border-primary-200 text-primary-700 btn-text text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="flex-1 py-3 bg-primary-900 text-white btn-text text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
