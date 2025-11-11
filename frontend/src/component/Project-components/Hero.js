"use client";
import { Award, Building2, CheckCircle, TrendingUp, Edit, Save, X, Upload } from 'lucide-react';
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
  const ENDPOINT = `${API_BASE}/projects/hero/`;

  // Stats configuration
  const stats = [
    { label: "Total Projects", value: "totalProjects", icon: Building2 },
    { label: "Active Projects", value: "activeProjects", icon: TrendingUp },
    { label: "Total Value", value: "totalValue", icon: Award },
    { label: "Client Satisfaction", value: "clientSatisfaction", icon: CheckCircle }
  ];

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
          badgeText: "OUR PORTFOLIO",
          title: "Projects That",
          highlightedTitle: "Define Excellence",
          description: "Showcasing 800+ successfully delivered projects across the Gulf region, setting benchmarks for quality and innovation.",
          stats: {
            totalProjects: "800+",
            activeProjects: "45+",
            totalValue: "$2.5B+",
            clientSatisfaction: "100%"
          },
          backgroundImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop"
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

  const triggerFileInput = () => {
    console.log("Triggering file input");
    if (backgroundFileInputRef.current) {
      backgroundFileInputRef.current.click();
    }
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

  // Handle stat changes
  const handleStatChange = (statKey, value) => {
    setTempData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statKey]: value
      }
    }));
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

  // Trigger file input click - NEW FUNCTION
  const triggerBackgroundUpload = () => {
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

  // Edit stat in modal
  const editStatInModal = async (statKey, currentValue, label) => {
    const { value: newValue } = await Swal.fire({
      title: `Edit ${label}`,
      input: 'text',
      inputLabel: `Update the value for ${label}`,
      inputValue: currentValue,
      inputAttributes: {
        'aria-label': `Edit ${label}`
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
      handleStatChange(statKey, newValue);
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

  if (!data) {
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
        {/* Edit Mode Toggle Button - FIXED POSITIONING */}
        {localStorage.getItem("authToken") && (
          <div className="fixed top-20 right-4 z-50">
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
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <span className="bg-yellow-500 text-black px-6 py-3 rounded-full text-sm font-bold shadow-lg">
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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            {editMode ? (
              <div 
                onClick={() => editTextInModal('badgeText', tempData.badgeText, 'Edit Badge Text', 'Update the badge text that appears above the title')}
                className="inline-block mb-6 cursor-pointer"
              >
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-dashed border-white/40 hover:bg-white/20 transition-all duration-300">
                  <div className="w-2 h-2 bg-[#f1601f] rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold text-sm tracking-wider bg-transparent border-none">
                    {tempData.badgeText}
                  </span>
                </div>
              </div>
            ) : (
              <div className="inline-block mb-6">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-[#f1601f] rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold text-sm tracking-wider">{data.badgeText}</span>
                </div>
              </div>
            )}
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              {editMode ? (
                <div className="flex flex-col items-center space-y-4">
                  <div 
                    onClick={() => editTextInModal('title', tempData.title, 'Edit Main Title', 'Update the main title text')}
                    className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300 w-full"
                  >
                    <span className="text-white bg-transparent border-none text-center">
                      {tempData.title}
                    </span>
                  </div>
                  <div 
                    onClick={() => editTextInModal('highlightedTitle', tempData.highlightedTitle, 'Edit Highlighted Title', 'Update the highlighted title text')}
                    className="cursor-pointer bg-gradient-to-r from-[#f1601f] to-orange-500 rounded-lg p-4 hover:from-[#f1601f] hover:to-orange-600 transition-all duration-300 w-full"
                  >
                    <span className="text-white bg-transparent border-none text-center">
                      {tempData.highlightedTitle}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {data.title} <span className="bg-gradient-to-r from-[#f1601f] to-orange-500 bg-clip-text text-transparent">{data.highlightedTitle}</span>
                </>
              )}
            </h1>
            
            {editMode ? (
              <div 
                onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text')}
                className="cursor-pointer bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto w-full p-6 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                {tempData.description}
              </div>
            ) : (
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                {data.description}
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                onClick={editMode ? () => editStatInModal(stat.value, tempData.stats[stat.value], stat.label) : undefined}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl border ${
                  editMode ? 'border-dashed border-white/40 cursor-pointer hover:bg-white/20' : 'border-white/20'
                } p-6 transition-all duration-300 relative`}
              >
                <stat.icon className="text-[#f1601f] mb-4" size={32} />
                <div className="text-4xl font-black text-white mb-2">
                  {editMode ? tempData.stats[stat.value] : data.stats[stat.value]}
                </div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;