import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  properties: [
    { name: "Luxury Homes", href: "/search?type=sale&luxury=true" },
    { name: "Penthouses", href: "/search?propertyType=penthouse" },
    { name: "Villas", href: "/search?propertyType=villa" },
    { name: "Historic Estates", href: "/search?style=historic" },
    { name: "New Developments", href: "/search?newDevelopment=true" },
  ],
  locations: [
    { name: "Paris", href: "/search?location=paris" },
    { name: "Monaco", href: "/search?location=monaco" },
    { name: "Milan", href: "/search?location=milan" },
    { name: "Barcelona", href: "/search?location=barcelona" },
    { name: "Vienna", href: "/search?location=vienna" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/team" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Contact", href: "/contact" },
  ],
  services: [
    { name: "Property Valuation", href: "/services/valuation" },
    { name: "Selling Your Property", href: "/sell" },
    { name: "Investment Advisory", href: "/services/investment" },
    { name: "Relocation Services", href: "/services/relocation" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary-950 text-accent-200">
      {/* Main Footer */}
      <div className="container mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-500 flex items-center justify-center">
                  <span className="text-primary-950 font-light text-base">C</span>
                </div>
                <span className="text-[11px] font-normal tracking-[0.3em] text-white uppercase">
                  Castello
                </span>
              </div>
            </Link>
            <p className="mt-8 text-[12px] text-accent-300/60 leading-relaxed max-w-xs tracking-wide">
              Curating exceptional properties across Europe since 1998.
              Your trusted partner in luxury real estate.
            </p>

            {/* Contact Info */}
            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-3 w-3 text-accent-500" />
                <span className="text-[12px] text-accent-200 tracking-wide">+41 22 700 0000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-3 w-3 text-accent-500" />
                <span className="text-[12px] text-accent-200 tracking-wide">enquiries@castello.international</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-3 w-3 text-accent-500 mt-0.5" />
                <span className="text-[12px] text-accent-200 tracking-wide leading-relaxed">
                  Place du Molard 8<br />
                  1204 Geneva, Switzerland
                </span>
              </div>
            </div>
          </div>

          {/* Properties */}
          <div>
            <h3 className="label-text text-accent-400 mb-6">
              Properties
            </h3>
            <ul className="space-y-3">
              {footerLinks.properties.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-accent-300/60 hover:text-white transition-colors tracking-wide"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="label-text text-accent-400 mb-6">
              Locations
            </h3>
            <ul className="space-y-3">
              {footerLinks.locations.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-accent-300/60 hover:text-white transition-colors tracking-wide"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="label-text text-accent-400 mb-6">
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-accent-300/60 hover:text-white transition-colors tracking-wide"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="label-text text-accent-400 mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-accent-300/60 hover:text-white transition-colors tracking-wide"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-800/50">
        <div className="container mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-[10px] text-accent-400/40 tracking-wider">
              &copy; {new Date().getFullYear()} Castello International SA. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <Link
                href="/privacy"
                className="text-[10px] text-accent-400/40 hover:text-accent-300 transition-colors tracking-wider uppercase"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-[10px] text-accent-400/40 hover:text-accent-300 transition-colors tracking-wider uppercase"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="text-[10px] text-accent-400/40 hover:text-accent-300 transition-colors tracking-wider uppercase"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
