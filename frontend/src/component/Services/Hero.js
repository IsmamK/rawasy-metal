"use client";
import { ArrowRight, Sparkles, Edit, Save, X, Upload } from 'lucide-react';
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
  const ENDPOINT = `${API_BASE}/services/hero/`;

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
          badge: {
            icon: "sparkles",
            text: "COMPREHENSIVE SOLUTIONS"
          },
          title: "Our",
          highlightedTitle: "Services",
          description: "From general contracting to specialized fabrication, we deliver integrated construction and industrial solutions that exceed expectations",
          primaryButton: {
            text: "Explore Services",
            link: "#main-services"
          },
          secondaryButton: {
            text: "Get a Quote",
            link: "#contact"
          },
          backgroundImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop",
          gradientColors: {
            start: "#0b1d34",
            middle: "#13344c",
            end: "black"
          },
          accentColors: {
            primary: "#f1601f",
            secondary: "#7f3e2c"
          }
        };
        setData(defaultData);
        setTempData(defaultData);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ENDPOINT]);

  // Toggle edit mode - FIXED FUNCTION
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
    } else {
      // Entering edit mode - ensure tempData is set
      setTempData(data);
    }
    setEditMode(!editMode);
  };

  // Handle text changes - FIXED FUNCTION
  const handleTextChange = (path, value) => {
    setTempData(prev => {
      if (!prev) return prev;
      
      const newData = JSON.parse(JSON.stringify(prev));
      const paths = path.split('.');
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

  // Handle background image upload - FIXED FUNCTION
  const handleBackgroundImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

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
    formData.append("category", "hero-background");

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
      
      Swal.fire({
        title: 'Success!',
        text: 'Background image updated successfully!',
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
      // Reset file input
      if (backgroundFileInputRef.current) {
        backgroundFileInputRef.current.value = '';
      }
    }
  };

  // Trigger file input click - NEW FUNCTION
  const triggerFileInput = () => {
    console.log("Triggering file input");
    if (backgroundFileInputRef.current) {
      backgroundFileInputRef.current.click();
    }
  };
  // Save changes with confirmation - FIXED FUNCTION
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

  // Edit text in modal - FIXED FUNCTION
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

  // Edit button in modal - FIXED FUNCTION
  const editButtonInModal = async (buttonType, currentButton) => {
    const { value: formValues } = await Swal.fire({
      title: `Edit ${buttonType === 'primary' ? 'Primary' : 'Secondary'} Button`,
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Button Text" value="${currentButton.text || ''}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Button Link" value="${currentButton.link || ''}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const text = document.getElementById('swal-input1').value;
        const link = document.getElementById('swal-input2').value;
        
        if (!text || !link) {
          Swal.showValidationMessage('Both fields are required');
          return false;
        }
        
        return {
          text: text,
          link: link
        };
      }
    });

    if (formValues) {
      handleTextChange(`${buttonType}Button.text`, formValues.text);
      handleTextChange(`${buttonType}Button.link`, formValues.link);
    }
  };

  // Edit badge in modal - FIXED FUNCTION
  const editBadgeInModal = async (currentBadge) => {
    const { value: newText } = await Swal.fire({
      title: 'Edit Badge Text',
      input: 'text',
      inputLabel: 'Update the badge text',
      inputValue: currentBadge.text || '',
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Badge text cannot be empty!';
        }
      }
    });

    if (newText) {
      handleTextChange('badge.text', newText);
    }
  };

  if (isLoading) {
    return (
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-300">Loading hero section...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black">
        <div className="text-center">
          <p className="text-gray-300">Failed to load hero section. Please try again later.</p>
        </div>
      </section>
    );
  }

  const currentData = editMode ? tempData : data;

  return (
    <>
      <section 
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(to bottom right, ${currentData.gradientColors.start}, ${currentData.gradientColors.middle}, ${currentData.gradientColors.end})`
        }}
      >
        {/* Edit Mode Toggle Button */}
        {localStorage.getItem("authToken") && (
          <div className="absolute top-4 right-4 z-50">
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

        {/* Background Image */}
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
        
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          {editMode ? (
            <div 
              onClick={() => editBadgeInModal(currentData.badge)}
              className="cursor-pointer inline-block mb-6 bg-white/20 backdrop-blur-sm border-2 border-dashed border-white/30 px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <Sparkles className="text-[#f1601f]" size={20} />
                <span className="text-white font-semibold text-sm tracking-wider">
                  {currentData.badge.text}
                </span>
              </div>
            </div>
          ) : (
            <div className="inline-block mb-6">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <Sparkles className="text-[#f1601f]" size={20} />
                <span className="text-white font-semibold text-sm tracking-wider">
                  {currentData.badge.text}
                </span>
              </div>
            </div>
          )}

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
            {editMode ? (
              <div className="flex flex-col items-center space-y-4">
                <div 
                  onClick={() => editTextInModal('title', currentData.title, 'Edit Main Title', 'Update the main title text')}
                  className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300 w-full max-w-2xl"
                >
                  <span className="text-white text-4xl md:text-6xl lg:text-7xl font-black">
                    {currentData.title}
                  </span>
                </div>
                <div 
                  onClick={() => editTextInModal('highlightedTitle', currentData.highlightedTitle, 'Edit Highlighted Title', 'Update the highlighted title text')}
                  className="cursor-pointer rounded-lg p-4 hover:opacity-90 transition-all duration-300 w-full max-w-2xl"
                  style={{
                    background: `linear-gradient(to right, ${currentData.accentColors.primary}, #f97316, ${currentData.accentColors.secondary})`
                  }}
                >
                  <span className="text-white text-4xl md:text-6xl lg:text-7xl font-black">
                    {currentData.highlightedTitle}
                  </span>
                </div>
              </div>
            ) : (
              <>
                {currentData.title}{' '}
                <span 
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${currentData.accentColors.primary}, #f97316, ${currentData.accentColors.secondary})`
                  }}
                >
                  {currentData.highlightedTitle}
                </span>
              </>
            )}
          </h1>
          
          {/* Description */}
          {editMode ? (
            <div 
              onClick={() => editTextInModal('description', currentData.description, 'Edit Description', 'Update the description text')}
              className="cursor-pointer bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 p-6 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              {currentData.description}
            </div>
          ) : (
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              {currentData.description}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            {editMode ? (
              <>
                <div 
                  onClick={() => editButtonInModal('primary', currentData.primaryButton)}
                  className="cursor-pointer group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center space-x-3 border-2 border-dashed border-white/50 min-w-[200px] justify-center"
                >
                  <span>{currentData.primaryButton.text}</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                </div>
                <div 
                  onClick={() => editButtonInModal('secondary', currentData.secondaryButton)}
                  className="cursor-pointer bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300 inline-flex items-center justify-center border-dashed min-w-[200px]"
                >
                  {currentData.secondaryButton.text}
                </div>
              </>
            ) : (
              <>
                <a 
                  href={currentData.primaryButton.link}
                  className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center space-x-3"
                >
                  <span>{currentData.primaryButton.text}</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                </a>
                <a 
                  href={currentData.secondaryButton.link}
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300"
                >
                  {currentData.secondaryButton.text}
                </a>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;