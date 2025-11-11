"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Edit, Save, X, Upload } from 'lucide-react';
import Swal from 'sweetalert2';

const Hero = () => {
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const backgroundFileInputRef = useRef(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/sector/hero/`;

  // Check for auth token
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsAuthenticated(true);
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
        setTempData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching hero data:", error);
        // Fallback to default data if API fails
        const defaultData = {
          badgeText: "INDUSTRY EXPERTISE",
          title: "Sectors We",
          highlightedTitle: "Serve",
          description: "Delivering specialized solutions across diverse industries with deep sector knowledge and proven expertise.",
          backgroundImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop"
        };
        setTempData(defaultData);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ENDPOINT]);

  // Toggle edit mode
  const toggleEditMode = () => {
    console.log("Edit button clicked");
    
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Access Denied',
        text: 'Admin access required. Please log in.',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }
    
    setEditMode(!editMode);
  };

  // Handle text changes
  const handleTextChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle background image upload - COMPLETELY FIXED
  const handleBackgroundImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File selected:", file.name, "Type:", file.type, "Size:", file.size);

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
      const formData = new FormData();
      formData.append("image", file);
      formData.append("category", "sector-hero-background");

      console.log("Uploading image to:", `${API_BASE}/images/`);

      const response = await fetch(`${API_BASE}/images/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", response.status, errorText);
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      
      // Update the background image - handle different response formats
      const imageUrl = result.imageUrl || result.image || result.url;
      if (imageUrl) {
        handleTextChange("backgroundImage", imageUrl);
        Swal.fire({
          title: 'Success!',
          text: 'Background image uploaded successfully!',
          icon: 'success',
          confirmButtonColor: '#f1601f',
        });
      } else {
        throw new Error("No image URL in response");
      }
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

  // Trigger file input click - FIXED
  const triggerFileInput = () => {
    console.log("Triggering file input");
    if (backgroundFileInputRef.current) {
      backgroundFileInputRef.current.click();
    }
  };

  // Save changes
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
      setTempData(updatedData);
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
    if (!editMode) return;

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

  if (isLoading) {
    return (
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-[#0b1d34] flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-300">Loading hero section...</p>
        </div>
      </section>
    );
  }

  if (!tempData) {
    return (
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-[#0b1d34] flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-300">Failed to load hero section. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Edit Mode Toggle Button */}
        {isAuthenticated && (
          <div className="absolute top-4 right-4 z-50" style={{ zIndex: 9999 }}>
            {editMode ? (
              <div className="flex gap-2">
                <button 
                  onClick={saveChanges}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-bold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  title="Save Changes"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span className="text-sm">Save</span>
                </button>
                <button 
                  onClick={toggleEditMode}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-xl font-bold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  title="Cancel Editing"
                >
                  <X className="w-5 h-5" />
                  <span className="text-sm">Cancel</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={toggleEditMode}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-bold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                title="Edit Content"
              >
                <Edit className="w-5 h-5" />
                <span className="text-sm">Edit</span>
              </button>
            )}
          </div>
        )}

        {/* Edit Mode Overlay Indicator */}
        {editMode && (
          <div className="absolute inset-0 border-4 border-yellow-400 pointer-events-none z-40 flex items-center justify-center">
            <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              EDIT MODE ENABLED - Click on any content to edit
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-[#0b1d34]">
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
            </div>
          ) : (
            <div className="absolute inset-0 opacity-10">
              <img src={tempData.backgroundImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div 
              onClick={() => editMode && editTextInModal('badgeText', tempData.badgeText, 'Edit Badge Text', 'Update the badge text that appears above the title')}
              className={`inline-block mb-6 ${editMode ? 'cursor-pointer transform hover:scale-105 transition-transform duration-300' : 'cursor-default'}`}
            >
              <div className={`flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border ${
                editMode ? 'border-2 border-dashed border-yellow-400 hover:bg-white/20' : 'border-white/20'
              } transition-all duration-300`}>
                <div className="w-2 h-2 bg-[#f1601f] rounded-full animate-pulse"></div>
                <span className="text-white font-semibold text-sm tracking-wider">
                  {tempData.badgeText}
                </span>
              </div>
            </div>
            
            {/* Main Title */}
            <div className={`mb-6 ${editMode ? 'cursor-pointer' : 'cursor-default'}`}>
              <h1 
                onClick={() => editMode && editTextInModal('title', tempData.title, 'Edit Main Title', 'Update the main title text')}
                className={`text-5xl md:text-7xl font-black text-white mb-2 leading-tight ${
                  editMode ? 'bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-all duration-300' : ''
                }`}
              >
                {tempData.title}
              </h1>
              <span 
                onClick={() => editMode && editTextInModal('highlightedTitle', tempData.highlightedTitle, 'Edit Highlighted Title', 'Update the highlighted part of the title')}
                className={`text-5xl md:text-7xl font-black bg-gradient-to-r from-[#f1601f] to-orange-500 bg-clip-text text-transparent ${
                  editMode ? 'cursor-pointer bg-orange-500/20 rounded-lg p-2 hover:bg-orange-500/30 transition-all duration-300' : ''
                }`}
              >
                {tempData.highlightedTitle}
              </span>
            </div>

            {/* Description */}
            <p 
              onClick={() => editMode && editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text below the title')}
              className={`text-xl md:text-2xl text-gray-300 leading-relaxed ${
                editMode ? 'cursor-pointer bg-white/10 rounded-lg p-6 hover:bg-white/20 transition-all duration-300' : ''
              }`}
            >
              {tempData.description}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;