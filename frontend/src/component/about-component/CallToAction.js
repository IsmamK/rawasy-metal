import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';

const CallToAction = () => {
    return (
        <>
            <section className="py-24  bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-[#0b1d34] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                      <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
                        Partner with <span className="bg-gradient-to-r from-[#f1601f] to-orange-500 bg-clip-text text-transparent">Excellence</span>
                      </h2>
                      <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Let's discuss how RAWASY can bring your vision to life with our proven expertise, dedicated workforce, and commitment to quality.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <a href="/contact" className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-10 py-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 inline-flex items-center justify-center space-x-3">
                          <span>Get in Touch</span>
                          <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
                        </a>
                        <a href="/projects" className="bg-white/10 backdrop-blur-sm text-white px-10 py-6 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300 inline-flex items-center justify-center">
                          View Our Projects
                        </a>
                      </div>
            
                      <div className="grid md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-white/10">
                        <div>
                          <Phone className="text-[#f1601f] mx-auto mb-4" size={32} />
                          <div className="text-white font-bold mb-2">Call Us</div>
                          <div className="text-gray-400">+971 XX XXX XXXX</div>
                        </div>
                        <div>
                          <Mail className="text-[#f1601f] mx-auto mb-4" size={32} />
                          <div className="text-white font-bold mb-2">Email Us</div>
                          <div className="text-gray-400">info@rawasy.com</div>
                        </div>
                        <div>
                          <MapPin className="text-[#f1601f] mx-auto mb-4" size={32} />
                          <div className="text-white font-bold mb-2">Visit Us</div>
                          <div className="text-gray-400">Gulf Region, UAE</div>
                        </div>
                      </div>
                    </div>
                  </section>
        </>
    );
};

export default CallToAction;