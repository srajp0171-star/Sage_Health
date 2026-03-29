import { Link, useLocation } from 'react-router-dom'
import { Leaf, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { clsx } from 'clsx'

export const Navbar = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-base/80 backdrop-blur-xl border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="Sage Tech Solutions home">
            <Leaf className="w-6 h-6 text-sage group-hover:rotate-12 transition-transform" />
            <span className="font-display text-lg text-white">sage tech</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {isHome && (
              <>
                <a href="#modules" className="text-sm text-gray-400 hover:text-white transition-colors">All Modules</a>
                <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</a>
                <a href="#comparison" className="text-sm text-gray-400 hover:text-white transition-colors">Compare</a>
              </>
            )}
            <Link to="/configure">
              <Button size="sm">Start Configuring →</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-gray-400 hover:text-white" aria-label="Toggle menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 pt-2 border-t border-dark-border mt-2 flex flex-col gap-3">
            {isHome && (
              <>
                <a href="#modules" className="text-sm text-gray-400 hover:text-white px-2 py-1" onClick={() => setOpen(false)}>All Modules</a>
                <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white px-2 py-1" onClick={() => setOpen(false)}>How It Works</a>
              </>
            )}
            <Link to="/configure" onClick={() => setOpen(false)}>
              <Button size="sm" fullWidth>Start Configuring →</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
