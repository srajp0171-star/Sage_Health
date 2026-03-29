import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import LandingPage from '@/pages/LandingPage'
import ConfigurePage from '@/pages/ConfigurePage'
import AdminPage from '@/pages/AdminPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell><LandingPage /></AppShell>} />
        <Route path="/configure" element={<AppShell showFooter={false}><ConfigurePage /></AppShell>} />
        <Route path="/admin" element={<AppShell showFooter={false}><AdminPage /></AppShell>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
