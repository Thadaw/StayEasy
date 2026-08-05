import { ReactNode } from 'react'
import BuildingScene from '../../../shared/components/BuildingScene'

interface AuthLayoutProps {
  mode: 'login' | 'signup'
  children: ReactNode
  passwordFocused?: boolean
  passwordVisible?: boolean
  fieldsReady?: boolean
  loginClicked?: boolean
}

export function AuthLayout({ mode, children, passwordFocused = false, passwordVisible = true, fieldsReady = false, loginClicked = false }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#e8e8e8] flex items-center justify-center p-5 font-jakarta">
      <div className="w-[640px] h-[440px] bg-white rounded-2xl flex overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.13)]">
        <div className={`w-1/2 bg-[#dde0ee] shrink-0 ${mode === 'login' ? 'order-1' : 'order-2'}`}>
          <BuildingScene
            mode={mode}
            passwordFocused={passwordFocused}
            passwordVisible={passwordVisible}
            fieldsReady={fieldsReady}
            loginClicked={loginClicked}
          />
        </div>
        <div className={`w-1/2 bg-white flex flex-col justify-center py-9 px-8 shrink-0 ${mode === 'login' ? 'order-2' : 'order-1 custom-scroll overflow-y-auto'}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
