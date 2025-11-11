import { CheckCircle, Clock, Shield, TrendingUp, Users } from 'lucide-react';
import React from 'react';

const WhyChooseUs = () => {
    return (
        <>
          <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                      <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Competitive Advantages</span>
                      <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mt-4 mb-6">
                        Why Choose RAWASY
                      </h2>
                    </div>
          
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                      <div className="space-y-8">
                        {[
                          {
                            icon: TrendingUp,
                            title: "Proven Track Record",
                            desc: "Over 15 years of successful project delivery with 800+ completed projects across the Gulf region, demonstrating consistent excellence and reliability."
                          },
                          {
                            icon: Users,
                            title: "Skilled Workforce",
                            desc: "Access to 2000+ certified professionals including engineers, technicians, and skilled craftsmen, ensuring expertise across all project requirements."
                          },
                          {
                            icon: Shield,
                            title: "Safety Excellence",
                            desc: "OHSAS 18001 certified with zero-harm workplace culture, comprehensive safety protocols, and regular training programs for all personnel."
                          },
                          {
                            icon: Clock,
                            title: "On-Time Delivery",
                            desc: "98% on-time project completion rate through advanced project management systems, efficient resource allocation, and proactive planning."
                          }
                        ].map((item, i) => (
                          <div key={i} className="flex items-start space-x-6 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <item.icon className="text-white" size={32} />
                            </div>
                            <div>
                              <h3 className="text-xl font-black text-[#0b1d34] mb-3">{item.title}</h3>
                              <p className="text-[#7f8994] leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
          
                      <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] rounded-3xl blur-2xl opacity-20"></div>
                        <div className="relative bg-white rounded-3xl shadow-2xl p-10">
                          <h3 className="text-2xl font-black text-[#0b1d34] mb-8">Our Differentiators</h3>
                          <ul className="space-y-6">
                            {[
                              "Comprehensive end-to-end solutions from design to execution",
                              "Multi-disciplinary expertise across all construction sectors",
                              "Advanced technology and modern equipment fleet",
                              "Strong supplier and subcontractor network",
                              "Flexible workforce deployment capabilities",
                              "ISO certified quality management systems",
                              "Competitive pricing with no compromise on quality",
                              "Dedicated project management and support teams"
                            ].map((item, i) => (
                              <li key={i} className="flex items-start space-x-3">
                                <CheckCircle className="text-[#f1601f] flex-shrink-0 mt-1" size={20} />
                                <span className="text-[#7f8994] font-medium">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>  
        </>
    );
};

export default WhyChooseUs;