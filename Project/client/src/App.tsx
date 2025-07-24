import { useState, useEffect } from 'react'
import { PročitajVrednostPoKljuču } from './helpers/local_storage'
import KontrolnaTabla from './components/kontrolna_tabla/KontrolnaTabla'
import AutentifikacionaForma from './components/autentifikacija/AutentifikacionaForma'
import { authApi } from './api_services/auth/AuthAPIService';

function App() {
  const [prijavljen, setPrijavljen] = useState<boolean>(false);

  useEffect(() => {
    const token = PročitajVrednostPoKljuču('authToken')
    if (token && token.includes('/')) {
      setPrijavljen(true)
    }
  }, [])

  return prijavljen ? (
    <KontrolnaTabla onLogout={() => setPrijavljen(false)} />
  ) : (
    <AutentifikacionaForma
      authApi={authApi}
      onLoginSuccess={() => setPrijavljen(true)}
    />
  )
}

export default App;