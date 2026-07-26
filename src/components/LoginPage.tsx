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
  ArrowRight,
  AlertTriangle,
  Loader2,
  User,
  Phone,
  TrendingUp,
  Zap,
  Shield,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { assetBull, assetGlassCharts, assetPedestal } from '../assets/images';

const TRANSLATIONS = {
  EN: {
    signin_tag: 'PROFESSIONAL TRADING. WORLDWIDE.',
    signin_title1: 'Trade Smarter.',
    signin_title2: 'Trade Vunex.',
    signin_desc:
      'Institutional-grade technology, deep liquidity, and tight spreads across global markets.',
    welcome: 'Welcome Back',
    sign_in_subtitle: 'Sign in to access your Vunex Market account.',
    email: 'Email Address',
    password: 'Password',
    remember: 'Remember me',
    forgot: 'Forgot password?',
    sign_in_btn: 'Sign In Securely',
    or: 'or',
    or_continue: 'or continue with',
    create_acct: 'Create an Account',
    new_to_vertex: 'New to Vunex Market? Join now and start trading.',
    risk_warning: 'Your capital is at risk. Trading involves significant risk.',
    secure_title: 'Secure Login',
    secure_desc: 'Your data is encrypted and protected.',
    regulated_title: 'Regulated Broker',
    regulated_desc: 'Licensed and regulated by global authorities.',
    support_title: '24/7 Support',
    support_desc: 'Our team is here whenever you trade.',
    signup_tag: 'TRADE SMARTER. TRADE VUNEX.',
    signup_title: 'Your Edge in Global Markets',
    signup_desc:
      'Join thousands of traders who trust Vunex Market for institutional-grade technology, deep liquidity, and unmatched trading conditions.',
    signup_header: 'Create Your Account',
    signup_subtitle: 'Start your trading journey with Vunex Market.',
    fullname: 'Full Name',
    confirm_password: 'Confirm Password',
    phone: 'Phone Number',
    country: 'Country of Residence',
    agree_terms: 'I agree to the Terms of Service and Privacy Policy',
    create_btn: 'Create Account',
    already: 'Already have an account?',
    already_action: 'Sign In',
    security_note:
      'Your data is protected with bank-level encryption and will never be shared with third parties.',
    trusted_bar: 'TRUSTED. REGULATED. SECURE.',
    liq_title: 'Institutional-Grade Liquidity',
    exec_title: 'Ultra-Fast Execution',
    env_title: 'Secure & Regulated Environment',
    real_support_title: '24/7 Support for Real Traders',
  },
  ES: {
    signin_tag: 'TRADING PROFESIONAL. EN TODO EL MUNDO.',
    signin_title1: 'Opere más inteligente.',
    signin_title2: 'Opere Vunex.',
    signin_desc:
      'Tecnología de nivel institucional, liquidez profunda y diferenciales ajustados en los mercados globales.',
    welcome: 'Bienvenido de nuevo',
    sign_in_subtitle: 'Inicie sesión para acceder a su cuenta de Vunex Market.',
    email: 'Correo electrónico',
    password: 'Contraseña',
    remember: 'Recordarme',
    forgot: '¿Olvidó su contraseña?',
    sign_in_btn: 'Iniciar sesión de forma segura',
    or: 'o',
    or_continue: 'o continuar con',
    create_acct: 'Crear una cuenta',
    new_to_vertex: '¿Nuevo en Vunex Market? Regístrese ahora y opere.',
    risk_warning:
      'Su capital está en riesgo. El comercio implica un riesgo significativo.',
    secure_title: 'Inicio seguro',
    secure_desc: 'Sus datos están encriptados y protegidos.',
    regulated_title: 'Bróker regulado',
    regulated_desc: 'Licenciado y regulado por autoridades globales.',
    support_title: 'Soporte 24/7',
    support_desc: 'Nuestro equipo está aquí siempre que opere.',
    signup_tag: 'OPERE INTELIGENTE. OPERE VUNEX.',
    signup_title: 'Su ventaja en los mercados globales',
    signup_desc:
      'Únase a miles de operadores que confían en Vunex Market para obtener tecnología de nivel institucional, liquidez profunda y condiciones inmejorables.',
    signup_header: 'Crear su cuenta',
    signup_subtitle: 'Comience su viaje de trading con Vunex Market.',
    fullname: 'Nombre completo',
    confirm_password: 'Confirmar contraseña',
    phone: 'Número de teléfono',
    country: 'País de residencia',
    agree_terms: 'Acepto los Términos de Servicio y la Política de Privacidad',
    create_btn: 'Crear cuenta',
    already: '¿Ya tiene una cuenta?',
    already_action: 'Iniciar sesión',
    security_note:
      'Sus datos están protegidos con cifrado de nivel bancario y nunca se compartirán con terceros.',
    trusted_bar: 'CONFIABLE. REGULADO. SEGURO.',
    liq_title: 'Liquidez de nivel institucional',
    exec_title: 'Ejecución ultra rápida',
    env_title: 'Entorno seguro y regulado',
    real_support_title: 'Soporte 24/7 para traders reales',
  },
  DE: {
    signin_tag: 'PROFESSIONELLER HANDEL. WELTWEIT.',
    signin_title1: 'Intelligenter handeln.',
    signin_title2: 'Vunex handeln.',
    signin_desc:
      'Institutionelle Technologie, tiefe Liquidität und enge Spreads auf den globalen Märkten.',
    welcome: 'Willkommen zurück',
    sign_in_subtitle:
      'Melden Sie sich an, um auf Ihr Vunex Market-Konto zuzugreifen.',
    email: 'E-Mail-Adresse',
    password: 'Passwort',
    remember: 'Angemeldet bleiben',
    forgot: 'Passwort vergessen?',
    sign_in_btn: 'Sicher einloggen',
    or: 'oder',
    or_continue: 'oder fortfahren mit',
    create_acct: 'Ein Konto erstellen',
    new_to_vertex: 'Neu bei Vunex Market? Jetzt beitreten und handeln.',
    risk_warning:
      'Ihr Kapital ist gefährdet. Der Handel birgt erhebliche Risiken.',
    secure_title: 'Sicherer Login',
    secure_desc: 'Ihre Daten sind verschlüsselt und geschützt.',
    regulated_title: 'Regulierter Broker',
    regulated_desc: 'Lizenziert und reguliert durch globale Behörden.',
    support_title: 'Support 24/7',
    support_desc: 'Unser Team ist immer für Sie da, wenn Sie handeln.',
    signup_tag: 'INTELLIGENTER HANDELN. VUNEX HANDELN.',
    signup_title: 'Ihr Vorsprung auf den globalen Märkten',
    signup_desc:
      'Schließen Sie sich Tausenden von Händlern an, die Vunex Market vertrauen, wenn es um institutionelle Technologie, tiefe Liquidität und unschlagbare Handelsbedingungen geht.',
    signup_header: 'Konto erstellen',
    signup_subtitle: 'Beginnen Sie Ihre Handelsreise mit Vunex Market.',
    fullname: 'Vollständiger Name',
    confirm_password: 'Passwort bestätigen',
    phone: 'Telefonnummer',
    country: 'Land des Wohnsitzes',
    agree_terms:
      'Ich stimme den Nutzungsbedingungen und der Datenschutzrichtlinie zu',
    create_btn: 'Konto erstellen',
    already: 'Haben Sie bereits ein Konto?',
    already_action: 'Anmelden',
    security_note:
      'Ihre Daten sind mit einer Verschlüsselung auf Bankniveau geschützt und werden niemals an Dritte weitergegeben.',
    trusted_bar: 'VERTRAUT. REGULIERT. SICHER.',
    liq_title: 'Institutionelle Liquidität',
    exec_title: 'Ultraschnelle Ausführung',
    env_title: 'Sichere & regulierte Umgebung',
    real_support_title: '24/7 Support für echte Trader',
  },
  AR: {
    signin_tag: 'التداول الاحترافي. في جميع أنحاء العالم.',
    signin_title1: 'تداول بذكاء أكبر.',
    signin_title2: 'تداول مع فيونكس.',
    signin_desc:
      'تكنولوجيا بمستوى مؤسسي، سيولة عميقة، وفروق أسعار ضيقة عبر الأسواق العالمية.',
    welcome: 'مرحباً بعودتك',
    sign_in_subtitle: 'سجل الدخول للوصول إلى حساب فيونكس ماركت الخاص بك.',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    remember: 'تذكرني',
    forgot: 'هل نسيت كلمة المرور؟',
    sign_in_btn: 'تسجيل الدخول بشكل آمن',
    or: 'أو',
    or_continue: 'أو الاستمرار بواسطة',
    create_acct: 'إنشاء حساب جديد',
    new_to_vertex: 'جديد في فيونكس ماركت؟ انضم الآن وابدأ التداول.',
    risk_warning: 'رأس مالك في خطر. التداول ينطوي على مخاطر كبيرة.',
    secure_title: 'دخول آمن',
    secure_desc: 'بياناتك مشفرة ومحمية بالكامل.',
    regulated_title: 'وسيط مرخص',
    regulated_desc: 'مرخص وخاضع للرقابة من قبل هيئات عالمية.',
    support_title: 'دعم ٢٤/٧',
    support_desc: 'فريقنا متواجد متى أردت التداول.',
    signup_tag: 'تداول بذكاء أكبر. تداول مع فيونكس.',
    signup_title: 'ميزتك في الأسواق العالمية',
    signup_desc:
      'انضم إلى آلاف المتداولين الذين يثقون في فيونكس ماركت للحصول على تكنولوجيا بمستوى مؤسسي، وسيولة عميقة، وظروف تداول لا مثيل لها.',
    signup_header: 'إنشاء حسابك',
    signup_subtitle: 'ابدأ رحلة التداول الخاصة بك مع فيونكس ماركت.',
    fullname: 'الاسم الكامل',
    confirm_password: 'تأكيد كلمة المرور',
    phone: 'رقم الهاتف',
    country: 'بلد الإقامة',
    agree_terms: 'أوافق على شروط الخدمة وسياسة الخصوصية',
    create_btn: 'إنشاء حساب',
    already: 'لديك حساب بالفعل؟',
    already_action: 'تسجيل الدخول',
    security_note:
      'بياناتك محمية بتشفير على مستوى البنوك ولن يتم مشاركتها أبداً مع أطراف ثالثة.',
    trusted_bar: 'موثوق. مرخص. آمن.',
    liq_title: 'سيولة بمستوى مؤسسي',
    exec_title: 'تنفيذ فائق السرعة',
    env_title: 'بيئة آمنة وخاضعة للرقابة',
    real_support_title: 'دعم ٢٤/٧ للمتداولين الحقيقيين',
  },
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
  { code: '+34', flag: '🇪🇸', name: 'Spain' },
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
  'Japan',
];

