"use client";
import { Edit, Save, X, Upload, Trash2, Plus } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

const Industry = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  const fileInputRefs = useRef({});

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/about/industry/`;

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
          title: "Serving Diverse Industries",
          subtitle: "Where We Work",
          description: "Extensive experience delivering projects across multiple sectors throughout the Gulf region",
          sectors: [
            {
              id: 1,
              name: "Oil & Gas",
              projects: "150+",
              image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop",
              description: "Refineries, processing plants, and storage facilities"
            },
            {
              id: 2,
              name: "Infrastructure",
              projects: "200+",
              image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&h=400&fit=crop",
              description: "Roads, bridges, and transportation networks"
            },
            {
              id: 3,
              name: "Commercial",
              projects: "250+",
              image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
              description: "Office buildings, retail centers, and hospitality"
            },
            {
              id: 4,
              name: "Industrial",
              projects: "180+",
              image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
              description: "Manufacturing facilities and warehouses"
            },
            {
              id: 5,
              name: "Residential",
              projects: "120+",
              image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
              description: "Luxury villas and residential complexes"
            },
            {
              id: 6,
              name: "Healthcare",
              projects: "90+",
              image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop",
              description: "Hospitals and medical facilities"
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
          id: Date.now(), // Temporary ID
          name: "New Sector",
          projects: "0+",
          image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop",
          description: "Sector description"
        }
      ]
    }));
  };

  // Remove sector with confirmation
  const removeSector = async (index) => {
    if (tempData.sectors.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one sector',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This sector will be removed permanently!',
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
        text: 'Sector has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Handle sector image upload
  const handleSectorImageUpload = async (event, sectorIndex) => {
    const file = event.target.files[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication required for image upload");
      return;
    }

    setUploadingImages(prev => ({ ...prev, [sectorIndex]: true }));

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", `industry-sector-${sectorIndex}`);

    try {
      const response = await fetch(`${API_BASE}/images/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`
        },
        body: formData
      });

      if (!response.ok) throw new Error("Sector image upload failed");

      const result = await response.json();
      handleSectorChange(sectorIndex, "image", result.image);
    } catch (error) {
      console.error("Error uploading sector image:", error);
      alert("Sector image upload failed");
    } finally {
      setUploadingImages(prev => ({ ...prev, [sectorIndex]: false }));
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

  // Edit sector in modal
  const editSectorInModal = async (index, currentSector) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Sector Information',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Sector Name" value="${currentSector.name}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Projects Count" value="${currentSector.projects}">` +
        `<textarea id="swal-input3" class="swal2-textarea" placeholder="Description" style="width: 100%; height: 100px; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; resize: vertical;">${currentSector.description}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          name: document.getElementById('swal-input1').value,
          projects: document.getElementById('swal-input2').value,
          description: document.getElementById('swal-input3').value
        };
      }
    });

    if (formValues) {
      handleSectorChange(index, 'name', formValues.name);
      handleSectorChange(index, 'projects', formValues.projects);
      handleSectorChange(index, 'description', formValues.description);
    }
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading industries...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Failed to load industries. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-24 bg-white relative">
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
          <div className="text-center mb-16">
            {editMode ? (
              <>
                <div 
                  onClick={() => editTextInModal('subtitle', tempData.subtitle, 'Edit Subtitle', 'Update the subtitle text')}
                  className="cursor-pointer inline-block bg-white/80 backdrop-blur-sm border-2 border-dashed border-orange-300 text-[#f1601f] font-bold text-sm tracking-widest uppercase rounded-lg px-4 py-2 mb-4 hover:bg-orange-50 transition-all duration-300"
                >
                  {tempData.subtitle}
                </div>
                <div 
                  onClick={() => editTextInModal('title', tempData.title, 'Edit Main Title', 'Update the main title text')}
                  className="cursor-pointer bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 text-4xl md:text-5xl font-black text-[#0b1d34] mt-4 mb-6 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  {tempData.title}
                </div>
                <div 
                  onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text')}
                  className="cursor-pointer bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 text-xl text-[#7f8994] max-w-3xl mx-auto w-full p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  {tempData.description}
                </div>
              </>
            ) : (
              <>
                <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                  {data.subtitle}
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mt-4 mb-6">
                  {data.title}
                </h2>
                <p className="text-xl text-[#7f8994] max-w-3xl mx-auto">
                  {data.description}
                </p>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tempData.sectors.map((sector, index) => (
              <div key={sector.id} className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
                {/* Delete button for sector */}
                {editMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSector(index);
                    }}
                    className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 z-20 hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove this sector"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Image upload button */}
                {editMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRefs.current[index]?.click();
                    }}
                    className="absolute top-3 left-3 bg-blue-500 text-white rounded-full p-2 z-20 hover:bg-blue-600 transition-colors shadow-lg"
                    title="Change sector image"
                  >
                    {uploadingImages[index] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </button>
                )}

                <input
                  type="file"
                  ref={el => fileInputRefs.current[index] = el}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleSectorImageUpload(e, index)}
                />

                {uploadingImages[index] ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                ) : (
                  <img 
                    src={sector.image} 
                    alt={sector.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent group-hover:from-[#f1601f]/90 group-hover:via-[#f1601f]/70 transition-all duration-500"></div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div 
                    onClick={editMode ? () => editSectorInModal(index, sector) : undefined}
                    className={`transform group-hover:-translate-y-4 transition-transform duration-500 ${editMode ? 'cursor-pointer hover:bg-black/20 rounded-lg p-2' : ''}`}
                  >
                    <div className="text-white/80 font-bold text-sm mb-2">
                      {editMode ? (
                        <span className="border-b border-dashed border-white/60">
                          {sector.projects} Projects Completed
                        </span>
                      ) : (
                        `${sector.projects} Projects Completed`
                      )}
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2">
                      {editMode ? (
                        <span className="border-b border-dashed border-white">
                          {sector.name}
                        </span>
                      ) : (
                        sector.name
                      )}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {editMode ? (
                        <span className="border-b border-dashed border-white/60">
                          {sector.description}
                        </span>
                      ) : (
                        sector.description
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add new sector button */}
            {editMode && (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer min-h-[320px] p-8 hover:bg-gray-50 transition-all duration-300"
                onClick={addNewSector}
              >
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-gray-600 font-medium">Add New Sector</span>
                <span className="text-gray-500 text-sm text-center mt-2">
                  Click to add a new industry sector
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Industry;