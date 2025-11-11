"use client";
import { ArrowRight, Building2, Factory, Package, Settings, Users, Wrench, Edit, Save, X, Plus, Trash2, Upload } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

const Services = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingIcons, setUploadingIcons] = useState({});

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/quote/services/`;

  // Icon mapping
  const iconComponents = {
    'building2': Building2,
    'settings': Settings,
    'users': Users,
    'wrench': Wrench,
    'package': Package,
    'factory': Factory
  };

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
        if (!response.ok) throw new Error("Failed to fetch services data");
        const jsonData = await response.json();
        setData(jsonData);
        setTempData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching services data:", error);
        // Fallback to default data if API fails
        const defaultData = {
          sectionTitle: "Our Services",
          sectionSubtitle: "Comprehensive Solutions",
          sectionDescription: "We provide end-to-end construction and industrial services",
          services: [
            { 
              id: 1, 
              value: 'general-contracting', 
              label: 'General Contracting', 
              icon: 'building2',
              description: 'Complete construction management and contracting services',
              customIcon: null
            },
            { 
              id: 2, 
              value: 'civil-mep', 
              label: 'Civil & MEP Works', 
              icon: 'settings',
              description: 'Civil engineering and MEP installation services',
              customIcon: null
            },
            { 
              id: 3, 
              value: 'manpower', 
              label: 'Manpower Supply', 
              icon: 'users',
              description: 'Skilled and unskilled manpower solutions',
              customIcon: null
            },
            { 
              id: 4, 
              value: 'maintenance', 
              label: 'Maintenance Services', 
              icon: 'wrench',
              description: 'Comprehensive maintenance and repair services',
              customIcon: null
            },
            { 
              id: 5, 
              value: 'trading', 
              label: 'Trading & Supply', 
              icon: 'package',
              description: 'Construction materials and equipment supply',
              customIcon: null
            },
            { 
              id: 6, 
              value: 'metal-fabrication', 
              label: 'Metal Fabrication', 
              icon: 'factory',
              description: 'Custom metal fabrication and welding services',
              customIcon: null
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

  // Handle section text changes
  const handleSectionTextChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle service changes
  const handleServiceChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.services[index][field] = value;
      return newData;
    });
  };

  // Add new service
  const addNewService = () => {
    setTempData(prev => ({
      ...prev,
      services: [
        ...prev.services,
        {
          id: Date.now(), // Temporary ID
          value: 'new-service',
          label: 'New Service',
          icon: 'building2',
          description: 'Service description',
          customIcon: null
        }
      ]
    }));
  };

  // Remove service with confirmation
  const removeService = async (index) => {
    if (tempData.services.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one service',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This service will be removed permanently!',
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
        services: prev.services.filter((_, i) => i !== index)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Service has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Handle icon upload for service
  const handleIconUpload = async (event, serviceIndex) => {
    const file = event.target.files[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication required for icon upload");
      return;
    }

    setUploadingIcons(prev => ({ ...prev, [serviceIndex]: true }));

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "service-icons");

    try {
      const response = await fetch(`${API_BASE}/images/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`
        },
        body: formData
      });

      if (!response.ok) throw new Error("Icon upload failed");

      const result = await response.json();
      handleServiceChange(serviceIndex, 'customIcon', result.image);
    } catch (error) {
      console.error("Error uploading icon:", error);
      alert("Icon upload failed");
    } finally {
      setUploadingIcons(prev => ({ ...prev, [serviceIndex]: false }));
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
      handleSectionTextChange(field, newValue);
    }
  };

  // Edit service in modal
  const editServiceInModal = async (index, currentService) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Service',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Service Value" value="${currentService.value}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Service Label" value="${currentService.label}">` +
        `<textarea id="swal-input3" class="swal2-textarea" placeholder="Service Description" style="width: 100%; height: 100px; padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 5px; font-size: 14px; resize: vertical;">${currentService.description}</textarea>` +
        `<select id="swal-input4" class="swal2-input">
          <option value="building2" ${currentService.icon === 'building2' ? 'selected' : ''}>Building</option>
          <option value="settings" ${currentService.icon === 'settings' ? 'selected' : ''}>Settings</option>
          <option value="users" ${currentService.icon === 'users' ? 'selected' : ''}>Users</option>
          <option value="wrench" ${currentService.icon === 'wrench' ? 'selected' : ''}>Wrench</option>
          <option value="package" ${currentService.icon === 'package' ? 'selected' : ''}>Package</option>
          <option value="factory" ${currentService.icon === 'factory' ? 'selected' : ''}>Factory</option>
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
          description: document.getElementById('swal-input3').value,
          icon: document.getElementById('swal-input4').value
        };
      }
    });

    if (formValues) {
      handleServiceChange(index, 'value', formValues.value);
      handleServiceChange(index, 'label', formValues.label);
      handleServiceChange(index, 'description', formValues.description);
      handleServiceChange(index, 'icon', formValues.icon);
    }
  };

  // Render icon based on service data
  const renderIcon = (service, props = {}) => {
    const iconProps = { size: 28, className: "text-white", ...props };
    
    if (service.customIcon) {
      return (
        <div className="w-16 h-16 flex items-center justify-center mb-6">
          <img 
            src={service.customIcon} 
            alt={service.label}
            className="w-8 h-8 object-contain"
          />
        </div>
      );
    }
    
    const IconComponent = iconComponents[service.icon] || Building2;
    return <IconComponent {...iconProps} />;
  };

  if (isLoading) {
    return (
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load services. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white relative">
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
              <div 
                onClick={() => editTextInModal('sectionTitle', tempData.sectionTitle, 'Edit Section Title', 'Update the small heading text above the main title')}
                className="cursor-pointer inline-block"
              >
                <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white transition-all duration-300">
                  {tempData.sectionTitle}
                </span>
              </div>
            ) : (
              <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                {data.sectionTitle}
              </span>
            )}
            
            {editMode ? (
              <div 
                onClick={() => editTextInModal('sectionSubtitle', tempData.sectionSubtitle, 'Edit Main Title', 'Update the main title text')}
                className="cursor-pointer mt-4 mb-6"
              >
                <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] bg-white/80 backdrop-blur-sm rounded-lg p-6 hover:bg-white transition-all duration-300">
                  {tempData.sectionSubtitle}
                </h2>
              </div>
            ) : (
              <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
                {data.sectionSubtitle}
              </h2>
            )}
            
            {editMode ? (
              <div 
                onClick={() => editTextInModal('sectionDescription', tempData.sectionDescription, 'Edit Description', 'Update the section description text')}
                className="cursor-pointer max-w-3xl mx-auto"
              >
                <p className="text-xl text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg p-4 hover:bg-white transition-all duration-300">
                  {tempData.sectionDescription}
                </p>
              </div>
            ) : (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {data.sectionDescription}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tempData.services.map((service, index) => (
              <div key={service.id} className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#f1601f] hover:shadow-xl transition-all duration-500 relative">
                
                {/* Delete button for service */}
                {editMode && (
                  <button
                    onClick={() => removeService(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                    title="Remove this service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Icon section with upload capability */}
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0b1d34] to-[#13344c] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500">
                    {uploadingIcons[index] ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      renderIcon(service)
                    )}
                  </div>
                  
                  {editMode && (
                    <button
                      onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = 'image/*';
                        fileInput.onchange = (e) => handleIconUpload(e, index);
                        fileInput.click();
                      }}
                      className="absolute top-0 left-0 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
                      title="Upload custom icon"
                    >
                      <Upload className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Service content */}
                <div 
                  onClick={editMode ? () => editServiceInModal(index, service) : undefined}
                  className={editMode ? "cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-all duration-300" : ""}
                >
                  {editMode ? (
                    <h3 className="text-xl font-black text-[#0b1d34] mb-4 border-2 border-dashed border-transparent hover:border-gray-300 rounded-lg p-2">
                      {service.label}
                    </h3>
                  ) : (
                    <h3 className="text-xl font-black text-[#0b1d34] mb-4">
                      {service.label}
                    </h3>
                  )}
                  
                  {editMode ? (
                    <p className="text-gray-600 mb-4 border-2 border-dashed border-transparent hover:border-gray-300 rounded-lg p-2">
                      {service.description}
                    </p>
                  ) : (
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                  )}
                  
                  <a 
                    href={`/services/${service.value}`} 
                    className="inline-flex items-center space-x-2 text-[#f1601f] font-bold hover:space-x-3 transition-all duration-300"
                  >
                    <span>Learn More</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            ))}
            
            {/* Add new service button */}
            {editMode && (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer min-h-[300px] p-8 hover:bg-gray-50 hover:border-[#f1601f] transition-all duration-300"
                onClick={addNewService}
              >
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-gray-600 font-medium">Add New Service</span>
              </div>
            )}
          </div>
        </div>
      </section> 
    </>
  );
};

export default Services;