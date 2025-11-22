'use client'

import { motion } from 'framer-motion'
import { Rocket, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="relative py-16 px-4 bg-[#0A1628] border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] via-[#06B6D4] to-[#7C3AED] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold gradient-text">SINSAJO</h3>
                <p className="text-xs text-gray-400">CREATORS</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {t.footer.about}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Facebook className="w-4 h-4 text-gray-400" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Twitter className="w-4 h-4 text-gray-400" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Linkedin className="w-4 h-4 text-gray-400" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Column 2 - Services */}
          <div>
            <h4 className="font-bold text-white mb-4">{t.footer.services}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {t.footer.servicesList.map((service, index) => (
                <li key={index}><a href="#" className="hover:text-[#F59E0B] transition-colors">{service}</a></li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h4 className="font-bold text-white mb-4">{t.footer.resources}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {t.footer.resourcesList.map((resource, index) => (
                <li key={index}><a href="#" className="hover:text-[#F59E0B] transition-colors">{resource}</a></li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 className="font-bold text-white mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0 text-[#F59E0B]" />
                <a href="mailto:sales@sinsajocreators.com" className="hover:text-[#F59E0B] transition-colors">
                  sales@sinsajocreators.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0 text-[#F59E0B]" />
                <a href="tel:+16092885466" className="hover:text-[#F59E0B] transition-colors">
                  +1 (609) 288-5466
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-[#F59E0B]" />
                <span>
                  Iowa
                  <br />
                  United States
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            {t.footer.copyright}
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            {t.footer.legal.map((item, index) => (
              <a key={index} href="#" className="hover:text-[#F59E0B] transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
