import { motion } from 'framer-motion';

export default function OurClients() {
  // Replace these placeholder URLs with your actual client image paths in the public folder (e.g. '/images/clients/client1.png')
  const clientLogos = [
    { name: "Client 1", url: "https://via.placeholder.com/200x100/EAF2F4/1AA3B6?text=Client+1" },
    { name: "Client 2", url: "https://via.placeholder.com/200x100/EAF2F4/1AA3B6?text=Client+2" },
    { name: "Client 3", url: "https://via.placeholder.com/200x100/EAF2F4/1AA3B6?text=Client+3" },
    { name: "Client 4", url: "https://via.placeholder.com/200x100/EAF2F4/1AA3B6?text=Client+4" },
    { name: "Client 5", url: "https://via.placeholder.com/200x100/EAF2F4/1AA3B6?text=Client+5" },
    { name: "Client 6", url: "https://via.placeholder.com/200x100/EAF2F4/1AA3B6?text=Client+6" },
  ];

  // We duplicate the list to create a seamless infinite scrolling effect
  const marqueeItems = [...clientLogos, ...clientLogos];

  return (
    <section className="py-24 bg-white relative overflow-hidden border-b border-[#EAF2F4]">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-32 bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-2xl"></div>
      </div>

      <div className="w-full xl:w-[95%] 2xl:w-[92%] max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-wider uppercase mb-3 text-sm"
          >
            TRUSTED PARTNERS
          </motion.h3>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[2.2rem] md:text-[2.8rem] font-extrabold text-heading mb-6 tracking-tight leading-tight"
          >
            Our Prestigious Clients
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-body text-[15px] md:text-[17px] leading-relaxed max-w-2xl mx-auto"
          >
            We are proud to collaborate with industry leaders and provide top-tier pharmaceutical solutions to businesses worldwide.
          </motion.p>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden flex items-center h-40">
        
        {/* Left and Right Fade Masks for a premium look */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>

        {/* The scrolling track */}
        <div className="flex w-[200%] animate-marquee">
          {marqueeItems.map((client, index) => (
            <div 
              key={index} 
              className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 px-4 flex-shrink-0 flex items-center justify-center group cursor-pointer"
            >
              <div className="bg-white border border-[#EAF2F4] rounded-xl p-4 w-full h-24 flex items-center justify-center shadow-sm hover:shadow-[0_10px_30px_rgba(26,163,182,0.12)] hover:border-primary/30 transition-all duration-300">
                <img 
                  src={client.url} 
                  alt={client.name} 
                  className="max-h-full max-w-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
