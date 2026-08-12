import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiBriefcase, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiArrowRight, FiChevronDown, FiAlertCircle } from 'react-icons/fi';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import CountryAutocomplete from '../components/common/CountryAutocomplete';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    clientName: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    const result = await register({
      clientName: formData.clientName,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      password: formData.password
    });
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };


  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#F8FBFC] overflow-hidden py-[90px] px-6 pb-[70px]">
      <div className="absolute inset-0 bg-[url('/images/credBG.png')] bg-center bg-cover bg-no-repeat -z-20" />
      <div className="absolute inset-0 bg-white/5 -z-10" />

      <motion.div
        className="w-full max-w-[740px] border border-white/60 sm:border-[#D9E8EC] rounded-[14px] bg-white/95 shadow-[0_10px_28px_rgba(26,163,182,0.12)] p-[45px_30px_40px] sm:p-[50px_60px_45px]"
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

        <h1 className="text-[#12344D] text-[34px] font-[750] tracking-[-0.038em] leading-[1.2] mt-[38px] mb-[10px] text-center">
          Create <span className="text-[#1AA3B6]">Account</span>
        </h1>
        <p className="text-[#5B7280] text-[14px] font-medium leading-[1.6] max-w-[600px] mx-auto text-center mb-6">
          Register to access our complete range of pharmaceutical standards and solutions.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 flex items-center gap-2 font-medium text-sm">
            <FiAlertCircle className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[24px] gap-y-[20px]">
            <div className="relative">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[#12344D] text-[13px] font-[750] leading-[1.25]">Full Name</label>
              </div>
              <div className="flex items-center h-[46px] bg-white border border-[#D9E8EC] rounded-[6px] transition-colors focus-within:border-[#1AA3B6]/70 focus-within:ring-[3px] focus-within:ring-[#1AA3B6]/10">
                <FiUser className="shrink-0 text-[#5B7280] ml-[12px] mr-[12px]" />
                <input name="clientName" value={formData.clientName} onChange={handleChange} type="text" placeholder="Enter your full name" className="w-full h-full bg-transparent border-0 text-[#12344D] text-[13px] outline-none placeholder:text-[#5B7280] pr-3" required />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[#12344D] text-[13px] font-[750] leading-[1.25]">Company / Organization</label>
              </div>
              <div className="flex items-center h-[46px] bg-white border border-[#D9E8EC] rounded-[6px] transition-colors focus-within:border-[#1AA3B6]/70 focus-within:ring-[3px] focus-within:ring-[#1AA3B6]/10">
                <FiBriefcase className="shrink-0 text-[#5B7280] ml-[12px] mr-[12px]" />
                <input name="company" value={formData.company} onChange={handleChange} type="text" placeholder="Enter company name" className="w-full h-full bg-transparent border-0 text-[#12344D] text-[13px] outline-none placeholder:text-[#5B7280] pr-3" required />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[#12344D] text-[13px] font-[750] leading-[1.25]">Email Address</label>
              </div>
              <div className="flex items-center h-[46px] bg-white border border-[#D9E8EC] rounded-[6px] transition-colors focus-within:border-[#1AA3B6]/70 focus-within:ring-[3px] focus-within:ring-[#1AA3B6]/10">
                <FiMail className="shrink-0 text-[#5B7280] ml-[12px] mr-[12px]" />
                <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Enter your email" className="w-full h-full bg-transparent border-0 text-[#12344D] text-[13px] outline-none placeholder:text-[#5B7280] pr-3" required />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[#12344D] text-[13px] font-[750] leading-[1.25]">Phone Number</label>
              </div>
              <div className="flex items-center h-[46px] bg-white border border-[#D9E8EC] rounded-[6px] transition-colors focus-within:border-[#1AA3B6]/70 focus-within:ring-[3px] focus-within:ring-[#1AA3B6]/10">
                <FiPhone className="shrink-0 text-[#5B7280] ml-[12px] mr-[12px]" />
                <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="Enter your phone number" className="w-full h-full bg-transparent border-0 text-[#12344D] text-[13px] outline-none placeholder:text-[#5B7280] pr-3" required />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[#12344D] text-[13px] font-[750] leading-[1.25]">Country</label>
              </div>
              <CountryAutocomplete
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full h-[46px] bg-white border border-[#D9E8EC] rounded-[6px] text-[#12344D] text-[13px] outline-none pl-[12px] transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10"
                required={true}
              />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[#12344D] text-[13px] font-[750] leading-[1.25]">Your Role</label>
              </div>
              <div className="flex items-center relative h-[46px] bg-white border border-[#D9E8EC] rounded-[6px] transition-colors focus-within:border-[#1AA3B6]/70 focus-within:ring-[3px] focus-within:ring-[#1AA3B6]/10">
                <select className="w-full h-full bg-transparent border-0 text-[#12344D] text-[13px] outline-none pl-[12px] pr-[27px] appearance-none cursor-pointer" defaultValue="">
                  <option value="" disabled className="text-[#5B7280]">Select your role</option>
                  <option value="researcher">Researcher</option>
                  <option value="purchasing">Purchasing Manager</option>
                  <option value="student">Student</option>
                </select>
                <FiChevronDown className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#5B7280] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="relative mt-[20px]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[#12344D] text-[13px] font-[750] leading-[1.25]">Password</label>
            </div>
            <div className="flex items-center h-[46px] bg-white border border-[#D9E8EC] rounded-[6px] transition-colors focus-within:border-[#1AA3B6]/70 focus-within:ring-[3px] focus-within:ring-[#1AA3B6]/10">
              <FiLock className="shrink-0 text-[#5B7280] ml-[12px] mr-[12px]" />
              <input
                name="password" value={formData.password} onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                className="w-full h-full bg-transparent border-0 text-[#12344D] text-[13px] outline-none placeholder:text-[#5B7280] pr-3"
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
            <p className="text-[11px] text-[#5B7280] mt-1.5 ml-1">* Password must be at least 6 characters long</p>
          </div>

          <div className="relative mt-[20px]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[#12344D] text-[13px] font-[750] leading-[1.25]">Confirm Password</label>
            </div>
            <div className="flex items-center h-[46px] bg-white border border-[#D9E8EC] rounded-[6px] transition-colors focus-within:border-[#1AA3B6]/70 focus-within:ring-[3px] focus-within:ring-[#1AA3B6]/10">
              <FiLock className="shrink-0 text-[#5B7280] ml-[12px] mr-[12px]" />
              <input
                name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className="w-full h-full bg-transparent border-0 text-[#12344D] text-[13px] outline-none placeholder:text-[#5B7280] pr-3"
                required
              />
              <button
                type="button"
                className="flex items-center justify-center h-full px-[11px] text-[#5B7280] hover:text-[#1AA3B6] transition-colors bg-transparent border-0 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-[8px] text-[#5B7280] text-[13px] leading-[1.35] mt-[20px] mb-[20px]">
            <input type="checkbox" id="terms" className="w-[15px] h-[15px] m-0 cursor-pointer accent-[#1AA3B6]" required />
            <label htmlFor="terms">
              I agree to the <Link to="/terms" className="text-[#1AA3B6] font-[650] hover:text-[#0B7285] hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-[#1AA3B6] font-[650] hover:text-[#0B7285] hover:underline">Privacy Policy</Link>
            </label>
          </div>

          <button disabled={loading} type="submit" className="relative flex items-center justify-center w-full h-[46px] bg-[#1AA3B6] text-white text-[15px] font-bold rounded-[6px] border-0 cursor-pointer transition-all hover:bg-[#0B7285] hover:-translate-y-[1px] hover:shadow-[0_7px_15px_rgba(26,163,182,0.2)] disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? 'Registering...' : 'Register'}
            {!loading && <FiArrowRight className="absolute right-[13px]" />}
          </button>


          <p className="text-[#5B7280] text-[13.5px] leading-[1.5] text-center mt-[36px]">
            Already have an account? <Link to="/login" className="text-[#1AA3B6] font-[650] hover:text-[#0B7285] hover:underline">Login</Link>
          </p>
        </form>
      </motion.div>
    </section>
  );
}
