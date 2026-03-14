import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#c8a96e] flex items-center justify-center">
              <span className="font-display text-white font-bold text-sm">N</span>
            </div>
            <span className="font-display text-2xl font-semibold">NEXA</span>
          </div>
          <p className="font-body text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
            Experience the pinnacle of automotive excellence. Maruti Suzuki&apos;s premium channel
            offering world-class cars with a bespoke ownership experience.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-9 h-9 border border-gray-700 flex items-center justify-center hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-9 h-9 border border-gray-700 flex items-center justify-center hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors">
              <Facebook size={16} />
            </a>
            <a href="#" className="w-9 h-9 border border-gray-700 flex items-center justify-center hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors">
              <Youtube size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-body text-xs tracking-[0.2em] uppercase text-[#c8a96e] mb-6">
            Quick Links
          </h4>
          <ul className="space-y-3">
            {[
              { label: 'Our Cars', href: '/cars' },
              { label: 'Current Offers', href: '/offers' },
              { label: 'Book Test Drive', href: '/test-drive' },
              { label: 'Contact Us', href: '/contact' },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-body text-sm text-gray-400 hover:text-[#c8a96e] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-body text-xs tracking-[0.2em] uppercase text-[#c8a96e] mb-6">
            Contact
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={14} className="text-[#c8a96e] mt-1 flex-shrink-0" />
              <span className="font-body text-sm text-gray-400 leading-relaxed">
                123 Premium Auto Park,<br />MG Road, Bangalore – 560001
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={14} className="text-[#c8a96e] flex-shrink-0" />
              <a href="tel:+919876543210" className="font-body text-sm text-gray-400 hover:text-white transition-colors">
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={14} className="text-[#c8a96e] flex-shrink-0" />
              <a href="mailto:hello@nexacars.in" className="font-body text-sm text-gray-400 hover:text-white transition-colors">
                hello@nexacars.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-gray-500">
            © {new Date().getFullYear()} Nexa Cars. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="font-body text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="font-body text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