/* ---------- Floating price pill shown on the hero bull scene ---------- */
function PricePill({
  pair,
  price,
  change,
  className,
}: {
  pair: string;
  price: string;
  change: string;
  className?: string;
}) {
  const isPositive = change.startsWith('+');
  return (
    <div
      className={`absolute z-20 bg-black/70 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 pointer-events-none select-none ${className}`}
    >
      <p className="text-[9px] text-gray-400 font-semibold tracking-wider uppercase leading-none">
        {pair}
      </p>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="text-[13px] font-bold text-white leading-none">
          {price}
        </span>
      </div>
      <span
        className={`text-[9px] font-semibold leading-none ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}
      >
        {change}
      </span>
    </div>
  );
}

/* ---------- Composed hero bull scene with pedestal + glass + labels ---------- */
function HeroBullScene({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative w-full ${compact ? 'max-w-lg' : 'max-w-xl'} mx-auto lg:mx-0`}
    >
      <div
        className={`relative ${compact ? 'aspect-[5/4]' : 'aspect-[4/3]'}`}
      >
        <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 w-[55%] h-[18%] bg-[#1e60ff]/20 rounded-full blur-[50px] pointer-events-none" />

        <img
          src={assetGlassCharts}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-[1] opacity-60"
          draggable={false}
        />
        <img
          src={assetPedestal}
          alt=""
          className="absolute bottom-[1%] left-1/2 -translate-x-1/2 w-[55%] object-contain pointer-events-none select-none z-[2]"
          draggable={false}
        />

        <motion.img
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          src={assetBull}
          alt="Trading bull"
          className="relative z-[3] w-full h-full object-contain object-center select-none pointer-events-none"
          draggable={false}
        />

        <PricePill
          pair="EURUSD"
          price="1.08945"
          change="+0.47%"
          className="top-[10%] left-[38%] sm:left-[42%]"
        />
        <PricePill
          pair="XAUUSD"
          price="2,394.65"
          change="+0.62%"
          className="top-[38%] left-[2%] sm:left-[4%]"
        />
        <PricePill
          pair="GBPUSD"
          price="1.27482"
          change="+0.35%"
          className="top-[42%] right-[2%] sm:right-[4%]"
        />
      </div>
    </div>
  );
}

export default function LoginPage({
  onBackToHome,
  initialMode = 'signin',
  onLoginSuccess,
}: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [language, setLanguage] = useState<LangKey>('EN');
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneCode, setPhoneCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const t = TRANSLATIONS[language];
  const isRTL = language === 'AR';

  const handleLanguageChange = (lang: LangKey) => {
    setLanguage(lang);
    setShowLangDropdown(false);
  };

  const languages = [
    { key: 'EN' as LangKey, label: 'English' },
    { key: 'ES' as LangKey, label: 'Español' },
    { key: 'DE' as LangKey, label: 'Deutsch' },
    { key: 'AR' as LangKey, label: 'العربية' },
  ];

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isSignUp) {
      if (!fullName) {
        setErrorMsg('Please fill in your full name.');
        return;
      }
      if (!email) {
        setErrorMsg('Please fill in your email address.');
        return;
      }
      if (!phoneNumber) {
        setErrorMsg('Please fill in your phone number.');
        return;
      }
      if (!password) {
        setErrorMsg('Please create a password.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg(
          'You must agree to the Terms of Service & Privacy Policy.',
        );
        return;
      }
    } else {
      if (!email) {
        setErrorMsg('Please fill in your email address.');
        return;
      }
      if (!password) {
        setErrorMsg('Please fill in your password.');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (email.includes('error')) {
        setErrorMsg(
          'Invalid credentials. Please double check and try again.',
        );
      } else {
        setSuccessMsg(
          isSignUp
            ? 'Account successfully created! Verification link sent.'
            : 'Access granted. Welcome back to Vunex Market!',
        );
        setEmail('');
        setPassword('');
        setFullName('');
        setConfirmPassword('');
        setPhoneNumber('');
        setAgreeTerms(false);
        if (onLoginSuccess) {
          setTimeout(() => onLoginSuccess(), 1500);
        }
      }
    }, 2000);
  };

  /* ------------------------------------------------------------------ */
  /*  Input field style tokens                                          */
  /* ------------------------------------------------------------------ */
  const inputBase =
    'w-full bg-[#0a0a0f] border border-white/10 focus:border-[#1e60ff]/50 rounded-lg text-[13px] text-white focus:outline-none transition-colors placeholder-gray-500';

  return (
    <div
      className="min-h-screen bg-black text-[#f4f4f5] font-sans flex flex-col justify-between overflow-x-hidden relative"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#1e60ff]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-[350px] h-[350px] bg-[#1e60ff]/3 rounded-full blur-[130px] pointer-events-none" />

      {/* ============================================================= */}
      {/*  HEADER                                                       */}
      {/* ============================================================= */}
      <header className="w-full px-6 lg:px-10 xl:px-14 py-6 flex items-center justify-between z-40 relative">
        <BrandLogo onClick={onBackToHome} variant="mark" />

        <div className="flex items-center gap-5">
          {isSignUp ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 hidden sm:inline">
                {t.already}
              </span>
              <button
                onClick={switchMode}
                className="text-[#1e60ff] hover:text-[#1e60ff]/80 transition-colors font-semibold flex items-center gap-1 cursor-pointer focus:outline-none"
              >
                <span>{t.already_action}</span>
                <ArrowRight
                  className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/[0.03] text-xs font-medium text-gray-300 transition-all cursor-pointer focus:outline-none"
              >
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                <span>
                  {languages.find((l) => l.key === language)?.label}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              <AnimatePresence>
                {showLangDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowLangDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-36 bg-[#09090d] border border-white/10 rounded-xl shadow-2xl p-1 z-50 overflow-hidden"
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
                          {language === lang.key && (
                            <Check className="w-3.5 h-3.5 text-[#1e60ff]" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </header>

      {/* ============================================================= */}
      {/*  MAIN 2-COLUMN LAYOUT                                         */}
      {/* ============================================================= */}
      <main className="flex-grow flex items-center justify-center py-4 px-6 lg:px-10 z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start px-6 lg:px-10 xl:px-14">
          {/* --------------------------------------------------------- */}
          {/*  LEFT COLUMN                                              */}
          {/* --------------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col text-left relative order-2 lg:order-1">
            {isSignUp ? (
              /* ===== SIGN-UP LEFT: hero → tagline → heading+features → desc → regulatory ===== */
              <>
                <HeroBullScene />

                <span className="text-[11px] font-bold tracking-[0.18em] text-[#1e60ff] uppercase mt-6 block">
                  {t.signup_tag}
                </span>

                <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mt-4 items-start">
                  <div className="flex-shrink-0 sm:max-w-[240px]">
                    <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-tight leading-[1.12]">
                      {t.signup_title}
                    </h1>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-5 flex-1">
                    {[
                      {
                        icon: TrendingUp,
                        label: t.liq_title,
                      },
                      { icon: Zap, label: t.exec_title },
                      { icon: Shield, label: t.env_title },
                      {
                        icon: Headphones,
                        label: t.real_support_title,
                      },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-[#1e60ff]" />
                        </div>
                        <span className="text-[12px] font-semibold text-white leading-snug">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mt-4 max-w-xl">
                  {t.signup_desc}
                </p>

                {/* Regulatory logos bar */}
                <div className="pt-6 border-t border-white/[0.08] mt-6 w-full">
                  <p className="text-[9px] font-bold text-gray-500 tracking-[0.2em] mb-4">
                    {t.trusted_bar}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-7 gap-y-4 opacity-40 hover:opacity-60 transition-opacity">
                    <div className="flex items-center gap-1">
                      <span className="font-sans font-extrabold text-[17px] text-white tracking-tighter">
                        FCA
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[5px] text-gray-400 font-semibold uppercase leading-none">
                          Financial
                        </span>
                        <span className="text-[5px] text-gray-400 font-semibold uppercase leading-none mt-0.5">
                          Conduct
                        </span>
                        <span className="text-[5px] text-gray-400 font-semibold uppercase leading-none mt-0.5">
                          Authority
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center p-0.5">
                        <div className="w-full h-full bg-white/20 rounded-full" />
                      </div>
                      <span className="font-sans font-bold text-[13px] text-white tracking-wider">
                        ASIC
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[4.5px] text-gray-400 leading-none">
                          Australian Securities &amp;
                        </span>
                        <span className="text-[4.5px] text-gray-400 leading-none mt-0.5">
                          Investments Commission
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-sans font-black text-[14px] text-white tracking-widest">
                        FSCA
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[4px] text-gray-400 leading-none">
                          Financial Sector
                        </span>
                        <span className="text-[4px] text-gray-400 leading-none mt-0.5">
                          Conduct Authority
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-sans font-bold text-[13px] text-white">
                        CySEC
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[4px] text-gray-400 leading-none">
                          Cyprus Securities &amp;
                        </span>
                        <span className="text-[4px] text-gray-400 leading-none mt-0.5">
                          Exchange Commission
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-sans font-extrabold text-[13px] text-white tracking-tighter">
                        DFSA
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[4px] text-gray-400 leading-none">
                          Dubai Financial
                        </span>
                        <span className="text-[4px] text-gray-400 leading-none mt-0.5">
                          Services Authority
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* ===== SIGN-IN LEFT: tagline → heading → desc → hero → trust items ===== */
              <>
                <span className="text-[11px] font-bold tracking-[0.18em] text-[#1e60ff] uppercase block">
                  {t.signin_tag}
                </span>

                <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.12]">
                  {t.signin_title1}
                  <br />
                  {t.signin_title2}
                </h1>

                <p className="text-gray-400 text-sm leading-relaxed mt-4 max-w-md">
                  {t.signin_desc}
                </p>

                <div className="mt-6">
                  <HeroBullScene compact />
                </div>

                {/* Trust items row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-0 pt-6 mt-2">
                  {[
                    {
                      icon: ShieldCheck,
                      title: t.secure_title,
                      desc: t.secure_desc,
                    },
                    {
                      icon: Building2,
                      title: t.regulated_title,
                      desc: t.regulated_desc,
                    },
                    {
                      icon: Headphones,
                      title: t.support_title,
                      desc: t.support_desc,
                    },
                  ].map((item, i) => (
                    <React.Fragment key={item.title}>
                      {i > 0 && (
                        <div className="hidden sm:block w-[1px] h-10 bg-white/[0.08] mx-5 flex-shrink-0" />
                      )}
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
                          <item.icon className="w-4 h-4 text-[#1e60ff]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-white">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* --------------------------------------------------------- */}
          {/*  RIGHT COLUMN — FORM CARD                                 */}
          {/* --------------------------------------------------------- */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[440px] p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#07070a]/95 shadow-[0_24px_80px_rgba(0,0,0,0.85)] text-left relative overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#1e60ff]/40 to-transparent" />

              <div className="space-y-5">
                {/* Heading */}
                <div className="space-y-1.5 text-center">
                  <h2 className="font-bold text-[24px] sm:text-[26px] text-white tracking-tight">
                    {isSignUp ? t.signup_header : t.welcome}
                  </h2>
                  <p className="text-[13px] text-gray-400">
                    {isSignUp ? t.signup_subtitle : t.sign_in_subtitle}
                  </p>
                </div>

                {/* Alert toasts */}
                <AnimatePresence mode="wait">
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs flex items-center gap-2"
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
                    >
                      <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                      <span>{successMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ------------- FORM ------------- */}
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {isSignUp ? (
                    /* ========== SIGN-UP FIELDS ========== */
                    <>
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 block">
                          {t.fullname}
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className={`${inputBase} pl-10 pr-4 py-2.5`}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 block">
                          {t.email}
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className={`${inputBase} pl-10 pr-4 py-2.5`}
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 block">
                          {t.phone}
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setShowPhoneDropdown(!showPhoneDropdown);
                                setShowCountryDropdown(false);
                              }}
                              className="h-full px-3 flex items-center gap-1.5 bg-[#0a0a0f] border border-white/10 hover:border-white/20 rounded-lg text-xs text-white cursor-pointer transition-colors focus:outline-none"
                            >
                              <Phone className="w-3.5 h-3.5 text-gray-500" />
                              <span>{phoneCode}</span>
                              <ChevronDown className="w-3 h-3 text-gray-500" />
                            </button>
                            <AnimatePresence>
                              {showPhoneDropdown && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={() =>
                                      setShowPhoneDropdown(false)
                                    }
                                  />
                                  <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute left-0 mt-1 w-48 max-h-56 overflow-y-auto bg-[#09090d] border border-white/10 rounded-lg shadow-2xl p-1 z-50"
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
                                        <span>
                                          {item.flag} {item.code}
                                        </span>
                                        <span className="text-[10px] text-gray-500 truncate max-w-[80px]">
                                          {item.name}
                                        </span>
                                      </button>
                                    ))}
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                          <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter your phone number"
                            className={`${inputBase} flex-grow px-3.5 py-2.5`}
                          />
                        </div>
                      </div>

                      {/* Country of Residence */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 block">
                          {t.country}
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setShowCountryDropdown(!showCountryDropdown);
                              setShowPhoneDropdown(false);
                            }}
                            className={`${inputBase} px-3.5 py-2.5 flex items-center justify-between cursor-pointer text-left`}
                          >
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-500" />
                              <span
                                className={
                                  country ? 'text-white' : 'text-gray-500'
                                }
                              >
                                {country || 'Select your country'}
                              </span>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                          <AnimatePresence>
                            {showCountryDropdown && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() =>
                                    setShowCountryDropdown(false)
                                  }
                                />
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
                                      {country === name && (
                                        <Check className="w-3 h-3 text-[#1e60ff]" />
                                      )}
                                    </button>
                                  ))}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Password + Confirm side by side */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300 block">
                            {t.password}
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Create a password"
                              className={`${inputBase} pl-10 pr-9 py-2.5`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer focus:outline-none"
                            >
                              {showPassword ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300 block">
                            {t.confirm_password}
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                              type={
                                showConfirmPassword ? 'text' : 'password'
                              }
                              required
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              placeholder="Confirm your password"
                              className={`${inputBase} pl-10 pr-9 py-2.5`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer focus:outline-none"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Terms checkbox */}
                      <div className="flex items-start gap-2.5 pt-1">
                        <input
                          type="checkbox"
                          id="terms-checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="w-4 h-4 mt-0.5 bg-black/40 border-white/10 rounded accent-[#1e60ff] cursor-pointer focus:ring-0 focus:ring-offset-0"
                        />
                        <label
                          htmlFor="terms-checkbox"
                          className="text-[11px] text-gray-400 select-none cursor-pointer leading-tight"
                        >
                          I agree to the{' '}
                          <a
                            href="#"
                            className="text-[#1e60ff] hover:underline font-medium"
                          >
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a
                            href="#"
                            className="text-[#1e60ff] hover:underline font-medium"
                          >
                            Privacy Policy
                          </a>
                        </label>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-[#1e60ff] hover:bg-[#1e60ff]/90 disabled:bg-[#1e60ff]/60 text-white font-semibold text-[13px] rounded-lg transition-all shadow-lg shadow-[#1e60ff]/20 flex items-center justify-center gap-2 mt-1 cursor-pointer active:scale-[0.99] focus:outline-none"
                      >
                        {isLoading && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        <span>
                          {isLoading ? 'Processing...' : t.create_btn}
                        </span>
                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                      </button>
                    </>
                  ) : (
                    /* ========== SIGN-IN FIELDS ========== */
                    <>
                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 block">
                          {t.email}
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className={`${inputBase} pl-4 pr-10 py-3`}
                          />
                          <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 block">
                          {t.password}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className={`${inputBase} pl-4 pr-16 py-3`}
                          />
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-gray-500" />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPassword(!showPassword)
                              }
                              className="text-gray-500 hover:text-white transition-colors cursor-pointer focus:outline-none"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remember / Forgot */}
                      <div className="flex items-center justify-between text-xs pt-0.5">
                        <label className="flex items-center gap-2 text-gray-400 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) =>
                              setRememberMe(e.target.checked)
                            }
                            className="w-4 h-4 bg-black/40 border-white/10 rounded accent-[#1e60ff] cursor-pointer focus:ring-0 focus:ring-offset-0"
                          />
                          <span>{t.remember}</span>
                        </label>
                        <a
                          href="#"
                          className="text-[#1e60ff] hover:text-[#1e60ff]/80 transition-colors font-semibold"
                        >
                          {t.forgot}
                        </a>
                      </div>

                      {/* Sign In button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-[#1e60ff] hover:bg-[#1e60ff]/90 disabled:bg-[#1e60ff]/60 text-white font-semibold text-[13px] rounded-lg transition-all shadow-lg shadow-[#1e60ff]/20 hover:shadow-[#1e60ff]/30 flex items-center justify-center gap-2 mt-1 cursor-pointer active:scale-[0.98] focus:outline-none"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Lock className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {isLoading ? 'Processing...' : t.sign_in_btn}
                        </span>
                      </button>
                    </>
                  )}
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-x-0 h-[1px] bg-white/[0.06]" />
                  <span className="relative px-3 bg-[#07070a] text-[10px] text-gray-500 uppercase font-bold tracking-wider z-10">
                    {isSignUp ? t.or_continue : t.or}
                  </span>
                </div>

                {isSignUp ? (
                  /* Social buttons (sign-up only) */
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      {
                        name: 'Google',
                        icon: (
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
                        ),
                      },
                      {
                        name: 'Apple',
                        icon: (
                          <svg
                            className="w-3.5 h-3.5 fill-white"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.57 2.94-1.39" />
                          </svg>
                        ),
                      },
                      {
                        name: 'Microsoft',
                        icon: (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 23 23">
                            <path fill="#F25022" d="M0 0h11v11H0z" />
                            <path fill="#7FBA00" d="M12 0h11v11H12z" />
                            <path fill="#00A4EF" d="M0 12h11v11H0z" />
                            <path fill="#FFB900" d="M12 12h11v11H12z" />
                          </svg>
                        ),
                      },
                    ].map((provider) => (
                      <button
                        key={provider.name}
                        type="button"
                        onClick={() => {
                          setIsLoading(true);
                          setTimeout(() => {
                            setIsLoading(false);
                            setSuccessMsg(
                              `Successfully connected via ${provider.name}!`,
                            );
                          }, 1200);
                        }}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg text-[11px] text-white font-medium transition-colors cursor-pointer focus:outline-none"
                      >
                        {provider.icon}
                        <span>{provider.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  /* "Create an Account" button (sign-in only) */
                  <button
                    type="button"
                    onClick={switchMode}
                    className="w-full py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white font-semibold text-[13px] rounded-lg transition-all cursor-pointer focus:outline-none"
                  >
                    {t.create_acct}
                  </button>
                )}

                {/* Bottom notes */}
                <div className="space-y-3 pt-1">
                  {isSignUp ? (
                    <div className="flex items-start gap-2.5 p-3 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                      <Lock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-gray-500 leading-normal">
                        {t.security_note}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-[11px] text-gray-500 text-center">
                        {t.new_to_vertex}
                      </p>
                      <div className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                        <ShieldCheck className="w-4 h-4 text-emerald-500/70 flex-shrink-0" />
                        <p className="text-[10px] text-gray-500 leading-none">
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

      {/* ============================================================= */}
      {/*  FOOTER                                                       */}
      {/* ============================================================= */}
      <footer className="w-full border-t border-white/[0.04] py-6 z-10 relative bg-black">
        <div className="w-full px-6 lg:px-10 xl:px-14 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[10.5px] text-gray-500">
            <span>
              © {new Date().getFullYear()} Vunex Market Ltd. All rights
              reserved.
            </span>
            <span className="text-white/10 hidden sm:inline">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="text-white/10">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <span className="text-white/10">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Risk Disclosure
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
