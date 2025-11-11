"use client";
import { Award, CheckCircle, Clock, DollarSign, Shield, Users, Edit, Save, X, Plus, Trash2, Upload } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

const Why_Choose_us = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/quote/why-choose-us/`;

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
          subtitle: "Why Choose RAWASY",
          title: "The RAWASY Advantage",
          description: "Experience the difference of working with a Grade 1 licensed contractor",
          features: [
            {
              icon: "award",
              title: "Grade 1 License",
              description: "Premium contractor license for large-scale, complex projects across the Gulf region"
            },
            {
              icon: "shield",
              title: "ISO Certified",
              description: "ISO 9001:2015, ISO 14001, and OHSAS 18001 certified for quality and safety"
            },
            {
              icon: "check-circle",
              title: "800+ Projects",
              description: "Successfully delivered projects across commercial, industrial, and infrastructure sectors"
            },
            {
              icon: "users",
              title: "2000+ Workforce",
              description: "Highly skilled and certified professionals ready for immediate deployment"
            },
            {
              icon: "clock",
              title: "On-Time Delivery",
              description: "Advanced project management ensuring timely completion without compromising quality"
            },
            {
              icon: "dollar-sign",
              title: "Competitive Pricing",
              description: "Best value for premium construction services with transparent pricing"
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

  // Handle feature changes
  const handleFeatureChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.features[index][field] = value;
      return newData;
    });
  };

  // Add new feature
  const addNewFeature = () => {
    setTempData(prev => ({
      ...prev,
      features: [
        ...prev.features,
        {
          icon: "award",
          title: "New Feature",
          description: "Feature description"
        }
      ]
    }));
  };

  // Remove feature with confirmation
  const removeFeature = async (index) => {
    if (tempData.features.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one feature',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This feature will be removed permanently!',
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
        features: prev.features.filter((_, i) => i !== index)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Feature has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
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

  // Edit feature in modal
  const editFeatureInModal = async (index, currentFeature) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Feature',
      html:
        `<select id="swal-input1" class="swal2-input">
          <option value="award" ${currentFeature.icon === 'award' ? 'selected' : ''}>Award</option>
          <option value="shield" ${currentFeature.icon === 'shield' ? 'selected' : ''}>Shield</option>
          <option value="check-circle" ${currentFeature.icon === 'check-circle' ? 'selected' : ''}>Check Circle</option>
          <option value="users" ${currentFeature.icon === 'users' ? 'selected' : ''}>Users</option>
          <option value="clock" ${currentFeature.icon === 'clock' ? 'selected' : ''}>Clock</option>
          <option value="dollar-sign" ${currentFeature.icon === 'dollar-sign' ? 'selected' : ''}>Dollar Sign</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Feature Title" value="${currentFeature.title}">` +
        `<textarea id="swal-input3" class="swal2-textarea" placeholder="Feature Description" style="resize: vertical; min-height: 100px;">${currentFeature.description}</textarea>`,
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
      handleFeatureChange(index, 'icon', formValues.icon);
      handleFeatureChange(index, 'title', formValues.title);
      handleFeatureChange(index, 'description', formValues.description);
    }
  };

  // Render icon based on icon name
  const renderIcon = (iconName, props = {}) => {
    const iconProps = { className: "text-white", size: 28, ...props };
    
    switch (iconName) {
      case 'award':
        return <Award {...iconProps} />;
      case 'shield':
        return <Shield {...iconProps} />;
      case 'check-circle':
        return <CheckCircle {...iconProps} />;
      case 'users':
        return <Users {...iconProps} />;
      case 'clock':
        return <Clock {...iconProps} />;
      case 'dollar-sign':
        return <DollarSign {...iconProps} />;
      default:
        return <Award {...iconProps} />;
    }
  };

  if (isLoading) {
    return (
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading why choose us section...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Failed to load why choose us section. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-32 bg-white relative">
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
          <div className="text-center mb-20">
            {editMode ? (
              <>
                <div 
                  onClick={() => editTextInModal('subtitle', tempData.subtitle, 'Edit Subtitle', 'Update the subtitle text')}
                  className="cursor-pointer inline-block bg-gray-100 rounded-lg px-4 py-2 hover:bg-gray-200 transition-all duration-300 mb-4"
                >
                  <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                    {tempData.subtitle}
                  </span>
                </div>
                <div 
                  onClick={() => editTextInModal('title', tempData.title, 'Edit Main Title', 'Update the main title text')}
                  className="cursor-pointer bg-gray-100 rounded-lg p-6 hover:bg-gray-200 transition-all duration-300 mb-6"
                >
                  <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34]">
                    {tempData.title}
                  </h2>
                </div>
                <div 
                  onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text')}
                  className="cursor-pointer bg-gray-100 rounded-lg p-4 max-w-3xl mx-auto hover:bg-gray-200 transition-all duration-300"
                >
                  <p className="text-xl text-gray-600">
                    {tempData.description}
                  </p>
                </div>
              </>
            ) : (
              <>
                <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                  {data.subtitle}
                </span>
                <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
                  {data.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {data.description}
                </p>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tempData.features.map((feature, index) => (
              <div key={index} className="relative">
                {/* Delete button for feature */}
                {editMode && (
                  <button
                    onClick={() => removeFeature(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                    title="Remove this feature"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <div 
                  onClick={editMode ? () => editFeatureInModal(index, feature) : undefined}
                  className={`group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#f1601f] hover:shadow-2xl transition-all duration-500 ${
                    editMode ? "cursor-pointer hover:bg-gray-50" : ""
                  }`}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    {renderIcon(feature.icon)}
                  </div>
                  
                  {editMode ? (
                    <>
                      <h3 className="text-2xl font-black text-[#0b1d34] mb-4 border-2 border-dashed border-transparent hover:border-gray-300 p-2 rounded">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed border-2 border-dashed border-transparent hover:border-gray-300 p-2 rounded">
                        {feature.description}
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-black text-[#0b1d34] mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add new feature button */}
            {editMode && (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer min-h-[300px] p-8 hover:bg-gray-50 hover:border-[#f1601f] transition-all duration-300"
                onClick={addNewFeature}
              >
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-gray-500 text-lg font-medium">Add New Feature</span>
                <span className="text-gray-400 text-sm mt-2">Click to add a new feature card</span>
              </div>
            )}
          </div>
        </div>
      </section> 
    </>
  );
};

export default Why_Choose_us;