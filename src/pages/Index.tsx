import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Mail, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react'

export default function Index() {
  const { user, signIn, resetPassword, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Mode: 'login' | 'recovery' | 'recovery-success'
  const [mode, setMode] = useState<'login' | 'recovery' | 'recovery-success'>('login')

  // Form states
  const [email, setEmail] = useState('daniel@diretoriapromocoes.com.br')
  const [password, setPassword] = useState('Skip@Pass')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  // Validation states
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [errorShakeKey, setErrorShakeKey] = useState(0)

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, authLoading, navigate])

  // Validation helpers
  const validateEmail = (val: string): boolean => {
    if (!val.trim()) {
      setEmailError('Informe um e-mail válido.')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(val.trim())) {
      setEmailError('Informe um e-mail válido.')
      return false
    }
    setEmailError(null)
    return true
  }

  const validatePassword = (val: string): boolean => {
    if (!val) {
      setPasswordError('Informe sua senha.')
      return false
    }
    setPasswordError(null)
    return true
  }

  const handleEmailBlur = () => {
    if (email) {
      validateEmail(email)
    }
  }

  const handlePasswordBlur = () => {
    if (password) {
      validatePassword(password)
    }
  }

  // Submit handler for login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)

    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await signIn(email.trim(), password, rememberMe)

      if (error) {
        // Distinguish network/timeout vs invalid credentials
        const message = error.message?.toLowerCase() || ''
        if (
          message.includes('fetch') ||
          message.includes('network') ||
          message.includes('connection') ||
          message.includes('failed to fetch')
        ) {
          setAuthError('Falha na conexão. Tente novamente.')
        } else {
          setAuthError('E-mail ou senha incorretos.')
        }
        setErrorShakeKey((prev) => prev + 1)
        setIsSubmitting(false)
      } else {
        // Success redirect
        navigate('/dashboard', { replace: true })
      }
    } catch {
      setAuthError('Falha na conexão. Tente novamente.')
      setErrorShakeKey((prev) => prev + 1)
      setIsSubmitting(false)
    }
  }

  // Submit handler for recovery
  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)

    const isEmailValid = validateEmail(email)
    if (!isEmailValid) {
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await resetPassword(email.trim())
      setIsSubmitting(false)

      if (error) {
        const message = error.message?.toLowerCase() || ''
        if (message.includes('network') || message.includes('fetch')) {
          setAuthError('Falha na conexão. Tente novamente.')
          setErrorShakeKey((prev) => prev + 1)
        } else {
          // Supabase still recommends showing success to prevent email enumeration,
          // or generic friendly notice
          setMode('recovery-success')
        }
      } else {
        setMode('recovery-success')
      }
    } catch {
      setIsSubmitting(false)
      setMode('recovery-success')
    }
  }

  // Reusable Hexagonal Gold Logo Mark
  const BrandLogo = ({ isDark = true }: { isDark?: boolean }) => (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
            stroke="#C9A227"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 6L18 9.5V14.5L12 18L6 14.5V9.5L12 6Z"
            fill="#C9A227"
            fillOpacity="0.25"
            stroke="#C9A227"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2" fill="#C9A227" />
        </svg>
      </div>
      <span
        className={`text-[22px] font-semibold tracking-[0.5px] ${
          isDark ? 'text-white' : 'text-[#1E3A5F]'
        }`}
      >
        Diretoria Promoções
      </span>
    </div>
  )

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-[#F7F8FA]">
      {/* BRAND PANEL (Desktop 45%, Tablet 35%, Hidden on Mobile) */}
      <aside className="relative hidden w-full overflow-hidden bg-[#1E3A5F] sm:flex sm:w-[35%] lg:w-[45%] flex-col justify-between p-10 lg:p-16 text-white select-none">
        {/* Soft Radial Gold Blobs (80px blur, rgba(201,162,39,0.15)) */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-[#C9A227]/15 blur-[80px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#C9A227]/15 blur-[80px]"
          aria-hidden="true"
        />

        {/* Top: Logo */}
        <div className="relative z-10">
          <BrandLogo isDark={true} />
        </div>

        {/* Center: Accent line + Headline & Subheadline */}
        <div className="relative z-10 my-auto py-12 max-w-md">
          {/* Gold Accent Line (4px width, rounded) */}
          <div className="mb-6 h-1 w-12 rounded-full bg-[#C9A227]" />

          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white lg:text-4xl">
            Bem-vindo de volta!
          </h1>
          <p className="mt-4 text-base font-normal leading-relaxed text-slate-300">
            Acesse o painel da Diretoria Promoções para gerenciar suas campanhas.
          </p>
        </div>

        {/* Bottom: Tagline */}
        <div className="relative z-10 border-t border-white/10 pt-6">
          <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            Gestão de Promoções & Marketing
          </p>
        </div>
      </aside>

      {/* FORM PANEL (Desktop 55%, Tablet 65%, Mobile 100%) */}
      <main className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 bg-[#F7F8FA]">
        {/* Mobile Header (0–640px) */}
        <div className="mb-8 flex justify-center sm:hidden">
          <BrandLogo isDark={false} />
        </div>

        {/* Centered Form Card */}
        <div className="mx-auto w-full max-w-[360px] sm:max-w-[340px] lg:max-w-[400px]">
          <div className="rounded-2xl bg-white p-7 sm:p-8 lg:p-10 shadow-sm border border-[#E2E8F0] animate-card-entrance">
            {/* Header depending on mode */}
            {mode === 'login' && (
              <div className="mb-7">
                <h2 className="text-[28px] font-semibold leading-tight text-[#1A202C]">
                  Entrar no sistema
                </h2>
                <p className="mt-2 text-sm text-[#64748B]">Acesse com seu e-mail corporativo.</p>
              </div>
            )}

            {mode === 'recovery' && (
              <div className="mb-7">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setAuthError(null)
                  }}
                  className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A5F] hover:text-[#C9A227] transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Voltar para o login
                </button>
                <h2 className="text-[28px] font-semibold leading-tight text-[#1A202C]">
                  Recuperar senha
                </h2>
                <p className="mt-2 text-sm text-[#64748B]">
                  Informe seu e-mail para receber as instruções de recuperação.
                </p>
              </div>
            )}

            {mode === 'recovery-success' && (
              <div className="py-4 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#16A34A]/10 text-[#16A34A] animate-scale-in">
                  <CheckCircle2 className="h-10 w-10 text-[#16A34A]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1A202C]">Link enviado</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                  Se o e-mail existir, enviaremos um link de recuperação.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setAuthError(null)
                  }}
                  className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#1E3A5F] text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[#17304D] hover:-translate-y-0.5 active:scale-98"
                >
                  Voltar para o login
                </button>
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} noValidate className="space-y-5">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#1A202C]">
                    E-mail
                  </label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-4 w-4 text-[#64748B]" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (emailError) validateEmail(e.target.value)
                      }}
                      onBlur={handleEmailBlur}
                      placeholder="seu@email.com"
                      className={`block h-12 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-[#1A202C] placeholder-[#64748B] transition-all duration-150 focus:outline-none ${
                        emailError
                          ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-3 focus:ring-[#DC2626]/15'
                          : 'border-[#D1D5DB] focus:border-[#C9A227] focus:ring-3 focus:ring-[#C9A227]/20'
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#DC2626]">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{emailError}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#1A202C]">
                    Senha
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (passwordError) validatePassword(e.target.value)
                      }}
                      onBlur={handlePasswordBlur}
                      placeholder="••••••••"
                      className={`block h-12 w-full rounded-lg border bg-white pl-3.5 pr-10 text-sm text-[#1A202C] placeholder-[#64748B] transition-all duration-150 focus:outline-none ${
                        passwordError
                          ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-3 focus:ring-[#DC2626]/15'
                          : 'border-[#D1D5DB] focus:border-[#C9A227] focus:ring-3 focus:ring-[#C9A227]/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#64748B] hover:text-[#1A202C] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#DC2626]">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{passwordError}</span>
                    </p>
                  )}
                </div>

                {/* Remember me & Forgot password row */}
                <div className="flex flex-col gap-2 pt-0.5 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer sr-only"
                      />
                      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border border-[#D1D5DB] bg-white transition-all duration-150 peer-checked:border-[#C9A227] peer-checked:bg-[#C9A227] peer-focus:ring-2 peer-focus:ring-[#C9A227]/30">
                        {rememberMe && (
                          <svg
                            className="h-3 w-3 text-white animate-scale-in"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="2.5 6 4.8 8.5 9.5 3.5" />
                          </svg>
                        )}
                      </span>
                    </span>
                    <span className="text-xs sm:text-sm text-[#1A202C]">Lembrar de mim</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('recovery')
                      setAuthError(null)
                    }}
                    className="text-xs sm:text-sm font-medium text-[#1E3A5F] hover:text-[#C9A227] transition-colors self-start sm:self-auto"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-[#1E3A5F] text-[15px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#17304D] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(30,58,95,0.25)] active:scale-[0.98] focus:outline-none focus:ring-3 focus:ring-[#C9A227]/30 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>Entrando...</span>
                    </span>
                  ) : (
                    <span>Entrar</span>
                  )}
                </button>

                {/* Inline error box */}
                {authError && (
                  <div
                    key={errorShakeKey}
                    className="flex items-center gap-2.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-3 text-sm text-[#DC2626] animate-shake"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
                    <span>{authError}</span>
                  </div>
                )}
              </form>
            )}

            {/* RECOVERY FORM */}
            {mode === 'recovery' && (
              <form onSubmit={handleRecoverySubmit} noValidate className="space-y-5">
                <div>
                  <label
                    htmlFor="recovery-email"
                    className="block text-sm font-medium text-[#1A202C]"
                  >
                    E-mail
                  </label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-4 w-4 text-[#64748B]" />
                    </div>
                    <input
                      id="recovery-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (emailError) validateEmail(e.target.value)
                      }}
                      onBlur={handleEmailBlur}
                      placeholder="seu@email.com"
                      className={`block h-12 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-[#1A202C] placeholder-[#64748B] transition-all duration-150 focus:outline-none ${
                        emailError
                          ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-3 focus:ring-[#DC2626]/15'
                          : 'border-[#D1D5DB] focus:border-[#C9A227] focus:ring-3 focus:ring-[#C9A227]/20'
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#DC2626]">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{emailError}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-[#1E3A5F] text-[15px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#17304D] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(30,58,95,0.25)] active:scale-[0.98] focus:outline-none focus:ring-3 focus:ring-[#C9A227]/30 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>Enviando link...</span>
                    </span>
                  ) : (
                    <span>Enviar link de recuperação</span>
                  )}
                </button>

                {authError && (
                  <div
                    key={errorShakeKey}
                    className="flex items-center gap-2.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-3 text-sm text-[#DC2626] animate-shake"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
                    <span>{authError}</span>
                  </div>
                )}
              </form>
            )}

            {/* Footer Support Text */}
            <div className="mt-8 border-t border-[#F1F5F9] pt-5 text-center">
              <p className="text-xs text-[#64748B]">
                Problemas para acessar?{' '}
                <a
                  href="mailto:suporte@diretoriapromocoes.com.br"
                  className="font-medium text-[#1E3A5F] underline decoration-transparent hover:decoration-[#1E3A5F] hover:text-[#C9A227] transition-colors"
                >
                  Fale com o suporte.
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
