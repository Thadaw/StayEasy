import { createRoot } from 'react-dom/client'
import { Providers } from './app/providers'
import './i18n'
import './index.css'
import App from './app/App'

createRoot(document.getElementById('root')!).render(
  <Providers>
    <App />
  </Providers>,
)
