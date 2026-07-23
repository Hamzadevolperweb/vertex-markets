import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Globe, 
  ChevronDown, 
  ShieldCheck, 
  Building2, 
  Headphones, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  AlertTriangle,
  Loader2,
  User,
  Phone,
  TrendingUp,
  Zap,
  Shield,
  Clock,
  ChevronRight
} from 'lucide-react';
import heroBullImg from '../assets/images/vertex_hero_bull_1784320384594.jpg';

// Translation dictionaries matching both pages' high-fidelity content
const TRANSLATIONS = {
  EN: {
    // Page 2: Sign In
    signin_tag: 'PROFESSIONAL TRADING. WORLDWIDE.',
    signin_title1: 'Trade Smarter.',
    signin_title2: 'Trade Vertex.',
    signin_desc: 'Institutional-grade technology, deep liquidity, and tight spreads across global markets.',
    welcome: 'Welcome Back',
    sign_in_subtitle: 'Sign in to access your Vertex Markets account.',
    email: 'Email Address',
    password: 'Password',
    remember: 'Remember me',
    forgot: 'Forgot password?',
    sign_in_btn: 'Sign In Securely',
    or: 'or',
    or_continue: 'or continue with',
    create_acct: 'Create an Account',
    new_to_vertex: 'New to Vertex Markets? Join now and start trading.',
    risk_warning: 'Your capital is at risk. Trading involves significant risk.',
    secure_title: 'Secure Login',
    secure_desc: 'Your data is encrypted and protected.',
    regulated_title: 'Regulated Broker',
    regulated_desc: 'Licensed and regulated by global authorities.',
    support_title: '24/7 Support',
    support_desc: 'Our team is here whenever you trade.',
    
    // Page 3: Sign Up
    signup_tag: 'TRADE SMARTER. TRADE VERTEX.',
    signup_title: 'Your Edge in Global Markets',
    signup_desc: 'Join thousands of traders who trust Vertex Markets for institutional-grade technology, deep liquidity, and unmatched trading conditions.',
    signup_header: 'Create Your Account',
    signup_subtitle: 'Start your trading journey with Vertex Markets.',
    fullname: 'Full Name',
    confirm_password: 'Confirm Password',
    phone: 'Phone Number',
    country: 'Country of Residence',
    agree_terms: 'I agree to the Terms of Service and Privacy Policy',
    create_btn: 'Create Account',
    already: 'Already have an account? Sign In',
    security_note: 'Your data is protected with bank-level encryption and will never be shared with third parties.',
    trusted_bar: 'TRUSTED. REGULATED. SECURE.',
    liq_title: 'Institutional-Grade Liquidity',
    exec_title: 'Ultra-Fast Execution',
    env_title: 'Secure & Regulated Environment',
    real_support_title: '24/7 Support for Real Traders'
  },
  ES: {
    // Page 2: Sign In
    signin_tag: 'TRADING PROFESIONAL. EN TODO EL MUNDO.',
    signin_title1: 'Opere más inteligente.',
    signin_title2: 'Opere Vertex.',
    signin_desc: 'Tecnología de nivel institucional, liquidez profunda y diferenciales ajustados en los mercados globales.',
    welcome: 'Bienvenido de nuevo',
    sign_in_subtitle: 'Inicie sesión para acceder a su cuenta de Vertex Markets.',
    email: 'Correo electrónico',
    password: 'Contraseña',
    remember: 'Recordarme',
    forgot: '¿Olvidó su contraseña?',
    sign_in_btn: 'Iniciar sesión de forma segura',
    or: 'o',
    or_continue: 'o continuar con',
    create_acct: 'Crear una cuenta',
    new_to_vertex: '¿Nuevo en Vertex Markets? Regístrese ahora y opere.',
    risk_warning: 'Su capital está en riesgo. El comercio implica un riesgo significativo.',
    secure_title: 'Inicio seguro',
    secure_desc: 'Sus datos están encriptados y protegidos.',
    regulated_title: 'Bróker regulado',
    regulated_desc: 'Licenciado y regulado por autoridades globales.',
    support_title: 'Soporte 24/7',
    support_desc: 'Nuestro equipo está aquí siempre que opere.',

    // Page 3: Sign Up
    signup_tag: 'OPERE INTELIGENTE. OPERE VERTEX.',
    signup_title: 'Su ventaja en los mercados globales',
    signup_desc: 'Únase a miles de operadores que confían en Vertex Markets para obtener tecnología de nivel institucional, liquidez profunda y condiciones inmejorables.',
    signup_header: 'Crear su cuenta',
    signup_subtitle: 'Comience su viaje de trading con Vertex Markets.',
    fullname: 'Nombre completo',
    confirm_password: 'Confirmar contraseña',
    phone: 'Número de teléfono',
    country: 'País de residencia',
    agree_terms: 'Acepto los Términos de Servicio y la Política de Privacidad',
    create_btn: 'Crear cuenta',
    already: '¿Ya tiene una cuenta? Iniciar sesión',
    security_note: 'Sus datos están protegidos con cifrado de nivel bancario y nunca se compartirán con terceros.',
    trusted_bar: 'CONFIABLE. REGULADO. SEGURO.',
    liq_title: 'Liquidez de nivel institucional',
    exec_title: 'Ejecución ultra rápida',
    env_title: 'Entorno seguro y regulado',
    real_support_title: 'Soporte 24/7 para traders reales'
  },
  DE: {
    // Page 2: Sign In
    signin_tag: 'PROFESSIONELLER HANDEL. WELTWEIT.',
    signin_title1: 'Intelligenter handeln.',
    signin_title2: 'Vertex handeln.',
    signin_desc: 'Institutionelle Technologie, tiefe Liquidität und enge Spreads auf den globalen Märkten.',
    welcome: 'Willkommen zurück',
    sign_in_subtitle: 'Melden Sie sich an, um auf Ihr Vertex Markets-Konto zuzugreifen.',
    email: 'E-Mail-Adresse',
    password: 'Passwort',
    remember: 'Angemeldet bleiben',
    forgot: 'Passwort vergessen?',
    sign_in_btn: 'Sicher einloggen',
    or: 'oder',
    or_continue: 'oder fortfahren mit',
    create_acct: 'Ein Konto erstellen',
    new_to_vertex: 'Neu bei Vertex Markets? Jetzt beitreten und handeln.',
    risk_warning: 'Ihr Kapital ist gefährdet. Der Handel birgt erhebliche Risiken.',
    secure_title: 'Sicherer Login',
    secure_desc: 'Ihre Daten sind verschlüsselt und geschützt.',
    regulated_title: 'Regulierter Broker',
    regulated_desc: 'Lizenziert und reguliert durch globale Behörden.',
    support_title: 'Support 24/7',
    support_desc: 'Unser Team ist immer für Sie da, wenn Sie handeln.',

    // Page 3: Sign Up
    signup_tag: 'INTELLIGENTER HANDELN. VERTEX HANDELN.',
    signup_title: 'Ihr Vorsprung auf den globalen Märkten',
    signup_desc: 'Schließen Sie sich Tausenden von Händlern an, die Vertex Markets vertrauen, wenn es um institutionelle Technologie, tiefe Liquidität und unschlagbare Handelsbedingungen geht.',
    signup_header: 'Konto erstellen',
    signup_subtitle: 'Beginnen Sie Ihre Handelsreise mit Vertex Markets.',
    fullname: 'Vollständiger Name',
    confirm_password: 'Passwort bestätigen',
    phone: 'Telefonnummer',
    country: 'Land des Wohnsitzes',
    agree_terms: 'Ich stimme den Nutzungsbedingungen und der Datenschutzrichtlinie zu',
    create_btn: 'Konto erstellen',
    already: 'Haben Sie bereits ein Konto? Anmelden',
    security_note: 'Ihre Daten sind mit einer Verschlüsselung auf Bankniveau geschützt und werden niemals an Dritte weitergegeben.',
    trusted_bar: 'VERTRAUT. REGULIERT. SICHER.',
    liq_title: 'Institutionelle Liquidität',
    exec_title: 'Ultraschnelle Ausführung',
    env_title: 'Sichere & regulierte Umgebung',
    real_support_title: '24/7 Support für echte Trader'
  },
  AR: {
    // Page 2: Sign In
    signin_tag: 'التداول الاحترافي. في جميع أنحاء العالم.',
    signin_title1: 'تداول بذكاء أكبر.',
    signin_title2: 'تداول مع فيرتكس.',
    signin_desc: 'تكنولوجيا بمستوى مؤسسي، سيولة عميقة، وفروق أسعار ضيقة عبر الأسواق العالمية.',
    welcome: 'مرحباً بعودتك',
    sign_in_subtitle: 'سجل الدخول للوصول إلى حساب فيرتكس ماركتس الخاص بك.',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    remember: 'تذكرني',
    forgot: 'هل نسيت كلمة المرور؟',
    sign_in_btn: 'تسجيل الدخول بشكل آمن',
    or: 'أو',
    or_continue: 'أو الاستمرار بواسطة',
    create_acct: 'إنشاء حساب جديد',
    new_to_vertex: 'جديد في فيرتكس ماركتس؟ انضم الآن وابدأ التداول.',
    risk_warning: 'رأس مالك في خطر. التداول ينطوي على مخاطر كبيرة.',
    secure_title: 'دخول آمن',
    secure_desc: 'بياناتك مشفرة ومحمية بالكامل.',
    regulated_title: 'وسيط مرخص',
    regulated_desc: 'مرخص وخاضع للرقابة من قبل هيئات عالمية.',
    support_title: 'دعم ٢٤/٧',
    support_desc: 'فريقنا متواجد متى أردت التداول.',

    // Page 3: Sign Up
    signup_tag: 'تداول بذكاء أكبر. تداول مع فيرتكس.',
    signup_title: 'ميزتك في الأسواق العالمية',
    signup_desc: 'انضم إلى آلاف المتداولين الذين يثقون في فيرتكس ماركتس للحصول على تكنولوجيا بمستوى مؤسسي، وسيولة عميقة، وظروف تداول لا مثيل لها.',
    signup_header: 'إنشاء حسابك',
    signup_subtitle: 'ابدأ رحلة التداول الخاصة بك مع فيرتكس ماركتس.',
    fullname: 'الاسم الكامل',
    confirm_password: 'تأكيد كلمة المرور',
    phone: 'رقم الهاتف',
    country: 'بلد الإقامة',
    agree_terms: 'أوافق على شروط الخدمة وسياسة الخصوصية',
    create_btn: 'إنشاء حساب',
    already: 'لديك حساب بالفعل؟ تسجيل الدخول',
    security_note: 'بياناتك محمية بتشفير على مستوى البنوك ولن يتم مشاركتها أبداً مع أطراف ثالثة.',
    trusted_bar: 'موثوق. مرخص. آمن.',
    liq_title: 'سيولة بمستوى مؤسسي',
    exec_title: 'تنفيذ فائق السرعة',
    env_title: 'بيئة آمنة وخاضعة للرقابة',
    real_support_title: 'دعم ٢٤/٧ للمتداولين الحقيقيين'
  }
};

