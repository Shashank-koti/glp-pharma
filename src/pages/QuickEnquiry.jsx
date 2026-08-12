import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LuShieldCheck, LuZap, LuHeadphones, LuAward,
  LuUser, LuMail, LuBuilding, LuPhone, LuGlobe,
  LuPackage, LuFlaskConical, LuHash, LuBox,
  LuArrowRight, LuLock, LuSend
} from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import CountryAutocomplete from '../components/common/CountryAutocomplete';

export default function QuickEnquiry() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    contactNumber: '',
    country: '',
    productName: '',
    chemicalName: '',
    casNo: '',
    quantity: ''
  });

  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=/quick-enquiry');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const res = await axios.post('https://glp-pharma-backend.vercel.app/api/inquiries/quick', {
        ...formData,
        inquiryType: 'quick',
        customerName: formData.fullName,
        phone: formData.contactNumber,
        productInterested: formData.productName,
        message: `Chemical: ${formData.chemicalName}, CAS: ${formData.casNo}, Qty: ${formData.quantity}`
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (res.data.success) {
        setSubmitSuccess(true);
        setFormData({
          fullName: '', email: '', companyName: '', contactNumber: '',
          country: '', productName: '', chemicalName: '', casNo: '', quantity: ''
        });
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-background overflow-hidden font-sans pb-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/enquiryBG.png"
          alt="Background"
          className="w-full h-full object-cover object-top opacity-60"
        />
      </div>

      <div className="relative z-10 w-full xl:w-[95%] 2xl:w-[92%] max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">

        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-extrabold text-[#1AA3B6] mb-4 tracking-tight text-4xl md:text-5xl"
          >
            Quick Inquiry
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-bold text-heading mb-3 tracking-tight text-3xl md:text-4xl"
          >
            Precision. Purity. Performance.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-body max-w-2xl mx-auto font-medium"
          >
            Share your requirements with us and
            our experts will get back to you promptly.
          </motion.p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EAF2F4] p-8 md:p-10 lg:p-12 relative"
        >
          <form onSubmit={handleSubmit}>
            {submitSuccess && (
              <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary font-medium text-sm">
                Your inquiry has been submitted successfully! We will get back to you soon.
              </div>
            )}
            {submitError && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 font-medium text-sm">
                {submitError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 relative">

              {/* Desktop Center Divider with Arrow */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[80%] bg-[#F0F6F8] items-center justify-center">
              </div>

              {/* Left Column - Contact Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-[#1AA3B6] flex items-center justify-center text-white shadow-md">
                    <LuUser size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-[#1AA3B6] font-bold text-lg">Contact Details</h2>
                    <p className="text-body font-medium text-xs">Tell us about yourself</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-[13px] font-bold text-body mb-1.5 ml-1">Full Name<span className="text-red-500 ml-0.5">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <LuUser size={18} />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Full Name"
                        className="w-full pl-11 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-body focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1AA3B6]/10 focus:border-[#1AA3B6] transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:border-border text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[13px] font-bold text-body mb-1.5 ml-1">Official Email Id<span className="text-red-500 ml-0.5">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <LuMail size={18} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Official Email Id"
                        className="w-full pl-11 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-body focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1AA3B6]/10 focus:border-[#1AA3B6] transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:border-border text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[13px] font-bold text-body mb-1.5 ml-1">Company Name<span className="text-red-500 ml-0.5">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <LuBuilding size={18} />
                      </div>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        placeholder="Company Name"
                        className="w-full pl-11 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-body focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1AA3B6]/10 focus:border-[#1AA3B6] transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:border-border text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[13px] font-bold text-body mb-1.5 ml-1">Contact Number<span className="text-red-500 ml-0.5">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <LuPhone size={18} />
                      </div>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                        placeholder="Contact Number"
                        className="w-full pl-11 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-body focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1AA3B6]/10 focus:border-[#1AA3B6] transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:border-border text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[13px] font-bold text-body mb-1.5 ml-1">Country<span className="text-red-500 ml-0.5">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 z-10">
                        <LuGlobe size={18} />
                      </div>
                      <CountryAutocomplete
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required={true}
                        className="w-full pl-11 pr-10 py-2.5 bg-background/50 border border-border rounded-xl text-body focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1AA3B6]/10 focus:border-[#1AA3B6] transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:border-border text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Product Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-[#F8FBFC] flex items-center justify-center text-[#1AA3B6] shadow-sm">
                    <LuFlaskConical size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-[#1AA3B6] font-bold text-lg">Product Details</h2>
                    <p className="text-body font-medium text-xs">Provide us the product information</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-[13px] font-bold text-body mb-1.5 ml-1">Product Name<span className="text-red-500 ml-0.5">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <LuPackage size={18} />
                      </div>
                      <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        required
                        placeholder="Product Name"
                        className="w-full pl-11 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-body focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1AA3B6]/10 focus:border-[#1AA3B6] transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:border-border text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[13px] font-bold text-body mb-1.5 ml-1">Chemical Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <LuFlaskConical size={18} />
                      </div>
                      <input
                        type="text"
                        name="chemicalName"
                        value={formData.chemicalName}
                        onChange={handleChange}
                        placeholder="Chemical Name"
                        className="w-full pl-11 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-body focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1AA3B6]/10 focus:border-[#1AA3B6] transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:border-border text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[13px] font-bold text-body mb-1.5 ml-1">CAS No<span className="text-red-500 ml-0.5">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <LuHash size={18} />
                      </div>
                      <input
                        type="text"
                        name="casNo"
                        value={formData.casNo}
                        onChange={handleChange}
                        required
                        placeholder="CAS No"
                        className="w-full pl-11 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-body focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1AA3B6]/10 focus:border-[#1AA3B6] transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:border-border text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[13px] font-bold text-body mb-1.5 ml-1">Quantity<span className="text-red-500 ml-0.5">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <LuBox size={18} />
                      </div>
                      <input
                        type="text"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        placeholder="Quantity (e.g., 10 g, 1 Kg)"
                        className="w-full pl-11 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-body focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1AA3B6]/10 focus:border-[#1AA3B6] transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:border-border text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Section */}
            <div className="mt-6 ">
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#1AA3B6] hover:bg-[#0B7285] text-white font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-sm"
                >
                  <LuSend size={18} />
                  <span>{isSubmitting ? 'Sending...' : (user ? 'Send Inquiry' : 'Login to Send Inquiry')}</span>
                </button>
              </div>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}
