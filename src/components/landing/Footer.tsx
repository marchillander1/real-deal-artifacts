
import React from 'react';
import Logo from '@/components/Logo';

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-slate-700 bg-slate-900/80 py-12 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="text-slate-400 mt-4">
              Human-first AI matching that delivers 96% fit in 12 seconds.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href = '/pricing'}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Pricing
                </button>
              </li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400">© 2024 MatchWise AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
