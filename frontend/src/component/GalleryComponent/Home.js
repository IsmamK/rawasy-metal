"use client";
import { ArrowRight, Edit, Save, X, Upload } from 'lucide-react';
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
  const ENDPOINT = `${API_BASE}/gallery/hero/`;

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
          badgeText: "OUR WORK GALLERY",
          title: "Metal",
          highlightedTitle: "Mastery",
          subtitle: "in Action",
          description: "Showcasing our expertise in metal fabrication, structural steel works, and industrial solutions across the Gulf region",
          stats: [
            { label: "Projects Completed", value: "800+", icon: "Building2" },
            { label: "Metal Structures", value: "450+", icon: "Factory" },
            { label: "Satisfied Clients", value: "200+", icon: "Users" },
            { label: "Years Excellence", value: "15+", icon: "Award" }
          ],
          backgroundImage: "https://images.unsplash.com/photo-1565717791661-a8d9edab7c8c?w=1920&h=1080&fit=crop"
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
  const triggerFileInput = () => {
    console.log("Triggering file input");
    if (backgroundFileInputRef.current) {
      backgroundFileInputRef.current.click();
    }
  };

  // Handle stat changes
  const handleStatChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.stats[index][field] = value;
      return newData;
    });
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

  // Edit stat in modal
  const editStatInModal = async (index, currentStat) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Statistic',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Value (e.g., 800+)" value="${currentStat.value}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Label" value="${currentStat.label}">` +
        `<select id="swal-input3" class="swal2-input">
          <option value="Building2" ${currentStat.icon === 'Building2' ? 'selected' : ''}>Building</option>
          <option value="Factory" ${currentStat.icon === 'Factory' ? 'selected' : ''}>Factory</option>
          <option value="Users" ${currentStat.icon === 'Users' ? 'selected' : ''}>Users</option>
          <option value="Award" ${currentStat.icon === 'Award' ? 'selected' : ''}>Award</option>
        </select>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          value: document.getElementById('swal-input1').value,
          label: document.getElementById('swal-input2').value,
          icon: document.getElementById('swal-input3').value
        };
      }
    });

    if (formValues) {
      handleStatChange(index, 'value', formValues.value);
      handleStatChange(index, 'label', formValues.label);
      handleStatChange(index, 'icon', formValues.icon);
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
        {/* Edit Mode Toggle Button */}
        {localStorage.getItem("authToken") && (
          <div className="absolute top-4 right-4 z-50">
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
          <div className="absolute inset-0 border-4 border-yellow-400 pointer-events-none z-40 flex items-center justify-center">
            <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
              EDIT MODE ENABLED - Click on any content to edit
            </span>
          </div>
        )}

        {/* Background */}
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
              <div 
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" 
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 opacity-10">
                <img src={data.backgroundImage} alt="Hero Background" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/20 rounded-full blur-3xl animate-pulse"></div>
              <div 
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" 
                style={{ animationDelay: "1s" }}
              ></div>
            </>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Content */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Badge */}
            {editMode ? (
              <div className="inline-block mb-6 cursor-pointer" 
                   onClick={() => editTextInModal('badgeText', tempData.badgeText, 'Edit Badge Text', 'Update the badge text at the top')}>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-dashed border-white/30 hover:bg-white/20 transition-all duration-300">
                  <div className="w-2 h-2 bg-[#f1601f] rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold text-sm tracking-wider">
                    {tempData.badgeText}
                  </span>
                </div>
              </div>
            ) : (
              <div className="inline-block mb-6">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-[#f1601f] rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold text-sm tracking-wider">
                    {data.badgeText}
                  </span>
                </div>
              </div>
            )}

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              {editMode ? (
                <div className="space-y-4">
                  <div 
                    onClick={() => editTextInModal('title', tempData.title, 'Edit Main Title', 'Update the main title text')}
                    className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300"
                  >
                    <span className="text-white">{tempData.title}</span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                    <div 
                      onClick={() => editTextInModal('highlightedTitle', tempData.highlightedTitle, 'Edit Highlighted Title', 'Update the highlighted title text')}
                      className="cursor-pointer bg-gradient-to-r from-[#f1601f] to-orange-500 rounded-lg p-4 hover:from-[#f1601f] hover:to-orange-600 transition-all duration-300"
                    >
                      <span className="text-white">{tempData.highlightedTitle}</span>
                    </div>
                    <div 
                      onClick={() => editTextInModal('subtitle', tempData.subtitle, 'Edit Subtitle', 'Update the subtitle text')}
                      className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300"
                    >
                      <span className="text-white">{tempData.subtitle}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {data.title}{" "}
                  <span className="bg-gradient-to-r from-[#f1601f] to-orange-500 bg-clip-text text-transparent">
                    {data.highlightedTitle}
                  </span>{" "}
                  {data.subtitle}
                </>
              )}
            </h1>

            {/* Description */}
            {editMode ? (
              <div 
                onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text')}
                className="cursor-pointer bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 text-xl md:text-2xl text-gray-300 leading-relaxed p-6 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                {tempData.description}
              </div>
            ) : (
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                {data.description}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {tempData.stats.map((stat, index) => (
              <div 
                key={index}
                onClick={editMode ? () => editStatInModal(index, stat) : undefined}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl border p-6 transition-all duration-300 ${
                  editMode 
                    ? "cursor-pointer border-dashed border-white/30 hover:bg-white/20" 
                    : "border-white/20 hover:bg-white/20"
                }`}
              >
                <div className="text-[#f1601f] mb-4 flex justify-center">
                  {/* Icon would be rendered here based on icon name */}
                  <div className="w-8 h-8 bg-[#f1601f]/30 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{stat.icon.charAt(0)}</span>
                  </div>
                </div>
                <div className="text-4xl font-black text-white mb-2">
                  {stat.value}
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