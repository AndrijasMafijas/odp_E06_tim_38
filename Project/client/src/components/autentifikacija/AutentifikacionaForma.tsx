/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect } from "react";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";

import { useLocation, useNavigate } from "react-router-dom";

const AutentifikacionaForma: React.FC<AuthFormProps> = ({ authApi, onLoginSuccess }) => {
	const [korisnickoIme, setKorisnickoIme] = useState("");
	const [lozinka, setLozinka] = useState("");
	const [email, setEmail] = useState("");
	const [greska, setGreska] = useState<string | undefined>(undefined);
	const [uspesno, setUspesno] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const [mode, setMode] = useState<"login" | "register">(() => {
		if (location.pathname === "/signup") return "register";
		return "login";
	});

	// Sync mode with URL
	useEffect(() => {
		if (location.pathname === "/signup" && mode !== "register") setMode("register");
		if (location.pathname === "/login" && mode !== "login") setMode("login");
	}, [location.pathname, mode]);

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
							onLoginSuccess(res.data, res.token);
						} else {
							setGreska(res.message);
						}
					} else {
						const res = await authApi.registracija(korisnickoIme, lozinka, email);
						if (res.success) {
							setUspesno("Uspešna registracija!");
							setGreska(undefined);
							// Automatski prijavi korisnika nakon registracije
							const loginRes = await authApi.prijava(korisnickoIme, lozinka);
							if (loginRes.success) {
								onLoginSuccess(loginRes.data, loginRes.token);
							} else {
								navigate("/login");
							}
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
			<div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
				<h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
					{mode === "login" ? "Prijava" : "Registracija"}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block mb-1 text-gray-700 dark:text-gray-200">Korisničko ime</label>
						<input
							type="text"
							className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={korisnickoIme}
							onChange={e => setKorisnickoIme(e.target.value)}
							autoComplete="username"
							required
						/>
					</div>
					<div>
						<label className="block mb-1 text-gray-700 dark:text-gray-200">Lozinka</label>
						<input
							type="password"
							className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={lozinka}
							onChange={e => setLozinka(e.target.value)}
							autoComplete={mode === "login" ? "current-password" : "new-password"}
							required
						/>
					</div>
					{mode === "register" && (
						<div>
							<label className="block mb-1 text-gray-700 dark:text-gray-200">Email</label>
							<input
								type="email"
								className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
				<div className="mt-4 text-center text-gray-600 dark:text-gray-300">
					{mode === "login" ? (
						<>
							Nemate nalog?{' '}
							<button
								className="text-blue-600 dark:text-blue-400 hover:underline"
								onClick={() => {
									setMode("register");
									setGreska(undefined);
									setUspesno(undefined);
									navigate("/signup");
								}}
							>
								Registrujte se
							</button>
						</>
					) : (
						<>
							Već imate nalog?{' '}
							<button
								className="text-blue-600 dark:text-blue-400 hover:underline"
								onClick={() => {
									setMode("login");
									setGreska(undefined);
									setUspesno(undefined);
									navigate("/login");
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
