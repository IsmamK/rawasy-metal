"use client";
import { ArrowRight, Mail, MapPin, Phone, Edit, Save, X, Plus, Trash2, Upload } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

const CallToAction = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const backgroundFileInputRef = useRef(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/home/CallToAction/`;

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
          title: "Ready to Build",
          highlightedTitle: "Something Extraordinary?",
          description: "Let's discuss your project requirements and discover how RAWASY can bring your vision to life with precision and excellence.",
          primaryButton: {
            text: "Start Your Project",
            link: "#contact"
          },
          secondaryButton: {
            text: "Explore Our Services",
            link: "#services"
          },
          contactInfo: [
            {
              icon: "phone",
              title: "Call Us",
              value: "+971 XX XXX XXXX"
            },
            {
              icon: "mail",
              title: "Email Us",
              value: "info@rawasy.com"
            },
            {
              icon: "map-pin",
              title: "Visit Us",
              value: "Gulf Region"
            }
          ],
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

  // Handle contact info changes
  const handleContactInfoChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.contactInfo[index][field] = value;
      return newData;
    });
  };

  // Add new contact info
  const addNewContactInfo = () => {
    setTempData(prev => ({
      ...prev,
      contactInfo: [
        ...prev.contactInfo,
        {
          icon: "phone",
          title: "New Contact",
          value: "Contact details"
        }
      ]
    }));
  };

  // Remove contact info with confirmation
  const removeContactInfo = async (index) => {
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

  // Handle background image upload - ORIGINAL FUNCTIONALITY
  const handleBackgroundImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication required for image upload");
      return;
    }

    setUploadingBackground(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "call-to-action-background");

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
      setUploadingBackground(false);
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

  // Edit button in modal
  const editButtonInModal = async (buttonType, currentButton) => {
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
  const editContactInfoInModal = async (index, currentContact) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Contact Information',
      html:
        `<select id="swal-input1" class="swal2-input">
          <option value="phone" ${currentContact.icon === 'phone' ? 'selected' : ''}>Phone</option>
          <option value="mail" ${currentContact.icon === 'mail' ? 'selected' : ''}>Email</option>
          <option value="map-pin" ${currentContact.icon === 'map-pin' ? 'selected' : ''}>Location</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Title" value="${currentContact.title}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Value" value="${currentContact.value}">`,
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
          value: document.getElementById('swal-input3').value
        };
      }
    });

    if (formValues) {
      handleContactInfoChange(index, 'icon', formValues.icon);
      handleContactInfoChange(index, 'title', formValues.title);
      handleContactInfoChange(index, 'value', formValues.value);
    }
  };

  // Render icon based on icon name
  const renderIcon = (iconName, props = {}) => {
    const iconProps = { size: 32, className: "text-[#f1601f] mx-auto mb-4", ...props };
    
    switch (iconName) {
      case 'phone':
        return <Phone {...iconProps} />;
      case 'mail':
        return <Mail {...iconProps} />;
      case 'map-pin':
        return <MapPin {...iconProps} />;
      default:
        return <Phone {...iconProps} />;
    }
  };

  if (isLoading) {
    return (
      <section className="py-32 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black relative overflow-hidden flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-300">Loading call to action...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-32 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black relative overflow-hidden flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-300">Failed to load call to action. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-32 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black relative overflow-hidden">
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

        <div className="absolute inset-0">
          {editMode ? (
            <div className="relative h-full">
              {uploadingBackground ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 opacity-10">
                    <img src={tempData.backgroundImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={() => backgroundFileInputRef.current?.click()}
                    className="absolute top-4 left-4 bg-blue-500 text-white rounded-full p-2 z-10"
                    title="Change background image"
                  >
                    <Upload className="w-4 h-4" />
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
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 opacity-10">
                <img src={data.backgroundImage} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </>
          )}
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            {editMode ? (
              <div className="flex flex-col items-center space-y-4">
                <div 
                  onClick={() => editTextInModal('title', tempData.title, 'Edit Main Title', 'Update the main title text')}
                  className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300"
                >
                  <span className="text-white bg-transparent border-none text-center focus:ring-2 focus:ring-yellow-400 rounded">
                    {tempData.title}
                  </span>
                </div>
                <div 
                  onClick={() => editTextInModal('highlightedTitle', tempData.highlightedTitle, 'Edit Highlighted Title', 'Update the highlighted subtitle text')}
                  className="cursor-pointer bg-gradient-to-r from-[#f1601f] to-orange-500 rounded-lg p-4 hover:from-[#f1601f] hover:to-orange-600 transition-all duration-300"
                >
                  <span className="text-white bg-transparent border-none text-center focus:ring-2 focus:ring-yellow-400 rounded">
                    {tempData.highlightedTitle}
                  </span>
                </div>
              </div>
            ) : (
              <>
                {data.title}<br />
                <span className="bg-gradient-to-r from-[#f1601f] to-orange-500 bg-clip-text text-transparent">
                  {data.highlightedTitle}
                </span>
              </>
            )}
          </h2>
          
          {editMode ? (
            <div 
              onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text')}
              className="cursor-pointer bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 text-2xl text-gray-300 mb-12 max-w-3xl mx-auto w-full p-6 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              {tempData.description}
            </div>
          ) : (
            <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              {data.description}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {editMode ? (
              <>
                <div 
                  onClick={() => editButtonInModal('primary', tempData.primaryButton)}
                  className="cursor-pointer group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-10 py-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 inline-flex items-center justify-center space-x-3 border-2 border-dashed border-white/50"
                >
                  <span>{tempData.primaryButton.text}</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
                </div>
                <div 
                  onClick={() => editButtonInModal('secondary', tempData.secondaryButton)}
                  className="cursor-pointer bg-white/10 backdrop-blur-sm text-white px-10 py-6 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300 inline-flex items-center justify-center border-dashed"
                >
                  {tempData.secondaryButton.text}
                </div>
              </>
            ) : (
              <>
                <a href={data.primaryButton.link} className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-10 py-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 inline-flex items-center justify-center space-x-3">
                  <span>{data.primaryButton.text}</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
                </a>
                <a href={data.secondaryButton.link} className="bg-white/10 backdrop-blur-sm text-white px-10 py-6 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300 inline-flex items-center justify-center">
                  {data.secondaryButton.text}
                </a>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-white/10">
            {tempData.contactInfo.map((contact, index) => (
              <div key={index} className="relative">
                {/* Delete button for contact info */}
                {editMode && (
                  <button
                    onClick={() => removeContactInfo(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                    title="Remove this contact info"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <div 
                  onClick={editMode ? () => editContactInfoInModal(index, contact) : undefined}
                  className={editMode ? "cursor-pointer hover:bg-white/10 rounded-lg p-4 transition-all duration-300" : ""}
                >
                  {renderIcon(contact.icon)}
                  
                  <div className="text-white font-bold mb-2">{contact.title}</div>
                  <div className="text-gray-400">{contact.value}</div>
                </div>
              </div>
            ))}
            
            {/* Add new contact info button */}
            {editMode && (
              <div 
                className="border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center cursor-pointer min-h-[120px] p-4 hover:bg-white/10 transition-all duration-300"
                onClick={addNewContactInfo}
              >
                <Plus className="w-8 h-8 text-white/50 mb-2" />
                <span className="text-white/70 text-sm font-medium">Add Contact Info</span>
              </div>
            )}
          </div>
        </div>
      </section>  
    </>
  );
};

export default CallToAction;