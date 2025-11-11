"use client";
import { Award, CheckCircle, Clock, FileText, Shield, Edit, Save, X, Upload } from 'lucide-react';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/quote/hero/`;

  // Default benefits data
  const defaultBenefits = [
    {
      icon: "clock",
      title: "Quick Response",
      desc: "Receive your detailed quote within 24-48 hours"
    },
    {
      icon: "award",
      title: "Competitive Pricing",
      desc: "Best value for quality construction services"
    },
    {
      icon: "check-circle",
      title: "No Obligation",
      desc: "Free quote with no commitment required"
    },
    {
      icon: "shield",
      title: "Expert Consultation",
      desc: "Professional advice included with every quote"
    }
  ];

  // Check for auth token - FIXED: Use useEffect properly
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!authToken);
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
          title: "Get Your",
          highlightedTitle: "Free Quote",
          description: "Tell us about your project and receive a detailed, customized quote within 24-48 hours. No obligation, completely free.",
          badgeText: "REQUEST A QUOTE",
          benefits: defaultBenefits,
          backgroundImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop"
        };
        setData(defaultData);
        setTempData(defaultData);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ENDPOINT]);

  // Toggle edit mode - FIXED: Proper function
  const toggleEditMode = () => {
    console.log("Toggle edit mode clicked");
    console.log("isAuthenticated:", isAuthenticated);
    
    if (!isAuthenticated) {
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
        if (!current[paths[i]]) {
          current[paths[i]] = {};
        }
        current = current[paths[i]];
      }
      
      current[paths[paths.length - 1]] = value;
      return newData;
    });
  };

  // Handle benefit changes
  const handleBenefitChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.benefits[index][field] = value;
      return newData;
    });
  };

  // Handle background image upload - FIXED: Proper upload function
  const handleBackgroundImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File selected:", file.name);

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

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("image", file);
      formData.append("category", "hero-background");

      console.log("Uploading image...");

      const response = await fetch(`${API_BASE}/images/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        throw new Error(`Background image upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      
      // Update the background image
      handleTextChange("backgroundImage", result.imageUrl || result.image);
      
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
        text: 'Failed to upload background image. Please try again.',
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
  const triggerFileInput = () => {
    console.log("Triggering file input");
    if (backgroundFileInputRef.current) {
      backgroundFileInputRef.current.click();
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
      console.log("Saving data:", tempData);
      
      const response = await fetch(ENDPOINT, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(tempData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Save failed:", errorText);
        throw new Error(`Failed to save changes: ${response.status}`);
      }

      const updatedData = await response.json();
      console.log("Save successful:", updatedData);
      
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

  // Edit benefit in modal
  const editBenefitInModal = async (index, currentBenefit) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Benefit',
      html:
        `<select id="swal-input1" class="swal2-input">
          <option value="clock" ${currentBenefit.icon === 'clock' ? 'selected' : ''}>Clock</option>
          <option value="award" ${currentBenefit.icon === 'award' ? 'selected' : ''}>Award</option>
          <option value="check-circle" ${currentBenefit.icon === 'check-circle' ? 'selected' : ''}>Check Circle</option>
          <option value="shield" ${currentBenefit.icon === 'shield' ? 'selected' : ''}>Shield</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Title" value="${currentBenefit.title}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Description" value="${currentBenefit.desc}">`,
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
          desc: document.getElementById('swal-input3').value
        };
      }
    });

    if (formValues) {
      handleBenefitChange(index, 'icon', formValues.icon);
      handleBenefitChange(index, 'title', formValues.title);
      handleBenefitChange(index, 'desc', formValues.desc);
    }
  };

  // Render icon based on icon name
  const renderIcon = (iconName, props = {}) => {
    const iconProps = { className: "text-[#f1601f]", ...props };
    
    switch (iconName) {
      case 'clock':
        return <Clock {...iconProps} />;
      case 'award':
        return <Award {...iconProps} />;
      case 'check-circle':
        return <CheckCircle {...iconProps} />;
      case 'shield':
        return <Shield {...iconProps} />;
      default:
        return <Clock {...iconProps} />;
    }
  };

  if (isLoading) {
    return (
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-300">Loading hero section...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black">
        <div className="text-center">
          <p className="text-gray-300">Failed to load hero section. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black">
        {/* Edit Mode Toggle Button - FIXED: Always show if authenticated */}
        {isAuthenticated && (
          <div className="absolute top-4 right-4 z-50" style={{ zIndex: 1000 }}>
            {editMode ? (
              <div className="flex gap-2">
                <button 
                  onClick={saveChanges}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-colors"
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
                  className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors"
                  title="Cancel Editing"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={toggleEditMode}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
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
          {/* Badge */}
          {editMode ? (
            <div 
              onClick={() => editTextInModal('badgeText', tempData.badgeText, 'Edit Badge Text', 'Update the badge text')}
              className="inline-block mb-6 cursor-pointer"
            >
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                <FileText className="text-[#f1601f]" size={20} />
                <span className="text-white font-semibold text-sm tracking-wider">{tempData.badgeText}</span>
              </div>
            </div>
          ) : (
            <div className="inline-block mb-6">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <FileText className="text-[#f1601f]" size={20} />
                <span className="text-white font-semibold text-sm tracking-wider">{data.badgeText}</span>
              </div>
            </div>
          )}

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
            {editMode ? (
              <div className="flex flex-col items-center space-y-4">
                <div 
                  onClick={() => editTextInModal('title', tempData.title, 'Edit Main Title', 'Update the main title text')}
                  className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300"
                >
                  <span className="text-white text-5xl md:text-7xl lg:text-8xl font-black">
                    {tempData.title}
                  </span>
                </div>
                <div 
                  onClick={() => editTextInModal('highlightedTitle', tempData.highlightedTitle, 'Edit Highlighted Title', 'Update the highlighted title text')}
                  className="cursor-pointer bg-gradient-to-r from-[#f1601f] via-orange-500 to-[#7f3e2c] rounded-lg p-4 hover:from-[#f1601f] hover:to-orange-600 transition-all duration-300"
                >
                  <span className="text-white text-5xl md:text-7xl lg:text-8xl font-black">
                    {tempData.highlightedTitle}
                  </span>
                </div>
              </div>
            ) : (
              <>
                {data.title}{' '}
                <span className="bg-gradient-to-r from-[#f1601f] via-orange-500 to-[#7f3e2c] bg-clip-text text-transparent">
                  {data.highlightedTitle}
                </span>
              </>
            )}
          </h1>
          
          {/* Description */}
          {editMode ? (
            <div 
              onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text')}
              className="cursor-pointer bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 w-full p-6 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              {tempData.description}
            </div>
          ) : (
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              {data.description}
            </p>
          )}

          {/* Benefits */}
          <div className="flex flex-wrap gap-3 justify-center text-white">
            {tempData.benefits.map((benefit, index) => (
              editMode ? (
                <div 
                  key={index}
                  onClick={() => editBenefitInModal(index, benefit)}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full cursor-pointer hover:bg-white/20 transition-all duration-300 border-2 border-dashed border-white/30"
                >
                  {renderIcon(benefit.icon, { size: 16 })}
                  <span className="text-sm font-medium">{benefit.title}</span>
                </div>
              ) : (
                <div key={index} className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  {renderIcon(benefit.icon, { size: 16 })}
                  <span className="text-sm font-medium">{benefit.title}</span>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="relative -mt-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] rounded-3xl shadow-2xl p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {tempData.benefits.map((benefit, index) => (
                editMode ? (
                  <div 
                    key={index} 
                    className="text-center group cursor-pointer"
                    onClick={() => editBenefitInModal(index, benefit)}
                  >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 border-2 border-dashed border-white/50">
                      {renderIcon(benefit.icon, { className: "text-white", size: 28 })}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-white/80 text-sm">{benefit.desc}</p>
                  </div>
                ) : (
                  <div key={index} className="text-center group">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                      {renderIcon(benefit.icon, { className: "text-white", size: 28 })}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-white/80 text-sm">{benefit.desc}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;