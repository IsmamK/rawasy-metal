"use client";
import { Clock, Mail, MapPin, MessageSquare, Phone, Send, Edit, Save, X, Upload, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

const Hero = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const backgroundFileInputRef = useRef(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/contact/hero/`;

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
        if (!response.ok) throw new Error("Failed to fetch hero data");
        const jsonData = await response.json();
        setData(jsonData);
        setTempData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching hero data:", error);
        // Fallback to default data if API fails
        const defaultData = {
          badgeText: "LET'S CONNECT",
          title: "Get In",
          highlightedTitle: "Touch",
          description: "Have a project in mind? Our team of experts is ready to help you bring your vision to life. Reach out today for a consultation.",
          primaryButton: {
            text: "Send Message",
            link: "#contact-form"
          },
          secondaryButton: {
            text: "Call Now",
            link: "tel:+971XXXXXXXX"
          },
          backgroundImage: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=1080&fit=crop",
          contactInfo: [
            {
              icon: "phone",
              title: "Call Us",
              details: ["+971 XX XXX XXXX", "+971 XX XXX XXXX"],
              subtext: "Mon-Sat: 8:00 AM - 6:00 PM",
              color: "from-[#f1601f] to-[#7f3e2c]",
              action: "tel:+971XXXXXXXX"
            },
            {
              icon: "mail",
              title: "Email Us",
              details: ["info@rawasy.com", "sales@rawasy.com"],
              subtext: "24-hour response time",
              color: "from-[#0b1d34] to-[#13344c]",
              action: "mailto:info@rawasy.com"
            },
            {
              icon: "map-pin",
              title: "Visit Our Office",
              details: ["Gulf Region", "United Arab Emirates"],
              subtext: "By appointment",
              color: "from-[#7f3e2c] to-[#7f8994]",
              action: "#map"
            },
            {
              icon: "clock",
              title: "Business Hours",
              details: ["Monday - Saturday", "8:00 AM - 6:00 PM"],
              subtext: "Closed on Sundays & Public Holidays",
              color: "from-[#13344c] to-[#0b1d34]",
              action: null
            }
          ]
        };
        setData(defaultData);
        setTempData(defaultData);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ENDPOINT]);

  // Toggle edit mode - FIXED: Added proper event handling
  const toggleEditMode = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
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

  const triggerFileInput = () => {
    console.log("Triggering file input");
    if (backgroundFileInputRef.current) {
      backgroundFileInputRef.current.click();
    }
  };

  // Handle contact info changes
  const handleContactInfoChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.contactInfo[index][field] = value;
      return newData;
    });
  };

  // Handle contact detail changes
  const handleContactDetailChange = (contactIndex, detailIndex, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.contactInfo[contactIndex].details[detailIndex] = value;
      return newData;
    });
  };

  // Add new contact info
  const addNewContactInfo = (e) => {
    if (e) e.stopPropagation();
    setTempData(prev => ({
      ...prev,
      contactInfo: [
        ...prev.contactInfo,
        {
          icon: "phone",
          title: "New Contact Info",
          details: ["Detail 1", "Detail 2"],
          subtext: "Additional information",
          color: "from-[#f1601f] to-[#7f3e2c]",
          action: "#"
        }
      ]
    }));
  };

  // Remove contact info with confirmation
  const removeContactInfo = async (index, e) => {
    if (e) e.stopPropagation();
    
    if (tempData.contactInfo.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one contact info',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This contact information will be removed permanently!',
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
        contactInfo: prev.contactInfo.filter((_, i) => i !== index)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Contact information has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Add new detail to contact info
  const addNewDetail = (contactIndex, e) => {
    if (e) e.stopPropagation();
    setTempData(prev => {
      const newData = {...prev};
      newData.contactInfo[contactIndex].details.push("New detail");
      return newData;
    });
  };

  // Remove detail from contact info
  const removeDetail = (contactIndex, detailIndex, e) => {
    if (e) e.stopPropagation();
    setTempData(prev => {
      const newData = {...prev};
      if (newData.contactInfo[contactIndex].details.length > 1) {
        newData.contactInfo[contactIndex].details = newData.contactInfo[contactIndex].details.filter((_, i) => i !== detailIndex);
      }
      return newData;
    });
  };

  // Handle background image upload - FIXED: Proper file handling
  const handleBackgroundImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Invalid File',
        text: 'Please select an image file (JPEG, PNG, etc.)',
        icon: 'error',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'File Too Large',
        text: 'Please select an image smaller than 5MB',
        icon: 'error',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to upload images',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    setUploadingBackground(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "contact-hero-background");

    try {
      const response = await fetch(`${API_BASE}/images/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      // Update the background image in temp data
      handleTextChange("backgroundImage", result.image || result.url);
      
      Swal.fire({
        title: 'Success!',
        text: 'Background image uploaded successfully!',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    } catch (error) {
      console.error("Error uploading background image:", error);
      Swal.fire({
        title: 'Upload Failed',
        text: error.message || 'Failed to upload background image. Please try again.',
        icon: 'error',
        confirmButtonColor: '#f1601f',
      });
    } finally {
      setUploadingBackground(false);
      // Reset the file input
      if (backgroundFileInputRef.current) {
        backgroundFileInputRef.current.value = '';
      }
    }
  };

  // Trigger file input click - FIXED: Proper function
  const triggerBackgroundUpload = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (backgroundFileInputRef.current) {
      backgroundFileInputRef.current.click();
    }
  };

  // Save changes with confirmation
  const saveChanges = async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
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
  const editTextInModal = async (field, currentValue, title, description, e) => {
    if (e) e.stopPropagation();
    
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

  // Edit button in modal
  const editButtonInModal = async (buttonType, currentButton, e) => {
    if (e) e.stopPropagation();
    
    const { value: formValues } = await Swal.fire({
      title: `Edit ${buttonType === 'primary' ? 'Primary' : 'Secondary'} Button`,
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Button Text" value="${currentButton.text}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Button Link" value="${currentButton.link}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          text: document.getElementById('swal-input1').value,
          link: document.getElementById('swal-input2').value
        };
      }
    });

    if (formValues) {
      handleTextChange(`${buttonType}Button.text`, formValues.text);
      handleTextChange(`${buttonType}Button.link`, formValues.link);
    }
  };

  // Edit contact info in modal
  const editContactInfoInModal = async (index, currentContact, e) => {
    if (e) e.stopPropagation();
    
    const { value: formValues } = await Swal.fire({
      title: 'Edit Contact Information',
      html:
        `<select id="swal-input1" class="swal2-input">
          <option value="phone" ${currentContact.icon === 'phone' ? 'selected' : ''}>Phone</option>
          <option value="mail" ${currentContact.icon === 'mail' ? 'selected' : ''}>Email</option>
          <option value="map-pin" ${currentContact.icon === 'map-pin' ? 'selected' : ''}>Location</option>
          <option value="clock" ${currentContact.icon === 'clock' ? 'selected' : ''}>Clock</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Title" value="${currentContact.title}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Subtext" value="${currentContact.subtext}">` +
        `<select id="swal-input4" class="swal2-input">
          <option value="from-[#f1601f] to-[#7f3e2c]" ${currentContact.color === 'from-[#f1601f] to-[#7f3e2c]' ? 'selected' : ''}>Orange Gradient</option>
          <option value="from-[#0b1d34] to-[#13344c]" ${currentContact.color === 'from-[#0b1d34] to-[#13344c]' ? 'selected' : ''}>Blue Gradient</option>
          <option value="from-[#7f3e2c] to-[#7f8994]" ${currentContact.color === 'from-[#7f3e2c] to-[#7f8994]' ? 'selected' : ''}>Brown Gradient</option>
          <option value="from-[#13344c] to-[#0b1d34]" ${currentContact.color === 'from-[#13344c] to-[#0b1d34]' ? 'selected' : ''}>Dark Blue Gradient</option>
        </select>` +
        `<input id="swal-input5" class="swal2-input" placeholder="Action Link" value="${currentContact.action || ''}">`,
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
          subtext: document.getElementById('swal-input3').value,
          color: document.getElementById('swal-input4').value,
          action: document.getElementById('swal-input5').value
        };
      }
    });

    if (formValues) {
      handleContactInfoChange(index, 'icon', formValues.icon);
      handleContactInfoChange(index, 'title', formValues.title);
      handleContactInfoChange(index, 'subtext', formValues.subtext);
      handleContactInfoChange(index, 'color', formValues.color);
      handleContactInfoChange(index, 'action', formValues.action);
    }
  };

  // Edit contact detail in modal
  const editContactDetailInModal = async (contactIndex, detailIndex, currentValue, e) => {
    if (e) e.stopPropagation();
    
    const { value: newValue } = await Swal.fire({
      title: 'Edit Contact Detail',
      input: 'text',
      inputLabel: 'Update the contact detail',
      inputValue: currentValue,
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
      handleContactDetailChange(contactIndex, detailIndex, newValue);
    }
  };

  // Render icon based on icon name
  const renderIcon = (iconName, props = {}) => {
    const iconProps = { className: "text-white", size: 28, ...props };
    
    switch (iconName) {
      case 'phone':
        return <Phone {...iconProps} />;
      case 'mail':
        return <Mail {...iconProps} />;
      case 'map-pin':
        return <MapPin {...iconProps} />;
      case 'clock':
        return <Clock {...iconProps} />;
      default:
        return <Phone {...iconProps} />;
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-300">Loading contact hero...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black">
        <div className="text-center">
          <p className="text-gray-300">Failed to load contact hero. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black">
        {/* Edit Mode Toggle Button - FIXED: Added proper event handling */}
        {localStorage.getItem("authToken") && (
          <div className="absolute top-4 right-4 z-50" style={{ zIndex: 1000 }}>
            {editMode ? (
              <div className="flex gap-2">
                <button 
                  onClick={saveChanges}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
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
                  className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                  title="Cancel Editing"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={toggleEditMode}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                title="Edit Content"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Edit Mode Overlay Indicator */}
        {editMode && (
          <div className="absolute inset-0 border-4 border-yellow-400 pointer-events-none z-40 flex items-center justify-center">
            <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
              EDIT MODE ENABLED - Click on any content to edit
            </span>
          </div>
        )}

        <div className="absolute inset-0">
          {editMode ? (
            <div className="relative h-full">
              {uploadingBackground ? (
                              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                <div className="text-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto mb-2"></div>
                                  <p className="text-white text-sm">Uploading background...</p>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="absolute inset-0 opacity-10">
                                  <img src={tempData.backgroundImage} alt="" className="w-full h-full object-cover" />
                                </div>
                                {/* FIXED: Background upload button */}
                                <button
                                  onClick={triggerFileInput}
                                  className="absolute top-4 left-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 z-30 shadow-lg transition-colors"
                                  title="Change background image"
                                  style={{ zIndex: 1000 }}
                                >
                                  <Upload className="w-5 h-5" />
                                </button>
                                <input
                                  type="file"
                                  ref={backgroundFileInputRef}
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleBackgroundImageUpload}
                                />
                              </>
                            )}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 opacity-10">
                <img src={data.backgroundImage} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </>
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {editMode ? (
            <div 
              onClick={(e) => editTextInModal('badgeText', tempData.badgeText, 'Edit Badge Text', 'Update the badge text', e)}
              className="cursor-pointer inline-block mb-6 bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-3 px-6 py-3">
                <MessageSquare className="text-[#f1601f]" size={20} />
                <span className="text-white font-semibold text-sm tracking-wider">
                  {tempData.badgeText}
                </span>
              </div>
            </div>
          ) : (
            <div className="inline-block mb-6">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <MessageSquare className="text-[#f1601f]" size={20} />
                <span className="text-white font-semibold text-sm tracking-wider">{data.badgeText}</span>
              </div>
            </div>
          )}

          {editMode ? (
            <div className="space-y-4 mb-6">
              <div 
                onClick={(e) => editTextInModal('title', tempData.title, 'Edit Main Title', 'Update the main title text', e)}
                className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-6 hover:bg-white/30 transition-all duration-300"
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white">
                  {tempData.title}
                </h1>
              </div>
              <div 
                onClick={(e) => editTextInModal('highlightedTitle', tempData.highlightedTitle, 'Edit Highlighted Title', 'Update the highlighted title text', e)}
                className="cursor-pointer bg-gradient-to-r from-[#f1601f] via-orange-500 to-[#7f3e2c] rounded-lg p-4 hover:from-[#f1601f] hover:to-orange-600 transition-all duration-300"
              >
                <span className="text-white font-black text-5xl md:text-7xl lg:text-8xl">
                  {tempData.highlightedTitle}
                </span>
              </div>
            </div>
          ) : (
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
              {data.title} <span className="bg-gradient-to-r from-[#f1601f] via-orange-500 to-[#7f3e2c] bg-clip-text text-transparent">{data.highlightedTitle}</span>
            </h1>
          )}
          
          {editMode ? (
            <div 
              onClick={(e) => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text', e)}
              className="cursor-pointer bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto w-full p-6 rounded-lg hover:bg-white/20 transition-all duration-300 mb-8"
            >
              {tempData.description}
            </div>
          ) : (
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              {data.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 justify-center">
            {editMode ? (
              <>
                <div 
                  onClick={(e) => editButtonInModal('primary', tempData.primaryButton, e)}
                  className="cursor-pointer group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center space-x-3 border-2 border-dashed border-white/50"
                >
                  <span>{tempData.primaryButton.text}</span>
                  <Send className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                </div>
                <div 
                  onClick={(e) => editButtonInModal('secondary', tempData.secondaryButton, e)}
                  className="cursor-pointer bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300 flex items-center space-x-3 border-dashed"
                >
                  <Phone size={20} />
                  <span>{tempData.secondaryButton.text}</span>
                </div>
              </>
            ) : (
              <>
                <a 
                  href={data.primaryButton.link} 
                  className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center space-x-3"
                >
                  <span>{data.primaryButton.text}</span>
                  <Send className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                </a>
                <a 
                  href={data.secondaryButton.link} 
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300 flex items-center space-x-3"
                >
                  <Phone size={20} />
                  <span>{data.secondaryButton.text}</span>
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="relative -mt-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tempData.contactInfo.map((info, i) => (
              <div key={i} className="relative">
                {/* Delete button for contact info - FIXED: Added proper event handling */}
                {editMode && (
                  <button
                    onClick={(e) => removeContactInfo(i, e)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 z-10 hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove this contact info"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <div
                  onClick={editMode ? (e) => editContactInfoInModal(i, info, e) : undefined}
                  className={`group bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500 border-2 ${
                    editMode ? 'cursor-pointer border-dashed border-yellow-400' : 'border-transparent hover:border-[#f1601f]'
                  }`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative`}>
                    {renderIcon(info.icon)}
                    {editMode && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                        <Edit className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-black text-[#0b1d34] mb-4">{info.title}</h3>
                  
                  <div className="space-y-1 mb-3">
                    {info.details.map((detail, j) => (
                      <div key={j} className="flex items-center justify-between">
                        {editMode ? (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              editContactDetailInModal(i, j, detail, e);
                            }}
                            className="cursor-pointer text-gray-600 font-semibold bg-gray-100 rounded px-2 py-1 hover:bg-gray-200 transition-colors flex-1 mr-2"
                          >
                            {detail}
                          </div>
                        ) : (
                          <p className="text-gray-600 font-semibold">{detail}</p>
                        )}
                        {editMode && info.details.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeDetail(i, j, e);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            title="Remove this detail"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addNewDetail(i, e);
                        }}
                        className="text-blue-500 hover:text-blue-700 transition-colors text-sm flex items-center space-x-1 mt-2 p-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Detail</span>
                      </button>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-3">{info.subtext}</p>
                </div>
              </div>
            ))}
            
            {/* Add new contact info button - FIXED: Added proper event handling */}
            {editMode && (
              <div 
                className="border-2 border-dashed border-gray-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer min-h-[200px] p-8 hover:bg-gray-50 transition-all duration-300"
                onClick={addNewContactInfo}
              >
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-gray-500 text-lg font-medium">Add Contact Info</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;