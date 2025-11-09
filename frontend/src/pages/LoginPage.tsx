import { useState } from "react";

function LoginPage() {
    //Definimos el estado para los campos del formulario
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // Definimos la función para manejar el envío del formulario
    const handleSubmit = (event: React.FormEvent) => {
    console.log("Formulario enviado");
    console.log("Email:", email, "Contraseña:", password);
    event.preventDefault();
    // Aquí puedes agregar la lógica para manejar el inicio de sesión
};
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img
                        src="/kaltire.png"
                        alt="Kaltire Logo"
                        className="mx-auto h-16 w-auto mb-4"
                    />
                </div>

                {/* Formulario */}
                <div className="bg-white shadow-2xl rounded-xl px-8 py-10">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
                        <p className="text-gray-600">Ingresa tus credenciales para acceder a tu cuenta</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="correo@correo.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;