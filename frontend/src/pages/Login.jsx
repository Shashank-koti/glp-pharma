import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiFileText, FiGlobe, FiShield, FiStar, FiAlertCircle } from 'react-icons/fi';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const benefits = [
  { icon: FiFileText, title: '1000+', lines: ['High Quality', 'Products'] },
  { icon: FiStar, title: 'COA & Analytical', lines: ['Support &', 'Documents'] },
  { icon: FiGlobe, title: 'Global Delivery', lines: ['Discreet &', 'Secure'] },
  { icon: FiShield, title: 'Quality Assured', lines: ['Highest Purity', 'Standards'] },
];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(redirect);
    } else {
      setError(result.message);
    }
  };


  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#F8FBFC] overflow-hidden py-10 px-6 pb-[60px]">
      <div className="absolute inset-0 bg-[url('/images/credBG.png')] bg-center bg-cover bg-no-repeat -z-20" />
      <div className="absolute inset-0 bg-white/5 -z-10" />

      <motion.div
        className="w-full max-w-[480px] border border-white/60 sm:border-[#D9E8EC] rounded-[14px] bg-white/95 shadow-[0_10px_28px_rgba(26,163,182,0.12)] p-[45px_30px] sm:p-[50px_58px_45px]"
        initial={{ opacity: 0, y: 22, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-center gap-[9px] text-[#1AA3B6]">
          <svg className="w-[52px] h-[52px] shrink-0" viewBox="0 0 56 56" aria-hidden="true">
            <path d="M28 7.5 42.5 16v16L28 40.5 13.5 32V16L28 7.5Z" fill="none" stroke="currentColor" strokeWidth="2.15" strokeLinejoin="round" />
            <path d="M28 7.5V24m14.5-8L28 24m14.5 8L28 24m0 16.5V24m-14.5 8L28 24m-14.5-8L28 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
            <circle cx="28" cy="7.5" r="4.7" fill="currentColor" />
            <circle cx="42.5" cy="16" r="4.7" fill="currentColor" />
            <circle cx="42.5" cy="32" r="4.7" fill="currentColor" />
            <circle cx="28" cy="40.5" r="4.7" fill="currentColor" />
            <circle cx="13.5" cy="32" r="4.7" fill="currentColor" />
            <circle cx="13.5" cy="16" r="4.7" fill="currentColor" />
            <circle cx="28" cy="24" r="3.7" fill="white" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div className="flex flex-col text-left leading-none">
            <strong className="text-[#1AA3B6] text-[24px] font-extrabold tracking-[0.035em]">GLP PHARMA</strong>
            <small className="text-[#12344D] text-[12.5px] font-bold tracking-[0.16em] mt-1">GLOBAL STANDARDS</small>
          </div>
        </div>

        <h1 className="text-[#12344D] text-[34px] font-[750] tracking-[-0.038em] leading-[1.2] mt-[40px] mb-[10px] text-center">
          Welcome <span className="text-[#1AA3B6]">Back</span>
        </h1>
        <p className="text-[#5B7280] text-[14px] font-medium leading-[1.6] max-w-[320px] mx-auto text-center mb-6">
          Login to your account to access our premium pharmaceutical standards.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 flex items-center gap-2 font-medium text-sm">
            <FiAlertCircle className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="relative mt-[26px]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[#12344D] text-[13px] font-[750] leading-[1.25]">Email Address</label>
            </div>
            <div className="flex items-center h-[48px] bg-white border border-[#D9E8EC] rounded-[7px] transition-colors focus-within:border-[#1AA3B6]/70 focus-within:ring-[3px] focus-within:ring-[#1AA3B6]/10">
              <FiMail className="shrink-0 text-[#5B7280] mx-[11px]" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" className="w-full h-full bg-transparent border-0 text-[#12344D] text-[14px] outline-none placeholder:text-[#5B7280] pr-3" required />
            </div>
            <p className="text-[11px] text-[#5B7280] mt-1.5 ml-1">* Must be a valid email address</p>
          </div>

          <div className="relative mt-[26px]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[#12344D] text-[13px] font-[750] leading-[1.25]">Password</label>
              <button type="button" className="text-[#1AA3B6] text-[13px] font-[650] bg-transparent border-0 p-0 hover:text-[#0B7285] hover:underline">Forgot Password?</button>
            </div>
            <div className="flex items-center h-[48px] bg-white border border-[#D9E8EC] rounded-[7px] transition-colors focus-within:border-[#1AA3B6]/70 focus-within:ring-[3px] focus-within:ring-[#1AA3B6]/10">
              <FiLock className="shrink-0 text-[#5B7280] mx-[11px]" />
              <input
                value={password} onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full h-full bg-transparent border-0 text-[#12344D] text-[14px] outline-none placeholder:text-[#5B7280] pr-3"
                required
              />
              <button
                type="button"
                className="flex items-center justify-center h-full px-[11px] text-[#5B7280] hover:text-[#1AA3B6] transition-colors bg-transparent border-0 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-[9px] text-[#5B7280] text-[13px] mt-[20px] mb-[24px]">
            <input type="checkbox" id="remember" className="w-4 h-4 m-0 cursor-pointer accent-[#1AA3B6]" />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button disabled={loading} type="submit" className="relative flex items-center justify-center w-full h-[48px] bg-[#1AA3B6] text-white text-[15px] font-bold rounded-[6px] border-0 cursor-pointer transition-all hover:bg-[#0B7285] hover:-translate-y-[1px] hover:shadow-[0_7px_15px_rgba(26,163,182,0.2)] disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? 'Logging in...' : 'Login'}
            {!loading && <FiArrowRight className="absolute right-[13px]" />}
          </button>


          <p className="text-[#5B7280] text-[13.5px] leading-[1.5] text-center mt-[42px]">
            Don't have an account? <Link to={`/register?redirect=${redirect}`} className="text-[#1AA3B6] font-[650] hover:text-[#0B7285] hover:underline">Register Now</Link>
          </p>
        </form>
      </motion.div>

      <div className="hidden sm:grid grid-cols-4 gap-[50px] w-full max-w-[650px] text-center mt-[50px]">
        {benefits.map(({ icon: Icon, title, lines }) => (
          <div className="flex flex-col items-center text-[#12344D] text-[12px] leading-[1.55]" key={title}>
            <Icon className="w-8 h-8 text-[#1AA3B6] mb-3 stroke-[1.55]" />
            <strong className="text-[12.5px] font-[750] whitespace-nowrap">{title}</strong>
            <span className="text-[#33444d] text-[11.5px] mt-1">{lines[0]}<br />{lines[1]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
