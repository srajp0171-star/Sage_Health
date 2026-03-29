import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ToastContainer } from '@/components/ui/Toast'

interface AppShellProps {
  children: React.ReactNode
  showFooter?: boolean
}

export const AppShell = ({ children, showFooter = true }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-dark-base text-white font-body">
      <Navbar />
      <main className="pt-16">{children}</main>
      {showFooter && <Footer />}
      <ToastContainer />
    </div>
  )
}
