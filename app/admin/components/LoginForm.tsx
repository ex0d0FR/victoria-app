'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import { loginAction } from '../actions'

export function LoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await loginAction(password)
      if (res.success) {
        router.refresh()
      } else {
        setError(res.error || 'Mot de passe incorrect.')
      }
    } catch {
      setError('Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-cream-300 p-8 sm:p-10 shadow-sm space-y-8 animate-fade-up">
        {/* Brand */}
        <div className="text-center space-y-2">
          <p className="label-sm text-gold-600">Espace Privé</p>
          <h1 className="font-serif text-2xl sm:text-3xl text-ink-900">
            Victoria Reindale
          </h1>
          <p className="text-xs text-ink-500">
            Gestion du site & des contenus
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label-sm block mb-2 text-ink-700">
              Mot de passe administrateur
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="form-input pr-10 tracking-widest text-sm"
                autoFocus
              />
              <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 p-3 border border-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center text-xs flex items-center gap-2"
          >
            <span>{loading ? 'Connexion en cours…' : 'Accéder au tableau de bord'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="pt-4 border-t border-cream-200 flex items-center justify-center gap-1.5 text-[11px] text-ink-400">
          <ShieldCheck size={13} className="text-green-600" />
          <span>Accès sécurisé réservé à l&apos;artiste et son équipe</span>
        </div>
      </div>
    </div>
  )
}
