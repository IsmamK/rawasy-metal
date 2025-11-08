"use client"
import React, { useState } from 'react';
import { 
  FileText, Building2, Users, Wrench, Package, Factory, Settings,
  CheckCircle, ArrowRight, Calendar, DollarSign, Clock, Target,
  Upload, Phone, Mail, MapPin, Award, Shield, Zap, Sparkles,
  Briefcase, HardHat, AlertCircle
} from 'lucide-react';

const GetQuotePage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    
    // Project Details
    serviceType: '',
    projectType: '',
    projectLocation: '',
    projectSize: '',
    budget: '',
    timeline: '',
    startDate: '',
    
    // Additional Info
    description: '',
    requirements: '',
    attachments: null,
    
    // Preferences
    preferredContact: 'email',
    urgency: 'normal'
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log('Quote request submitted:', formData);
    // Handle submission
  };

  const services = [
    { value: 'general-contracting', label: 'General Contracting', icon: Building2 },
    { value: 'civil-mep', label: 'Civil & MEP Works', icon: Settings },
    { value: 'manpower', label: 'Manpower Supply', icon: Users },
    { value: 'maintenance', label: 'Maintenance Services', icon: Wrench },
    { value: 'trading', label: 'Trading & Supply', icon: Package },
    { value: 'metal-fabrication', label: 'Metal Fabrication', icon: Factory }
  ];

  const projectTypes = [
    { value: 'commercial', label: 'Commercial Building', icon: Briefcase },
    { value: 'industrial', label: 'Industrial Facility', icon: Factory },
    { value: 'infrastructure', label: 'Infrastructure', icon: Building2 },
    { value: 'residential', label: 'Residential', icon: Building2 },
    { value: 'oil-gas', label: 'Oil & Gas', icon: Factory },
    { value: 'healthcare', label: 'Healthcare', icon: Shield },
    { value: 'other', label: 'Other', icon: Target }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Quick Response",
      desc: "Receive your detailed quote within 24-48 hours"
    },
    {
      icon: Award,
      title: "Competitive Pricing",
      desc: "Best value for quality construction services"
    },
    {
      icon: CheckCircle,
      title: "No Obligation",
      desc: "Free quote with no commitment required"
    },
    {
      icon: Shield,
      title: "Expert Consultation",
      desc: "Professional advice included with every quote"
    }
  ];

  const steps = [
    { number: 1, title: 'Contact Info', desc: 'Your details' },
    { number: 2, title: 'Project Details', desc: 'Scope & requirements' },
    { number: 3, title: 'Additional Info', desc: 'Specifications' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <FileText className="text-[#f1601f]" size={20} />
              <span className="text-white font-semibold text-sm tracking-wider">REQUEST A QUOTE</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
            Get Your <span className="bg-gradient-to-r from-[#f1601f] via-orange-500 to-[#7f3e2c] bg-clip-text text-transparent">Free Quote</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Tell us about your project and receive a detailed, customized quote within 24-48 hours. No obligation, completely free.
          </p>

          <div className="flex flex-wrap gap-3 justify-center text-white">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <benefit.icon size={16} className="text-[#f1601f]" />
                <span className="text-sm font-medium">{benefit.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="relative -mt-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] rounded-3xl shadow-2xl p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, i) => (
                <div key={i} className="text-center group">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                    <benefit.icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-white/80 text-sm">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Quote Form */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16">
            {/* Left Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-8">
                <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Quick & Easy</span>
                <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mt-4 mb-6">
                  3 Simple Steps
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-12">
                  Complete the form and our team will prepare a comprehensive quote tailored to your project requirements.
                </p>

                {/* Step Indicator */}
                <div className="space-y-6 mb-12">
                  {steps.map((s, i) => (
                    <div 
                      key={i}
                      className={`flex items-center space-x-4 ${step >= s.number ? 'opacity-100' : 'opacity-30'} transition-opacity duration-300`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${step >= s.number ? 'bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] text-white' : 'bg-gray-200 text-gray-400'} transition-all duration-300`}>
                        {step > s.number ? <CheckCircle size={24} /> : s.number}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0b1d34]">{s.title}</h4>
                        <p className="text-sm text-gray-600">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="bg-gradient-to-br from-[#0b1d34] to-[#13344c] rounded-2xl p-8">
                  <h4 className="text-white font-black text-xl mb-6">Need Help?</h4>
                  <div className="space-y-4">
                    <a href="tel:+971XXXXXXXX" className="flex items-center space-x-3 text-white hover:text-[#f1601f] transition-colors duration-300">
                      <Phone size={20} />
                      <span>+971 XX XXX XXXX</span>
                    </a>
                    <a href="mailto:sales@rawasy.com" className="flex items-center space-x-3 text-white hover:text-[#f1601f] transition-colors duration-300">
                      <Mail size={20} />
                      <span>sales@rawasy.com</span>
                    </a>
                    <div className="flex items-center space-x-3 text-gray-400">
                      <Clock size={20} />
                      <span className="text-sm">Mon-Sat: 8AM - 6PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Area */}
            <div className="lg:col-span-8">
              <div className="bg-white border-2 border-gray-100 rounded-3xl shadow-2xl p-8 lg:p-12">
                {/* Step 1: Contact Information */}
                {step === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-3xl font-black text-[#0b1d34] mb-2">Contact Information</h3>
                      <p className="text-gray-600">Let us know how to reach you</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
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

                    <div className="grid md:grid-cols-2 gap-6">
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

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
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
                      <div>
                        <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                          Position/Title
                        </label>
                        <input 
                          type="text" 
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                          placeholder="Project Manager"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Project Details */}
                {step === 2 && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-3xl font-black text-[#0b1d34] mb-2">Project Details</h3>
                      <p className="text-gray-600">Tell us about your project requirements</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0b1d34] mb-4">
                        Service Required <span className="text-[#f1601f]">*</span>
                      </label>
                      <div className="grid md:grid-cols-2 gap-4">
                        {services.map((service, i) => (
                          <div
                            key={i}
                            onClick={() => setFormData({ ...formData, serviceType: service.value })}
                            className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                              formData.serviceType === service.value
                                ? 'border-[#f1601f] bg-[#f1601f]/5'
                                : 'border-gray-200 hover:border-[#f1601f]/50'
                            }`}
                          >
                            <service.icon className={formData.serviceType === service.value ? 'text-[#f1601f]' : 'text-gray-400'} size={24} />
                            <span className="font-semibold text-[#0b1d34]">{service.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0b1d34] mb-4">
                        Project Type <span className="text-[#f1601f]">*</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {projectTypes.map((type, i) => (
                          <div
                            key={i}
                            onClick={() => setFormData({ ...formData, projectType: type.value })}
                            className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                              formData.projectType === type.value
                                ? 'border-[#f1601f] bg-[#f1601f]/5'
                                : 'border-gray-200 hover:border-[#f1601f]/50'
                            }`}
                          >
                            <type.icon className={formData.projectType === type.value ? 'text-[#f1601f] mb-3' : 'text-gray-400 mb-3'} size={32} />
                            <span className="font-semibold text-[#0b1d34] text-sm text-center">{type.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                          Project Location <span className="text-[#f1601f]">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="projectLocation"
                          value={formData.projectLocation}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                          placeholder="Dubai, UAE"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                          Project Size
                        </label>
                        <input 
                          type="text" 
                          name="projectSize"
                          value={formData.projectSize}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                          placeholder="e.g., 10,000 sqm"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                          Estimated Budget
                        </label>
                        <select 
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                        >
                          <option value="">Select budget range</option>
                          <option value="<100k">Less than $100,000</option>
                          <option value="100k-500k">$100,000 - $500,000</option>
                          <option value="500k-1m">$500,000 - $1,000,000</option>
                          <option value="1m-5m">$1,000,000 - $5,000,000</option>
                          <option value=">5m">More than $5,000,000</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                          Expected Timeline
                        </label>
                        <select 
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                        >
                          <option value="">Select timeline</option>
                          <option value="<3months">Less than 3 months</option>
                          <option value="3-6months">3-6 months</option>
                          <option value="6-12months">6-12 months</option>
                          <option value=">12months">More than 12 months</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                        Preferred Start Date
                      </label>
                      <input 
                        type="date" 
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Additional Information */}
                {step === 3 && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-3xl font-black text-[#0b1d34] mb-2">Additional Information</h3>
                      <p className="text-gray-600">Help us understand your project better</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                        Project Description <span className="text-[#f1601f]">*</span>
                      </label>
                      <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300 resize-none"
                        placeholder="Provide a detailed description of your project, including objectives, scope, and any specific requirements..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                        Specific Requirements or Specifications
                      </label>
                      <textarea 
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300 resize-none"
                        placeholder="List any technical specifications, standards, certifications, or special requirements..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                        Attach Documents (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#f1601f] transition-all duration-300">
                        <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-600 mb-2">
                          <span className="text-[#f1601f] font-bold cursor-pointer">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">PDF, DOC, DOCX, XLS, XLSX (max 10MB)</p>
                        <input 
                          type="file"
                          name="attachments"
                          onChange={handleChange}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.xls,.xlsx"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
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

                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 flex items-start space-x-4">
                      <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                      <div>
                        <h4 className="font-bold text-blue-900 mb-2">What Happens Next?</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Our team will review your request within 24 hours</li>
                          <li>• We may contact you for clarification if needed</li>
                          <li>• You'll receive a detailed quote via email within 24-48 hours</li>
                          <li>• A project consultant will be assigned to discuss the quote</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t-2 border-gray-100">
                  <button
                    onClick={handlePrev}
                    disabled={step === 1}
                    className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                      step === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-[#0b1d34] hover:bg-gray-200'
                    }`}
                  >
                    Previous
                  </button>

                  {step < 3 ? (
                    <button
                      onClick={handleNext}
                      className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center space-x-3"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center space-x-3"
                    >
                      <span>Submit Request</span>
                      <CheckCircle className="group-hover:scale-110 transition-transform duration-300" size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Why Choose RAWASY</span>
            <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
              The RAWASY Advantage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference of working with a Grade 1 licensed contractor
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Grade 1 License",
                desc: "Premium contractor license for large-scale, complex projects across the Gulf region"
              },
              {
                icon: Shield,
                title: "ISO Certified",
                desc: "ISO 9001:2015, ISO 14001, and OHSAS 18001 certified for quality and safety"
              },
              {
                icon: CheckCircle,
                title: "800+ Projects",
                desc: "Successfully delivered projects across commercial, industrial, and infrastructure sectors"
              },
              {
                icon: Users,
                title: "2000+ Workforce",
                desc: "Highly skilled and certified professionals ready for immediate deployment"
              },
              {
                icon: Clock,
                title: "On-Time Delivery",
                desc: "Advanced project management ensuring timely completion without compromising quality"
              },
              {
                icon: DollarSign,
                title: "Competitive Pricing",
                desc: "Best value for premium construction services with transparent pricing"
              }
            ].map((item, i) => (
              <div key={i} className="group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#f1601f] hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <item.icon className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-black text-[#0b1d34] mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Our Services</span>
            <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
              Comprehensive Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide end-to-end construction and industrial services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div key={i} className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#f1601f] hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0b1d34] to-[#13344c] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500">
                  <service.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-black text-[#0b1d34] mb-4">{service.label}</h3>
                <a href="/services" className="inline-flex items-center space-x-2 text-[#f1601f] font-bold hover:space-x-3 transition-all duration-300">
                  <span>Learn More</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Client Success Stories</span>
            <h2 className="text-5xl md:text-6xl font-black text-white mt-4 mb-6">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "RAWASY delivered our industrial facility on time and within budget. Their professionalism and quality of work exceeded our expectations.",
                author: "Ahmed Al-Mansouri",
                position: "Project Director",
                company: "Major Oil & Gas Company"
              },
              {
                quote: "The team's expertise in MEP works is outstanding. They handled complex installations with precision and maintained highest safety standards.",
                author: "Sarah Johnson",
                position: "Facilities Manager",
                company: "Healthcare Provider"
              },
              {
                quote: "From initial consultation to project handover, RAWASY demonstrated exceptional project management and technical capabilities.",
                author: "Mohamed Al-Hashimi",
                position: "CEO",
                company: "Commercial Real Estate"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-500">
                <div className="flex mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Sparkles key={star} className="text-[#f1601f]" size={20} />
                  ))}
                </div>
                <p className="text-white leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                <div className="border-t border-white/20 pt-6">
                  <h4 className="text-white font-bold">{testimonial.author}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.position}</p>
                  <p className="text-gray-500 text-xs">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">FAQ</span>
            <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
              Common Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our quote process
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How long does it take to receive a quote?",
                a: "You will receive a comprehensive quote within 24-48 hours of submitting your request. For urgent projects, we can provide preliminary estimates within 24 hours."
              },
              {
                q: "Is the quote obligation-free?",
                a: "Yes, absolutely! Our quotes are completely free with no obligation. You can review our proposal and pricing without any commitment."
              },
              {
                q: "What information do I need to provide?",
                a: "The more details you provide, the more accurate your quote will be. Essential information includes project type, location, size, timeline, and any specific requirements or specifications."
              },
              {
                q: "Can I modify my project after receiving the quote?",
                a: "Yes, we understand that projects evolve. We'll work with you to adjust the quote based on any changes to scope, timeline, or requirements."
              },
              {
                q: "Do you offer financing options?",
                a: "Yes, we work with several financial institutions to provide flexible payment plans and financing options for qualified projects."
              },
              {
                q: "What areas do you serve?",
                a: "RAWASY primarily serves the Gulf region with a strong presence in the United Arab Emirates and surrounding countries."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#f1601f] hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-black text-[#0b1d34] mb-4 flex items-start">
                  <span className="w-8 h-8 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-lg flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">
                    {i + 1}
                  </span>
                  {faq.q}
                </h3>
                <p className="text-gray-600 leading-relaxed ml-12">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Ready to Get Started?
          </h2>
          
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Request your free quote today and let our experts help you bring your project to life
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <a 
              href="#" 
              onClick={() => setStep(1)}
              className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-10 py-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 inline-flex items-center justify-center space-x-3"
            >
              <span>Start Your Quote</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
            </a>
            <a 
              href="tel:+971XXXXXXXX" 
              className="bg-white/10 backdrop-blur-sm text-white px-10 py-6 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300 inline-flex items-center justify-center space-x-3"
            >
              <Phone size={20} />
              <span>Call Us Now</span>
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-16 border-t border-white/10">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="text-white" size={28} />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Call Us</h4>
              <p className="text-gray-400">+971 XX XXX XXXX</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="text-white" size={28} />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Email Us</h4>
              <p className="text-gray-400">sales@rawasy.com</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-white" size={28} />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Visit Us</h4>
              <p className="text-gray-400">Gulf Region</p>
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

export default GetQuotePage;