type LangKey = 'EN' | 'ES' | 'DE' | 'AR';

interface LoginPageProps {
  onBackToHome: () => void;
  initialMode?: 'signin' | 'signup';
  onLoginSuccess?: () => void;
}

const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸', name: 'United States / Canada' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+34', flag: '🇪🇸', name: 'Spain' }
];

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Australia',
  'Germany',
  'United Arab Emirates',
  'Saudi Arabia',
  'Spain',
  'Canada',
  'France',
  'Singapore',
  'Switzerland',
  'Japan'
];

export default function LoginPage({ onBackToHome, initialMode = 'signin', onLoginSuccess }: LoginPageProps) {
  // Form view mode
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [language, setLanguage] = useState<LangKey>('EN');
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneCode, setPhoneCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('United States');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Custom dropdown display states
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Simulation feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  const handleLanguageChange = (lang: LangKey) => {
    setLanguage(lang);
    setShowLangDropdown(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Form validation
    if (isSignUp) {
      if (!fullName) {
        setErrorMsg(language === 'AR' ? 'يرجى إدخال الاسم الكامل' : 'Please fill in your full name.');
        return;
      }
      if (!email) {
        setErrorMsg(language === 'AR' ? 'يرجى إدخال البريد الإلكتروني' : 'Please fill in your email address.');
        return;
      }
      if (!phoneNumber) {
        setErrorMsg(language === 'AR' ? 'يرجى إدخال رقم الهاتف' : 'Please fill in your phone number.');
        return;
      }
      if (!password) {
        setErrorMsg(language === 'AR' ? 'يرجى إدخال كلمة المرور' : 'Please create a password.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg(language === 'AR' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg(language === 'AR' ? 'يجب الموافقة على شروط الخدمة' : 'You must agree to the Terms of Service & Privacy Policy.');
        return;
      }
    } else {
      if (!email) {
        setErrorMsg(language === 'AR' ? 'يرجى إدخال البريد الإلكتروني' : 'Please fill in your email address.');
        return;
      }
      if (!password) {
        setErrorMsg(language === 'AR' ? 'يرجى إدخال كلمة المرور' : 'Please fill in your password.');
        return;
      }
    }

    // Trigger simulated server call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (email.includes('error')) {
        setErrorMsg(language === 'AR' ? 'بيانات الاعتماد غير صالحة.' : 'Invalid credentials. Please double check and try again.');
      } else {
        setSuccessMsg(
          isSignUp 
            ? (language === 'AR' ? 'تم إنشاء الحساب بنجاح! تم إرسال رابط التفعيل.' : 'Account successfully created! Verification link sent.')
            : (language === 'AR' ? 'تم منح الإذن بالدخول. أهلاً بك مجدداً!' : 'Access granted. Welcome back to Vertex Markets!')
        );
        // Clear forms on success
        setEmail('');
        setPassword('');
        setFullName('');
        setConfirmPassword('');
        setPhoneNumber('');
        setAgreeTerms(false);

        if (onLoginSuccess) {
          setTimeout(() => {
            onLoginSuccess();
          }, 1500);
        }
      }
    }, 2000);
  };

  const languages = [
    { key: 'EN' as LangKey, label: 'English' },
    { key: 'ES' as LangKey, label: 'Español' },
    { key: 'DE' as LangKey, label: 'Deutsch' },
    { key: 'AR' as LangKey, label: 'العربية' }
  ];

  const isRTL = language === 'AR';

  return (
    <div className="min-h-screen bg-black text-[#f4f4f5] font-sans flex flex-col justify-between overflow-x-hidden relative" id="login-root-view" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Subtle background glows matching the premium mockup design */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#1e60ff]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-[350px] h-[350px] bg-[#1e60ff]/3 rounded-full blur-[130px] pointer-events-none" />

      {/* 1. TOP HEADER NAVIGATION */}
      <header className="w-full h-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between z-45 relative">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-2">
          <button onClick={onBackToHome} className="flex items-center gap-2.5 group cursor-pointer focus:outline-none text-left">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <span className="absolute inset-0 bg-[#1e60ff]/20 rounded-lg blur-sm group-hover:bg-[#1e60ff]/30 transition-all"></span>
              <svg className="w-6 h-6 text-white relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4L12 20L20 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 4L12 12L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-bold text-[19px] tracking-wider text-white uppercase leading-none">Vertex</span>
              <span className="font-sans text-[9px] tracking-[0.28em] text-gray-400 uppercase leading-none mt-1.5">Markets</span>
            </div>
          </button>
        </div>

        {/* Right Side: State Toggle & Language Selector */}
        <div className="flex items-center gap-6">
          
          {/* Header Link Toggle matching EXACT wording in the screenshot */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 hidden sm:inline">
              {isSignUp ? 'Already have an account?' : 'New to Vertex Markets?'}
            </span>
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-[#1e60ff] hover:text-[#1e60ff]/80 transition-colors font-semibold flex items-center gap-1 cursor-pointer focus:outline-none"
              id="header-state-toggle-btn"
            >
              <span>{isSignUp ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className={`w-4 h-4 transform transition-transform ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Language Switcher Dropdown - Styled precisely like the screenshot */}
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.02] text-xs font-medium text-gray-300 transition-all cursor-pointer focus:outline-none"
              id="language-selector-dropdown-btn"
            >
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span>{languages.find(l => l.key === language)?.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            <AnimatePresence>
              {showLangDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-36 bg-[#09090d] border border-white/10 rounded-xl shadow-2xl p-1 z-50 overflow-hidden"
                    id="lang-options-panel"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.key}
                        onClick={() => handleLanguageChange(lang.key)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left ${
                          language === lang.key 
                            ? 'bg-[#1e60ff]/15 text-white font-semibold' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{lang.label}</span>
                        {language === lang.key && <Check className="w-3.5 h-3.5 text-[#1e60ff]" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* 2. MAIN 2-COLUMN LAYOUT PANEL */}
      <main className="flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Visual Brand Pillar */}
          <div className="lg:col-span-6 flex flex-col space-y-6 text-left relative order-2 lg:order-1">
            
            {/* 3D Pedestal Bull is in the center-top of left column in BOTH screenshots */}
            <div className="relative w-full max-w-xl mx-auto lg:mx-0 overflow-hidden rounded-xl bg-gradient-to-b from-[#060608] to-transparent p-1">
              <img
                src={heroBullImg}
                alt="Vertex Markets 3D metallic trading bull illustration with holographic screens"
                className="w-full h-auto select-none rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Tag block (Plain text tagline matching screenshot) */}
            <span className="text-[11px] font-bold tracking-[0.18em] text-[#1e60ff] uppercase block">
              {isSignUp ? t.signup_tag : t.signin_tag}
            </span>

            {/* Dynamic heading depending on which screen is active */}
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]">
              {isSignUp ? t.signup_title : (
                <>
                  {t.signin_title1}<br />
                  <span className="text-white">{t.signin_title2}</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 font-sans text-sm leading-relaxed max-w-xl">
              {isSignUp ? t.signup_desc : t.signin_desc}
            </p>

            {/* Features layout shifts dynamically depending on mode to reflect BOTH screenshots */}
            {isSignUp ? (
              /* Features grid with icons in circular badges and white texts */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4" id="signup-features-grid">
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-[#1e60ff]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-xs text-white leading-normal">{t.liq_title}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-[#1e60ff]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-xs text-white leading-normal">{t.exec_title}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-[#1e60ff]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-xs text-white leading-normal">{t.env_title}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-4 h-4 text-[#1e60ff]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-xs text-white leading-normal">{t.real_support_title}</h4>
                  </div>
                </div>

              </div>
            ) : (
              /* Standard horizontal layout for sign in screen */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/[0.08]" id="login-highlights-bar">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-[#1e60ff]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-xs text-white">{t.secure_title}</h4>
                    <p className="font-sans text-[10px] text-gray-500 mt-1 leading-normal">{t.secure_desc}</p>
                  </div>
                </div>

                <div className="hidden sm:block w-[1px] h-10 bg-white/[0.08] self-center" />

                <div className="flex items-start gap-3 -ml-0 sm:-ml-4">
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 mt-0.5">
                    <Building2 className="w-4 h-4 text-[#1e60ff]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-xs text-white">{t.regulated_title}</h4>
                    <p className="font-sans text-[10px] text-gray-500 mt-1 leading-normal">{t.regulated_desc}</p>
                  </div>
                </div>

                <div className="hidden sm:block w-[1px] h-10 bg-white/[0.08] self-center" />

                <div className="flex items-start gap-3 -ml-0 sm:-ml-4">
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 mt-0.5">
                    <Headphones className="w-4 h-4 text-[#1e60ff]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-xs text-white">{t.support_title}</h4>
                    <p className="font-sans text-[10px] text-gray-500 mt-1 leading-normal">{t.support_desc}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Regulatory Logos Bar on Sign Up Page Bottom precisely matching Screenshot 3 */}
            {isSignUp && (
              <div className="pt-8 border-t border-white/[0.08] mt-4 w-full" id="signup-regulatory-bar">
                <p className="text-[9px] font-bold text-gray-500 tracking-[0.2em] mb-4 text-center sm:text-left">
                  {t.trusted_bar}
                </p>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 justify-center sm:justify-start opacity-40 hover:opacity-60 transition-opacity">
                  
                  {/* FCA */}
                  <div className="flex items-center gap-1">
                    <span className="font-sans font-extrabold text-[17px] text-white tracking-tighter">FCA</span>
                    <div className="flex flex-col">
                      <span className="text-[5px] text-gray-400 font-semibold uppercase leading-none">Financial</span>
                      <span className="text-[5px] text-gray-400 font-semibold uppercase leading-none mt-0.5">Conduct</span>
                      <span className="text-[5px] text-gray-400 font-semibold uppercase leading-none mt-0.5">Authority</span>
                    </div>
                  </div>

                  {/* ASIC */}
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center p-0.5">
                      <div className="w-full h-full bg-white/20 rounded-full" />
                    </div>
                    <span className="font-sans font-bold text-[13px] text-white tracking-wider">ASIC</span>
                    <div className="flex flex-col">
                      <span className="text-[4.5px] text-gray-400 leading-none">Australian Securities &</span>
                      <span className="text-[4.5px] text-gray-400 leading-none mt-0.5">Investments Commission</span>
                    </div>
                  </div>

                  {/* FSCA */}
                  <div className="flex items-center gap-1">
                    <span className="font-sans font-black text-[14px] text-white tracking-widest">FSCA</span>
                    <div className="flex flex-col">
                      <span className="text-[4px] text-gray-400 leading-none">Financial Sector</span>
                      <span className="text-[4px] text-gray-400 leading-none mt-0.5">Conduct Authority</span>
                    </div>
                  </div>

                  {/* CySEC */}
                  <div className="flex items-center gap-1">
                    <span className="font-sans font-bold text-[13px] text-white tracking-normal">CySEC</span>
                    <div className="flex flex-col">
                      <span className="text-[4px] text-gray-400 leading-none">Cyprus Securities &</span>
                      <span className="text-[4px] text-gray-400 leading-none mt-0.5">Exchange Commission</span>
                    </div>
                  </div>

                  {/* DFSA */}
                  <div className="flex items-center gap-1">
                    <span className="font-sans font-extrabold text-[13px] text-white tracking-tighter">DFSA</span>
                    <div className="flex flex-col">
                      <span className="text-[4px] text-gray-400 leading-none">Dubai Financial</span>
                      <span className="text-[4px] text-gray-400 leading-none mt-0.5">Services Authority</span>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Premium Glowing Sign Up / Login Form Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end w-full order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="w-full p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#07070a]/95 shadow-[0_24px_80px_rgba(0,0,0,0.85)] text-left relative overflow-hidden"
              id="login-interactive-card"
            >
              {/* Premium top border subtle ambient blue glow strip */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#1e60ff]/40 to-transparent" />
              
              <div className="space-y-5">
                
                {/* Form Heading & Subtext (Centered precisely as mockup) */}
                <div className="space-y-1 text-center">
                  <h2 className="font-sans font-bold text-2xl sm:text-[25px] text-white tracking-tight">
                    {isSignUp ? t.signup_header : t.welcome}
                  </h2>
                  <p className="font-sans text-xs text-gray-400">
                    {isSignUp ? t.signup_subtitle : t.sign_in_subtitle}
                  </p>
                </div>

                {/* Simulated alert feedback toasts */}
                <AnimatePresence mode="wait">
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs flex items-center gap-2"
                      id="login-error-toast"
                    >
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}

                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-emerald-400 text-xs flex items-center gap-2"
                      id="login-success-toast"
                    >
                      <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                      <span>{successMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main Form Fields */}
                <form onSubmit={handleFormSubmit} className="space-y-3.5">
                  
                  {isSignUp ? (
                    /* SIGN UP FORM FIELDS MATCHING EXACTLY THE 3RD SCREENSHOT */
                    <>
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 block">{t.fullname}</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full bg-[#030303]/40 border border-white/10 focus:border-[#1e60ff]/50 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-colors placeholder-gray-500"
                          />
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 block">{t.email}</label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full bg-[#030303]/40 border border-white/10 focus:border-[#1e60ff]/50 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-colors placeholder-gray-500"
                          />
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        </div>
                      </div>

                      {/* Phone Number with country dropdown code */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 block">{t.phone}</label>
                        <div className="flex gap-2">
                          
                          {/* Country Code Selector */}
                          <div className="relative flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setShowPhoneDropdown(!showPhoneDropdown);
                                setShowCountryDropdown(false);
                              }}
                              className="h-full px-3 flex items-center gap-1.5 bg-[#030303]/40 border border-white/10 hover:border-white/20 rounded-lg text-xs text-white focus:outline-none cursor-pointer transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-gray-500" />
                              <span>{phoneCode}</span>
                              <ChevronDown className="w-3 h-3 text-gray-500" />
                            </button>

                            <AnimatePresence>
                              {showPhoneDropdown && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setShowPhoneDropdown(false)} />
                                  <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute left-0 mt-2 w-48 max-h-56 overflow-y-auto bg-[#09090d] border border-white/10 rounded-lg shadow-2xl p-1 z-50"
                                  >
                                    {COUNTRY_CODES.map((item) => (
                                      <button
                                        type="button"
                                        key={item.code}
                                        onClick={() => {
                                          setPhoneCode(item.code);
                                          setShowPhoneDropdown(false);
                                        }}
                                        className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-gray-300 hover:text-white hover:bg-white/5 text-left"
                                      >
                                        <span>{item.flag} {item.code}</span>
                                        <span className="text-[10px] text-gray-500 truncate max-w-[80px]">{item.name}</span>
                                      </button>
                                    ))}
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Phone input field */}
                          <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter your phone number"
                            className="flex-grow bg-[#030303]/40 border border-white/10 focus:border-[#1e60ff]/50 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors placeholder-gray-500"
                          />
                        </div>
                      </div>

                      {/* Country of Residence Dropdown */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 block">{t.country}</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setShowCountryDropdown(!showCountryDropdown);
                              setShowPhoneDropdown(false);
                            }}
                            className="w-full bg-[#030303]/40 border border-white/10 hover:border-white/20 focus:border-[#1e60ff]/50 rounded-lg px-3.5 py-2.5 text-xs text-white flex items-center justify-between transition-colors focus:outline-none cursor-pointer text-left"
                          >
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-500" />
                              <span>{country}</span>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                          </button>

                          <AnimatePresence>
                            {showCountryDropdown && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowCountryDropdown(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 5 }}
                                  className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-[#09090d] border border-white/10 rounded-lg shadow-2xl p-1 z-50"
                                >
                                  {COUNTRIES.map((name) => (
                                    <button
                                      type="button"
                                      key={name}
                                      onClick={() => {
                                        setCountry(name);
                                        setShowCountryDropdown(false);
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-md text-gray-300 hover:text-white hover:bg-white/5 text-left"
                                    >
                                      <span>{name}</span>
                                      {country === name && <Check className="w-3 h-3 text-[#1e60ff]" />}
                                    </button>
                                  ))}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Password and Confirm Password Side-by-Side Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Password */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300 block">{t.password}</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Create a password"
                              className="w-full bg-[#030303]/40 border border-white/10 focus:border-[#1e60ff]/50 rounded-lg pl-10 pr-9 py-2.5 text-xs text-white focus:outline-none transition-colors placeholder-gray-500"
                            />
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors focus:outline-none cursor-pointer"
                              title="Toggle password view"
                            >
                              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300 block">{t.confirm_password}</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm your password"
                              className="w-full bg-[#030303]/40 border border-white/10 focus:border-[#1e60ff]/50 rounded-lg pl-10 pr-9 py-2.5 text-xs text-white focus:outline-none transition-colors placeholder-gray-500"
                            />
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors focus:outline-none cursor-pointer"
                              title="Toggle password view"
                            >
                              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Agreement Checkbox */}
                      <div className="flex items-start gap-2.5 pt-1">
                        <input
                          type="checkbox"
                          id="terms-checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="w-4 h-4 mt-0.5 bg-black/40 border-white/10 rounded accent-[#1e60ff] cursor-pointer focus:ring-0 focus:ring-offset-0"
                        />
                        <label htmlFor="terms-checkbox" className="text-[11px] text-gray-400 select-none cursor-pointer leading-tight">
                          I agree to the <a href="#" className="text-[#1e60ff] hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-[#1e60ff] hover:underline font-medium">Privacy Policy</a>
                        </label>
                      </div>

                      {/* Create Account Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-[#1e60ff] hover:bg-[#1e60ff]/95 disabled:bg-[#1e60ff]/60 text-white font-semibold text-xs rounded-lg transition-all shadow-lg shadow-[#1e60ff]/20 flex items-center justify-center gap-2 mt-2.5 cursor-pointer active:scale-[0.99] focus:outline-none"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : null}
                        <span>{isLoading ? 'Processing...' : t.create_btn}</span>
                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                      </button>
                    </>
                  ) : (
                    /* SIGN IN FORM FIELDS MATCHING EXACTLY SCREENSHOT 1 */
                    <>
                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 block">{t.email}</label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full bg-[#030303]/40 border border-white/10 focus:border-[#1e60ff]/50 rounded-lg pl-4 pr-10 py-3 text-xs text-white focus:outline-none transition-colors placeholder-gray-500"
                            id="login-email-input"
                          />
                          <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 block">{t.password}</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full bg-[#030303]/40 border border-white/10 focus:border-[#1e60ff]/50 rounded-lg pl-4 pr-16 py-3 text-xs text-white focus:outline-none transition-colors placeholder-gray-500"
                            id="login-password-input"
                          />
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-gray-500" />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-gray-500 hover:text-white transition-colors focus:outline-none cursor-pointer"
                              title={showPassword ? 'Hide password' : 'Show password'}
                              id="login-password-toggle-btn"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Options row (Remember me & Forgot Password) */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 text-gray-400 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 bg-black/40 border-white/10 rounded accent-[#1e60ff] cursor-pointer focus:ring-0 focus:ring-offset-0"
                          />
                          <span>{t.remember}</span>
                        </label>
                        <a href="#" className="text-[#1e60ff] hover:text-[#1e60ff]/80 transition-colors font-semibold">
                          {t.forgot}
                        </a>
                      </div>

                      {/* Sign In Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-[#1e60ff] hover:bg-[#1e60ff]/95 disabled:bg-[#1e60ff]/60 text-white font-semibold text-xs rounded-lg transition-all duration-200 shadow-lg shadow-[#1e60ff]/20 hover:shadow-[#1e60ff]/30 flex items-center justify-center gap-2 mt-2.5 cursor-pointer active:scale-[0.98] focus:outline-none"
                        id="login-securely-submit-btn"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <Lock className="w-3.5 h-3.5" />
                        )}
                        <span>{isLoading ? 'Processing...' : t.sign_in_btn}</span>
                      </button>

                      {onLoginSuccess && (
                        <button
                          type="button"
                          onClick={onLoginSuccess}
                          className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] font-bold rounded-lg transition-all border border-white/5 text-center cursor-pointer focus:outline-none mt-2"
                        >
                          Bypass Login: View Trader Dashboard →
                        </button>
                      )}
                    </>
                  )}
                </form>

                {/* Or Continue With divider */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-x-0 h-[1.5px] bg-white/[0.05]" />
                  <span className="relative px-3 bg-[#07070a] text-[10px] text-gray-500 uppercase font-bold tracking-wider z-10">
                    {t.or_continue}
                  </span>
                </div>

                {/* Social Login Buttons Grid precisely matching the colors and icons from the mockup */}
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Google Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                        setSuccessMsg('Successfully connected via Google!');
                      }, 1200);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg text-[11px] text-white font-medium transition-colors cursor-pointer focus:outline-none"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 15 0 12 0 7.35 0 3.37 2.67 1.44 6.56l3.86 3C6.21 6.81 8.87 5.04 12 5.04z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.3 14.44C5.06 13.72 4.93 12.91 4.93 12c0-.91.13-1.72.37-2.44L1.44 6.56C.52 8.2 0 10.04 0 12c0 1.96.52 3.8 1.44 5.44l3.86-3z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.1.74-2.51 1.18-4.23 1.18-3.13 0-5.79-1.77-6.74-4.52L1.4 17.88C3.33 21.33 7.31 24 12 24z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* Apple Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                        setSuccessMsg('Successfully connected via Apple!');
                      }, 1200);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg text-[11px] text-white font-medium transition-colors cursor-pointer focus:outline-none"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.57 2.94-1.39" />
                    </svg>
                    <span>Apple</span>
                  </button>

                  {/* Microsoft Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                        setSuccessMsg('Successfully connected via Microsoft!');
                      }, 1200);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg text-[11px] text-white font-medium transition-colors cursor-pointer focus:outline-none"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 23 23">
                      <path fill="#F25022" d="M0 0h11v11H0z" />
                      <path fill="#7FBA00" d="M12 0h11v11H12z" />
                      <path fill="#00A4EF" d="M0 12h11v11H0z" />
                      <path fill="#FFB900" d="M12 12h11v11H12z" />
                    </svg>
                    <span>Microsoft</span>
                  </button>
                </div>

                {/* Secondary Bottom Links & Guard Label */}
                <div className="space-y-4 pt-1">
                  {isSignUp ? (
                    /* Guard label matching EXACTLY the footnote at the bottom of card in screenshot 3 */
                    <div className="flex items-start gap-2.5 p-3 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                      <Lock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[9.5px] text-gray-500 leading-normal">
                        {t.security_note}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-[11px] text-gray-500 text-center">
                        {t.new_to_vertex}
                      </p>
                      <div className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                        <ShieldCheck className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <p className="text-[9.5px] text-gray-500 leading-none">
                          {t.risk_warning}
                        </p>
                      </div>
                    </>
                  )}
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </main>

      {/* 3. SLEEK COPYRIGHT FOOTER STRIP (Centered horizontal row matching design) */}
      <footer className="w-full border-t border-white/[0.04] py-6 z-10 relative bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[10.5px] text-gray-500 font-sans">
            <span>© {new Date().getFullYear()} Vertex Markets Ltd. All rights reserved.</span>
            <span className="text-white/10 hidden sm:inline">|</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-white/10">|</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span className="text-white/10">|</span>
            <a href="#" className="hover:text-white transition-colors">Risk Disclosure</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
