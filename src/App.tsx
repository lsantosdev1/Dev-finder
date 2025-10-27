// src/App.tsx
import { useState } from 'react';
import Footer from './components/Footer';

// Interface para definir o formato dos dados do usuário do GitHub
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
  // Estados principais da aplicação
  const [username, setUsername] = useState(''); // armazena o nome digitado
  const [userData, setUserData] = useState<GithubUser | null>(null); // dados do usuário buscado
  const [loading, setLoading] = useState(false); // controla o carregamento
  const [error, setError] = useState<string | null>(null); // armazena erros

  // Função executada ao clicar em "Buscar"
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setUserData(null);
    setError(null);

    try {
      // Faz requisição à API do GitHub
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (response.status === 404) {
        throw new Error('Usuário não encontrado.');
      }
      if (!response.ok) {
        throw new Error('Ocorreu um erro ao buscar os dados.');
      }

      // Converte o retorno da API em JSON
      const data: GithubUser = await response.json();
      setUserData(data); // salva os dados no estado
    } catch (err: any) {
      setError(err.message); // exibe mensagem de erro
    } finally {
      setLoading(false); // encerra o carregamento
    }
  };

  return (
    // Layout principal da página
    <div className="min-h-screen flex flex-col items-center text-white p-4 font-sans bg-gradient-to-b from-black via-gray-900 to-red-900">
      <main className="w-full max-w-md flex flex-col items-center pt-16 sm:pt-20 flex-grow">
        {/* Título */}
        <h1 className="text-4xl sm:text-5xl font-bold text-red-600 text-center">Dev-Finder</h1>
        <p className="text-gray-400 mt-2 mb-8 text-center">Encontre perfis no GitHub.</p>
        
        {/* Campo de busca */}
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
            className="bg-red-600 hover:bg-red-700 rounded-lg px-6 py-2 font-bold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={!username || loading}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {/* Exibição dos resultados */}
        <div className="w-full">
          {loading && <p className="text-center">Carregando...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* Se tiver dados, mostra o perfil */}
          {userData && (
            <div className="bg-gray-800 p-6 rounded-lg w-full">
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar com borda vermelha */}
                <img 
                  src={userData.avatar_url} 
                  alt={`Avatar de ${userData.name}`} 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-red-600" 
                />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{userData.name}</h2>
                  {/* Link do perfil do GitHub */}
                  <a 
                    href={userData.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-red-500 hover:underline"
                  >
                    @{userData.login}
                  </a>
                </div>
              </div>

              {/* Bio do usuário */}
              <p className="text-gray-300">{userData.bio || 'Este usuário não possui uma bio.'}</p>

              {/* Estatísticas do GitHub */}
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
      
      {/* Rodapé */}
      <Footer />
    </div>
  );
}

export default App;
