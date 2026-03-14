'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';

const navItems = [
  { label: 'Cars', href: '/cars' },
  { label: 'Offers', href: '/offers' },
  { label: 'Test Drive', href: '/test-drive' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      {/* Top bar */}
      <div className={`border-b transition-all duration-300 ${scrolled ? 'border-gray-100 bg-[#1a1a2e]' : 'border-white/10 bg-[#1a1a2e]'}`}>
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <p className="text-xs text-gray-300 tracking-widest uppercase font-body">
            Premium Nexa Experience
          </p>
          <a
            href="tel:+919876543210"
            className="flex items-center gap-2 text-xs text-[#c8a96e] tracking-wider font-body hover:text-white transition-colors"
          >
            <Phone size={12} />
            +91 98765 43210
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className={`max-w-7xl mx-auto px-6 py-4 flex items-center justify-between`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#c8a96e] flex items-center justify-center">
            <span className="font-display text-white font-bold text-sm">N</span>
          </div>
          <div>
            <span className={`font-display text-xl font-semibold tracking-wide transition-colors ${
              scrolled ? 'text-[#1a1a2e]' : 'text-white'
            }`}>
              NEXA
            </span>
            <span className={`block text-[10px] tracking-[0.25em] uppercase font-body leading-none transition-colors ${
              scrolled ? 'text-gray-500' : 'text-gray-300'
            }`}>
              Premium Cars
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link transition-colors ${
                scrolled ? 'text-gray-700' : 'text-white/90'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/cars" className="btn-gold text-xs py-2 px-5">
            Book Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className={`md:hidden transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="px-6 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link text-gray-800 py-2 border-b border-gray-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/cars" className="btn-gold text-center mt-2" onClick={() => setOpen(false)}>
              Book Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
