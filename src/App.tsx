// src/App.tsx
import { useState } from 'react';
import Footer from './components/Footer';

interface GithubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setUserData(null);
    setError(null);

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (response.status === 404) {
        throw new Error('Usuário não encontrado.');
      }
      if (!response.ok) {
        throw new Error('Ocorreu um erro ao buscar os dados.');
      }
      const data: GithubUser = await response.json();
      setUserData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="bg-black min-h-screen flex flex-col items-center text-white p-4 font-sans">
      <main className="w-full max-w-md flex flex-col items-center pt-16 sm:pt-20 flex-grow">
        {/* 👇 Título em vermelho */}
        <h1 className="text-4xl sm:text-5xl font-bold text-red-600 text-center">Dev-Finder</h1>
        <p className="text-gray-400 mt-2 mb-8 text-center">Encontre perfis no GitHub.</p>
        
        <form onSubmit={handleSearch} className="flex gap-2 w-full mb-8">
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite um username do GitHub..."
            
            className="flex-grow bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button 
            type="submit"
            // 👇 Botão em vermelho
            className="bg-red-600 hover:bg-red-700 rounded-lg px-6 py-2 font-bold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={!username || loading}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        <div className="w-full">
          {loading && <p className="text-center">Carregando...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {userData && (
            <div className="bg-gray-800 p-6 rounded-lg w-full">
              <div className="flex items-center gap-4 mb-4">
                {/* 👇 Borda do avatar  em vermelho */}
                <img src={userData.avatar_url} alt={`Avatar de ${userData.name}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-red-600" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{userData.name}</h2>
                  {/* 👇 Link do @username em vermelho */}
                  <a href={userData.html_url} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">@{userData.login}</a>
                </div>
              </div>
              <p className="text-gray-300">{userData.bio || 'Este usuário não possui uma bio.'}</p>
              <div className="mt-4 flex justify-around bg-black p-4 rounded-lg text-center">
                <div>
                  <span className="block font-bold text-lg sm:text-xl">{userData.public_repos}</span>
                  <span className="text-xs sm:text-sm text-gray-400">Repositórios</span>
                </div>
                <div>
                  <span className="block font-bold text-lg sm:text-xl">{userData.followers}</span>
                  <span className="text-xs sm:text-sm text-gray-400">Seguidores</span>
                </div>
                <div>
                  <span className="block font-bold text-lg sm:text-xl">{userData.following}</span>
                  <span className="text-xs sm:text-sm text-gray-400">Seguindo</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;