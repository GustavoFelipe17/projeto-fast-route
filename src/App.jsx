import { useState, useEffect } from 'react';
import { FaUser, FaIdCard, FaEnvelope, FaPhoneAlt, FaLock } from 'react-icons/fa';
import Dashboard from './Dashboard';

function App() {
  const [aba, setAba] = useState('login');
  const [logado, setLogado] = useState(false);
  const [animando, setAnimando] = useState(false);

  const trocarAba = (novaAba) => {
    if (novaAba === aba) return;
    setAnimando(true);
    setTimeout(() => {
      setAba(novaAba);
      setAnimando(false);
    }, 200);
  };

  const [typedText, setTypedText] = useState('');
  const fullText = 'Bem-Vindo a Fast Route';

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(typingInterval);
    }, 80);
    return () => clearInterval(typingInterval);
  }, []);

  if (logado) return <Dashboard onLogout={() => setLogado(false)} />;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/background_principal.jpeg')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '100% 100%',
      }}
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <div className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-2 leading-tight">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-4">
            {typedText}
            <span className="animate-pulse">|</span>
          </h1>
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Acesso ao Sistema
        </h2>

        <div className="flex mb-6 bg-gray-100 rounded-xl overflow-hidden">
          <button
            onClick={() => trocarAba('login')}
            className={`w-1/2 py-2 text-sm font-medium border ${
              aba === 'login'
                ? 'bg-white text-blue-600 border-blue-500'
                : 'border-transparent text-gray-500'
            } rounded-l-xl`}
          >
            Login
          </button>
          <button
            onClick={() => trocarAba('cadastro')}
            className={`w-1/2 py-2 text-sm font-medium border ${
              aba === 'cadastro'
                ? 'bg-white text-blue-600 border-blue-500'
                : 'border-transparent text-gray-500'
            } rounded-r-xl`}
          >
            Cadastro
          </button>
        </div>

        <div className={`transition-all duration-300 ease-in-out transform ${animando ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
          {aba === 'login' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLogado(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" required className="w-full px-4 py-2 mt-1 rounded-lg bg-blue-50 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Senha</label>
                <input type="password" required className="w-full px-4 py-2 mt-1 rounded-lg bg-blue-50 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">Entrar</button>
            </form>
          )}

          {aba === 'cadastro' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLogado(true);
              }}
              className="space-y-4"
            >
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input type="text" required placeholder="Nome Completo" className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div className="relative">
                <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input type="text" required placeholder="000.000.000-00" className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input type="email" required placeholder="seu@email.com" className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div className="relative">
                <FaPhoneAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input type="tel" required placeholder="(00) 00000-0000" className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input type="password" required placeholder="Senha" className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">Cadastrar</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
