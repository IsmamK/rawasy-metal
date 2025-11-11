"use client";
import { AlertCircle, ArrowRight, CheckCircle, Clock, Mail, Phone, Upload, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

const QuoteForm = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    serviceType: '',
    projectType: '',
    projectLocation: '',
    projectSize: '',
    budget: '',
    timeline: '',
    startDate: '',
    description: '',
    requirements: '',
    attachments: null,
    preferredContact: 'email',
    urgency: 'normal'
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/quote/form/`;

  // Check for auth token
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      console.log("Admin authenticated, edit mode available");
    }
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(ENDPOINT);
        if (!response.ok) throw new Error("Failed to fetch data");
        const jsonData = await response.json();
        setData(jsonData);
        setTempData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to default data if API fails
        const defaultData = {
          title: "Get Your Custom Quote",
          subtitle: "3 Simple Steps",
          description: "Complete the form and our team will prepare a comprehensive quote tailored to your project requirements.",
          contactInfo: {
            phone: "+971 XX XXX XXXX",
            email: "sales@rawasy.com",
            workingHours: "Mon-Sat: 8AM - 6PM"
          },
          formFields: {
            services: [
              { value: "engineering", label: "Engineering", icon: "engineering" },
              { value: "construction", label: "Construction", icon: "construction" },
              { value: "consulting", label: "Consulting", icon: "consulting" },
              { value: "maintenance", label: "Maintenance", icon: "maintenance" }
            ],
            projectTypes: [
              { value: "residential", label: "Residential", icon: "residential" },
              { value: "commercial", label: "Commercial", icon: "commercial" },
              { value: "industrial", label: "Industrial", icon: "industrial" },
              { value: "infrastructure", label: "Infrastructure", icon: "infrastructure" },
              { value: "renovation", label: "Renovation", icon: "renovation" },
              { value: "other", label: "Other", icon: "other" }
            ],
            budgetRanges: [
              "Less than $100,000",
              "$100,000 - $500,000",
              "$500,000 - $1,000,000",
              "$1,000,000 - $5,000,000",
              "More than $5,000,000"
            ],
            timelineRanges: [
              "Less than 3 months",
              "3-6 months",
              "6-12 months",
              "More than 12 months"
            ]
          },
          steps: [
            { number: 1, title: "Contact Info", desc: "Your details" },
            { number: 2, title: "Project Details", desc: "Scope & requirements" },
            { number: 3, title: "Additional Info", desc: "Specifications" }
          ]
        };
        setData(defaultData);
        setTempData(defaultData);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ENDPOINT]);

  // Form handling functions
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = async () => {
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    Swal.fire({
      title: 'Success!',
      text: 'Your quote request has been submitted successfully!',
      icon: 'success',
      confirmButtonColor: '#f1601f',
    });
  };

  // Edit mode functions
  const toggleEditMode = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      Swal.fire({
        title: 'Access Denied',
        text: 'Admin access required. Please log in.',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }
    
    if (editMode) {
      setTempData(data);
    }
    setEditMode(!editMode);
  };

  const handleTextChange = (path, value) => {
    const paths = path.split('.');
    setTempData(prev => {
      const newData = {...prev};
      let current = newData;
      
      for (let i = 0; i < paths.length - 1; i++) {
        current = current[paths[i]];
      }
      
      current[paths[paths.length - 1]] = value;
      return newData;
    });
  };

  const saveChanges = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to save changes',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Save Changes?',
      text: 'All modifications will be updated on the website.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, save changes!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    setIsSaving(true);
    try {
      const response = await fetch(ENDPOINT, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(tempData)
      });

      if (!response.ok) throw new Error("Failed to save changes");

      const updatedData = await response.json();
      setData(updatedData);
      setEditMode(false);
      
      Swal.fire({
        title: 'Success!',
        text: 'Changes saved successfully!',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    } catch (error) {
      console.error("Error saving data:", error);
      Swal.fire({
        title: 'Save Failed',
        text: 'Failed to save changes. Please try again.',
        icon: 'error',
        confirmButtonColor: '#f1601f',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const editTextInModal = async (field, currentValue, title, description) => {
    const { value: newValue } = await Swal.fire({
      title: title,
      input: 'textarea',
      inputLabel: description,
      inputValue: currentValue,
      inputAttributes: {
        'aria-label': `Edit ${field}`
      },
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'This field cannot be empty!';
        }
      }
    });

    if (newValue) {
      handleTextChange(field, newValue);
    }
  };

  const editContactInfoInModal = async (field, currentValue, title) => {
    const { value: newValue } = await Swal.fire({
      title: title,
      input: 'text',
      inputLabel: `Edit ${field}`,
      inputValue: currentValue,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel'
    });

    if (newValue) {
      handleTextChange(`contactInfo.${field}`, newValue);
    }
  };

  // Render icon based on icon name
  const renderIcon = (iconName, props = {}) => {
    const iconProps = { size: 24, ...props };
    
    // You can replace these with actual icons or keep as text
    switch (iconName) {
      case 'engineering':
        return <div className="w-8 h-8 bg-[#f1601f] rounded-lg flex items-center justify-center text-white font-bold">E</div>;
      case 'construction':
        return <div className="w-8 h-8 bg-[#f1601f] rounded-lg flex items-center justify-center text-white font-bold">C</div>;
      case 'consulting':
        return <div className="w-8 h-8 bg-[#f1601f] rounded-lg flex items-center justify-center text-white font-bold">CS</div>;
      case 'maintenance':
        return <div className="w-8 h-8 bg-[#f1601f] rounded-lg flex items-center justify-center text-white font-bold">M</div>;
      case 'residential':
        return <div className="w-12 h-12 bg-[#f1601f] rounded-lg flex items-center justify-center text-white font-bold">🏠</div>;
      case 'commercial':
        return <div className="w-12 h-12 bg-[#f1601f] rounded-lg flex items-center justify-center text-white font-bold">🏢</div>;
      case 'industrial':
        return <div className="w-12 h-12 bg-[#f1601f] rounded-lg flex items-center justify-center text-white font-bold">🏭</div>;
      case 'infrastructure':
        return <div className="w-12 h-12 bg-[#f1601f] rounded-lg flex items-center justify-center text-white font-bold">🌉</div>;
      case 'renovation':
        return <div className="w-12 h-12 bg-[#f1601f] rounded-lg flex items-center justify-center text-white font-bold">🔨</div>;
      case 'other':
        return <div className="w-12 h-12 bg-[#f1601f] rounded-lg flex items-center justify-center text-white font-bold">❓</div>;
      default:
        return <div className="w-8 h-8 bg-[#f1601f] rounded-lg flex items-center justify-center text-white font-bold">?</div>;
    }
  };

  if (isLoading) {
    return (
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading quote form...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Failed to load quote form. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-32 bg-gradient-to-b from-white to-gray-50 relative">
        {/* Edit Mode Toggle Button */}
        {localStorage.getItem("authToken") && (
          <div className="absolute top-4 right-4 z-20">
            {editMode ? (
              <div className="flex gap-2">
                <button 
                  onClick={saveChanges}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg flex items-center justify-center"
                  title="Save Changes"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                </button>
                <button 
                  onClick={toggleEditMode}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg"
                  title="Cancel Editing"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={toggleEditMode}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg"
                title="Edit Content"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Edit Mode Overlay Indicator */}
        {editMode && (
          <div className="absolute inset-0 border-4 border-yellow-400 pointer-events-none z-10 flex items-center justify-center">
            <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
              EDIT MODE ENABLED - Click on any content to edit
            </span>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16">
            {/* Left Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-8">
                {editMode ? (
                  <>
                    <div 
                      onClick={() => editTextInModal('subtitle', tempData.subtitle, 'Edit Subtitle', 'Update the subtitle text')}
                      className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-4 hover:bg-white/30 transition-all duration-300"
                    >
                      <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase bg-transparent border-none">
                        {tempData.subtitle}
                      </span>
                    </div>
                    <div 
                      onClick={() => editTextInModal('title', tempData.title, 'Edit Main Title', 'Update the main title text')}
                      className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6 hover:bg-white/30 transition-all duration-300"
                    >
                      <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] bg-transparent border-none">
                        {tempData.title}
                      </h2>
                    </div>
                    <div 
                      onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text')}
                      className="cursor-pointer bg-white/10 backdrop-blur-sm border-2 border-dashed border-gray-300 text-lg text-gray-600 leading-relaxed mb-12 p-4 rounded-lg hover:bg-white/20 transition-all duration-300"
                    >
                      {tempData.description}
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                      {data.subtitle}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mt-4 mb-6">
                      {data.title}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-12">
                      {data.description}
                    </p>
                  </>
                )}

                {/* Step Indicator */}
                <div className="space-y-6 mb-12">
                  {tempData.steps.map((s, i) => (
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
                  <h4 className="text-white font-black text-xl mb-6">
                    {editMode ? (
                      <span className="cursor-pointer hover:text-[#f1601f] transition-colors duration-300">
                        Need Help?
                      </span>
                    ) : (
                      "Need Help?"
                    )}
                  </h4>
                  <div className="space-y-4">
                    <div 
                      onClick={editMode ? () => editContactInfoInModal('phone', tempData.contactInfo.phone, 'Edit Phone Number') : undefined}
                      className={`flex items-center space-x-3 ${editMode ? 'cursor-pointer hover:text-[#f1601f]' : ''} transition-colors duration-300`}
                    >
                      <Phone size={20} className="text-white" />
                      <span className="text-white">{tempData.contactInfo.phone}</span>
                    </div>
                    <div 
                      onClick={editMode ? () => editContactInfoInModal('email', tempData.contactInfo.email, 'Edit Email') : undefined}
                      className={`flex items-center space-x-3 ${editMode ? 'cursor-pointer hover:text-[#f1601f]' : ''} transition-colors duration-300`}
                    >
                      <Mail size={20} className="text-white" />
                      <span className="text-white">{tempData.contactInfo.email}</span>
                    </div>
                    <div 
                      onClick={editMode ? () => editContactInfoInModal('workingHours', tempData.contactInfo.workingHours, 'Edit Working Hours') : undefined}
                      className={`flex items-center space-x-3 ${editMode ? 'cursor-pointer' : ''}`}
                    >
                      <Clock size={20} className="text-gray-400" />
                      <span className="text-sm text-gray-400">{tempData.contactInfo.workingHours}</span>
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
                        {tempData.formFields.services.map((service, i) => (
                          <div
                            key={i}
                            onClick={() => setFormData({ ...formData, serviceType: service.value })}
                            className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                              formData.serviceType === service.value
                                ? 'border-[#f1601f] bg-[#f1601f]/5'
                                : 'border-gray-200 hover:border-[#f1601f]/50'
                            }`}
                          >
                            {renderIcon(service.icon)}
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
                        {tempData.formFields.projectTypes.map((type, i) => (
                          <div
                            key={i}
                            onClick={() => setFormData({ ...formData, projectType: type.value })}
                            className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                              formData.projectType === type.value
                                ? 'border-[#f1601f] bg-[#f1601f]/5'
                                : 'border-gray-200 hover:border-[#f1601f]/50'
                            }`}
                          >
                            {renderIcon(type.icon, { className: formData.projectType === type.value ? 'text-[#f1601f] mb-3' : 'text-gray-400 mb-3' })}
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
                          {tempData.formFields.budgetRanges.map((range, i) => (
                            <option key={i} value={range}>{range}</option>
                          ))}
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
                          {tempData.formFields.timelineRanges.map((range, i) => (
                            <option key={i} value={range}>{range}</option>
                          ))}
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
    </>
  );
};

export default QuoteForm;