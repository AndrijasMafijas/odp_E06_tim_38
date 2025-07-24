import { PročitajVrednostPoKljuču, ObrišiVrednostPoKljuču } from "../../helpers/local_storage"

type KontrolnaTablaProps = {
  onLogout: () => void
}

export default function KontrolnaTabla({ onLogout }: KontrolnaTablaProps) {
  const token = PročitajVrednostPoKljuču("authToken")

  if (!token || !token.includes("/")) {
    onLogout();
    return; // nije prijavljen
  }

  const [korisnickoIme, id] = token.split("/")

  const handleLogout = () => {
    ObrišiVrednostPoKljuču("authToken")
    onLogout()
  }

  return (
    <div className="form-container">
      <h1>Контролна табла</h1>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Корисничко име:</strong> {korisnickoIme}</p>
      <p><strong>Датум и време:</strong> {new Date().toLocaleString()}</p>
      <button onClick={handleLogout}>Напусти контролну таблу</button>
    </div>
  )
}
