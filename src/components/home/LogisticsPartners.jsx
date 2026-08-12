import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function LogisticsPartners() {
  const { t } = useTranslation();

  const partners = [
    {
      name: "DHL",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHE7nLF7XxXI9aaBedOBfhEsTKXpqqJ6g_hQIE3HKFcg&s=10",
      url: "https://www.dhl.com/en/express/tracking.html",
      delay: 0.2
    },
    {
      name: "FedEx",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqUyFIWSxoy7JfgeqEpmrlyKvbMj2Ba2qz_UVVnipsrg&s=10",
      url: "https://www.fedex.com/en-us/tracking.html",
      delay: 0.3
    },
    {
      name: "DTDC",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGFruJIOc2SVCvobu8vurFe2yO3i5cV_hw1V7duBEPYQ&s=10",
      url: "https://www.dtdc.in/tracking/shipment-tracking.asp",
      delay: 0.4
    },
    {
      name: "Blue Dart",
      logo: "https://images.seeklogo.com/logo-png/2/1/blue-dart-express-logo-png_seeklogo-20437.png",
      url: "https://www.bluedart.com/tracking",
      delay: 0.5
    }
  ];

  return (
    <section className="py-18 bg-[#F8FBFC] relative overflow-hidden border-y border-[#EAF2F4]">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl"></div>
        <div className="absolute top-[60%] -right-[10%] w-[30%] h-[50%] rounded-full bg-gradient-to-tl from-secondary/10 to-transparent blur-3xl"></div>
      </div>

      <div className="w-full xl:w-[95%] 2xl:w-[92%] max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-wider uppercase mb-3 text-sm"
          >
            GLOBAL REACH
          </motion.h3>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[2.2rem] md:text-[2.8rem] font-extrabold text-heading mb-6 tracking-tight leading-tight"
          >
            Our Logistics Partners
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-body text-[15px] md:text-[17px] leading-relaxed max-w-2xl mx-auto"
          >
            We ensure safe, secure, and timely delivery of our premium pharmaceutical products worldwide through our network of globally recognized logistics services.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {partners.map((partner, index) => {
            return (
              <motion.a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                key={partner.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: partner.delay, duration: 0.5, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#EAF2F4] p-4 md:p-6 flex items-center justify-center h-24 md:h-28 max-w-[240px] mx-auto w-full group hover:shadow-[0_15px_30px_rgba(26,163,182,0.12)] hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <img
                  src={partner.logo}
                  alt={`${partner.name} Logo`}
                  className="w-full h-full object-contain transition-all duration-500 scale-95 group-hover:scale-105 relative z-10 mix-blend-multiply"
                />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
