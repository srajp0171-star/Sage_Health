import { Leaf } from 'lucide-react'
import { AGENCY } from '@/data/agency'

export const Footer = () => {
  return (
    <footer className="bg-dark-sidebar border-t border-dark-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-5 h-5 text-sage" />
              <span className="font-display text-lg text-white">{AGENCY.name}</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">{AGENCY.tagline}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Contact</h4>
            <p className="text-sm text-gray-400">{AGENCY.email}</p>
            <p className="text-sm text-gray-400">{AGENCY.phone}</p>
            <p className="text-sm text-gray-400">{AGENCY.address}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
            <a href="/configure" className="text-sm text-gray-400 hover:text-sage block mb-1">Configure Solution</a>
            <a href="/admin" className="text-sm text-gray-400 hover:text-sage block mb-1">Admin Panel</a>
            <a href={`https://${AGENCY.website}`} className="text-sm text-gray-400 hover:text-sage block">{AGENCY.website}</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-dark-border text-center text-xs text-gray-600">
          © {new Date().getFullYear()} {AGENCY.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
