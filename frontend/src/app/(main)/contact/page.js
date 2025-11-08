"use client"
import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Globe, Send, CheckCircle, 
  Building2, Users, Award, Shield, ArrowRight, Linkedin,
  Facebook, Twitter, Instagram, MessageSquare, Headphones,
  FileText, Calendar, Zap
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    preferredContact: 'email',
    urgency: 'normal'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: ["+971 XX XXX XXXX", "+971 XX XXX XXXX"],
      subtext: "Mon-Sat: 8:00 AM - 6:00 PM",
      color: "from-[#f1601f] to-[#7f3e2c]",
      action: "tel:+971XXXXXXXX"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@rawasy.com", "sales@rawasy.com"],
      subtext: "24-hour response time",
      color: "from-[#0b1d34] to-[#13344c]",
      action: "mailto:info@rawasy.com"
    },
    {
      icon: MapPin,
      title: "Visit Our Office",
      details: ["Gulf Region", "United Arab Emirates"],
      subtext: "By appointment",
      color: "from-[#7f3e2c] to-[#7f8994]",
      action: "#map"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Saturday", "8:00 AM - 6:00 PM"],
      subtext: "Closed on Sundays & Public Holidays",
      color: "from-[#13344c] to-[#0b1d34]",
      action: null
    }
  ];

  const departments = [
    {
      icon: Building2,
      title: "General Inquiries",
      email: "info@rawasy.com",
      phone: "+971 XX XXX XXXX",
      desc: "For general questions and information"
    },
    {
      icon: FileText,
      title: "Project Quotes",
      email: "sales@rawasy.com",
      phone: "+971 XX XXX XXXX",
      desc: "Request project quotations and proposals"
    },
    {
      icon: Users,
      title: "HR & Recruitment",
      email: "hr@rawasy.com",
      phone: "+971 XX XXX XXXX",
      desc: "Career opportunities and employment"
    },
    {
      icon: Headphones,
      title: "Customer Support",
      email: "support@rawasy.com",
      phone: "+971 XX XXX XXXX",
      desc: "Technical support and assistance"
    }
  ];

  const reasons = [
    {
      icon: Award,
      title: "15+ Years Experience",
      desc: "Established reputation since 2008"
    },
    {
      icon: Shield,
      title: "ISO Certified",
      desc: "Quality & safety standards"
    },
    {
      icon: Users,
      title: "2000+ Workforce",
      desc: "Skilled professionals ready"
    },
    {
      icon: CheckCircle,
      title: "800+ Projects",
      desc: "Successfully delivered"
    }
  ];

  const faqs = [
    {
      question: "What services does RAWASY offer?",
      answer: "We offer comprehensive construction and industrial solutions including general contracting, civil & MEP works, manpower supply, maintenance services, trading & supply, and metal fabrication."
    },
    {
      question: "What regions do you serve?",
      answer: "RAWASY primarily serves the Gulf region with a strong presence in the United Arab Emirates and surrounding countries."
    },
    {
      question: "How quickly can you start a project?",
      answer: "Project timelines vary based on scope and complexity. Contact us for a detailed assessment and we'll provide a realistic timeline for your specific requirements."
    },
    {
      question: "Do you provide emergency services?",
      answer: "Yes, we offer 24/7 emergency response services for maintenance and critical repairs. Contact our emergency hotline for immediate assistance."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=1080&fit=crop" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <MessageSquare className="text-[#f1601f]" size={20} />
              <span className="text-white font-semibold text-sm tracking-wider">LET'S CONNECT</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
            Get In <span className="bg-gradient-to-r from-[#f1601f] via-orange-500 to-[#7f3e2c] bg-clip-text text-transparent">Touch</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Have a project in mind? Our team of experts is ready to help you bring your vision to life. Reach out today for a consultation.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="#contact-form" 
              className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center space-x-3"
            >
              <span>Send Message</span>
              <Send className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
            </a>
            <a 
              href="tel:+971XXXXXXXX" 
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300 flex items-center space-x-3"
            >
              <Phone size={20} />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative -mt-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <a
                key={i}
                href={info.action || '#'}
                className="group bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500 border-2 border-transparent hover:border-[#f1601f]"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <info.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-black text-[#0b1d34] mb-4">{info.title}</h3>
                {info.details.map((detail, j) => (
                  <p key={j} className="text-gray-600 font-semibold mb-1">{detail}</p>
                ))}
                <p className="text-sm text-gray-500 mt-3">{info.subtext}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section id="contact-form" className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Left Column - Info */}
            <div className="lg:col-span-2">
              <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Contact Form</span>
              <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
                Send Us a Message
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-12">
                Fill out the form and our team will get back to you within 24 hours. For urgent matters, please call us directly.
              </p>

              {/* Why Choose Us */}
              <div className="space-y-6 mb-12">
                {reasons.map((reason, i) => (
                  <div key={i} className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <reason.icon className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0b1d34] mb-1">{reason.title}</h4>
                      <p className="text-sm text-gray-600">{reason.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-[#0b1d34] to-[#13344c] rounded-2xl p-8">
                <h4 className="text-white font-black text-xl mb-6">Connect With Us</h4>
                <div className="flex space-x-4">
                  {[
                    { icon: Linkedin, href: "#" },
                    { icon: Facebook, href: "#" },
                    { icon: Twitter, href: "#" },
                    { icon: Instagram, href: "#" }
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-[#f1601f] transition-all duration-300 group"
                    >
                      <social.icon className="text-white group-hover:scale-110 transition-transform duration-300" size={20} />
                    </a>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-6">
                  Follow us on social media for updates on our latest projects and industry insights.
                </p>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-3">
              <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 lg:p-12 shadow-xl">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                      First Name <span className="text-[#f1601f]">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                      Last Name <span className="text-[#f1601f]">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                      Email Address <span className="text-[#f1601f]">*</span>
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                      Phone Number <span className="text-[#f1601f]">*</span>
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                    Company Name
                  </label>
                  <input 
                    type="text" 
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                    placeholder="Your Company"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                    Subject <span className="text-[#f1601f]">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                      Preferred Contact Method
                    </label>
                    <select 
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="either">Either</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                      Urgency Level
                    </label>
                    <select 
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                    >
                      <option value="low">Low - Within a week</option>
                      <option value="normal">Normal - Within 2-3 days</option>
                      <option value="high">High - Within 24 hours</option>
                      <option value="urgent">Urgent - ASAP</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                    Your Message <span className="text-[#f1601f]">*</span>
                  </label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300 resize-none"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>

                <button 
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center space-x-3 group"
                >
                  <span>Send Message</span>
                  <Send className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                </button>

                <p className="text-sm text-gray-500 text-center mt-6">
                  By submitting this form, you agree to our privacy policy. We'll respond within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Contact Departments</span>
            <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
              Reach the Right Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect directly with the department that best suits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {departments.map((dept, i) => (
              <div key={i} className="group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#f1601f] hover:shadow-2xl transition-all duration-500">
                <dept.icon className="text-[#f1601f] mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" size={40} />
                <h3 className="text-2xl font-black text-[#0b1d34] mb-4">{dept.title}</h3>
                <p className="text-sm text-gray-600 mb-6">{dept.desc}</p>
                <div className="space-y-3">
                  <a href={`mailto:${dept.email}`} className="flex items-center space-x-3 text-gray-700 hover:text-[#f1601f] transition-colors duration-300">
                    <Mail size={18} />
                    <span className="text-sm font-semibold">{dept.email}</span>
                  </a>
                  <a href={`tel:${dept.phone}`} className="flex items-center space-x-3 text-gray-700 hover:text-[#f1601f] transition-colors duration-300">
                    <Phone size={18} />
                    <span className="text-sm font-semibold">{dept.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">FAQ</span>
            <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#f1601f] hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-black text-[#0b1d34] mb-4 flex items-start">
                  <span className="w-8 h-8 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-lg flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">
                    {i + 1}
                  </span>
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed ml-12">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">Still have questions?</p>
            <a 
              href="#contact-form" 
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 group"
            >
              <span>Contact Us</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map" className="py-32 bg-[#0b1d34]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black text-white mb-4">Visit Our Office</h2>
            <p className="text-xl text-gray-300">Located in the heart of the Gulf region</p>
          </div>
          
          <div className="bg-gray-200 rounded-3xl overflow-hidden shadow-2xl h-96 flex items-center justify-center">
            <p className="text-gray-600 font-semibold">Map Integration Placeholder</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <MapPin className="text-[#f1601f] mx-auto mb-4" size={32} />
              <h4 className="text-white font-bold mb-2">Address</h4>
              <p className="text-gray-400">Gulf Region, UAE</p>
            </div>
            <div className="text-center">
              <Calendar className="text-[#f1601f] mx-auto mb-4" size={32} />
              <h4 className="text-white font-bold mb-2">Schedule Visit</h4>
              <p className="text-gray-400">By appointment only</p>
            </div>
            <div className="text-center">
              <Zap className="text-[#f1601f] mx-auto mb-4" size={32} />
              <h4 className="text-white font-bold mb-2">Quick Response</h4>
              <p className="text-gray-400">24-hour turnaround</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;