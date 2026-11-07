/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Menu, 
  User, 
  Heart, 
  Bookmark, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sun, 
  Moon, 
  BookMarked,
  Plus,
  SlidersHorizontal,
  CheckCircle2,
  Lock,
  Mail,
  Camera,
  LogOut,
  Gift,
  ShieldCheck,
  AlertCircle,
  Search,
  Sparkles,
  Share2,
  Star,
  Grid,
  Info,
  MessageSquare,
  Settings,
  Bell,
  DollarSign,
  Pencil,
  Download,
  Smartphone,
  Play
} from 'lucide-react';
import { db, auth } from './firebase';
import { usePWAInstall } from './usePWAInstall';
import bibleLogo from './assets/images/bible_logo_alt_1793581602427.jpg';

const OFFICIAL_URL = 'https://biblia-com-deus.vercel.app/';

const BIBLE_VERSIONS = [
  { id: 'NVI', name: 'NVI', fullName: 'Nova Versão Internacional' },
  { id: 'ARA', name: 'ARA', fullName: 'Almeida Revista e Atualizada' },
  { id: 'NVT', name: 'NVT', fullName: 'Nova Versão Transformadora' },
  { id: 'KJV', name: 'KJV', fullName: 'King James Version' },
  { id: 'ACF', name: 'ACF', fullName: 'Almeida Corrigida Fiel' },
  { id: 'ARC', name: 'ARC', fullName: 'Almeida Revista e Corrigida' },
];

const BIBLE_BOOKS = [
  { name: 'Gênesis', testament: 'Antigo', chapters: 50 },
  { name: 'Êxodo', testament: 'Antigo', chapters: 40 },
  { name: 'Levítico', testament: 'Antigo', chapters: 27 },
  { name: 'Números', testament: 'Antigo', chapters: 36 },
  { name: 'Deuteronômio', testament: 'Antigo', chapters: 34 },
  { name: 'Josué', testament: 'Antigo', chapters: 24 },
  { name: 'Juízes', testament: 'Antigo', chapters: 21 },
  { name: 'Rute', testament: 'Antigo', chapters: 4 },
  { name: '1 Samuel', testament: 'Antigo', chapters: 31 },
  { name: '2 Samuel', testament: 'Antigo', chapters: 24 },
  { name: '1 Reis', testament: 'Antigo', chapters: 22 },
  { name: '2 Reis', testament: 'Antigo', chapters: 25 },
  { name: '1 Crônicas', testament: 'Antigo', chapters: 29 },
  { name: '2 Crônicas', testament: 'Antigo', chapters: 36 },
  { name: 'Esdras', testament: 'Antigo', chapters: 10 },
  { name: 'Neemias', testament: 'Antigo', chapters: 13 },
  { name: 'Ester', testament: 'Antigo', chapters: 10 },
  { name: 'Jó', testament: 'Antigo', chapters: 42 },
  { name: 'Salmos', testament: 'Antigo', chapters: 150 },
  { name: 'Provérbios', testament: 'Antigo', chapters: 31 },
  { name: 'Eclesiastes', testament: 'Antigo', chapters: 12 },
  { name: 'Cânticos', testament: 'Antigo', chapters: 8 },
  { name: 'Isaías', testament: 'Antigo', chapters: 66 },
  { name: 'Jeremias', testament: 'Antigo', chapters: 52 },
  { name: 'Lamentações', testament: 'Antigo', chapters: 5 },
  { name: 'Ezequiel', testament: 'Antigo', chapters: 48 },
  { name: 'Daniel', testament: 'Antigo', chapters: 12 },
  { name: 'Oséias', testament: 'Antigo', chapters: 14 },
  { name: 'Joel', testament: 'Antigo', chapters: 3 },
  { name: 'Amós', testament: 'Antigo', chapters: 9 },
  { name: 'Obadias', testament: 'Antigo', chapters: 1 },
  { name: 'Jonas', testament: 'Antigo', chapters: 4 },
  { name: 'Miqueias', testament: 'Antigo', chapters: 7 },
  { name: 'Naum', testament: 'Antigo', chapters: 3 },
  { name: 'Habacuque', testament: 'Antigo', chapters: 3 },
  { name: 'Sofonias', testament: 'Antigo', chapters: 3 },
  { name: 'Ageu', testament: 'Antigo', chapters: 2 },
  { name: 'Zacarias', testament: 'Antigo', chapters: 14 },
  { name: 'Malaquias', testament: 'Antigo', chapters: 4 },
  { name: 'Mateus', testament: 'Novo', chapters: 28 },
  { name: 'Marcos', testament: 'Novo', chapters: 16 },
  { name: 'Lucas', testament: 'Novo', chapters: 24 },
  { name: 'João', testament: 'Novo', chapters: 21 },
  { name: 'Atos', testament: 'Novo', chapters: 28 },
  { name: 'Romanos', testament: 'Novo', chapters: 16 },
  { name: '1 Coríntios', testament: 'Novo', chapters: 16 },
  { name: '2 Coríntios', testament: 'Novo', chapters: 13 },
  { name: 'Gálatas', testament: 'Novo', chapters: 6 },
  { name: 'Efésios', testament: 'Novo', chapters: 6 },
  { name: 'Filipenses', testament: 'Novo', chapters: 4 },
  { name: 'Colossenses', testament: 'Novo', chapters: 4 },
  { name: '1 Tessalonicenses', testament: 'Novo', chapters: 5 },
  { name: '2 Tessalonicenses', testament: 'Novo', chapters: 3 },
  { name: '1 Timóteo', testament: 'Novo', chapters: 6 },
  { name: '2 Timóteo', testament: 'Novo', chapters: 4 },
  { name: 'Tito', testament: 'Novo', chapters: 3 },
  { name: 'Filemom', testament: 'Novo', chapters: 1 },
  { name: 'Hebreus', testament: 'Novo', chapters: 13 },
  { name: 'Tiago', testament: 'Novo', chapters: 5 },
  { name: '1 Pedro', testament: 'Novo', chapters: 5 },
  { name: '2 Pedro', testament: 'Novo', chapters: 3 },
  { name: '1 João', testament: 'Novo', chapters: 5 },
  { name: '2 João', testament: 'Novo', chapters: 1 },
  { name: '3 João', testament: 'Novo', chapters: 1 },
  { name: 'Judas', testament: 'Novo', chapters: 1 },
  { name: 'Apocalipse', testament: 'Novo', chapters: 22 },
];

const HIGHLIGHT_COLORS = [
  { id: 'yellow', name: 'Amarelo', bg: 'bg-amber-200/70 dark:bg-amber-900/50', dot: 'bg-amber-400' },
  { id: 'red', name: 'Vermelho', bg: 'bg-red-200/70 dark:bg-red-900/50', dot: 'bg-red-500' },
  { id: 'green', name: 'Verde', bg: 'bg-emerald-200/70 dark:bg-emerald-900/50', dot: 'bg-emerald-500' },
  { id: 'blue', name: 'Azul', bg: 'bg-sky-200/70 dark:bg-sky-900/50', dot: 'bg-sky-500' },
  { id: 'purple', name: 'Roxo', bg: 'bg-purple-200/70 dark:bg-purple-900/50', dot: 'bg-purple-500' },
];

