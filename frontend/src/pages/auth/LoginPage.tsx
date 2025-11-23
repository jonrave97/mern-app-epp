import { useLogin } from '@hooks/auth/useLoginForm';
import { usePageTitle } from '@hooks/page/usePageTitle';

function LoginPage() {

    usePageTitle("Login");

    // Usamos el hook personalizado para manejar el login
    const { 
        email, setEmail, 
        password, setPassword, 
        loading, error, success, 
        isBlocked, remainingTime, attemptsRemaining,
        handleLogin 
    } = useLogin();
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

                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className={`border px-4 py-3 rounded-lg ${
                                isBlocked 
                                    ? 'bg-orange-100 border-orange-400 text-orange-700'
                                    : 'bg-red-100 border-red-400 text-red-700'
                            }`}>
                                <div className="flex items-center gap-2">
                                    {isBlocked ? (
                                        <span className="text-lg">🔒</span>
                                    ) : (
                                        <span className="text-lg">❌</span>
                                    )}
                                    <div>
                                        <p className="font-medium">{error}</p>
                                        {isBlocked && remainingTime > 0 && (
                                            <p className="text-sm mt-1">
                                                Tiempo restante: {Math.floor(remainingTime / 60)} minutos {remainingTime % 60} segundos
                                            </p>
                                        )}
                                        {!isBlocked && attemptsRemaining !== null && attemptsRemaining > 0 && (
                                            <p className="text-sm mt-1">
                                                ⚠️ Te quedan {attemptsRemaining} intento{attemptsRemaining !== 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                                ✅ Login exitoso
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="correo@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-200"
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-200"
                            />
                            <a href="/forgot-password" className="text-sm text-gray-600 hover:underline">Olvidaste tu contraseña?</a>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || isBlocked}
                            className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 ${
                                isBlocked 
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    : loading
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        : 'bg-primary text-white cursor-pointer hover:bg-primary-dark'
                            }`}
                        >
                            {isBlocked 
                                ? '🔒 Cuenta Bloqueada'
                                : loading 
                                    ? 'Iniciando sesión...' 
                                    : 'Iniciar Sesión'
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;