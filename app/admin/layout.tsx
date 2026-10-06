import Link from 'next/link'
import { ArrowLeft, LogOut, Shield } from 'lucide-react'
import { isAuthenticated } from './auth'
import { logoutAction } from './actions'

export const metadata = {
  title: 'Administration — Victoria Reindale',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthed = await isAuthenticated()

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col font-sans text-ink-900">
      {/* Admin Top Navigation */}
      <header className="bg-white border-b border-cream-300 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-medium text-ink-500 hover:text-ink-900 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Retour au site</span>
            </Link>
            <span className="text-cream-300">|</span>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-medium text-ink-900">
                Victoria Reindale
              </span>
              <span className="px-2 py-0.5 bg-gold-50 text-gold-700 text-[10px] uppercase tracking-wider font-semibold border border-gold-200">
                Administration
              </span>
            </div>
          </div>

          {isAuthed && (
            <div className="flex items-center gap-4">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-xs text-ink-500 hover:text-red-600 flex items-center gap-1.5 transition-colors py-1.5 px-3 hover:bg-red-50 rounded"
                >
                  <LogOut size={13} />
                  <span>Déconnexion</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-cream-300 bg-white/50 py-4 text-center text-xs text-ink-400">
        <p>Espace de gestion autonome — Victoria Reindale Soprano</p>
      </footer>
    </div>
  )
}
