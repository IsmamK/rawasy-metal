"use client";
import { ArrowRight, Edit, Save, X, Plus, Trash2, Upload } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import Swal from 'sweetalert2';

const IndustrySector = () => {
  const [data, setData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  const fileInputRefs = useRef({});

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/home/industry/`;

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
          preTitle: "Industry Sectors",
          title: "Serving Diverse Industries",
          subtitle: "Across the Gulf Region",
          sectors: [
            {
              name: "Oil & Gas",
              img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop",
              projects: "150+",
            },
            {
              name: "Infrastructure",
              img: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&h=400&fit=crop",
              projects: "200+",
            },
            {
              name: "Commercial",
              img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
              projects: "250+",
            },
            {
              name: "Industrial",
              img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
              projects: "180+",
            },
            {
              name: "Residential",
              img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
              projects: "120+",
            },
            {
              name: "Healthcare",
              img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop",
              projects: "90+",
            },
          ]
        };
        setData(defaultData);
        setTempData(defaultData);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ENDPOINT]);

  // Animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [data]);

  // Toggle edit mode
  const toggleEditMode = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Admin Access Required',
        text: 'Please log in to access edit mode.',
        confirmButtonColor: '#f1601f'
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

  // Handle sector changes
  const handleSectorChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.sectors[index][field] = value;
      return newData;
    });
  };

  // Add new sector
  const addNewSector = () => {
    setTempData(prev => ({
      ...prev,
      sectors: [
        ...prev.sectors,
        {
          name: "New Sector",
          img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop",
          projects: "0+",
        }
      ]
    }));
  };

  // Remove sector
  const removeSector = async (index) => {
    if (tempData.sectors.length <= 1) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Remove',
        text: 'You must have at least one sector',
        confirmButtonColor: '#f1601f'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
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
        sectors: prev.sectors.filter((_, i) => i !== index)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'The sector has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f'
      });
    }
  };

  // Handle image upload for sector - FOLLOWING CALL TO ACTION PATTERN
  const handleImageUpload = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select an image file.',
        confirmButtonColor: '#f1601f'
      });
      return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please log in to upload images.',
        confirmButtonColor: '#f1601f'
      });
      return;
    }

    setUploadingImages(prev => ({ ...prev, [index]: true }));

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "industry-sector-images");

    try {
      const response = await fetch(`${API_BASE}/images/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`
        },
        body: formData
      });

      if (!response.ok) throw new Error("Image upload failed");

      const result = await response.json();
      handleSectorChange(index, "img", result.image);

      Swal.fire({
        icon: 'success',
        title: 'Image Uploaded!',
        text: 'Sector image has been successfully updated.',
        confirmButtonColor: '#f1601f',
        timer: 2000
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload image. Please try again.',
        confirmButtonColor: '#f1601f'
      });
    } finally {
      setUploadingImages(prev => ({ ...prev, [index]: false }));
    }
  };

  // Trigger file input click - FIXED VERSION
  const triggerFileInput = (index) => {
    // Create file input if it doesn't exist for this index
    if (!fileInputRefs.current[index]) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      fileInput.onchange = (e) => handleImageUpload(e, index);
      document.body.appendChild(fileInput);
      fileInputRefs.current[index] = fileInput;
    }
    
    fileInputRefs.current[index].click();
  };

  // Save changes
  const saveChanges = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please log in to save changes.',
        confirmButtonColor: '#f1601f'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Save Changes?',
      text: "Are you sure you want to save all changes?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, save changes!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    setIsSaving(true);
    
    Swal.fire({
      title: 'Saving...',
      text: 'Please wait while we save your changes.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

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
        icon: 'success',
        title: 'Saved!',
        text: 'Changes have been saved successfully.',
        confirmButtonColor: '#f1601f',
        timer: 2000
      });
    } catch (error) {
      console.error("Error saving data:", error);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: 'Failed to save changes. Please try again.',
        confirmButtonColor: '#f1601f'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const cancelEditing = async () => {
    const result = await Swal.fire({
      title: 'Cancel Editing?',
      text: "All unsaved changes will be lost.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel!',
      cancelButtonText: 'Continue editing'
    });

    if (result.isConfirmed) {
      setTempData(data);
      setEditMode(false);
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

  // Edit sector in modal
  const editSectorInModal = async (index, currentSector) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Sector Information',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Sector Name" value="${currentSector.name}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Projects Count" value="${currentSector.projects}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          name: document.getElementById('swal-input1').value,
          projects: document.getElementById('swal-input2').value
        };
      }
    });

    if (formValues) {
      handleSectorChange(index, 'name', formValues.name);
      handleSectorChange(index, 'projects', formValues.projects);
    }
  };

  if (isLoading) {
    return (
      <section className="py-32 bg-[#0b1d34] flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f1601f]"></div>
          <p className="mt-4 text-white">Loading industry sectors...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-32 bg-[#0b1d34] flex justify-center items-center">
        <div className="text-center">
          <p className="text-white">Failed to load industry sectors. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="sectors"
        className="py-32 bg-[#0b1d34] relative overflow-hidden"
        data-animate
      >
        {/* Edit Mode Toggle Button */}
        {localStorage.getItem("authToken") && (
          <div className="absolute top-4 right-4 z-50">
            {editMode ? (
              <div className="flex gap-2">
                <button 
                  onClick={saveChanges}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
                  title="Save Changes"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                </button>
                <button 
                  onClick={cancelEditing}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-all duration-200"
                  title="Cancel Editing"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={toggleEditMode}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200"
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

        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            {editMode ? (
              <div 
                onClick={() => editTextInModal('preTitle', tempData.preTitle, 'Edit Pre-Title', 'Update the pre-title text')}
                className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-2 inline-block hover:bg-white/30 transition-all duration-300"
              >
                <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                  {tempData.preTitle}
                </span>
              </div>
            ) : (
              <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                {data.preTitle}
              </span>
            )}
            
            {editMode ? (
              <div className="space-y-2 mt-4">
                <div 
                  onClick={() => editTextInModal('title', tempData.title, 'Edit Main Title', 'Update the main title text')}
                  className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300"
                >
                  <span className="text-5xl md:text-6xl font-black text-white">
                    {tempData.title}
                  </span>
                </div>
                <div 
                  onClick={() => editTextInModal('subtitle', tempData.subtitle, 'Edit Subtitle', 'Update the subtitle text')}
                  className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300"
                >
                  <span className="text-5xl md:text-6xl font-black text-white">
                    {tempData.subtitle}
                  </span>
                </div>
              </div>
            ) : (
              <h2 className="text-5xl md:text-6xl font-black text-white mt-4 mb-6">
                {data.title}
                <br />
                {data.subtitle}
              </h2>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {tempData.sectors.map((sector, i) => (
              <div
                key={i}
                className={`group relative h-80 rounded-2xl overflow-hidden cursor-pointer ${
                  isVisible["sectors"]
                    ? "animate-fade-in-up"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {editMode && (
                  <>
                    {/* Remove button */}
                    <button
                      onClick={() => removeSector(i)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-10 transition-all duration-200"
                      title="Remove this sector"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    {/* Upload button - FOLLOWING CALL TO ACTION PATTERN */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerFileInput(i);
                      }}
                      className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 z-10 transition-all duration-200"
                      title="Change image"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </>
                )}

                {editMode && uploadingImages[i] ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f1601f] mb-2"></div>
                    <span className="text-gray-600 text-sm">Uploading...</span>
                  </div>
                ) : (
                  <img
                    src={sector.img}
                    alt={sector.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-[#f1601f] group-hover:via-[#f1601f]/80 transition-all duration-500"></div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="transform group-hover:-translate-y-4 transition-transform duration-500">
                    {editMode ? (
                      <div 
                        onClick={() => editSectorInModal(i, sector)}
                        className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-2 hover:bg-white/30 transition-all duration-300"
                      >
                        <div className="text-white/70 font-bold text-sm mb-2">
                          {sector.projects} Projects
                        </div>
                        <h3 className="text-3xl font-black text-white">
                          {sector.name}
                        </h3>
                      </div>
                    ) : (
                      <>
                        <div className="text-white/70 font-bold text-sm mb-2">
                          {sector.projects} Projects
                        </div>
                        <h3 className="text-3xl font-black text-white">
                          {sector.name}
                        </h3>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-2 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span className="font-semibold">View Projects</span>
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add new sector button */}
            {editMode && (
              <div 
                className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-2xl overflow-hidden flex flex-col items-center justify-center cursor-pointer min-h-[320px] hover:border-[#f1601f] hover:bg-gray-700 transition-all duration-200"
                onClick={addNewSector}
              >
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-gray-400 font-medium">Add New Sector</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default IndustrySector;