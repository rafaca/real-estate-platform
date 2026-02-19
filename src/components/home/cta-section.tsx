import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative bg-primary-900 py-24 lg:py-32 overflow-hidden">
      {/* Decorative accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-accent-500/30" />

      <div className="container relative mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Tagline */}
          <p className="tagline text-accent-400 mb-8">
            Begin Your Journey
          </p>

          {/* Headline */}
          <h2 className="section-title text-white mb-6">
            Ready to Find Your
            <span className="block text-accent-300 mt-2">
              Extraordinary Residence?
            </span>
          </h2>

          <p className="text-[13px] text-accent-100/60 leading-relaxed max-w-md mx-auto mb-12 tracking-wide">
            Our dedicated advisors are here to guide you through every step
            of your property journey. Schedule a private consultation today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent-500 text-primary-950 hover:bg-accent-400 transition-colors btn-text"
            >
              Schedule Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="tel:+41227000000"
              className="inline-flex items-center gap-3 px-8 py-4 border border-accent-400/30 text-white hover:bg-white/5 transition-colors btn-text"
            >
              <Phone className="h-3 w-3" />
              +41 22 700 0000
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 pt-12 border-t border-white/10">
            <p className="label-text text-accent-400/40 mb-8">
              Trusted by discerning clients worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-10 text-accent-300/30">
              <span className="text-[11px] font-normal tracking-[0.2em]">FIABCI</span>
              <span className="text-[11px] font-normal tracking-[0.2em]">EREN</span>
              <span className="text-[11px] font-normal tracking-[0.2em]">LPI</span>
              <span className="text-[11px] font-normal tracking-[0.2em]">RICS</span>
              <span className="text-[11px] font-normal tracking-[0.2em]">SVIT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
