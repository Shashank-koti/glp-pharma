import { Link } from 'react-router-dom';
import {
  FiShoppingCart, FiTrash2, FiArrowLeft, FiPlus, FiMinus, FiClipboard,
  FiCheckCircle, FiFileText, FiGlobe, FiHeadphones, FiLock, FiSend, FiChevronDown
} from 'react-icons/fi';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import RecentlyViewed from '../components/products/RecentlyViewed';
import CountryAutocomplete from '../components/common/CountryAutocomplete';

import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cartItems, updateQuantity, updateItem, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    role: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setSubmitStatus({ type: 'error', message: 'Your cart is empty.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await axios.post('https://glp-pharma-backend.vercel.app/api/inquiries', {
        ...formData,
        inquiryType: 'Quote Request',
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          cas: item.cas,
          quantity: item.quantity,
          unit: item.unit
        }))
      }, {
        headers: user ? { Authorization: `Bearer ${user.token}` } : {}
      });

      if (res.data.success) {
        setSubmitStatus({ type: 'success', message: 'Inquiry submitted successfully! We will contact you soon.' });
        setFormData({ customerName: '', companyName: '', email: '', phone: '', country: '', role: '', message: '' });
        clearCart();
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: error.response?.data?.message || 'Failed to submit inquiry.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center bg-[#F8FBFC] overflow-hidden py-[70px] px-4 md:px-6 pb-[90px]">
      <div className="absolute inset-0 bg-[url('/images/credBG.png')] bg-center bg-cover bg-no-repeat -z-20 opacity-80" />
      <div className="absolute inset-0 bg-white/40 -z-10" />

      {/* Header */}
      <div className="text-center mb-[40px] pt-6 sm:pt-0 max-w-[1000px]">
        <h1 className="text-[#084553] sm:text-[34px] font-[800] tracking-[-0.03em] leading-[1.2] mb-[12px]  uppercase text-xl">
          CART & PRODUCT INQUIRY
        </h1>
        <p className="text-[#5B7280] text-[15px] sm:text-[16px] font-medium leading-[1.6]">
          Users can add products to cart and submit an inquiry to get detailed information, pricing, availability & more.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="w-full max-w-[1440px] grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] gap-[30px]">

        {/* Left Panel: Cart */}
        <div className="flex flex-col gap-[30px]">
          <motion.div
            className="border border-[#D9E8EC] rounded-[16px] bg-white shadow-[0_10px_30px_rgba(26,163,182,0.06)] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Box Header */}
            <div className="flex items-center gap-3 p-[24px_30px] border-b border-[#D9E8EC]">
              <FiShoppingCart className="text-[28px] text-[#1AA3B6]" strokeWidth={1.5} />
              <div>
                <h2 className="text-[#12344D] text-[18px] font-[750]">Your Cart</h2>
                <p className="text-[#5B7280] text-[13px] mt-0.5">Review the products you have added.</p>
              </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#E8F4F6] text-[#12344D] text-[11px] font-[800] tracking-[0.05em] uppercase border-y border-[#DDF8FB]">
                    <th className="py-3 px-6 whitespace-nowrap">Product</th>
                    <th className="py-3 px-4 whitespace-nowrap">CAS No.</th>
                    <th className="py-3 px-4 whitespace-nowrap">Catalog No.</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap">Quantity</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap">Unit</th>
                    <th className="py-3 px-6 text-center whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] text-[#12344D] font-medium">
                  {cartItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-[#5B7280]">Your cart is currently empty.</td>
                    </tr>
                  ) : cartItems.map(item => (
                    <tr key={item.id} className="border-b border-[#D9E8EC] hover:bg-[#F8FBFC] transition-colors">
                      <td className="py-4 px-6 flex items-center gap-4">
                        <div className="w-[45px] h-[45px] border border-[#D9E8EC] rounded-[6px] flex items-center justify-center p-1 bg-white shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                          ) : (
                            <svg viewBox="0 0 100 100" className="w-full h-full text-[#a4b0b8]" fill="none" stroke="currentColor" strokeWidth="3">
                              <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <strong className="block text-[#12344D] text-[14px] font-[750] leading-[1.3]">{item.name}</strong>
                          <span className="text-[#5B7280] text-[12px]">{item.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">{item.cas}</td>
                      <td className="py-4 px-4 whitespace-nowrap">{item.catalog}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center border border-[#D9E8EC] rounded-[5px] overflow-hidden bg-white">
                            <button type="button" onClick={() => updateQuantity(item.id, -1)} className="w-[28px] h-[28px] flex items-center justify-center text-[#5B7280] hover:bg-[#D9E8EC] hover:text-[#1AA3B6] transition-colors cursor-pointer shrink-0"><FiMinus className="text-[13px]" /></button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val > 0) {
                                  updateItem(item.id, 'quantity', val);
                                } else if (e.target.value === '') {
                                  updateItem(item.id, 'quantity', '');
                                }
                              }}
                              onBlur={(e) => {
                                if (e.target.value === '' || isNaN(parseInt(e.target.value)) || parseInt(e.target.value) < 1) {
                                  updateItem(item.id, 'quantity', 1);
                                }
                              }}
                              className="w-[45px] h-[28px] text-center font-[700] text-[13px] outline-none border-x border-[#D9E8EC] hide-number-spinners"
                            />
                            <button type="button" onClick={() => updateQuantity(item.id, 1)} className="w-[28px] h-[28px] flex items-center justify-center text-[#5B7280] hover:bg-[#D9E8EC] hover:text-[#1AA3B6] transition-colors cursor-pointer shrink-0"><FiPlus className="text-[13px]" /></button>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="relative inline-block w-[70px]">
                          <select
                            value={item.unit || 'mg'}
                            onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                            className="w-full bg-white border border-[#D9E8EC] rounded-[5px] text-[13px] font-[600] py-1 pl-2 pr-6 outline-none cursor-pointer hover:border-[#1AA3B6]/50 transition-colors appearance-none"
                          >
                            <option value="mg">mg</option>
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                          </select>
                          <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5B7280] pointer-events-none text-[12px]" />
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button onClick={() => removeFromCart(item.id)} className="text-[#9ABAC0] hover:text-[#e04545] p-2 transition-colors cursor-pointer" title="Remove Item">
                          <FiTrash2 className="text-[17px]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cart Footer */}
            <div className="p-[20px] flex flex-wrap items-center justify-between border-t border-[#D9E8EC] bg-[#FFFFFF]">
              <Link to="/product-categories-view/api-impurities-and-reference-standards" className="inline-flex items-center gap-2 text-[#5B7280] hover:text-[#1AA3B6] font-[650] text-[14px] px-[16px] h-[40px] rounded-[6px] border border-[#D9E8EC] hover:border-[#1AA3B6]/50 bg-white transition-all">
                <FiArrowLeft className="text-[15px]" /> Continue browsing
              </Link>
              <div className="flex items-center gap-3">
                <button onClick={clearCart} className="inline-flex items-center gap-2 text-[#5B7280] hover:text-[#e04545] font-[600] text-[13px] px-[16px] h-[40px] rounded-[6px] border border-[#D9E8EC] hover:border-[#e04545]/30 bg-white transition-all cursor-pointer">
                  <FiTrash2 className="text-[14px]" /> Clear Cart
                </button>
              </div>
            </div>
          </motion.div>

          {/* Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[15px]">
            {[
              { icon: FiCheckCircle, title: '1000+', sub: 'High Quality Products' },
              { icon: FiFileText, title: 'COA & Analytical', sub: 'Supporting Documents' },
              { icon: FiGlobe, title: 'Global Shipping', sub: 'Discreet & Secure' },
              { icon: FiHeadphones, title: 'Expert Support', sub: 'Quick Response' },
            ].map((badge, idx) => (
              <div key={idx} className="flex items-center gap-3 border border-[#D9E8EC] rounded-[10px] bg-white p-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <badge.icon className="text-[24px] text-[#1AA3B6] shrink-0" strokeWidth={1.5} />
                <div className="leading-[1.3]">
                  <strong className="block text-[#12344D] text-[13px] font-[750]">{badge.title}</strong>
                  <span className="text-[#5B7280] text-[11px] font-medium">{badge.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Inquiry Form */}
        <motion.div
          className="border border-[#D9E8EC] rounded-[16px] bg-white shadow-[0_10px_30px_rgba(26,163,182,0.06)] overflow-hidden h-fit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 p-[24px_30px] border-b border-[#D9E8EC]">
            <FiClipboard className="text-[26px] text-[#1AA3B6]" strokeWidth={1.5} />
            <div>
              <h2 className="text-[#12344D] text-[18px] font-[750]">Get a Quote / Product Inquiry</h2>
              <p className="text-[#5B7280] text-[13px] mt-0.5">Fill in the details below and our team will get back to you shortly.</p>
            </div>
          </div>

          <form className="p-[25px_30px]" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[20px] gap-y-[18px]">
              <div>
                <label className="block text-[#12344D] text-[12.5px] font-[700] mb-1.5">
                  Full Name <span className="text-[#e04545]">*</span>
                </label>
                <input name="customerName" value={formData.customerName} onChange={handleChange} type="text" placeholder="Enter your full name" className="w-full h-[44px] bg-white border border-[#D9E8EC] rounded-[6px] text-[13.5px] px-[14px] outline-none transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10 placeholder:text-[#5B7280]" required />
              </div>
              <div>
                <label className="block text-[#12344D] text-[12.5px] font-[700] mb-1.5">
                  Company / Organization <span className="text-[#e04545]">*</span>
                </label>
                <input name="companyName" value={formData.companyName} onChange={handleChange} type="text" placeholder="Enter company name" className="w-full h-[44px] bg-white border border-[#D9E8EC] rounded-[6px] text-[13.5px] px-[14px] outline-none transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10 placeholder:text-[#5B7280]" required />
              </div>
              <div>
                <label className="block text-[#12344D] text-[12.5px] font-[700] mb-1.5">
                  Email Address <span className="text-[#e04545]">*</span>
                </label>
                <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Enter your email" className="w-full h-[44px] bg-white border border-[#D9E8EC] rounded-[6px] text-[13.5px] px-[14px] outline-none transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10 placeholder:text-[#5B7280]" required />
                <p className="text-[11px] text-[#5B7280] mt-1.5 ml-1">* Must be a valid email address</p>
              </div>
              <div>
                <label className="block text-[#12344D] text-[12.5px] font-[700] mb-1.5">
                  Phone Number <span className="text-[#e04545]">*</span>
                </label>
                <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="Enter your phone number" className="w-full h-[44px] bg-white border border-[#D9E8EC] rounded-[6px] text-[13.5px] px-[14px] outline-none transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10 placeholder:text-[#5B7280]" required />
              </div>
              <div className="relative">
                <label className="block text-[#12344D] text-[12.5px] font-[700] mb-1.5">
                  Country <span className="text-[#e04545]">*</span>
                </label>
                <CountryAutocomplete
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full h-[44px] bg-white border border-[#D9E8EC] rounded-[6px] text-[13.5px] px-[14px] outline-none transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10"
                  required={true}
                />
              </div>
              <div className="relative">
                <label className="block text-[#12344D] text-[12.5px] font-[700] mb-1.5">
                  Your Role
                </label>
                <div className="relative">
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full h-[44px] bg-white border border-[#D9E8EC] rounded-[6px] text-[13.5px] px-[14px] outline-none transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10 appearance-none cursor-pointer">
                    <option value="" disabled className="text-[#5B7280]">Select your role</option>
                    <option value="researcher">Researcher</option>
                    <option value="purchasing">Purchasing Manager</option>
                  </select>
                  <FiChevronDown className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#5B7280] pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="mt-[18px]">
              <label className="block text-[#12344D] text-[12.5px] font-[700] mb-1.5">
                Your Requirement / Message <span className="text-[#e04545]">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please provide details about your requirement, quantity, intended use, etc."
                className="w-full min-h-[90px] bg-white border border-[#D9E8EC] rounded-[6px] text-[13.5px] p-[12px_14px] outline-none transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10 placeholder:text-[#5B7280] resize-y"
                required
              />
            </div>

            <div className="mt-[20px] bg-[#E8F4F6] border border-[#D9E8EC] rounded-[8px] p-[16px] relative overflow-hidden">
              {/* Decorative Flask Watermark */}
              <svg className="absolute -right-4 -bottom-4 w-[100px] h-[100px] text-[#1AA3B6]/[0.05] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 3h6v6l4 10H5l4-10V3z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 14h6" strokeLinecap="round" />
              </svg>

              <div className="relative z-10">
                <span className="text-[#12344D] text-[12.5px] font-[750] flex items-center gap-1.5 mb-2.5">
                  <span className="text-[#1AA3B6] text-[14px]">›</span> Products in Inquiry ({cartItems.length})
                </span>
                <ul className="text-[#5B7280] text-[12px] font-medium leading-[1.6] space-y-1 list-disc pl-[20px]">
                  {cartItems.map(item => (
                    <li key={item.id}>
                      {item.name} (CAS: {item.cas}) – {item.quantity} {item.unit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-[18px] mb-[20px] text-[#5B7280] text-[11.5px] font-medium">
              <FiLock className="text-[#9ABAC0] shrink-0" />
              Your information is secure and will only be used to respond to your inquiry.
            </div>

            <button disabled={isSubmitting} type="submit" className="flex items-center justify-center w-full h-[46px] bg-[#1AA3B6] text-white text-[15px] font-bold rounded-[6px] border-0 cursor-pointer transition-all hover:bg-[#0B7285] shadow-[0_6px_15px_rgba(26,163,182,0.25)] hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
              <FiSend className="mr-[8px]" /> {isSubmitting ? 'Sending Inquiry...' : 'Send Inquiry'}
            </button>

            {submitStatus && (
              <div className={`mt-5 p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${submitStatus.type === 'success' ? 'bg-[#084553] text-white border border-[#DDF8FB]' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                {submitStatus.message}
              </div>
            )}
          </form>
        </motion.div>
      </div>

      <RecentlyViewed />
    </section>
  );
}