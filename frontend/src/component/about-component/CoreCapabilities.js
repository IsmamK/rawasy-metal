"use client";
import { Briefcase, Building2, CheckCircle, Factory, HardHat, Users, Wrench, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const CoreCapabilities = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/about/capabilities/`;

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
          sectionTitle: "Core Capabilities",
          sectionSubtitle: "What We Do",
          sectionDescription: "Comprehensive solutions across all aspects of construction, trading, and workforce management",
          capabilities: [
            {
              id: 1,
              icon: "building2",
              title: "General Contracting",
              description: "End-to-end construction management including civil works, structural engineering, and project execution for commercial, industrial, and residential developments.",
              features: ["Commercial Buildings", "Industrial Facilities", "Infrastructure Projects", "Turnkey Solutions"]
            },
            {
              id: 2,
              icon: "wrench",
              title: "Civil & MEP Works",
              description: "Comprehensive mechanical, electrical, and plumbing solutions with expertise in HVAC, electrical installations, and fire safety systems.",
              features: ["HVAC Systems", "Electrical Installations", "Plumbing Networks", "Fire Safety"]
            },
            {
              id: 3,
              icon: "users",
              title: "Manpower Supply",
              description: "Access to over 2000 skilled professionals including engineers, technicians, and specialized workforce ready for immediate deployment.",
              features: ["Engineers & Technicians", "Skilled Labor", "Project Management", "Quality Teams"]
            },
            {
              id: 4,
              icon: "hard-hat",
              title: "Maintenance Services",
              description: "Ongoing facility management, preventive maintenance, and emergency repair services to ensure optimal performance of your assets.",
              features: ["Preventive Maintenance", "Emergency Repairs", "Facility Management", "Asset Optimization"]
            },
            {
              id: 5,
              icon: "briefcase",
              title: "Trading & Supply",
              description: "Premium construction materials, equipment, and safety gear sourced from trusted global suppliers with quality assurance.",
              features: ["Construction Materials", "Heavy Equipment", "Safety Gear", "Technical Supplies"]
            },
            {
              id: 6,
              icon: "factory",
              title: "Industrial Solutions",
              description: "Specialized services for oil & gas, petrochemical, and industrial sectors with focus on safety and compliance.",
              features: ["Oil & Gas Projects", "Industrial Facilities", "Process Equipment", "Safety Systems"]
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

  // Handle capability changes
  const handleCapabilityChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.capabilities[index][field] = value;
      return newData;
    });
  };

  // Handle feature changes
  const handleFeatureChange = (capabilityIndex, featureIndex, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.capabilities[capabilityIndex].features[featureIndex] = value;
      return newData;
    });
  };

  // Add new capability
  const addNewCapability = () => {
    setTempData(prev => ({
      ...prev,
      capabilities: [
        ...prev.capabilities,
        {
          id: Date.now(), // Temporary ID
          icon: "building2",
          title: "New Capability",
          description: "Add description for this capability",
          features: ["Feature 1", "Feature 2", "Feature 3"]
        }
      ]
    }));
  };

  // Remove capability with confirmation
  const removeCapability = async (index) => {
    if (tempData.capabilities.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one capability',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This capability will be removed permanently!',
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
        capabilities: prev.capabilities.filter((_, i) => i !== index)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Capability has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Add new feature to capability
  const addNewFeature = (capabilityIndex) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.capabilities[capabilityIndex].features.push("New Feature");
      return newData;
    });
  };

  // Remove feature from capability
  const removeFeature = (capabilityIndex, featureIndex) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.capabilities[capabilityIndex].features = 
        newData.capabilities[capabilityIndex].features.filter((_, i) => i !== featureIndex);
      return newData;
    });
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

  // Edit capability in modal
  const editCapabilityInModal = async (index, currentCapability) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Capability',
      html:
        `<select id="swal-input1" class="swal2-input">
          <option value="building2" ${currentCapability.icon === 'building2' ? 'selected' : ''}>Building</option>
          <option value="wrench" ${currentCapability.icon === 'wrench' ? 'selected' : ''}>Wrench</option>
          <option value="users" ${currentCapability.icon === 'users' ? 'selected' : ''}>Users</option>
          <option value="hard-hat" ${currentCapability.icon === 'hard-hat' ? 'selected' : ''}>Hard Hat</option>
          <option value="briefcase" ${currentCapability.icon === 'briefcase' ? 'selected' : ''}>Briefcase</option>
          <option value="factory" ${currentCapability.icon === 'factory' ? 'selected' : ''}>Factory</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Title" value="${currentCapability.title}">` +
        `<textarea id="swal-input3" class="swal2-textarea" placeholder="Description" style="width: 100%; height: 100px; padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 5px; font-size: 14px; resize: vertical;">${currentCapability.description}</textarea>`,
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
      handleCapabilityChange(index, 'icon', formValues.icon);
      handleCapabilityChange(index, 'title', formValues.title);
      handleCapabilityChange(index, 'description', formValues.description);
    }
  };

  // Edit feature in modal
  const editFeatureInModal = async (capabilityIndex, featureIndex, currentFeature) => {
    const { value: newValue } = await Swal.fire({
      title: 'Edit Feature',
      input: 'text',
      inputLabel: 'Update the feature text',
      inputValue: currentFeature,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Feature cannot be empty!';
        }
      }
    });

    if (newValue) {
      handleFeatureChange(capabilityIndex, featureIndex, newValue);
    }
  };

  // Render icon based on icon name
  const renderIcon = (iconName, props = {}) => {
    const iconProps = { className: "text-white", size: 32, ...props };
    
    switch (iconName) {
      case 'building2':
        return <Building2 {...iconProps} />;
      case 'wrench':
        return <Wrench {...iconProps} />;
      case 'users':
        return <Users {...iconProps} />;
      case 'hard-hat':
        return <HardHat {...iconProps} />;
      case 'briefcase':
        return <Briefcase {...iconProps} />;
      case 'factory':
        return <Factory {...iconProps} />;
      default:
        return <Building2 {...iconProps} />;
    }
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading capabilities...</p>
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
            <p className="text-gray-600">Failed to load capabilities. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-24 bg-white relative">
        {/* Edit Mode Overlay Indicator */}
        {editMode && (
          <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 text-sm font-bold z-40">
            EDIT MODE ENABLED - Click on any content to edit
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Edit Mode Toggle Button - MOVED INSIDE THE COMPONENT */}
          {localStorage.getItem("authToken") && (
            <div className="absolute top-0 right-4 z-50">
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

          <div className="text-center mb-16">
            {editMode ? (
              <>
                <div 
                  onClick={() => editTextInModal('sectionSubtitle', tempData.sectionSubtitle, 'Edit Section Subtitle', 'Update the small subtitle text')}
                  className="cursor-pointer inline-block bg-white border-2 border-dashed border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-all duration-300 mb-4"
                >
                  <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                    {tempData.sectionSubtitle}
                  </span>
                </div>
                <div 
                  onClick={() => editTextInModal('sectionTitle', tempData.sectionTitle, 'Edit Section Title', 'Update the main section title')}
                  className="cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-all duration-300 mb-4"
                >
                  <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34]">
                    {tempData.sectionTitle}
                  </h2>
                </div>
                <div 
                  onClick={() => editTextInModal('sectionDescription', tempData.sectionDescription, 'Edit Section Description', 'Update the section description text')}
                  className="cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-all duration-300 max-w-3xl mx-auto"
                >
                  <p className="text-xl text-[#7f8994]">
                    {tempData.sectionDescription}
                  </p>
                </div>
              </>
            ) : (
              <>
                <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                  {data.sectionSubtitle}
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mt-4 mb-6">
                  {data.sectionTitle}
                </h2>
                <p className="text-xl text-[#7f8994] max-w-3xl mx-auto">
                  {data.sectionDescription}
                </p>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tempData.capabilities.map((capability, i) => (
              <div key={capability.id || i} className="group relative bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-[#f1601f] hover:shadow-2xl transition-all duration-500">
                
                {/* Delete button for capability */}
                {editMode && (
                  <button
                    onClick={() => removeCapability(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                    title="Remove this capability"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="absolute inset-0 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative">
                  <div 
                    onClick={editMode ? () => editCapabilityInModal(i, capability) : undefined}
                    className={editMode ? "cursor-pointer" : ""}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      {renderIcon(capability.icon)}
                    </div>
                    
                    <h3 className="text-2xl font-black text-[#0b1d34] group-hover:text-white mb-4 transition-colors duration-500">
                      {capability.title}
                    </h3>
                    
                    <p className="text-[#7f8994] group-hover:text-white/90 mb-6 transition-colors duration-500">
                      {capability.description}
                    </p>
                  </div>
                  
                  <ul className="space-y-2">
                    {capability.features.map((feature, j) => (
                      <li key={j} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="text-[#f1601f] group-hover:text-white flex-shrink-0" size={16} />
                        {editMode ? (
                          <div className="flex items-center space-x-2 flex-1">
                            <span 
                              onClick={() => editFeatureInModal(i, j, feature)}
                              className="text-[#7f8994] group-hover:text-white/90 transition-colors duration-500 cursor-pointer bg-white/50 group-hover:bg-transparent rounded px-1 flex-1"
                            >
                              {feature}
                            </span>
                            <button
                              onClick={() => removeFeature(i, j)}
                              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove feature"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[#7f8994] group-hover:text-white/90 transition-colors duration-500">
                            {feature}
                          </span>
                        )}
                      </li>
                    ))}
                    
                    {/* Add new feature button */}
                    {editMode && (
                      <li className="flex items-center space-x-2 text-sm">
                        <button
                          onClick={() => addNewFeature(i)}
                          className="flex items-center space-x-2 text-[#f1601f] hover:text-[#7f3e2c] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-sm">Add Feature</span>
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
            
            {/* Add new capability button */}
            {editMode && (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer min-h-[400px] p-8 hover:border-[#f1601f] hover:bg-gray-50 transition-all duration-300"
                onClick={addNewCapability}
              >
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-gray-500 font-medium">Add New Capability</span>
              </div>
            )}
          </div>
        </div>
      </section> 
    </>
  );
};

export default CoreCapabilities;