"use client";
import { ArrowRight, CheckCircle, Globe, Mail, Phone, Edit, Save, X, Plus, Trash2, Upload } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

const Contact = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/services/contact/`;

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
          sectionTitle: "Get In Touch",
          mainTitle: "Let's Discuss Your Project",
          description: "Our team of experts is ready to help you bring your vision to life. Contact us today for a consultation and detailed project quotation.",
          contactMethods: [
            {
              icon: "phone",
              title: "Call Us",
              value: "+971 XX XXX XXXX",
              subtitle: "Mon-Sat: 8:00 AM - 6:00 PM"
            },
            {
              icon: "mail",
              title: "Email Us",
              value: "info@rawasy.com",
              subtitle: "We'll respond within 24 hours"
            },
            {
              icon: "globe",
              title: "Visit Our Office",
              value: "Gulf Region",
              subtitle: "Serving UAE and surrounding areas"
            }
          ],
          whyChooseUs: {
            title: "Why Choose RAWASY?",
            features: [
              "Grade 1 Contractor License",
              "ISO 9001:2015 Certified",
              "15+ Years of Excellence",
              "2000+ Skilled Workforce",
              "24/7 Emergency Support"
            ]
          },
          formTitle: "Request a Quote",
          formFields: {
            firstName: { label: "First Name *", placeholder: "John", required: true },
            lastName: { label: "Last Name *", placeholder: "Doe", required: true },
            email: { label: "Email Address *", placeholder: "john.doe@example.com", required: true },
            phone: { label: "Phone Number *", placeholder: "+971 XX XXX XXXX", required: true },
            service: { 
              label: "Service Required *", 
              required: true,
              options: [
                "Select a service",
                "General Contracting",
                "Civil & MEP Works",
                "Manpower Supply",
                "Maintenance Services",
                "Trading & Supply",
                "Metal Fabrication",
                "Other"
              ]
            },
            projectDetails: { label: "Project Details *", placeholder: "Tell us about your project requirements, timeline, and any specific needs...", required: true }
          },
          submitButton: {
            text: "Submit Request",
            loadingText: "Submitting..."
          },
          formFooter: "By submitting this form, you agree to our privacy policy. We'll contact you within 24 hours."
        };
        setData(defaultData);
        setTempData(defaultData);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ENDPOINT]);

  // Toggle edit mode
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
      // Exiting edit mode - reset temp data
      setTempData(data);
    }
    setEditMode(!editMode);
  };

  // Handle text changes
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

  // Handle contact methods changes
  const handleContactMethodChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.contactMethods[index][field] = value;
      return newData;
    });
  };

  // Handle features changes
  const handleFeatureChange = (index, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.whyChooseUs.features[index] = value;
      return newData;
    });
  };

  // Add new contact method
  const addNewContactMethod = () => {
    setTempData(prev => ({
      ...prev,
      contactMethods: [
        ...prev.contactMethods,
        {
          icon: "phone",
          title: "New Contact Method",
          value: "Contact details",
          subtitle: "Additional information"
        }
      ]
    }));
  };

  // Add new feature
  const addNewFeature = () => {
    setTempData(prev => ({
      ...prev,
      whyChooseUs: {
        ...prev.whyChooseUs,
        features: [...prev.whyChooseUs.features, "New Feature"]
      }
    }));
  };

  // Remove contact method with confirmation
  const removeContactMethod = async (index) => {
    if (tempData.contactMethods.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one contact method',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This contact method will be removed permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setTempData(prev => ({
        ...prev,
        contactMethods: prev.contactMethods.filter((_, i) => i !== index)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Contact method has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Remove feature with confirmation
  const removeFeature = async (index) => {
    if (tempData.whyChooseUs.features.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one feature',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This feature will be removed permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setTempData(prev => ({
        ...prev,
        whyChooseUs: {
          ...prev.whyChooseUs,
          features: prev.whyChooseUs.features.filter((_, i) => i !== index)
        }
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Feature has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Save changes with confirmation
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

  // Edit text in modal
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

  // Edit contact method in modal
  const editContactMethodInModal = async (index, currentContact) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Contact Method',
      html:
        `<select id="swal-input1" class="swal2-input">
          <option value="phone" ${currentContact.icon === 'phone' ? 'selected' : ''}>Phone</option>
          <option value="mail" ${currentContact.icon === 'mail' ? 'selected' : ''}>Email</option>
          <option value="globe" ${currentContact.icon === 'globe' ? 'selected' : ''}>Globe</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Title" value="${currentContact.title}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Value" value="${currentContact.value}">` +
        `<input id="swal-input4" class="swal2-input" placeholder="Subtitle" value="${currentContact.subtitle}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          icon: document.getElementById('swal-input1').value,
          title: document.getElementById('swal-input2').value,
          value: document.getElementById('swal-input3').value,
          subtitle: document.getElementById('swal-input4').value
        };
      }
    });

    if (formValues) {
      handleContactMethodChange(index, 'icon', formValues.icon);
      handleContactMethodChange(index, 'title', formValues.title);
      handleContactMethodChange(index, 'value', formValues.value);
      handleContactMethodChange(index, 'subtitle', formValues.subtitle);
    }
  };

  // Edit feature in modal
  const editFeatureInModal = async (index, currentFeature) => {
    const { value: newValue } = await Swal.fire({
      title: 'Edit Feature',
      input: 'text',
      inputLabel: 'Update the feature text',
      inputValue: currentFeature,
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
      handleFeatureChange(index, newValue);
    }
  };

  // Edit form field in modal
  const editFormFieldInModal = async (fieldName, currentField) => {
    const { value: formValues } = await Swal.fire({
      title: `Edit ${fieldName} Field`,
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Label" value="${currentField.label}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Placeholder" value="${currentField.placeholder || ''}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          label: document.getElementById('swal-input1').value,
          placeholder: document.getElementById('swal-input2').value
        };
      }
    });

    if (formValues) {
      setTempData(prev => ({
        ...prev,
        formFields: {
          ...prev.formFields,
          [fieldName]: {
            ...prev.formFields[fieldName],
            label: formValues.label,
            placeholder: formValues.placeholder
          }
        }
      }));
    }
  };

  // Render icon based on icon name
  const renderIcon = (iconName, props = {}) => {
    const iconProps = { size: 24, className: "text-white", ...props };
    
    switch (iconName) {
      case 'phone':
        return <Phone {...iconProps} />;
      case 'mail':
        return <Mail {...iconProps} />;
      case 'globe':
        return <Globe {...iconProps} />;
      default:
        return <Phone {...iconProps} />;
    }
  };

  if (isLoading) {
    return (
      <section id="contact" className="py-32 bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading contact section...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section id="contact" className="py-32 bg-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load contact section. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="contact" className="py-32 bg-white relative">
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
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Column */}
            <div>
              {/* Section Title */}
              {editMode ? (
                <div 
                  onClick={() => editTextInModal('sectionTitle', tempData.sectionTitle, 'Edit Section Title', 'Update the section title text')}
                  className="cursor-pointer bg-orange-100 rounded-lg p-3 mb-2 hover:bg-orange-200 transition-all duration-300"
                >
                  <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                    {tempData.sectionTitle}
                  </span>
                </div>
              ) : (
                <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                  {data.sectionTitle}
                </span>
              )}

              {/* Main Title */}
              {editMode ? (
                <div 
                  onClick={() => editTextInModal('mainTitle', tempData.mainTitle, 'Edit Main Title', 'Update the main title text')}
                  className="cursor-pointer bg-gray-100 rounded-xl p-4 my-4 hover:bg-gray-200 transition-all duration-300"
                >
                  <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34]">
                    {tempData.mainTitle}
                  </h2>
                </div>
              ) : (
                <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
                  {data.mainTitle}
                </h2>
              )}

              {/* Description */}
              {editMode ? (
                <div 
                  onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text')}
                  className="cursor-pointer bg-gray-100 rounded-xl p-4 mb-12 hover:bg-gray-200 transition-all duration-300"
                >
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {tempData.description}
                  </p>
                </div>
              ) : (
                <p className="text-xl text-gray-600 leading-relaxed mb-12">
                  {data.description}
                </p>
              )}

              {/* Contact Methods */}
              <div className="space-y-6">
                {tempData.contactMethods.map((contact, index) => (
                  <div key={index} className="relative">
                    {/* Delete button for contact method */}
                    {editMode && (
                      <button
                        onClick={() => removeContactMethod(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                        title="Remove this contact method"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    
                    <div 
                      onClick={editMode ? () => editContactMethodInModal(index, contact) : undefined}
                      className={`flex items-start space-x-4 group cursor-pointer ${editMode ? 'hover:bg-gray-50 rounded-lg p-3 transition-all duration-300' : ''}`}
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {renderIcon(contact.icon)}
                      </div>
                      <div className="flex-1">
                        {editMode ? (
                          <div className="space-y-1">
                            <h4 className="font-bold text-[#0b1d34]">{contact.title}</h4>
                            <p className="text-gray-600">{contact.value}</p>
                            <p className="text-sm text-gray-500">{contact.subtitle}</p>
                          </div>
                        ) : (
                          <>
                            <h4 className="font-bold text-[#0b1d34] mb-1">{contact.title}</h4>
                            <p className="text-gray-600">{contact.value}</p>
                            <p className="text-sm text-gray-500">{contact.subtitle}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add new contact method button */}
                {editMode && (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer p-4 hover:bg-gray-50 transition-all duration-300"
                    onClick={addNewContactMethod}
                  >
                    <Plus className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-gray-600 font-medium">Add Contact Method</span>
                  </div>
                )}
              </div>

              {/* Why Choose Us Section */}
              <div className="mt-12 p-8 bg-gradient-to-br from-[#0b1d34] to-[#13344c] rounded-2xl relative">
                {/* Edit title */}
                {editMode ? (
                  <div 
                    onClick={() => editTextInModal('whyChooseUs.title', tempData.whyChooseUs.title, 'Edit Why Choose Us Title', 'Update the section title')}
                    className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-2 mb-4 hover:bg-white/30 transition-all duration-300"
                  >
                    <h4 className="text-white font-black text-xl">{tempData.whyChooseUs.title}</h4>
                  </div>
                ) : (
                  <h4 className="text-white font-black text-xl mb-4">{data.whyChooseUs.title}</h4>
                )}

                <ul className="space-y-3">
                  {tempData.whyChooseUs.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3 text-white relative">
                      <CheckCircle className="text-[#f1601f] flex-shrink-0" size={20} />
                      {editMode ? (
                        <div className="flex items-center justify-between w-full">
                          <span 
                            onClick={() => editFeatureInModal(index, feature)}
                            className="cursor-pointer hover:bg-white/20 rounded px-2 py-1 flex-1"
                          >
                            {feature}
                          </span>
                          <button
                            onClick={() => removeFeature(index)}
                            className="bg-red-500 text-white rounded-full p-1 ml-2 hover:bg-red-600 transition-colors"
                            title="Remove this feature"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span>{feature}</span>
                      )}
                    </li>
                  ))}
                  
                  {/* Add new feature button */}
                  {editMode && (
                    <li 
                      className="flex items-center space-x-3 text-white/70 cursor-pointer hover:text-white transition-colors"
                      onClick={addNewFeature}
                    >
                      <Plus className="text-[#f1601f] flex-shrink-0" size={20} />
                      <span>Add New Feature</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-3xl p-8 lg:p-12 relative">
              {/* Form Title */}
              {editMode ? (
                <div 
                  onClick={() => editTextInModal('formTitle', tempData.formTitle, 'Edit Form Title', 'Update the form title text')}
                  className="cursor-pointer bg-gray-100 rounded-xl p-4 mb-8 hover:bg-gray-200 transition-all duration-300"
                >
                  <h3 className="text-3xl font-black text-[#0b1d34]">{tempData.formTitle}</h3>
                </div>
              ) : (
                <h3 className="text-3xl font-black text-[#0b1d34] mb-8">{data.formTitle}</h3>
              )}
              
              <form className="space-y-6">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  {['firstName', 'lastName'].map((fieldName) => (
                    <div key={fieldName}>
                      {editMode ? (
                        <div 
                          onClick={() => editFormFieldInModal(fieldName, tempData.formFields[fieldName])}
                          className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-3 hover:bg-gray-50 transition-all duration-300"
                        >
                          <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                            {tempData.formFields[fieldName].label}
                          </label>
                          <input 
                            type="text" 
                            required={tempData.formFields[fieldName].required}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl"
                            placeholder={tempData.formFields[fieldName].placeholder}
                            readOnly
                          />
                        </div>
                      ) : (
                        <>
                          <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                            {data.formFields[fieldName].label}
                          </label>
                          <input 
                            type="text" 
                            required={data.formFields[fieldName].required}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:outline-none transition-colors duration-300"
                            placeholder={data.formFields[fieldName].placeholder}
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Email Field */}
                <div>
                  {editMode ? (
                    <div 
                      onClick={() => editFormFieldInModal('email', tempData.formFields.email)}
                      className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-3 hover:bg-gray-50 transition-all duration-300"
                    >
                      <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                        {tempData.formFields.email.label}
                      </label>
                      <input 
                        type="email" 
                        required={tempData.formFields.email.required}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl"
                        placeholder={tempData.formFields.email.placeholder}
                        readOnly
                      />
                    </div>
                  ) : (
                    <>
                      <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                        {data.formFields.email.label}
                      </label>
                      <input 
                        type="email" 
                        required={data.formFields.email.required}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:outline-none transition-colors duration-300"
                        placeholder={data.formFields.email.placeholder}
                      />
                    </>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  {editMode ? (
                    <div 
                      onClick={() => editFormFieldInModal('phone', tempData.formFields.phone)}
                      className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-3 hover:bg-gray-50 transition-all duration-300"
                    >
                      <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                        {tempData.formFields.phone.label}
                      </label>
                      <input 
                        type="tel" 
                        required={tempData.formFields.phone.required}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl"
                        placeholder={tempData.formFields.phone.placeholder}
                        readOnly
                      />
                    </div>
                  ) : (
                    <>
                      <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                        {data.formFields.phone.label}
                      </label>
                      <input 
                        type="tel" 
                        required={data.formFields.phone.required}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:outline-none transition-colors duration-300"
                        placeholder={data.formFields.phone.placeholder}
                      />
                    </>
                  )}
                </div>

                {/* Service Select */}
                <div>
                  {editMode ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-3">
                      <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                        {tempData.formFields.service.label}
                      </label>
                      <select 
                        required={tempData.formFields.service.required}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl"
                        disabled
                      >
                        {tempData.formFields.service.options.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-2">Service options can be edited in the admin panel</p>
                    </div>
                  ) : (
                    <>
                      <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                        {data.formFields.service.label}
                      </label>
                      <select 
                        required={data.formFields.service.required}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:outline-none transition-colors duration-300"
                      >
                        {data.formFields.service.options.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    </>
                  )}
                </div>

                {/* Project Details */}
                <div>
                  {editMode ? (
                    <div 
                      onClick={() => editFormFieldInModal('projectDetails', tempData.formFields.projectDetails)}
                      className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-3 hover:bg-gray-50 transition-all duration-300"
                    >
                      <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                        {tempData.formFields.projectDetails.label}
                      </label>
                      <textarea 
                        required={tempData.formFields.projectDetails.required}
                        rows={5}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl resize-none"
                        placeholder={tempData.formFields.projectDetails.placeholder}
                        readOnly
                      />
                    </div>
                  ) : (
                    <>
                      <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                        {data.formFields.projectDetails.label}
                      </label>
                      <textarea 
                        required={data.formFields.projectDetails.required}
                        rows={5}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:outline-none transition-colors duration-300 resize-none"
                        placeholder={data.formFields.projectDetails.placeholder}
                      />
                    </>
                  )}
                </div>

                {/* Submit Button */}
                {editMode ? (
                  <div 
                    onClick={() => editTextInModal('submitButton.text', tempData.submitButton.text, 'Edit Submit Button Text', 'Update the submit button text')}
                    className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-50 transition-all duration-300"
                  >
                    <button 
                      type="button"
                      className="w-full bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-3"
                    >
                      <span>{tempData.submitButton.text}</span>
                      <ArrowRight size={20} />
                    </button>
                  </div>
                ) : (
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center space-x-3 group"
                  >
                    <span>{data.submitButton.text}</span>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                  </button>
                )}

                {/* Form Footer */}
                {editMode ? (
                  <div 
                    onClick={() => editTextInModal('formFooter', tempData.formFooter, 'Edit Form Footer', 'Update the form footer text')}
                    className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-all duration-300"
                  >
                    <p className="text-sm text-gray-500 text-center">
                      {tempData.formFooter}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center">
                    {data.formFooter}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;