const getVersesForChapter = (book: string, chapter: number) => {
  if (book === 'Salmos' && chapter === 23) {
    return [
      { v: 1, text: 'O Senhor é o meu pastor; nada me faltará.' },
      { v: 2, text: 'Deitar-me faz em verdes pastos, conduz-me mansa às águas tranquilas.' },
      { v: 3, text: 'Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.' },
      { v: 4, text: 'Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.' },
      { v: 5, text: 'Preparas uma mesa perante mim na presença dos meus inimigos, ungiste a minha cabeça com óleo, o meu cálice transborda.' },
      { v: 6, text: 'Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.' },
    ];
  }
  if (book === 'João' && chapter === 3) {
    return [
      { v: 1, text: 'E havia entre os fariseus um homem chamado Nicodemo, príncipe dos judeus.' },
      { v: 2, text: 'Este foi ter com Jesus de noite, e disse-lhe: Rabi, sabemos que andaste da parte de Deus como mestre; porque ninguém pode fazer estes sinais que tu fazes, se Deus não for com ele.' },
      { v: 3, text: 'Jesus respondeu, e disse-lhe: Na verdade, na verdade te digo que Aquele que não nascer de novo, não pode ver o reino de Deus.' },
      { v: 16, text: 'Porque Deus amou o mundo de maneira tal que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
      { v: 17, text: 'Porque Deus enviou o seu Filho ao mundo, não para condenar o mundo, mas para que o mundo fosse salvo por ele.' },
    ];
  }
  if (book === 'Gênesis' && chapter === 1) {
    return [
      { v: 1, text: 'No princípio criou Deus os céus e a terra.' },
      { v: 2, text: 'E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.' },
      { v: 3, text: 'E disse Deus: Haja luz; e houve luz.' },
      { v: 4, text: 'E viu Deus que a luz era boa; e fez Deus separação entre a luz e as trevas.' },
      { v: 5, text: 'E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã, o dia primeiro.' },
    ];
  }

  const count = Math.min(25, 12 + ((book.charCodeAt(0) + chapter) % 10));
  const verses = [];
  const themes = [
    'Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.',
    'Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento.',
    'O Senhor é a minha força e o meu escudo; nele o meu coração confia.',
    'Tudo posso naquele que me fortalece com sua graça infinita e poder.',
    'Buscai primeiro o reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas.',
    'O amor é paciente, o amor é benigno; não arde em ciúmes, não se ufana.',
    'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente alojar-se-á.',
    'Disse-lhe Jesus: Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai senão por mim.'
  ];
  for (let i = 1; i <= count; i++) {
    const themeIdx = (i + chapter + book.length) % themes.length;
    verses.push({
      v: i,
      text: i === 1 
        ? `No capítulo ${chapter} do livro de ${book}, vemos a revelação da glória e da justiça divina. ${themes[themeIdx]}`
        : i === 2 
        ? `Prosseguindo na leitura de ${book} ${chapter}, compreendemos os propósitos eternos do Criador para nossas vidas.`
        : `Instrução sagrada de ${book} ${chapter}:${i}: Guardemos os mandamentos do Senhor em nosso espírito com fé e dedicação.`
    });
  }
  return verses;
};

const checkCredentials = (str: string) => {
  return {
    lengthValid: str.length > 0 && str.length <= 8,
    upperValid: /[A-Z]/.test(str),
    symbolValid: /[!@#$%^&*(),.?":{}|<>_\-\+]/.test(str),
    noSpaceValid: !/\s/.test(str),
    noAccentValid: !/[À-ú]/.test(str),
  };
};

export default function App() {
  const [registeredUsers, setRegisteredUsers] = useState<Array<{ name: string; surname: string; username: string; email: string; birthDate: string; isAdmin: boolean }>>([
    { name: 'Samuel', surname: 'Silva', username: 'SamAdmin', email: 'Samuellsilvva02@gmail.com', birthDate: '1995-05-15', isAdmin: true }
  ]);

  const [user, setUser] = useState<{
    name: string;
    surname: string;
    username: string;
    email: string;
    avatarUrl?: string;
    birthDate?: string;
    isAdmin?: boolean;
  } | null>(null);

  // PWA Native Installation
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Elegant Opening Splash Animation
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [splashProgress, setSplashProgress] = useState(0);

  useEffect(() => {
    if (!showSplashScreen) return;
    const interval = setInterval(() => {
      setSplashProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowSplashScreen(false), 450);
          return 100;
        }
        return prev + 3;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [showSplashScreen]);

  const replaySplashScreen = () => {
    setSplashProgress(0);
    setShowSplashScreen(true);
  };

  const [showLoginPromptModal, setShowLoginPromptModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBirthDate, setRegBirthDate] = useState('');

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotBirthDate, setForgotBirthDate] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState<'bible' | 'community' | 'support' | 'profile'>('bible');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [currentVersion, setCurrentVersion] = useState('NVI');
  const [currentBook, setCurrentBook] = useState('Mateus');
  const [currentChapter, setCurrentChapter] = useState(5);
  const [fontSize, setFontSize] = useState(18);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);

  // Sidebar Modals State
  const [activeModal, setActiveModal] = useState<
    | 'none'
    | 'marked'
    | 'search'
    | 'progress'
    | 'settings'
    | 'novidades'
    | 'rate'
    | 'share'
    | 'more_apps'
    | 'about'
    | 'support_contact'
    | 'suggestion'
    | 'admin_panel'
  >('none');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [readChapters, setReadChapters] = useState<Record<string, number[]>>({
    'Mateus': [1]
  });
  const [highlights, setHighlights] = useState<Record<string, string>>({});
  const [activeHighlightVerse, setActiveHighlightVerse] = useState<number | null>(null);

  const [prayers, setPrayers] = useState<Array<{ id: number; name: string; text: string; count: number; prayed: boolean; answered: boolean; time: string }>>([]);
  const [newPrayerText, setNewPrayerText] = useState('');

  const [suggestions, setSuggestions] = useState<Array<{ id: number; name: string; text: string; date: string; status: string }>>([]);
  const [newSuggestionText, setNewSuggestionText] = useState('');

  const [announcements, setAnnouncements] = useState<Array<{ id: number; title: string; text: string; date: string; imageUrl?: string }>>([
    { id: 1, title: 'Bem-vindo à Bíblia Sagrada', text: 'Aplicativo oficial com todas as traduções e recursos para leitura da palavra.', date: '01/11/2026' }
  ]);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnText, setNewAnnText] = useState('');
  const [newAnnImage, setNewAnnImage] = useState('');

  // Pix / Monthly Goal state (editable by Admin)
  const [monthlyGoal, setMonthlyGoal] = useState({
    target: 5000,
    current: 1250,
    pixKey: 'pix@bibliasagrada.com.br',
    pixHolder: 'Projeto Bíblia Sagrada',
    bankName: 'Banco Oficial'
  });
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editTarget, setEditTarget] = useState(monthlyGoal.target.toString());
  const [editCurrent, setEditCurrent] = useState(monthlyGoal.current.toString());
  const [editPixKey, setEditPixKey] = useState(monthlyGoal.pixKey);

  // About App state (editable by admin)
  const [aboutText, setAboutText] = useState('Aplicativo dedicado exclusivamente à leitura da Palavra de Deus em múltiplas versões (NVI, ARA, NVT, KJV, ACF, ARC) com mural de orações comunitário.');
  const [aboutImage, setAboutImage] = useState(bibleLogo);
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const bookObj = BIBLE_BOOKS.find(b => b.name === currentBook) || BIBLE_BOOKS[39];
  const totalChapters = bookObj.chapters;

  useEffect(() => {
    if (currentChapter > totalChapters) {
      setCurrentChapter(1);
    }
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      mainContainer.scrollTop = 0;
    }
  }, [currentBook, currentChapter]);

  const readListForBook = readChapters[currentBook] || [];
  const isCurrentChapterRead = readListForBook.includes(currentChapter);
  const readPercentage = Math.round((readListForBook.length / totalChapters) * 100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const requireLogin = (actionCallback: () => void) => {
    if (!user) {
      setShowLoginPromptModal(true);
      return;
    }
    actionCallback();
  };

  const handleShareVerse = (verseNum: number, verseText: string) => {
    const shareText = `"${verseText}"\n— ${currentBook} ${currentChapter}:${verseNum} (${currentVersion})\n\nLeia na Bíblia Sagrada:\n${OFFICIAL_URL}`;
    if (navigator.share) {
      navigator.share({
        title: `Bíblia Sagrada - ${currentBook} ${currentChapter}:${verseNum}`,
        text: shareText,
        url: OFFICIAL_URL,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      showToast('Versículo copiado para compartilhamento!');
    }
  };

  const handleShareApp = () => {
    const shareText = `Conheça o aplicativo Bíblia Sagrada - Leitura da Palavra em múltiplas versões:\n${OFFICIAL_URL}`;
    if (navigator.share) {
      navigator.share({
        title: 'Bíblia Sagrada',
        text: shareText,
        url: OFFICIAL_URL,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(OFFICIAL_URL);
      showToast('Link do aplicativo copiado para compartilhamento!');
    }
  };

  const handleNativeInstallClick = async () => {
    if (isInstalled) {
      showToast('O aplicativo já está instalado no seu celular!');
      return;
    }
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        showToast('Instalação iniciada! Adicionado à tela de início.');
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword) {
      alert('Preencha o e-mail ou nome de usuário e a senha.');
      return;
    }
    const found = registeredUsers.find(
      u => u.email.toLowerCase() === loginIdentifier.toLowerCase() || u.username.toLowerCase() === loginIdentifier.toLowerCase()
    );

    if (!found && loginIdentifier.toLowerCase() !== 'samuellsilvva02@gmail.com') {
      alert('Usuário ou e-mail não encontrado. Verifique seus dados ou cadastre-se.');
      return;
    }

    const isAdmin = loginIdentifier.toLowerCase() === 'samuellsilvva02@gmail.com' || found?.isAdmin;
    setUser({
      name: found ? found.name : 'Samuel',
      surname: found ? found.surname : 'Silva',
      username: found ? found.username : 'SamAdmin',
      email: found ? found.email : 'Samuellsilvva02@gmail.com',
      isAdmin: isAdmin,
      birthDate: found?.birthDate || '1995-05-15'
    });
    setIsAuthModalOpen(false);
    setLoginIdentifier('');
    setLoginPassword('');
    showToast('Login realizado com sucesso!');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const credUser = checkCredentials(regUsername);
    const credPass = checkCredentials(regPassword);

    if (!credUser.lengthValid || !credUser.upperValid || !credUser.symbolValid || !credUser.noSpaceValid || !credUser.noAccentValid) {
      alert('Nome de usuário inválido: Sem espaços, sem acentos, máx 8 caracteres, 1 maiúscula e 1 símbolo.');
      return;
    }
    if (!credPass.lengthValid || !credPass.upperValid || !credPass.symbolValid || !credPass.noSpaceValid || !credPass.noAccentValid) {
      alert('Senha inválida: Sem espaços, sem acentos, máx 8 caracteres, 1 maiúscula e 1 símbolo.');
      return;
    }

    const emailExists = registeredUsers.some(u => u.email.toLowerCase() === regEmail.toLowerCase());
    const usernameExists = registeredUsers.some(u => u.username.toLowerCase() === regUsername.toLowerCase());

    if (emailExists) {
      alert('Este e-mail já está cadastrado no sistema!');
      return;
    }
    if (usernameExists) {
      alert('Este nome de usuário já está em uso!');
      return;
    }

    const isAdmin = regEmail.toLowerCase() === 'samuellsilvva02@gmail.com';
    const newUser = {
      name: regName,
      surname: regSurname,
      username: regUsername,
      email: regEmail,
      birthDate: regBirthDate,
      isAdmin: isAdmin
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    setUser(newUser);
    setIsAuthModalOpen(false);
    showToast('Conta criada com sucesso!');
  };

  const handleForgotVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const found = registeredUsers.some(u => u.email.toLowerCase() === forgotEmail.toLowerCase());
    if (found || forgotEmail.toLowerCase() === 'samuellsilvva02@gmail.com') {
      setForgotStep(2);
    } else {
      alert('E-mail não encontrado em nossa base de cadastros.');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const credPass = checkCredentials(forgotNewPass);
    if (!credPass.lengthValid || !credPass.upperValid || !credPass.symbolValid || !credPass.noSpaceValid || !credPass.noAccentValid) {
      alert('Nova senha inválida: Sem espaços, sem acentos, máx 8 caracteres, 1 maiúscula e 1 símbolo.');
      return;
    }
    setForgotSuccess(true);
    setTimeout(() => {
      setAuthView('login');
      setForgotStep(1);
      setForgotSuccess(false);
      setForgotEmail('');
      setForgotBirthDate('');
      setForgotNewPass('');
    }, 2000);
  };

  const toggleChapterRead = () => {
    requireLogin(() => {
      setReadChapters(prev => {
        const currentList = prev[currentBook] || [];
        if (currentList.includes(currentChapter)) {
          return { ...prev, [currentBook]: currentList.filter(c => c !== currentChapter) };
        } else {
          return { ...prev, [currentBook]: [...currentList, currentChapter].sort((a,b)=>a-b) };
        }
      });
      showToast(isCurrentChapterRead ? 'Capítulo desmarcado.' : 'Capítulo marcado como lido!');
    });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans flex flex-col items-center justify-start select-none transition-colors duration-300 relative`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* ELEGANT OPENING SPLASH ANIMATION */}
      {showSplashScreen && (
        <div 
          onClick={() => setShowSplashScreen(false)}
          className="fixed inset-0 z-[100] bg-gradient-to-b from-stone-950 via-red-950 to-stone-950 flex flex-col items-center justify-between p-8 text-white animate-in fade-in duration-500 cursor-pointer overflow-hidden"
        >
          {/* Ambient Golden Radial Light Rays */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(245,158,11,0.22)_0%,transparent_65%)] pointer-events-none animate-pulse"></div>

          {/* Twinkling Divine Particles */}
          <div className="absolute top-1/4 left-10 text-amber-300/40 animate-ping duration-1000">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="absolute top-1/3 right-12 text-amber-200/50 animate-pulse duration-700">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute bottom-1/3 left-14 text-amber-400/30 animate-pulse duration-1000">
            <Sparkles className="w-4 h-4" />
          </div>

          <div className="w-full flex justify-end pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSplashScreen(false);
              }}
              className="text-xs px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 backdrop-blur-md transition-all font-medium border border-white/10 flex items-center gap-1"
            >
              Pular ✕
            </button>
          </div>

          {/* Centerpiece: Glowing Bible with Sacred Light */}
          <div className="flex flex-col items-center text-center space-y-6 max-w-xs my-auto relative z-10">
            <div className="relative">
              {/* Golden Halo Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/40 via-red-500/30 to-amber-400/40 rounded-full blur-xl animate-pulse"></div>
              
              <div className="relative w-28 h-28 rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/40 bg-red-900 p-1 flex items-center justify-center transform transition-transform hover:scale-105 duration-300">
                <img src={bibleLogo} alt="Logo Bíblia" className="w-full h-full object-cover rounded-2xl" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-amber-400/10 text-amber-300 border border-amber-400/30 rounded-full text-[10px] font-bold tracking-widest uppercase">
                A Palavra Eterna
              </span>
              <h1 className="text-3xl font-serif font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-white to-amber-100 bg-clip-text text-transparent drop-shadow-md">
                BÍBLIA SAGRADA
              </h1>
              <p className="text-xs text-amber-100/80 font-serif italic leading-relaxed pt-2">
                "Lâmpada para os meus pés é tua palavra e luz para o meu caminho."
              </p>
              <span className="text-[11px] font-bold text-amber-400 tracking-wider">
                — Salmos 119:105
              </span>
            </div>
          </div>

          {/* Elegant Loading & Progress */}
          <div className="w-full max-w-xs space-y-3 pb-6 relative z-10 text-center">
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden p-0.5 backdrop-blur-md">
              <div 
                className="bg-gradient-to-r from-amber-400 to-rose-400 h-full rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                style={{ width: `${splashProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-amber-200/60 font-medium px-1">
              <span>Preparando Escrituras...</span>
              <span>{splashProgress}%</span>
            </div>
            <p className="text-[11px] text-slate-400 hover:text-white transition-colors pt-2">
              Toque para abrir a Palavra →
            </p>
          </div>
        </div>
      )}

      {/* Mobile Frame Container */}
      <div className="w-full max-w-md min-h-screen bg-white dark:bg-slate-900 shadow-2xl flex flex-col relative overflow-hidden border-x border-slate-200 dark:border-slate-800">

        {/* Top Header */}
        <header className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden shadow-md border border-red-500/30 flex items-center justify-center bg-red-600">
                <img src={bibleLogo} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-tight bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                  BÍBLIA SAGRADA
                </h1>
                <span className="text-[10px] text-slate-400 font-medium">{currentBook} {currentChapter}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Install Native App Button Header */}
            {!isInstalled && (
              <button
                onClick={handleNativeInstallClick}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs font-bold hover:bg-red-100 transition-all shadow-sm"
                title="Instalar Aplicativo Nativo no Celular"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Instalar</span>
              </button>
            )}

            {/* Version Selector Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
                className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs border border-red-200 dark:border-red-900 flex items-center gap-1.5"
              >
                {currentVersion}
              </button>

              {isVersionDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 py-2 z-40">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">Versões da Bíblia</div>
                  {BIBLE_VERSIONS.map(v => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setCurrentVersion(v.id);
                        setIsVersionDropdownOpen(false);
                        showToast(`Versão alterada para ${v.name}`);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 ${currentVersion === v.id ? 'font-bold text-red-600 bg-red-50/50 dark:bg-red-950/20' : 'text-slate-700 dark:text-slate-300'}`}
                    >
                      <span>{v.name}</span>
                      <span className="text-[10px] text-slate-400">{v.fullName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                if (user) {
                  setActiveTab('profile');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24">
          
          {/* TAB 1: BIBLE READING */}
          {activeTab === 'bible' && (
            <div className="p-4 space-y-4">
              {/* Quick Book & Chapter Bar */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setIsBookModalOpen(true)}
                  className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white hover:text-red-600"
                >
                  <BookOpen className="w-4 h-4 text-red-600" />
                  <span>{currentBook} {currentChapter}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (currentChapter > 1) setCurrentChapter(c => c - 1);
                      else if (currentChapter === 1 && BIBLE_BOOKS.findIndex(b => b.name === currentBook) > 0) {
                        const idx = BIBLE_BOOKS.findIndex(b => b.name === currentBook);
                        const prevBook = BIBLE_BOOKS[idx - 1];
                        setCurrentBook(prevBook.name);
                        setCurrentChapter(prevBook.chapters);
                      }
                    }}
                    className="p-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-600"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (currentChapter < totalChapters) setCurrentChapter(c => c + 1);
                      else {
                        const idx = BIBLE_BOOKS.findIndex(b => b.name === currentBook);
                        if (idx < BIBLE_BOOKS.length - 1) {
                          setCurrentBook(BIBLE_BOOKS[idx + 1].name);
                          setCurrentChapter(1);
                        }
                      }
                    }}
                    className="p-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-600"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress & Mark as Read Bar */}
              <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-red-700 dark:text-red-400">Progresso de Leitura ({currentBook})</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{readListForBook.length} de {totalChapters} capítulos lidos ({readPercentage}%)</div>
                </div>
                <button
                  onClick={toggleChapterRead}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isCurrentChapterRead 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                      : 'bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {isCurrentChapterRead ? 'Capítulo Lido ✓' : 'Marcar como Lido'}
                </button>
              </div>

              {/* Bible Text Container */}
              <div className="space-y-4 px-1 py-2">
                <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">{currentBook} {currentChapter}</h2>
                  <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest">{currentVersion}</span>
                </div>

                <div 
                  key={`${currentBook}-${currentChapter}-${currentVersion}`}
                  className="space-y-3" 
                  style={{ fontSize: `${fontSize}px`, lineHeight: '1.7' }}
                >
                  {getVersesForChapter(currentBook, currentChapter).map((verse) => {
                    const highlightKey = `${currentBook} ${currentChapter}-${verse.v}`;
                    const currentHighlight = highlights[highlightKey];

                    return (
                      <div 
                        key={verse.v}
                        onClick={() => requireLogin(() => setActiveHighlightVerse(verse.v))}
                        className={`group relative p-2 rounded-xl transition-all cursor-pointer ${
                          currentHighlight ? HIGHLIGHT_COLORS.find(c => c.id === currentHighlight)?.bg : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-red-600 mr-2 select-none">{verse.v}</span>
                            <span className="font-serif text-slate-800 dark:text-slate-200">{verse.text}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareVerse(verse.v, verse.text);
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors ml-2"
                            title="Compartilhar Versículo"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Highlight Palette Popup */}
                        {activeHighlightVerse === verse.v && (
                          <div className="absolute top-0 right-0 -mt-10 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-2 flex items-center gap-2 border border-slate-200 dark:border-slate-700 z-20">
                            <span className="text-[10px] font-bold text-slate-500">Marcar:</span>
                            {HIGHLIGHT_COLORS.map(hc => (
                              <button
                                key={hc.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHighlights(prev => ({ ...prev, [highlightKey]: hc.id }));
                                  setActiveHighlightVerse(null);
                                  showToast('Verso marcado!');
                                }}
                                className={`w-5 h-5 rounded-full ${hc.dot} shadow-md hover:scale-110 transition-transform`}
                              />
                            ))}
                            {currentHighlight && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHighlights(prev => {
                                    const copy = { ...prev };
                                    delete copy[highlightKey];
                                    return copy;
                                  });
                                  setActiveHighlightVerse(null);
                                }}
                                className="text-[10px] text-red-600 font-bold px-1.5"
                              >
                                Limpar
                              </button>
                            )}
                            <button 
                              onClick={(e) => { e.stopPropagation(); setActiveHighlightVerse(null); }}
                              className="p-1 text-slate-400"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BOTTOM Mark as Read Bar */}
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-red-700 dark:text-red-400">Fim do Capítulo {currentChapter} de {currentBook}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Parabéns por meditar na Palavra!</div>
                </div>
                <button
                  onClick={toggleChapterRead}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                    isCurrentChapterRead 
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                      : 'bg-red-600 text-white shadow-red-600/20 hover:bg-red-700'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  {isCurrentChapterRead ? 'Capítulo Lido ✓' : 'Marcar como Lido'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: COMMUNITY PRAYERS */}
          {activeTab === 'community' && (
            <div className="p-4 space-y-4">
              <div className="bg-gradient-to-r from-red-600 to-rose-500 rounded-3xl p-5 text-white shadow-xl space-y-2">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-white" /> Mural de Orações da Comunidade
                </h3>
                <p className="text-xs text-red-100">Compartilhe seu pedido de oração ou interceda pelos irmãos em fé.</p>
              </div>

              {/* Add Prayer Form */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Enviar Pedido de Oração</h4>
                <textarea
                  rows={3}
                  placeholder="Escreva seu pedido de oração..."
                  value={newPrayerText}
                  onChange={(e) => setNewPrayerText(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white resize-none"
                />
                <button
                  onClick={() => {
                    requireLogin(() => {
                      if (!newPrayerText.trim()) return;
                      setPrayers(prev => [
                        { id: Date.now(), name: `${user?.name} ${user?.surname}`, text: newPrayerText, count: 1, prayed: true, answered: false, time: 'Agora' },
                        ...prev
                      ]);
                      setNewPrayerText('');
                      showToast('Pedido de oração publicado!');
                    });
                  }}
                  className="w-full py-3 bg-red-600 text-white rounded-2xl font-bold text-xs shadow-lg hover:bg-red-700"
                >
                  Publicar Oração
                </button>
              </div>

              {/* Prayers List */}
              <div className="space-y-3">
                {prayers.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Nenhum pedido de oração no momento. Seja o primeiro a compartilhar!
                  </div>
                ) : (
                  prayers.map((p) => (
                    <div key={p.id} className="p-4 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 rounded-3xl shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white">{p.name}</h5>
                          <span className="text-[10px] text-slate-400">{p.time}</span>
                        </div>
                        {p.answered && (
                          <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-xl text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Causa Deu Certo!
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{p.text}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                        <button
                          onClick={() => {
                            requireLogin(() => {
                              setPrayers(prev => prev.map(item => item.id === p.id ? { ...item, count: item.prayed ? item.count - 1 : item.count + 1, prayed: !item.prayed } : item));
                            });
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                            p.prayed ? 'bg-red-100 dark:bg-red-950/60 text-red-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${p.prayed ? 'fill-red-600 text-red-600' : ''}`} />
                          <span>{p.count} orando</span>
                        </button>

                        {(user?.isAdmin || user?.email === p.name) && (
                          <button
                            onClick={() => {
                              setPrayers(prev => prev.map(item => item.id === p.id ? { ...item, answered: !item.answered } : item));
                              showToast('Status atualizado!');
                            }}
                            className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
                          >
                            {p.answered ? 'Desfazer' : 'Marcar que Deu Certo'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECT SUPPORT & PIX MONTHLY GOAL */}
          {activeTab === 'support' && (
            <div className="p-4 space-y-4">
              <div className="bg-gradient-to-tr from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white font-bold shadow-lg">
                    <Gift className="w-6 h-6" />
                  </div>
                  {user?.isAdmin && (
                    <button 
                      onClick={() => setIsEditingGoal(!isEditingGoal)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Pencil className="w-4 h-4" /> {isEditingGoal ? 'Fechar Edição' : 'Editar Meta Pix'}
                    </button>
                  )}
                </div>

                <h3 className="font-bold text-base">Crescimento dos Projetos & Pix</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  As contribuições via Pix auxiliam no crescimento dos projetos, expansão da palavra e distribuição de Bíblias.
                </p>

                {/* Monthly Fundraising Goal Box */}
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">Meta Arrecadada no Mês</span>
                    <span className="font-extrabold text-emerald-400">
                      R$ {monthlyGoal.current} / R$ {monthlyGoal.target}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, Math.round((monthlyGoal.current / monthlyGoal.target) * 100))}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">
                    {Math.round((monthlyGoal.current / monthlyGoal.target) * 100)}% da meta mensal atingida
                  </div>

                  {/* Admin Editing Monthly Goal */}
                  {isEditingGoal && user?.isAdmin && (
                    <div className="pt-3 border-t border-white/10 space-y-3 text-xs">
                      <div className="font-bold text-emerald-300">Painel do Administrador: Editar Meta Pix</div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-300">Meta Total (R$)</label>
                        <input
                          type="number"
                          value={editTarget}
                          onChange={(e) => setEditTarget(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-300">Valor Arrecadado (R$)</label>
                        <input
                          type="number"
                          value={editCurrent}
                          onChange={(e) => setEditCurrent(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-300">Chave Pix</label>
                        <input
                          type="text"
                          value={editPixKey}
                          onChange={(e) => setEditPixKey(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setMonthlyGoal({
                            ...monthlyGoal,
                            target: Number(editTarget) || 5000,
                            current: Number(editCurrent) || 0,
                            pixKey: editPixKey
                          });
                          setIsEditingGoal(false);
                          showToast('Meta Pix atualizada com sucesso!');
                        }}
                        className="w-full py-2.5 bg-red-600 text-white rounded-xl font-bold shadow-lg"
                      >
                        Salvar Alterações da Meta
                      </button>
                    </div>
                  )}
                </div>

                {/* Pix Details */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 text-xs">
                  <div className="text-slate-400">Chave Pix para Contribuição:</div>
                  <div className="p-3 bg-slate-900 rounded-xl font-mono font-bold text-emerald-400 select-all border border-slate-800">
                    {monthlyGoal.pixKey}
                  </div>
                  <div className="text-[10px] text-slate-400">Favorecido: {monthlyGoal.pixHolder}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(monthlyGoal.pixKey);
                  showToast('Chave Pix copiada para a área de transferência!');
                }}
                className="w-full py-3.5 bg-red-600 text-white rounded-2xl font-bold text-xs shadow-xl hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <DollarSign className="w-4 h-4" /> Copiar Chave Pix
              </button>
            </div>
          )}

          {/* TAB 4: USER PROFILE */}
          {activeTab === 'profile' && (
            <div className="p-4 space-y-4">
              {user ? (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 shadow-sm text-center space-y-3">
                    <div className="relative w-20 h-20 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-700 overflow-hidden border-2 border-red-600 shadow-xl flex items-center justify-center">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-slate-400" />
                      )}
                      <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-5 h-5 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                setUser(prev => prev ? { ...prev, avatarUrl: reader.result as string } : null);
                                showToast('Foto de perfil atualizada!');
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{user.name} {user.surname}</h3>
                      <span className="text-xs text-red-600 font-bold">@{user.username}</span>
                      {user.isAdmin && (
                        <div className="mt-1 inline-block px-2.5 py-0.5 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded-full text-[10px] font-bold">
                          Administrador Geral
                        </div>
                      )}
                    </div>

                    <div className="text-left space-y-2 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">E-mail:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{user.email}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Nascimento:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{user.birthDate || 'Não informado'}</span>
                      </div>
                    </div>
                  </div>

                  {user.isAdmin && (
                    <button
                      onClick={() => setActiveModal('admin_panel')}
                      className="w-full py-3.5 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-lg hover:bg-slate-800 flex items-center justify-center gap-2 border border-slate-700"
                    >
                      <ShieldCheck className="w-4 h-4 text-red-500" /> Painel do Administrador Geral
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setUser(null);
                      setActiveTab('bible');
                      showToast('Sessão encerrada.');
                    }}
                    className="w-full py-3.5 bg-red-50 dark:bg-red-950/40 text-red-600 rounded-2xl font-bold text-xs hover:bg-red-100 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sair da Conta
                  </button>
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Acesse sua Conta</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">Faça login para salvar seus dados e interagir.</p>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-6 py-3 bg-red-600 text-white rounded-2xl font-bold text-xs shadow-lg hover:bg-red-700"
                  >
                    Fazer Login ou Cadastrar
                  </button>
                </div>
              )}
            </div>
          )}

        </main>

        {/* Bottom Navigation Bar */}
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex items-center justify-around px-2 z-30">
          {[
            { id: 'bible', label: 'Bíblia', icon: BookOpen },
            { id: 'community', label: 'Comunidade', icon: Heart },
            { id: 'support', label: 'Projetos', icon: Gift },
            { id: 'profile', label: 'Perfil', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                  isActive ? 'text-red-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                <span className="text-[10px] mt-1">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* NATIVE APP INSTALL MODAL */}
        {showInstallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowInstallModal(false)}></div>
            <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl p-6 z-10 space-y-4">
              <div className="flex justify-between items-start pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl overflow-hidden shadow bg-red-600 flex items-center justify-center">
                    <img src={bibleLogo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Instalar Aplicativo Nativo</h3>
                    <span className="text-[10px] text-slate-400">Bíblia Sagrada no seu Celular</span>
                  </div>
                </div>
                <button onClick={() => setShowInstallModal(false)} className="p-1 rounded-xl text-slate-400 hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isInstallable ? (
                <div className="space-y-3 text-center py-2">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Instale a Bíblia Sagrada na sua tela inicial para leitura rápida, offline e experiência nativa completa!
                  </p>
                  <button
                    onClick={async () => {
                      const res = await install();
                      if (res) {
                        setShowInstallModal(false);
                        showToast('Aplicativo instalado com sucesso!');
                      }
                    }}
                    className="w-full py-3 bg-red-600 text-white rounded-2xl font-bold text-xs shadow-lg hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Instalar Aplicativo Agora
                  </button>
                </div>
              ) : isIOS ? (
                /* iOS Safari instructions */
                <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 py-1">
                  <p className="text-slate-500 text-[11px]">Para instalar no seu iPhone ou iPad:</p>
                  
                  <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-[11px]">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">1</span>
                      <p>Toque no ícone de <strong>Compartilhar</strong> (quadrado com seta para cima) na barra inferior do Safari.</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">2</span>
                      <p>Role as opções para baixo e toque em <strong>"Adicionar à Tela de Início"</strong> (+).</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">3</span>
                      <p>Toque em <strong>"Adicionar"</strong> no canto superior direito.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowInstallModal(false)}
                    className="w-full py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs shadow hover:bg-red-700"
                  >
                    Entendi
                  </button>
                </div>
              ) : (
                /* Android / Chrome standard instructions */
                <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 py-1">
                  <p className="text-slate-500 text-[11px]">Para instalar no seu dispositivo Android:</p>
                  
                  <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-[11px]">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">1</span>
                      <p>Toque nos três pontinhos <strong>(⋮)</strong> no canto superior direito do navegador Chrome.</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">2</span>
                      <p>Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">3</span>
                      <p>Confirme a instalação para ter o ícone nativo no seu celular.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowInstallModal(false)}
                    className="w-full py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs shadow hover:bg-red-700"
                  >
                    Entendi
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LOGIN PROMPT MODAL */}
        {showLoginPromptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginPromptModal(false)}></div>
            <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl p-6 z-10 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Login Necessário</h3>
                <p className="text-xs text-slate-500 mt-1">Para realizar esta ação, é necessário fazer login na sua conta.</p>
              </div>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setShowLoginPromptModal(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-3 bg-red-600 text-white rounded-2xl font-bold text-xs shadow-lg hover:bg-red-700 transition-colors"
                >
                  Entrar ou Cadastrar-se
                </button>
                <button
                  onClick={() => setShowLoginPromptModal(false)}
                  className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                >
                  Continuar como Convidado
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AUTHENTICATION MODAL */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAuthModalOpen(false)}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl p-6 z-10 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-red-600 flex items-center justify-center">
                    <img src={bibleLogo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Acessar Bíblia Sagrada</h3>
                </div>
                <button onClick={() => setIsAuthModalOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {authView === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">E-mail ou Nome de Usuário</label>
                    <input
                      type="text"
                      required
                      placeholder="usuario123 ou seuemail@gmail.com"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value.replace(/[\sÀ-ú]/g, ''))}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Senha</label>
                      <button
                        type="button"
                        onClick={() => setAuthView('forgot')}
                        className="text-xs text-red-600 hover:underline font-medium"
                      >
                        Esqueceu?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      maxLength={8}
                      placeholder="Ab#123"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value.replace(/[\sÀ-ú]/g, ''))}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-red-700"
                  >
                    Entrar
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthView('register')}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Não tem conta? Cadastre-se
                    </button>
                  </div>
                </form>
              )}

              {authView === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Nome</label>
                      <input
                        type="text"
                        required
                        placeholder="Nome"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Sobrenome</label>
                      <input
                        type="text"
                        required
                        placeholder="Sobrenome"
                        value={regSurname}
                        onChange={(e) => setRegSurname(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Nome de Usuário (Sem espaços ou acentos)</label>
                    <input
                      type="text"
                      required
                      maxLength={8}
                      placeholder="user123!"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value.replace(/[\sÀ-ú]/g, ''))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                    <div className="mt-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-0.5 text-[10px]">
                      <div className={checkCredentials(regUsername).lengthValid ? 'text-emerald-600 font-bold' : 'text-slate-400'}>✓ Máx 8 caracteres</div>
                      <div className={checkCredentials(regUsername).upperValid ? 'text-emerald-600 font-bold' : 'text-slate-400'}>✓ 1 letra maiúscula</div>
                      <div className={checkCredentials(regUsername).symbolValid ? 'text-emerald-600 font-bold' : 'text-slate-400'}>✓ 1 símbolo (!@#...)</div>
                      <div className={checkCredentials(regUsername).noSpaceValid && checkCredentials(regUsername).noAccentValid ? 'text-emerald-600 font-bold' : 'text-slate-400'}>✓ Sem espaços ou acentos</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">E-mail</label>
                    <input
                      type="email"
                      required
                      placeholder="seuemail@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value.replace(/\s/g, ''))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Senha (Sem espaços ou acentos)</label>
                    <input
                      type="password"
                      required
                      maxLength={8}
                      placeholder="Ab#123"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value.replace(/[\sÀ-ú]/g, ''))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                    <div className="mt-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-0.5 text-[10px]">
                      <div className={checkCredentials(regPassword).lengthValid ? 'text-emerald-600 font-bold' : 'text-slate-400'}>✓ Máx 8 caracteres</div>
                      <div className={checkCredentials(regPassword).upperValid ? 'text-emerald-600 font-bold' : 'text-slate-400'}>✓ 1 letra maiúscula</div>
                      <div className={checkCredentials(regPassword).symbolValid ? 'text-emerald-600 font-bold' : 'text-slate-400'}>✓ 1 símbolo</div>
                      <div className={checkCredentials(regPassword).noSpaceValid && checkCredentials(regPassword).noAccentValid ? 'text-emerald-600 font-bold' : 'text-slate-400'}>✓ Sem espaços ou acentos</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Data de Nascimento</label>
                    <input
                      type="date"
                      required
                      value={regBirthDate}
                      onChange={(e) => setRegBirthDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-red-600 text-white rounded-2xl font-bold text-xs shadow-lg hover:bg-red-700 mt-2"
                  >
                    Criar Conta
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthView('login')}
                      className="text-xs text-slate-500 hover:text-red-600 font-medium"
                    >
                      ← Voltar ao Login
                    </button>
                  </div>
                </form>
              )}

              {authView === 'forgot' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">Recuperação de Senha</h3>
                    <button onClick={() => setAuthView('login')} className="p-1 rounded-xl text-slate-400 hover:bg-slate-100">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {forgotSuccess ? (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-2xl text-center text-emerald-700 text-xs font-bold">
                      Senha redefinida com sucesso!
                    </div>
                  ) : forgotStep === 1 ? (
                    <form onSubmit={handleForgotVerify} className="space-y-3">
                      <p className="text-xs text-slate-500">Informe seu e-mail e data de nascimento para recuperar a senha.</p>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">E-mail</label>
                        <input
                          type="email"
                          required
                          placeholder="seuemail@gmail.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value.replace(/\s/g, ''))}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Data de Nascimento</label>
                        <input
                          type="date"
                          required
                          value={forgotBirthDate}
                          onChange={(e) => setForgotBirthDate(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-red-600 text-white rounded-2xl font-bold text-xs shadow-lg hover:bg-red-700"
                      >
                        Verificar Identidade
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-3">
                      <p className="text-xs text-emerald-600 font-bold">Identidade confirmada!</p>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Nova Senha (Sem espaços/acentos, máx 8, maiúscula e símbolo)</label>
                        <input
                          type="password"
                          required
                          maxLength={8}
                          placeholder="Nova senha"
                          value={forgotNewPass}
                          onChange={(e) => setForgotNewPass(e.target.value.replace(/[\sÀ-ú]/g, ''))}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-red-600 text-white rounded-2xl font-bold text-xs shadow-lg hover:bg-red-700"
                      >
                        Salvar Nova Senha
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SIDEBAR MENU MODAL */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
            <div className="relative w-80 max-w-full bg-white dark:bg-slate-900 h-full shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300 overflow-y-auto">
              
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg border border-red-500/30 flex items-center justify-center bg-red-600">
                      <img src={bibleLogo} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">Bíblia Sagrada</h3>
                      <span className="text-[10px] text-slate-500">{user ? `@${user.username}` : 'Modo Convidado'}</span>
                    </div>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Featured PWA Native App Install Banner */}
                <div className="p-3.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl text-white shadow-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-amber-300" />
                      <span className="font-bold text-xs">Instalar Aplicativo</span>
                    </div>
                    <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {isInstalled ? 'Instalado' : 'Nativo'}
                    </span>
                  </div>
                  <p className="text-[11px] text-red-100 leading-tight">
                    {isInstalled 
                      ? 'Aplicativo instalado! Acesse diretamente pela sua tela de início.'
                      : 'Tenha o app oficial na tela de início do seu celular para leitura rápida e offline.'}
                  </p>
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      handleNativeInstallClick();
                    }}
                    className="w-full py-2 bg-white text-red-600 rounded-xl font-bold text-xs shadow hover:bg-red-50 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isInstalled ? 'Abrir no Celular ✓' : 'Instalar no Celular'}
                  </button>
                </div>

                {/* Sidebar Options */}
                <div className="space-y-0.5">
                  {[
                    { id: 'marked', label: 'Versículos Marcados', icon: Bookmark },
                    { id: 'search', label: 'Pesquisar Versículos', icon: Search },
                    { id: 'progress', label: 'Progresso de Leitura', icon: BookMarked },
                    { id: 'install_app', label: 'Instalar Aplicativo Nativo', icon: Smartphone },
                    { id: 'replay_splash', label: 'Animação de Abertura', icon: Sparkles },
                    { id: 'settings', label: 'Configurações', icon: Settings },
                    { id: 'novidades', label: 'Novidades', icon: Bell },
                    { id: 'support_donor', label: 'Seja Um Apoiador', icon: DollarSign },
                    { id: 'suggestion', label: 'Sugestão', icon: MessageSquare },
                    { id: 'rate', label: 'Avaliar Aplicativo', icon: Star },
                    { id: 'share', label: 'Compartilhar Aplicativo', icon: Share2 },
                    { id: 'more_apps', label: 'Mais Aplicativos', icon: Grid },
                    { id: 'about', label: 'Sobre o Aplicativo', icon: Info },
                    { id: 'support_contact', label: 'Suporte', icon: Mail },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setIsSidebarOpen(false);
                          if (item.id === 'support_donor') {
                            setActiveTab('support');
                          } else if (item.id === 'share') {
                            handleShareApp();
                          } else if (item.id === 'install_app') {
                            handleNativeInstallClick();
                          } else if (item.id === 'replay_splash') {
                            replaySplashScreen();
                          } else {
                            setActiveModal(item.id as any);
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-slate-400" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
                {user ? (
                  <button 
                    onClick={() => {
                      setUser(null);
                      setIsSidebarOpen(false);
                      setActiveTab('bible');
                      showToast('Sessão encerrada.');
                    }}
                    className="w-full py-2.5 bg-red-50 dark:bg-red-950/40 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sair
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-red-700"
                  >
                    Fazer Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN PANEL MODAL */}
        {activeModal === 'admin_panel' && user?.isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal('none')}></div>
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 z-10 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-red-600" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Painel do Administrador Geral</h3>
                </div>
                <button onClick={() => setActiveModal('none')} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Admin Management Sections */}
              <div className="space-y-6 text-xs">
                {/* 1. Post Novidade with Image & Text */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Pencil className="w-4 h-4 text-red-600" /> Publicar Novidade (Texto e Imagem)
                  </h4>
                  <input
                    type="text"
                    placeholder="Título da novidade"
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <textarea
                    rows={2}
                    placeholder="Conteúdo da novidade..."
                    value={newAnnText}
                    onChange={(e) => setNewAnnText(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl resize-none"
                  />
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold">Adicionar Imagem Ilustrativa (Opcional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setNewAnnImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!newAnnTitle.trim() || !newAnnText.trim()) return;
                      setAnnouncements(prev => [{ id: Date.now(), title: newAnnTitle, text: newAnnText, date: 'Hoje', imageUrl: newAnnImage || undefined }, ...prev]);
                      setNewAnnTitle('');
                      setNewAnnText('');
                      setNewAnnImage('');
                      showToast('Novidade publicada com sucesso!');
                    }}
                    className="w-full py-2.5 bg-red-600 text-white rounded-xl font-bold shadow-md hover:bg-red-700"
                  >
                    Publicar Novidade
                  </button>
                </div>

                {/* 2. DEDICATED SUGGESTIONS SECTION FOR ADMIN */}
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl space-y-3">
                  <h4 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-600" /> Caixa de Sugestões dos Clientes ({suggestions.length})
                  </h4>
                  {suggestions.length === 0 ? (
                    <p className="text-amber-700/60 dark:text-amber-400/60 italic text-[11px]">Nenhuma sugestão enviada pelos clientes ainda.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {suggestions.map(s => (
                        <div key={s.id} className="p-3 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 rounded-xl space-y-1">
                          <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                            <span>{s.name}</span>
                            <span className="text-[10px] text-slate-400">{s.date}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300">{s.text}</p>
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => {
                                setSuggestions(prev => prev.filter(item => item.id !== s.id));
                                showToast('Sugestão removida.');
                              }}
                              className="text-[10px] text-red-600 font-bold hover:underline"
                            >
                              Excluir Sugestão
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Moderate Prayers */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-600" /> Moderar Mural de Orações ({prayers.length})
                  </h4>
                  {prayers.length === 0 ? (
                    <p className="text-slate-400 italic">Nenhum pedido de oração ativo.</p>
                  ) : (
                    prayers.map(p => (
                      <div key={p.id} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
                          <p className="text-slate-500 truncate max-w-[200px]">{p.text}</p>
                        </div>
                        <button
                          onClick={() => {
                            setPrayers(prev => prev.filter(item => item.id !== p.id));
                            showToast('Oração removida pelo Administrador.');
                          }}
                          className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg font-bold text-[10px]"
                        >
                          Excluir
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OTHER SIDEBAR MODALS */}
        {activeModal !== 'none' && activeModal !== 'admin_panel' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal('none')}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 z-10 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white capitalize">
                    {activeModal === 'marked' && 'Versículos Marcados'}
                    {activeModal === 'search' && 'Pesquisar Versículos'}
                    {activeModal === 'progress' && 'Progresso de Leitura'}
                    {activeModal === 'settings' && 'Configurações'}
                    {activeModal === 'novidades' && 'Novidades'}
                    {activeModal === 'rate' && 'Avaliar Aplicativo'}
                    {activeModal === 'share' && 'Compartilhar Aplicativo'}
                    {activeModal === 'more_apps' && 'Mais Aplicativos'}
                    {activeModal === 'about' && 'Sobre o Aplicativo'}
                    {activeModal === 'support_contact' && 'Suporte'}
                    {activeModal === 'suggestion' && 'Enviar Sugestão'}
                  </h3>
                  {activeModal === 'about' && user?.isAdmin && (
                    <button 
                      onClick={() => setIsEditingAbout(!isEditingAbout)}
                      className="p-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      title="Editar com Caneta"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button onClick={() => setActiveModal('none')} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Marked Verses Modal */}
              {activeModal === 'marked' && (
                <div className="space-y-3 text-xs">
                  {Object.keys(highlights).length === 0 ? (
                    <p className="text-slate-400 text-center py-6">Nenhum versículo marcado ainda.</p>
                  ) : (
                    Object.entries(highlights).map(([key, col]) => (
                      <div key={key} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                        <div className="font-bold text-red-600">{key}</div>
                        <p className="text-slate-700 dark:text-slate-300">Versículo destacado.</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Search Modal */}
              {activeModal === 'search' && (
                <div className="space-y-4 text-xs">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Pesquisar palavra ou versículo..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    {searchQuery.trim() ? (
                      [
                        { ref: 'Mateus 5:3', text: 'Bem-aventurados os pobres de espírito, porque deles é o reino dos céus;' },
                        { ref: 'Mateus 5:14', text: 'Vós sois a luz do mundo; não se pode esconder uma cidade edificada sobre um monte;' }
                      ].map((res, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            setActiveModal('none');
                            setActiveTab('bible');
                          }}
                          className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-red-500 cursor-pointer"
                        >
                          <div className="font-bold text-red-600">{res.ref}</div>
                          <p className="text-slate-700 dark:text-slate-300 mt-1">{res.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-center py-6">Digite algo para pesquisar na Bíblia Sagrada.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Progress Modal */}
              {activeModal === 'progress' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900 text-center space-y-1">
                    <div className="text-sm font-bold text-red-700 dark:text-red-300">{currentBook}</div>
                    <div className="text-xl font-extrabold text-red-600">{readPercentage}% Concluído</div>
                    <p className="text-slate-500">{readListForBook.length} de {totalChapters} capítulos lidos</p>
                  </div>
                </div>
              )}

              {/* Settings Modal */}
              {activeModal === 'settings' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Modo Escuro</span>
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${isDarkMode ? 'bg-red-600 justify-end' : 'bg-slate-300 justify-start'}`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                    </button>
                  </div>

                  <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Tamanho da Fonte ({fontSize}px)</span>
                    <input
                      type="range"
                      min={14}
                      max={26}
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full accent-red-600"
                    />
                  </div>
                </div>
              )}

              {/* Novidades Modal */}
              {activeModal === 'novidades' && (
                <div className="space-y-3 text-xs">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                        <span>{ann.title}</span>
                        <span className="text-[10px] text-red-600">{ann.date}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{ann.text}</p>
                      {ann.imageUrl && (
                        <div className="rounded-xl overflow-hidden mt-2 h-36">
                          <img src={ann.imageUrl} alt="Novidade" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Rate Modal */}
              {activeModal === 'rate' && (
                <div className="text-center space-y-4 py-4">
                  <div className="flex justify-center gap-2 text-amber-400">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-8 h-8 fill-amber-400" />
                    ))}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Obrigado por avaliar o aplicativo!</h4>
                  <p className="text-xs text-slate-500">Seu feedback é muito importante.</p>
                  <button
                    onClick={() => { setActiveModal('none'); showToast('Avaliação enviada com sucesso!'); }}
                    className="w-full py-3 bg-red-600 text-white rounded-2xl font-bold text-xs shadow-lg"
                  >
                    Concluir
                  </button>
                </div>
              )}

              {/* Share Modal */}
              {activeModal === 'share' && (
                <div className="text-center space-y-4 py-4">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Compartilhe a Bíblia Sagrada</h4>
                  <p className="text-xs text-slate-500">Divulgue o link oficial: {OFFICIAL_URL}</p>
                  <button
                    onClick={() => {
                      handleShareApp();
                      setActiveModal('none');
                    }}
                    className="w-full py-3 bg-red-600 text-white rounded-2xl font-bold text-xs shadow-lg"
                  >
                    Compartilhar Aplicativo
                  </button>
                </div>
              )}

              {/* More Apps Modal */}
              {activeModal === 'more_apps' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Harpa Cristã Multiversões</div>
                      <p className="text-slate-500 text-[10px]">Hinos sagrados para adoração.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-red-100 text-red-600 rounded-xl font-bold text-[10px]">Em Breve</span>
                  </div>
                </div>
              )}

              {/* About Modal with Admin Editing */}
              {activeModal === 'about' && (
                <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                  <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-lg border border-red-500/30 flex items-center justify-center bg-red-600">
                    <img src={aboutImage} alt="Logo" className="w-full h-full object-cover" />
                  </div>

                  {isEditingAbout && user?.isAdmin ? (
                    <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200">
                      <div className="font-bold text-red-600 flex items-center gap-1">
                        <Pencil className="w-3.5 h-3.5" /> Editar Sobre o Aplicativo
                      </div>
                      <textarea
                        rows={3}
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 rounded-xl text-xs"
                      />
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold">Alterar Imagem/Logo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => setAboutImage(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-xs text-slate-500"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setIsEditingAbout(false);
                          showToast('Informações salvas com sucesso!');
                        }}
                        className="w-full py-2 bg-red-600 text-white rounded-xl font-bold shadow-md"
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">Bíblia Sagrada</h4>
                      <p className="leading-relaxed">{aboutText}</p>
                      <div className="pt-2 text-[11px] font-bold text-red-600">
                        {OFFICIAL_URL}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Support Contact Modal */}
              {activeModal === 'support_contact' && (
                <div className="space-y-3 text-xs">
                  <p className="text-slate-600 dark:text-slate-300">Entre em contato com o suporte:</p>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl font-bold text-red-600">
                    Samuellsilvva02@gmail.com
                  </div>
                </div>
              )}

              {/* Suggestion Modal */}
              {activeModal === 'suggestion' && (
                <div className="space-y-3 text-xs">
                  <p className="text-slate-600 dark:text-slate-300">Envie sua sugestão de melhoria:</p>
                  <textarea
                    rows={4}
                    placeholder="Escreva sua sugestão..."
                    value={newSuggestionText}
                    onChange={(e) => setNewSuggestionText(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none"
                  />
                  <button
                    onClick={() => {
                      requireLogin(() => {
                        if (!newSuggestionText.trim()) return;
                        setSuggestions(prev => [
                          { id: Date.now(), name: `${user?.name} ${user?.surname}`, text: newSuggestionText, date: 'Hoje', status: 'Pendente' },
                          ...prev
                        ]);
                        setNewSuggestionText('');
                        setActiveModal('none');
                        showToast('Sugestão enviada com sucesso!');
                      });
                    }}
                    className="w-full py-3 bg-red-600 text-white rounded-2xl font-bold text-xs shadow-lg hover:bg-red-700"
                  >
                    Enviar Sugestão
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOOK & CHAPTER SELECTION MODAL */}
        {isBookModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsBookModalOpen(false)}></div>
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 z-10 max-h-[85vh] flex flex-col space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Todos os 66 Livros da Bíblia</h3>
                <button onClick={() => setIsBookModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-4 flex-1 pr-1">
                <div>
                  <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2 sticky top-0 bg-white dark:bg-slate-900 py-1">
                    Antigo Testamento (39 Livros)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {BIBLE_BOOKS.filter(b => b.testament === 'Antigo').map((b) => (
                      <button
                        key={b.name}
                        onClick={() => {
                          setCurrentBook(b.name);
                          setCurrentChapter(1);
                          setIsBookModalOpen(false);
                          setActiveTab('bible');
                        }}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          currentBook === b.name
                            ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
                            : 'border-slate-200 dark:border-slate-700 hover:border-red-400 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="text-sm font-bold">{b.name}</div>
                        <div className="text-[10px] text-slate-400">{b.chapters} capítulos</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2 sticky top-0 bg-white dark:bg-slate-900 py-1">
                    Novo Testamento (27 Livros)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {BIBLE_BOOKS.filter(b => b.testament === 'Novo').map((b) => (
                      <button
                        key={b.name}
                        onClick={() => {
                          setCurrentBook(b.name);
                          setCurrentChapter(1);
                          setIsBookModalOpen(false);
                          setActiveTab('bible');
                        }}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          currentBook === b.name
                            ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
                            : 'border-slate-200 dark:border-slate-700 hover:border-red-400 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="text-sm font-bold">{b.name}</div>
                        <div className="text-[10px] text-slate-400">{b.chapters} capítulos</div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
