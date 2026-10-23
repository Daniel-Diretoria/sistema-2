import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { LogOut, ShieldCheck, Sparkles, Building2 } from 'lucide-react'

export default function Dashboard() {
  const { user, signOut, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true })
    }
  }, [user, loading, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#1E3A5F] border-t-transparent" />
          <p className="text-sm font-medium text-[#64748B]">Carregando painel...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userEmail = user.email || 'Usuário'

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F8FA]">
      {/* Top navigation bar */}
      <header className="border-b border-[#E2E8F0] bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hexagonal Gold Logo Mark */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E3A5F]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="text-[#C9A227]"
              >
                <path
                  d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
                  stroke="#C9A227"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" fill="#C9A227" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-semibold tracking-wide text-[#1E3A5F]">
                Diretoria Promoções
              </span>
              <p className="text-xs text-[#64748B]">Gestão de Promoções & Marketing</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-semibold text-[#1E3A5F] transition-all hover:bg-[#F1F5F9] hover:border-[#1E3A5F] active:scale-95"
          >
            <LogOut className="h-4 w-4 text-[#DC2626]" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Main content area */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-lg md:p-12 animate-card-entrance">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E3A5F]/10 text-[#C9A227]">
            <Sparkles className="h-8 w-8 text-[#C9A227]" />
          </div>

          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#1E3A5F]/5 px-3 py-1 text-xs font-semibold text-[#1E3A5F]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
            Sessão autenticada
          </div>

          <h1 className="mt-3 text-2xl font-bold text-[#1A202C] md:text-3xl">
            Bem-vindo à Diretoria Promoções!
          </h1>

          <p className="mt-3 text-sm text-[#64748B] md:text-base">
            Você está conectado como{' '}
            <span className="font-semibold text-[#1E3A5F]">{userEmail}</span>.
          </p>

          <div className="mt-8 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-left">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-[#1E3A5F] mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-[#1A202C]">Painel Corporativo</h3>
                <p className="mt-1 text-xs text-[#64748B]">
                  Seu acesso à gestão de campanhas e ações promocionais foi validado com sucesso
                  pelo serviço de autenticação corporativo.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSignOut}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#1E3A5F] px-8 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#17304D] hover:-translate-y-0.5 hover:shadow-lg active:scale-98 focus:outline-none focus:ring-3 focus:ring-[#C9A227]/30"
            >
              <LogOut className="h-4 w-4" />
              Encerrar sessão
            </button>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-[#64748B]">
        © {new Date().getFullYear()} Diretoria Promoções. Todos os direitos reservados.
      </footer>
    </div>
  )
}
