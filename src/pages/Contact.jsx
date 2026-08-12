import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiGlobe, FiClock, FiLock, FiArrowRight, FiHeadphones, FiShield } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useState } from 'react';
import axios from 'axios';

export default function Contact() {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await axios.post('https://glp-pharma-backend.vercel.app/api/contact', {
        name: data.name,
        email: data.email,
        companyName: data.companyName,
        subject: data.subject,
        message: data.message
      });
      if (res.data.success) {
        setSubmitStatus({ type: 'success', message: 'Message sent successfully!' });
        reset();
      } else {
        setSubmitStatus({ type: 'error', message: res.data.message || 'Failed to send message.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: error.response?.data?.message || 'Failed to send message.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans pb-24">

      {/* Hero Section with Background Image */}
      <div className="relative pt-12 pb-40 lg:pt-16 lg:pb-50 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/contactBG.png"
            alt="Pharmaceutical laboratory background"
            className="w-full h-full object-cover object-right"
          />
          {/* Gradient overlay to make text readable on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/10 to-transparent"></div>
        </div>

        <div className="w-full xl:w-[95%] 2xl:w-[92%] max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            {/* Main Headings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="lg:text-[3rem] font-bold text-heading mb-1 tracking-tight text-5xl">
                {t('contact.getIn')} <span className="text-primary">{t('contact.touch')}</span>
              </h1>
              <h2 className="lg:text-[2rem] font-bold text-heading mb-8 tracking-tight text-4xl">
                {t('contact.weAreHere')}
              </h2>
            </motion.div>

            {/* Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-body text-[15px] mb-12 max-w-md leading-relaxed md:text-base"
            >
              {t('contact.desc')}
            </motion.p>

            {/* Feature Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6 items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FiHeadphones size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-heading mb-0.5 text-xs">{t('contact.quickResponse')}</h4>
                  <p className="text-[11px] text-body">{t('contact.quickResponseDesc')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FiShield size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-heading mb-0.5 text-xs">{t('contact.trustedSupport')}</h4>
                  <p className="text-[11px] text-body">{t('contact.trustedSupportDesc')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-heading mb-0.5 text-xs">{t('contact.globalReach')}</h4>
                  <p className="text-[11px] text-body">{t('contact.globalReachDesc')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Card (Overlapping) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 lg:-mt-32"
      >
        <div className="bg-white rounded-[1.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row overflow-hidden border border-[#EAF2F4]">

          {/* Left Column: Form */}
          <div className="lg:w-[60%] p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-[#EAF2F4] bg-white">
            <h3 className="text-[22px] font-bold text-heading mb-1 relative inline-block">
              {t('contact.sendUsMessage')}
            </h3>
            <div className="w-8 h-[3px] bg-primary mb-8"></div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <input
                    {...register("name", { required: true })}
                    className="w-full px-4 py-4 bg-[#F9FAFB] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[15px] text-heading placeholder-slate-400"
                    placeholder={t('contact.yourName')}
                  />
                  {errors.name && <span className="text-red-500 text-[10px] mt-1 block">Required</span>}
                </div>
                <div>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className="w-full px-4 py-4 bg-[#F9FAFB] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[15px] text-heading placeholder-slate-400"
                    placeholder={t('contact.yourEmail')}
                  />
                  {errors.email && <span className="text-red-500 text-[10px] mt-1 block">Required</span>}
                  <span className="text-[11px] text-[#5B7280] mt-1.5 ml-1 block">* Must be a valid email address</span>
                </div>
              </div>

              <div>
                <input
                  {...register("companyName")}
                  className="w-full px-4 py-4 bg-[#F9FAFB] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[15px] text-heading placeholder-slate-400"
                  placeholder={t('contact.companyName')}
                />
              </div>

              <div>
                <input
                  {...register("subject")}
                  className="w-full px-4 py-4 bg-[#F9FAFB] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[15px] text-heading placeholder-slate-400"
                  placeholder={t('contact.subject')}
                />
              </div>

              <div>
                <textarea
                  {...register("message", { required: true })}
                  rows={6}
                  className="w-full px-4 py-4 bg-[#F9FAFB] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[15px] text-heading placeholder-slate-400 resize-none"
                  placeholder={t('contact.yourMessage')}
                />
                {errors.message && <span className="text-red-500 text-[10px] mt-1 block">Required</span>}
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-[11px] mb-5">
                <FiLock size={11} />
                <span>{t('contact.secureInfo')}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1AA3B6] text-white font-bold rounded-xl hover:bg-[#0B7285] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-[15px] w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? 'Sending...' : t('contact.sendMessage')}
                {!isSubmitting && <FiArrowRight size={16} />}
              </button>

              {submitStatus && (
                <div className={`mt-5 p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${submitStatus.type === 'success' ? 'bg-[#DDF8FB] text-[#1AA3B6] border border-[#DDF8FB]' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Contact Info */}
          <div className="lg:w-[40%] p-8 lg:p-12 bg-white">
            <h3 className="text-[22px] font-bold text-heading mb-1 relative inline-block mb-10">
              {t('contact.contactInfo')}
            </h3>


            <div className="space-y-8">
              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#F8FBFC] flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-heading text-[18px] mb-1">{t('contact.ourLocation')}</h4>
                  <p className="text-[15px] text-body leading-relaxed">
                    Plot No:1, Shakti Puram Phase-2,<br />
                    Prashanti Nagar, Industrial Estate(IE), Kukatpally,<br />
                    Hyderabad, Telangana State, India, PIN: 500072
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#F8FBFC] flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <FiPhone size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-heading text-[18px] mb-1">{t('contact.phone')}</h4>
                  <p className="text-[15px] text-body leading-relaxed">
                    +91 9866074638<br />
                    +91 8341411731
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#F8FBFC] flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <FiMail size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-heading text-[18px] mb-1">{t('contact.email')}</h4>
                  <p className="text-[15px] text-body leading-relaxed">
                    info@glppharmastandards.com
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#F8FBFC] flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <FiClock size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-heading text-[18px] mb-1">{t('contact.businessHours')}</h4>
                  <p className="text-[15px] text-body leading-relaxed">
                    Mon - Fri: 9:00 AM - 6:00 PM (IST)<br />
                    Saturday & Sunday: Closed
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
