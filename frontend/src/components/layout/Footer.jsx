import { Link, useLocation } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiTwitter, FiFacebook } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import navImg from "/navImg.png";

export default function Footer() {
  const { t } = useTranslation();
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <footer className="relative bg-white pt-6 pb-4 border-t border-[#EAF2F4] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] overflow-hidden">
      {/* Premium Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-primary/10 to-transparent blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-primary/5 to-transparent blur-3xl"></div>
      </div>

      <div className="w-full xl:w-[95%] 2xl:w-[92%] max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-4">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block transition-transform hover:scale-105 duration-300 mb-2">
              <img
                src={navImg}
                alt="GLP Pharma Logo"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-slate-600 font-medium text-[16.5px] leading-relaxed pr-4">
              {t('footer.desc')}
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-primary border border-[#EAF2F4]">
                <FiLinkedin size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-primary border border-[#EAF2F4]">
                <FiTwitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-primary border border-[#EAF2F4]">
                <FiFacebook size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h4 className="text-heading font-extrabold mb-6 text-lg">{t('footer.quickLinks')}</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="hover:text-primary transition-colors text-[16.5px] font-medium text-slate-700">{t('footer.aboutUs')}</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors text-[16.5px] font-medium text-slate-700">{t('footer.careers')}</Link></li>
              <li><Link to="/news" className="hover:text-primary transition-colors text-[16.5px] font-medium text-slate-700">{t('footer.latestNews')}</Link></li>
              <li><Link to="/gallery" className="hover:text-primary transition-colors text-[16.5px] font-medium text-slate-700">{t('footer.gallery')}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors text-[16.5px] font-medium text-slate-700">{t('footer.contactUs')}</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-heading font-extrabold mb-6 text-lg">{t('footer.products')}</h4>
            <ul className="space-y-5">
              <li className="hover:text-primary transition-colors text-[16.5px] font-medium text-slate-700 cursor-pointer">{t('footer.api')}</li>
              <li className="hover:text-primary transition-colors text-[16.5px] font-medium text-slate-700 cursor-pointer">Certificate of Analysis</li>
              <li className="hover:text-primary transition-colors text-[16.5px] font-medium text-slate-700 cursor-pointer">{t('footer.impurities')}</li>
              <li className="hover:text-primary transition-colors text-[16.5px] font-medium text-slate-700 cursor-pointer">{t('footer.catalogue')}</li>
              <li className="hover:text-primary transition-colors text-[16.5px] font-medium text-slate-700 cursor-pointer">{t('footer.technicalDocs')}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-heading font-extrabold mb-6 tracking-wide text-lg">Contact Us</h4>
            <ul className="space-y-5 text-slate-700 font-medium">
              <li className="flex items-start gap-3 group cursor-pointer">
                <div className="mt-1 w-7 h-7 rounded-full bg-[#F0F7F9] shadow-sm flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                  <FiMapPin size={13} />
                </div>
                <span className="text-[16px] leading-relaxed group-hover:text-primary transition-colors text-slate-700">
                  Plot No:1, Shakti Puram Phase-2, Prashanti Nagar,<br />Industrial Estate(IE), Kukatpally, Hyderabad,<br />Telangana State, India, PIN: 500072
                </span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-[#F0F7F9] shadow-sm flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                  <FiPhone size={13} />
                </div>
                <a href="tel:+919866074638" className="text-[16.5px] group-hover:text-primary transition-colors text-slate-700">+91 9866074638</a>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-[#F0F7F9] shadow-sm flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                  <FiMail size={13} />
                </div>
                <a href="mailto:info@glppharmastandards.com" className="text-[16.5px] group-hover:text-primary transition-colors text-slate-700">info@glppharmastandards.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#EAF2F4] pt-3 flex flex-col md:flex-row justify-between items-center gap-4 text-[16px] text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} GLP Pharma. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
