
import React, { useState } from "react";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";

const AutentifikacionaForma: React.FC<AuthFormProps> = ({ authApi, onLoginSuccess }) => {
	const [korisnickoIme, setKorisnickoIme] = useState("");
	const [lozinka, setLozinka] = useState("");
	const [email, setEmail] = useState("");
	const [greska, setGreska] = useState<string | undefined>(undefined);
	const [uspesno, setUspesno] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [mode, setMode] = useState<"login" | "register">("login");

		const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setGreska(undefined);
		setUspesno(undefined);
		setLoading(true);
		const validacija =
			mode === "login"
				? validacijaPodatakaAuth(korisnickoIme, lozinka)
				: validacijaPodatakaAuth(korisnickoIme, lozinka, email);
		if (!validacija.uspesno) {
			setGreska(validacija.poruka);
			setLoading(false);
			return;
		}
		try {
					if (mode === "login") {
						const res = await authApi.prijava(korisnickoIme, lozinka);
						if (res.success) {
							setUspesno("Uspešna prijava!");
							setGreska(undefined);
							onLoginSuccess(res.data); // prosleđuje podatke o korisniku
						} else {
							setGreska(res.message);
						}
					} else {
						const res = await authApi.registracija(korisnickoIme, lozinka, email);
						if (res.success) {
							setUspesno("Uspešna registracija! Možete se prijaviti.");
							setGreska(undefined);
							setMode("login");
						} else {
							setGreska(res.message);
						}
					}
		} catch (err) {
			setGreska("Došlo je do greške. Pokušajte ponovo.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
			<h2 className="text-2xl font-bold mb-4 text-center">
				{mode === "login" ? "Prijava" : "Registracija"}
			</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block mb-1">Korisničko ime</label>
					<input
						type="text"
						className="w-full border rounded px-3 py-2"
						value={korisnickoIme}
						onChange={e => setKorisnickoIme(e.target.value)}
						autoComplete="username"
						required
					/>
				</div>
				<div>
					<label className="block mb-1">Lozinka</label>
					<input
						type="password"
						className="w-full border rounded px-3 py-2"
						value={lozinka}
						onChange={e => setLozinka(e.target.value)}
						autoComplete={mode === "login" ? "current-password" : "new-password"}
						required
					/>
				</div>
				{mode === "register" && (
					<div>
						<label className="block mb-1">Email</label>
						<input
							type="email"
							className="w-full border rounded px-3 py-2"
							value={email}
							onChange={e => setEmail(e.target.value)}
							autoComplete="email"
							required
						/>
					</div>
				)}
				{greska && <div className="text-red-600 text-sm">{greska}</div>}
				{uspesno && <div className="text-green-600 text-sm">{uspesno}</div>}
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
					disabled={loading}
				>
					{loading ? "Obrada..." : mode === "login" ? "Prijavi se" : "Registruj se"}
				</button>
			</form>
			<div className="mt-4 text-center">
				{mode === "login" ? (
					<>
						Nemate nalog?{' '}
						<button
							className="text-blue-600 hover:underline"
							onClick={() => {
								setMode("register");
								setGreska(undefined);
								setUspesno(undefined);
							}}
						>
							Registrujte se
						</button>
					</>
				) : (
					<>
						Već imate nalog?{' '}
						<button
							className="text-blue-600 hover:underline"
							onClick={() => {
								setMode("login");
								setGreska(undefined);
								setUspesno(undefined);
							}}
						>
							Prijavite se
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default AutentifikacionaForma;
