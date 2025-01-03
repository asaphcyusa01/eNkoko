import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">eNkoko</h3>
            <p className="text-primary-100">
              Guha aborora inkoko ubumenyi, ibikoresho, n'ibicuruzwa by'umwimerere.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Aho Kujya</h4>
            <ul className="space-y-2">
              <li><a href="/elearning" className="text-primary-100 hover:text-white">Ihugure</a></li>
              <li><a href="/marketplace" className="text-primary-100 hover:text-white">Isoko</a></li>
              <li><a href="/hatchery" className="text-primary-100 hover:text-white">Imishwi</a></li>
              <li><a href="/contact" className="text-primary-100 hover:text-white">Twandikire</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Twandikire</h4>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>+250 788 123 456</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span>info@enkoko.com</span>
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Dukurikire</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-200">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-primary-200">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-primary-200">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-600 text-center">
          <p className="text-primary-100">© 2024 eNkoko. Uburenganzira bwose burafitwe.</p>
        </div>
      </div>
    </footer>
  );
}