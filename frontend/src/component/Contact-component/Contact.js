"use client";
import { Award, CheckCircle, Facebook, Instagram, Linkedin, Send, Shield, Twitter, Users, Edit, Save, X, Plus, Trash2, Upload } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

const Contact = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const backgroundFileInputRef = useRef(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/contact/contactform/`;

  // Form state for user input
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

  // Handle form input changes
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // You can add API call here to submit the form data
  };

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
          sectionTitle: "Contact Form",
          mainTitle: "Send Us a Message",
          description: "Fill out the form and our team will get back to you within 24 hours. For urgent matters, please call us directly.",
          reasons: [
            {
              icon: "award",
              title: "15+ Years Experience",
              description: "Established reputation since 2008"
            },
            {
              icon: "shield",
              title: "ISO Certified",
              description: "Quality & safety standards"
            },
            {
              icon: "users",
              title: "2000+ Workforce",
              description: "Skilled professionals ready"
            },
            {
              icon: "check-circle",
              title: "800+ Projects",
              description: "Successfully delivered"
            }
          ],
          socialMedia: {
            title: "Connect With Us",
            description: "Follow us on social media for updates on our latest projects and industry insights.",
            platforms: [
              { icon: "linkedin", href: "#" },
              { icon: "facebook", href: "#" },
              { icon: "twitter", href: "#" },
              { icon: "instagram", href: "#" }
            ]
          },
          formLabels: {
            firstName: "First Name",
            lastName: "Last Name",
            email: "Email Address",
            phone: "Phone Number",
            company: "Company Name",
            subject: "Subject",
            message: "Your Message",
            preferredContact: "Preferred Contact Method",
            urgency: "Urgency Level"
          },
          formPlaceholders: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "+971 XX XXX XXXX",
            company: "Your Company",
            subject: "How can we help you?",
            message: "Tell us about your project or inquiry..."
          },
          contactOptions: {
            preferredContact: [
              { value: "email", label: "Email" },
              { value: "phone", label: "Phone" },
              { value: "either", label: "Either" }
            ],
            urgency: [
              { value: "low", label: "Low - Within a week" },
              { value: "normal", label: "Normal - Within 2-3 days" },
              { value: "high", label: "High - Within 24 hours" },
              { value: "urgent", label: "Urgent - ASAP" }
            ]
          },
          submitButton: {
            text: "Send Message",
            loadingText: "Sending..."
          },
          footerText: "By submitting this form, you agree to our privacy policy. We'll respond within 24 hours.",
          backgroundImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop"
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

  // Handle reason changes
  const handleReasonChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.reasons[index][field] = value;
      return newData;
    });
  };

  // Add new reason
  const addNewReason = () => {
    setTempData(prev => ({
      ...prev,
      reasons: [
        ...prev.reasons,
        {
          icon: "award",
          title: "New Reason",
          description: "Reason description"
        }
      ]
    }));
  };

  // Remove reason with confirmation
  const removeReason = async (index) => {
    if (tempData.reasons.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one reason',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This reason will be removed permanently!',
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
        reasons: prev.reasons.filter((_, i) => i !== index)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Reason has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Handle social media changes
  const handleSocialMediaChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.socialMedia.platforms[index][field] = value;
      return newData;
    });
  };

  // Add new social media platform
  const addNewSocialMedia = () => {
    setTempData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        platforms: [
          ...prev.socialMedia.platforms,
          {
            icon: "linkedin",
            href: "#"
          }
        ]
      }
    }));
  };

  // Remove social media platform
  const removeSocialMedia = async (index) => {
    if (tempData.socialMedia.platforms.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one social media platform',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This social media platform will be removed!',
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
        socialMedia: {
          ...prev.socialMedia,
          platforms: prev.socialMedia.platforms.filter((_, i) => i !== index)
        }
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Social media platform has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Handle background image upload
  const handleBackgroundImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication required for image upload");
      return;
    }

    setUploadingImage(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "contact-background");

    try {
      const response = await fetch(`${API_BASE}/images/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`
        },
        body: formData
      });

      if (!response.ok) throw new Error("Background image upload failed");

      const result = await response.json();
      handleTextChange("backgroundImage", result.image);
    } catch (error) {
      console.error("Error uploading background image:", error);
      alert("Background image upload failed");
    } finally {
      setUploadingImage(false);
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

  // Edit reason in modal
  const editReasonInModal = async (index, currentReason) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Reason',
      html:
        `<select id="swal-input1" class="swal2-input">
          <option value="award" ${currentReason.icon === 'award' ? 'selected' : ''}>Award</option>
          <option value="shield" ${currentReason.icon === 'shield' ? 'selected' : ''}>Shield</option>
          <option value="users" ${currentReason.icon === 'users' ? 'selected' : ''}>Users</option>
          <option value="check-circle" ${currentReason.icon === 'check-circle' ? 'selected' : ''}>Check Circle</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Title" value="${currentReason.title}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Description" value="${currentReason.description}">`,
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
          description: document.getElementById('swal-input3').value
        };
      }
    });

    if (formValues) {
      handleReasonChange(index, 'icon', formValues.icon);
      handleReasonChange(index, 'title', formValues.title);
      handleReasonChange(index, 'description', formValues.description);
    }
  };

  // Edit social media in modal
  const editSocialMediaInModal = async (index, currentSocial) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Social Media',
      html:
        `<select id="swal-input1" class="swal2-input">
          <option value="linkedin" ${currentSocial.icon === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
          <option value="facebook" ${currentSocial.icon === 'facebook' ? 'selected' : ''}>Facebook</option>
          <option value="twitter" ${currentSocial.icon === 'twitter' ? 'selected' : ''}>Twitter</option>
          <option value="instagram" ${currentSocial.icon === 'instagram' ? 'selected' : ''}>Instagram</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Link URL" value="${currentSocial.href}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          icon: document.getElementById('swal-input1').value,
          href: document.getElementById('swal-input2').value
        };
      }
    });

    if (formValues) {
      handleSocialMediaChange(index, 'icon', formValues.icon);
      handleSocialMediaChange(index, 'href', formValues.href);
    }
  };

  // Render icon based on icon name
  const renderIcon = (iconName, props = {}) => {
    const iconProps = { size: 20, className: "text-white", ...props };
    
    switch (iconName) {
      case 'award':
        return <Award {...iconProps} />;
      case 'shield':
        return <Shield {...iconProps} />;
      case 'users':
        return <Users {...iconProps} />;
      case 'check-circle':
        return <CheckCircle {...iconProps} />;
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'twitter':
        return <Twitter {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      default:
        return <Award {...iconProps} />;
    }
  };

  // Helper function to render form labels with asterisks
  const renderFormLabel = (label, isRequired = false) => {
    if (editMode) {
      return (
        <input 
          type="text"
          value={label}
          onChange={(e) => handleTextChange('formLabels.' + Object.keys(data.formLabels).find(key => data.formLabels[key] === label), e.target.value)}
          className="w-full px-2 py-1 bg-gray-100 rounded border border-gray-300"
        />
      );
    }
    
    return (
      <>
        {label} {isRequired && <span className="text-[#f1601f]">*</span>}
      </>
    );
  };

  if (isLoading) {
    return (
      <section className="py-32 bg-gradient-to-b from-white to-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading contact form...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-32 bg-gradient-to-b from-white to-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load contact form. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="contact-form" className="py-32 bg-gradient-to-b from-white to-gray-50 relative">
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
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Left Column - Info */}
            <div className="lg:col-span-2">
              {editMode ? (
                <div className="space-y-6">
                  <div 
                    onClick={() => editTextInModal('sectionTitle', tempData.sectionTitle, 'Edit Section Title', 'Update the section title text')}
                    className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300"
                  >
                    <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                      {tempData.sectionTitle}
                    </span>
                  </div>
                  <div 
                    onClick={() => editTextInModal('mainTitle', tempData.mainTitle, 'Edit Main Title', 'Update the main title text')}
                    className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300"
                  >
                    <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34]">
                      {tempData.mainTitle}
                    </h2>
                  </div>
                  <div 
                    onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text')}
                    className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300"
                  >
                    <p className="text-xl text-gray-600 leading-relaxed">
                      {tempData.description}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                    {data.sectionTitle}
                  </span>
                  <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
                    {data.mainTitle}
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed mb-12">
                    {data.description}
                  </p>
                </>
              )}

              {/* Why Choose Us */}
              <div className="space-y-6 mb-12">
                {tempData.reasons.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-4 group relative">
                    {editMode && (
                      <button
                        onClick={() => removeReason(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                        title="Remove this reason"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    <div 
                      onClick={editMode ? () => editReasonInModal(index, reason) : undefined}
                      className={editMode ? "cursor-pointer flex items-start space-x-4 w-full p-2 rounded-lg hover:bg-gray-100 transition-all duration-300" : "flex items-start space-x-4"}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {renderIcon(reason.icon)}
                      </div>
                      <div>
                        {editMode ? (
                          <div className="space-y-2">
                            <div className="font-bold text-[#0b1d34]">{reason.title}</div>
                            <div className="text-sm text-gray-600">{reason.description}</div>
                          </div>
                        ) : (
                          <>
                            <h4 className="font-bold text-[#0b1d34] mb-1">{reason.title}</h4>
                            <p className="text-sm text-gray-600">{reason.description}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add new reason button */}
                {editMode && (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer min-h-[80px] p-4 hover:bg-gray-100 transition-all duration-300"
                    onClick={addNewReason}
                  >
                    <Plus className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-gray-500 text-sm font-medium">Add Reason</span>
                  </div>
                )}
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-[#0b1d34] to-[#13344c] rounded-2xl p-8 relative">
                {editMode && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={addNewSocialMedia}
                      className="bg-green-500 text-white rounded-full p-1 hover:bg-green-600 transition-colors"
                      title="Add social media"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {editMode ? (
                  <div 
                    onClick={() => editTextInModal('socialMedia.title', tempData.socialMedia.title, 'Edit Social Media Title', 'Update the social media section title')}
                    className="cursor-pointer mb-6 p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                  >
                    <h4 className="text-white font-black text-xl">{tempData.socialMedia.title}</h4>
                  </div>
                ) : (
                  <h4 className="text-white font-black text-xl mb-6">{data.socialMedia.title}</h4>
                )}
                
                <div className="flex space-x-4 mb-4">
                  {tempData.socialMedia.platforms.map((social, index) => (
                    <div key={index} className="relative">
                      {editMode && (
                        <button
                          onClick={() => removeSocialMedia(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                          title="Remove this social media"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      <div 
                        onClick={editMode ? () => editSocialMediaInModal(index, social) : undefined}
                        className={editMode ? "cursor-pointer w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-[#f1601f] transition-all duration-300 group border-2 border-dashed border-white/30" : "w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-[#f1601f] transition-all duration-300 group"}
                      >
                        {renderIcon(social.icon, { className: "text-white group-hover:scale-110 transition-transform duration-300" })}
                      </div>
                    </div>
                  ))}
                </div>
                
                {editMode ? (
                  <div 
                    onClick={() => editTextInModal('socialMedia.description', tempData.socialMedia.description, 'Edit Social Media Description', 'Update the social media description')}
                    className="cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                  >
                    <p className="text-gray-400 text-sm">{tempData.socialMedia.description}</p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">{data.socialMedia.description}</p>
                )}
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-3">
              <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 lg:p-12 shadow-xl">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                      {renderFormLabel(tempData.formLabels.firstName, true)}
                    </label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                      placeholder={editMode ? (
                        <input 
                          type="text"
                          value={tempData.formPlaceholders.firstName}
                          onChange={(e) => handleTextChange('formPlaceholders.firstName', e.target.value)}
                          className="w-full px-2 py-1 bg-gray-100 rounded border border-gray-300"
                        />
                      ) : data.formPlaceholders.firstName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                      {renderFormLabel(tempData.formLabels.lastName, true)}
                    </label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                      placeholder={editMode ? (
                        <input 
                          type="text"
                          value={tempData.formPlaceholders.lastName}
                          onChange={(e) => handleTextChange('formPlaceholders.lastName', e.target.value)}
                          className="w-full px-2 py-1 bg-gray-100 rounded border border-gray-300"
                        />
                      ) : data.formPlaceholders.lastName}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                      {renderFormLabel(tempData.formLabels.email, true)}
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                      placeholder={editMode ? (
                        <input 
                          type="text"
                          value={tempData.formPlaceholders.email}
                          onChange={(e) => handleTextChange('formPlaceholders.email', e.target.value)}
                          className="w-full px-2 py-1 bg-gray-100 rounded border border-gray-300"
                        />
                      ) : data.formPlaceholders.email}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                      {renderFormLabel(tempData.formLabels.phone, true)}
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                      placeholder={editMode ? (
                        <input 
                          type="text"
                          value={tempData.formPlaceholders.phone}
                          onChange={(e) => handleTextChange('formPlaceholders.phone', e.target.value)}
                          className="w-full px-2 py-1 bg-gray-100 rounded border border-gray-300"
                        />
                      ) : data.formPlaceholders.phone}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                    {renderFormLabel(tempData.formLabels.company, false)}
                  </label>
                  <input 
                    type="text" 
                    name="company"
                    value={formData.company}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                    placeholder={editMode ? (
                      <input 
                        type="text"
                        value={tempData.formPlaceholders.company}
                        onChange={(e) => handleTextChange('formPlaceholders.company', e.target.value)}
                        className="w-full px-2 py-1 bg-gray-100 rounded border border-gray-300"
                      />
                    ) : data.formPlaceholders.company}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                    {renderFormLabel(tempData.formLabels.subject, true)}
                  </label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                    placeholder={editMode ? (
                      <input 
                        type="text"
                        value={tempData.formPlaceholders.subject}
                        onChange={(e) => handleTextChange('formPlaceholders.subject', e.target.value)}
                        className="w-full px-2 py-1 bg-gray-100 rounded border border-gray-300"
                      />
                    ) : data.formPlaceholders.subject}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                      {renderFormLabel(tempData.formLabels.preferredContact, false)}
                    </label>
                    <select 
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                    >
                      {tempData.contactOptions.preferredContact.map((option, index) => (
                        <option key={index} value={option.value}>
                          {editMode ? (
                            <input 
                              type="text"
                              value={option.label}
                              onChange={(e) => {
                                const newOptions = [...tempData.contactOptions.preferredContact];
                                newOptions[index].label = e.target.value;
                                handleTextChange('contactOptions.preferredContact', newOptions);
                              }}
                              className="w-full px-2 py-1 bg-gray-100 rounded border border-gray-300"
                            />
                          ) : option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                      {renderFormLabel(tempData.formLabels.urgency, false)}
                    </label>
                    <select 
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300"
                    >
                      {tempData.contactOptions.urgency.map((option, index) => (
                        <option key={index} value={option.value}>
                          {editMode ? (
                            <input 
                              type="text"
                              value={option.label}
                              onChange={(e) => {
                                const newOptions = [...tempData.contactOptions.urgency];
                                newOptions[index].label = e.target.value;
                                handleTextChange('contactOptions.urgency', newOptions);
                              }}
                              className="w-full px-2 py-1 bg-gray-100 rounded border border-gray-300"
                            />
                          ) : option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#0b1d34] mb-2">
                    {renderFormLabel(tempData.formLabels.message, true)}
                  </label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:bg-white focus:outline-none transition-all duration-300 resize-none"
                    placeholder={editMode ? (
                      <input 
                        type="text"
                        value={tempData.formPlaceholders.message}
                        onChange={(e) => handleTextChange('formPlaceholders.message', e.target.value)}
                        className="w-full px-2 py-1 bg-gray-100 rounded border border-gray-300"
                      />
                    ) : data.formPlaceholders.message}
                  />
                </div>

                <button 
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center space-x-3 group"
                >
                  <span>
                    {editMode ? (
                      <input 
                        type="text"
                        value={tempData.submitButton.text}
                        onChange={(e) => handleTextChange('submitButton.text', e.target.value)}
                        className="bg-transparent border-none text-white text-center focus:ring-2 focus:ring-yellow-400 rounded px-2"
                      />
                    ) : (
                      data.submitButton.text
                    )}
                  </span>
                  <Send className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                </button>

                {editMode ? (
                  <div 
                    onClick={() => editTextInModal('footerText', tempData.footerText, 'Edit Footer Text', 'Update the footer text')}
                    className="cursor-pointer text-sm text-gray-500 text-center mt-6 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                  >
                    {tempData.footerText}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center mt-6">
                    {data.footerText}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;