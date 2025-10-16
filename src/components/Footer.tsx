// src/components/Footer.tsx

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full text-center p-4 mt-auto text-gray-500 text-sm">
      <p>
        © {currentYear} | Desenvolvido por{' '}
        <a 
          href="https://github.com/luanjob" 
          target="_blank" 
          rel="noopener noreferrer"
          // 👇 Efeito hover agora em vermelho
          className="font-bold text-gray-400 hover:text-red-500 transition-colors"
        >
          Luan Santos
        </a>
      </p>
    </footer>
  );
};

export default Footer;