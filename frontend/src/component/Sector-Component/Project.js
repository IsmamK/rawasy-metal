"use client";
import React, { useEffect, useState, useRef } from 'react';
import { 
  Droplets, Building2, Factory, Home, Hospital, TrendingUp, 
  ArrowRight, CheckCircle, Award, Shield, Users, Zap, 
  ChevronRight, Wrench, Package, Power, Cpu, Layers,
  Edit, Save, X, Upload, Plus, Trash2
} from 'lucide-react';
import Swal from 'sweetalert2';

const Projects = () => {
  const [activeSector, setActiveSector] = useState(0);
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  const fileInputRefs = useRef({});

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/sector/projects/`;

  // Icon mapping
  const iconComponents = {
    Droplets, Building2, Factory, Home, Hospital, TrendingUp,
    ArrowRight, CheckCircle, Award, Shield, Users, Zap,
    ChevronRight, Wrench, Package, Power, Cpu, Layers
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
        if (!response.ok) throw new Error("Failed to fetch data");
        const jsonData = await response.json();
        setData(jsonData);
        setTempData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to default data if API fails
        const defaultData = {
          sectors: [
            {
              id: 'oil-gas',
              name: 'Oil & Gas',
              icon: 'Droplets',
              tagline: 'Energy Sector Excellence',
              description: 'Comprehensive solutions for the oil and gas industry, delivering world-class infrastructure for refineries, processing plants, and storage facilities with unwavering focus on safety and operational excellence.',
              image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=800&fit=crop',
              stats: [
                { label: 'Projects Completed', value: '150+' },
                { label: 'Safety Record', value: '100%' },
                { label: 'Client Retention', value: '98%' },
                { label: 'Years Experience', value: '15+' }
              ],
              services: [
                {
                  title: 'Refinery Construction',
                  desc: 'Complete construction services for oil refineries including structural works, piping systems, and equipment installation',
                  icon: 'Factory'
                },
                {
                  title: 'Processing Plants',
                  desc: 'Design and construction of petrochemical processing facilities with advanced automation and safety systems',
                  icon: 'Cpu'
                },
                {
                  title: 'Storage Facilities',
                  desc: 'Tank farms and storage infrastructure with leak detection and environmental protection systems',
                  icon: 'Package'
                },
                {
                  title: 'Pipeline Networks',
                  desc: 'Installation and maintenance of pipeline systems for crude oil, gas, and refined products transportation',
                  icon: 'Layers'
                }
              ],
              capabilities: [
                'Civil & Structural Works',
                'Process Equipment Installation',
                'Piping & Instrumentation',
                'Electrical & Automation Systems',
                'Fire Fighting & Safety Systems',
                'Tank Farm Construction',
                'Maintenance & Shutdown Services',
                'HAZOP & Safety Studies'
              ],
              projects: [
                { name: 'Al Ruwais Refinery Expansion', value: '$45M', status: 'Completed' },
                { name: 'Petrochemical Processing Plant', value: '$95M', status: 'Completed' },
                { name: 'Gas Processing Facility', value: '$62M', status: 'Ongoing' }
              ],
              certifications: ['ISO 9001:2015', 'OHSAS 18001', 'Grade 1 Contractor License', 'ADNOC Approved'],
              whyChooseUs: [
                {
                  icon: 'Award',
                  title: 'Sector Expertise',
                  desc: 'Deep understanding of industry-specific requirements and regulations'
                },
                {
                  icon: 'Users',
                  title: 'Specialized Workforce',
                  desc: 'Certified professionals with extensive sector experience'
                },
                {
                  icon: 'Shield',
                  title: 'Safety Excellence',
                  desc: 'Industry-leading safety protocols and zero-harm culture'
                },
                {
                  icon: 'Zap',
                  title: 'Proven Track Record',
                  desc: 'Hundreds of successfully delivered projects in this sector'
                }
              ]
            },
            {
              id: 'infrastructure',
              name: 'Infrastructure',
              icon: 'TrendingUp',
              tagline: 'Building Tomorrow\'s Foundations',
              description: 'Delivering large-scale infrastructure projects including highways, bridges, airports, and urban development with cutting-edge engineering and sustainable practices.',
              image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&h=800&fit=crop',
              stats: [
                { label: 'Projects Delivered', value: '200+' },
                { label: 'Total Value', value: '$850M+' },
                { label: 'On-Time Delivery', value: '98%' },
                { label: 'Coverage Area', value: 'Gulf Region' }
              ],
              services: [
                {
                  title: 'Highway Construction',
                  desc: 'Multi-lane highway development with modern interchanges, drainage systems, and smart traffic management',
                  icon: 'TrendingUp'
                },
                {
                  title: 'Bridge Engineering',
                  desc: 'Design-build services for bridges and elevated structures using advanced construction methodologies',
                  icon: 'Layers'
                },
                {
                  title: 'Urban Development',
                  desc: 'Comprehensive urban infrastructure including utilities, streetscapes, and public amenities',
                  icon: 'Building2'
                },
                {
                  title: 'Transportation Systems',
                  desc: 'Metro stations, bus terminals, and integrated transportation hubs with modern facilities',
                  icon: 'Cpu'
                }
              ],
              capabilities: [
                'Road & Highway Construction',
                'Bridge & Flyover Construction',
                'Underground Utilities',
                'Drainage & Storm Water Systems',
                'Street Lighting & Signage',
                'Landscaping & Public Spaces',
                'Traffic Management Systems',
                'Sustainable Infrastructure Solutions'
              ],
              projects: [
                { name: 'Sheikh Zayed Highway Bridge', value: '$65M', status: 'Completed' },
                { name: 'Metro Station Development', value: '$72M', status: 'Completed' },
                { name: 'Urban Infrastructure Package', value: '$48M', status: 'Ongoing' }
              ],
              certifications: ['ISO 9001:2015', 'ISO 14001', 'RTA Approved', 'Municipality Approved'],
              whyChooseUs: [
                {
                  icon: 'Award',
                  title: 'Sector Expertise',
                  desc: 'Deep understanding of industry-specific requirements and regulations'
                },
                {
                  icon: 'Users',
                  title: 'Specialized Workforce',
                  desc: 'Certified professionals with extensive sector experience'
                },
                {
                  icon: 'Shield',
                  title: 'Safety Excellence',
                  desc: 'Industry-leading safety protocols and zero-harm culture'
                },
                {
                  icon: 'Zap',
                  title: 'Proven Track Record',
                  desc: 'Hundreds of successfully delivered projects in this sector'
                }
              ]
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
  const handleSectorChange = (sectorIndex, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.sectors[sectorIndex][field] = value;
      return newData;
    });
  };

  // Handle stat changes
  const handleStatChange = (sectorIndex, statIndex, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.sectors[sectorIndex].stats[statIndex][field] = value;
      return newData;
    });
  };

  // Handle service changes
  const handleServiceChange = (sectorIndex, serviceIndex, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.sectors[sectorIndex].services[serviceIndex][field] = value;
      return newData;
    });
  };

  // Handle capability changes
  const handleCapabilityChange = (sectorIndex, capabilityIndex, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.sectors[sectorIndex].capabilities[capabilityIndex] = value;
      return newData;
    });
  };

  // Handle project changes
  const handleProjectChange = (sectorIndex, projectIndex, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.sectors[sectorIndex].projects[projectIndex][field] = value;
      return newData;
    });
  };

  // Handle certification changes
  const handleCertificationChange = (sectorIndex, certificationIndex, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.sectors[sectorIndex].certifications[certificationIndex] = value;
      return newData;
    });
  };

  // Handle why choose us changes
  const handleWhyChooseUsChange = (sectorIndex, itemIndex, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.sectors[sectorIndex].whyChooseUs[itemIndex][field] = value;
      return newData;
    });
  };

  // Add new capability
  const addNewCapability = (sectorIndex) => {
    setTempData(prev => ({
      ...prev,
      sectors: prev.sectors.map((sector, index) => 
        index === sectorIndex 
          ? { ...sector, capabilities: [...sector.capabilities, 'New Capability'] }
          : sector
      )
    }));
  };

  // Add new why choose us item
  const addNewWhyChooseUs = (sectorIndex) => {
    setTempData(prev => ({
      ...prev,
      sectors: prev.sectors.map((sector, index) => 
        index === sectorIndex 
          ? { 
              ...sector, 
              whyChooseUs: [
                ...sector.whyChooseUs, 
                {
                  icon: 'Award',
                  title: 'New Feature',
                  desc: 'Description of the new feature'
                }
              ] 
            }
          : sector
      )
    }));
  };

  // Remove capability
  const removeCapability = async (sectorIndex, capabilityIndex) => {
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
        sectors: prev.sectors.map((sector, index) => 
          index === sectorIndex 
            ? { ...sector, capabilities: sector.capabilities.filter((_, i) => i !== capabilityIndex) }
            : sector
        )
      }));
    }
  };

  // Remove why choose us item
  const removeWhyChooseUs = async (sectorIndex, itemIndex) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This item will be removed permanently!',
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
        sectors: prev.sectors.map((sector, index) => 
          index === sectorIndex 
            ? { ...sector, whyChooseUs: sector.whyChooseUs.filter((_, i) => i !== itemIndex) }
            : sector
        )
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = async (event, sectorIndex, imageType) => {
    const file = event.target.files[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication required for image upload");
      return;
    }

    setUploadingImages(prev => ({ ...prev, [`${sectorIndex}-${imageType}`]: true }));

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", `sector-${imageType}`);

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
      handleSectorChange(sectorIndex, 'image', result.image);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed");
    } finally {
      setUploadingImages(prev => ({ ...prev, [`${sectorIndex}-${imageType}`]: false }));
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
  const editTextInModal = async (currentValue, title, description, onSave) => {
    const { value: newValue } = await Swal.fire({
      title: title,
      input: 'textarea',
      inputLabel: description,
      inputValue: currentValue,
      inputAttributes: {
        'aria-label': `Edit ${title}`
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
      onSave(newValue);
    }
  };

  // Edit simple text in modal
  const editSimpleTextInModal = async (currentValue, title, description, onSave) => {
    const { value: newValue } = await Swal.fire({
      title: title,
      input: 'text',
      inputLabel: description,
      inputValue: currentValue,
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
      onSave(newValue);
    }
  };

  // Edit icon selection
  const editIconSelection = async (currentIcon, title, onSave) => {
    const icons = ['Award', 'Users', 'Shield', 'Zap', 'TrendingUp', 'CheckCircle', 'Building2', 'Factory'];
    
    const { value: selectedIcon } = await Swal.fire({
      title: title,
      input: 'select',
      inputOptions: icons.reduce((options, icon) => {
        options[icon] = icon;
        return options;
      }, {}),
      inputValue: currentIcon,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel'
    });

    if (selectedIcon) {
      onSave(selectedIcon);
    }
  };

  // Render icon based on icon name
  const renderIcon = (iconName, props = {}) => {
    const IconComponent = iconComponents[iconName] || Building2;
    return <IconComponent {...props} />;
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (!data || !data.sectors) {
    return (
      <section className="py-20 bg-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load projects. Please try again later.</p>
        </div>
      </section>
    );
  }

  const currentSector = tempData.sectors[activeSector];

  return (
    <>
      {/* Edit Mode Overlay Indicator */}
      {editMode && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            EDIT MODE ENABLED - Click on any content to edit
          </span>
        </div>
      )}

      {/* Sector Navigation */}
      <section className="py-12 bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Edit Button Inside Component */}
          {localStorage.getItem("authToken") && (
            <div className="flex justify-end mb-4">
              {editMode ? (
                <div className="flex gap-2">
                  <button 
                    onClick={saveChanges}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-center space-x-2"
                    title="Save Changes"
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save Changes</span>
                  </button>
                  <button 
                    onClick={toggleEditMode}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-center space-x-2"
                    title="Cancel Editing"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={toggleEditMode}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-center space-x-2"
                  title="Edit Content"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Content</span>
                </button>
              )}
            </div>
          )}

          <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
            {tempData.sectors.map((sector, index) => {
              const Icon = iconComponents[sector.icon] || Building2;
              return (
                <button
                  key={sector.id}
                  onClick={() => setActiveSector(index)}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-bold whitespace-nowrap transition-all duration-300 ${
                    activeSector === index
                      ? 'bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-[#7f8994] hover:bg-gray-200'
                  }`}
                >
                  <Icon size={24} />
                  <span>{sector.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sector Hero */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center space-x-3 mb-4">
                  {editMode ? (
                    <div 
                      className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                      onClick={() => editSimpleTextInModal(
                        currentSector.tagline, 
                        'Edit Tagline', 
                        'Update the sector tagline',
                        (value) => handleSectorChange(activeSector, 'tagline', value)
                      )}
                    >
                      {renderIcon(currentSector.icon, {
                        className: "text-[#f1601f]",
                        size: 48
                      })}
                    </div>
                  ) : (
                    renderIcon(currentSector.icon, {
                      className: "text-[#f1601f]",
                      size: 48
                    })
                  )}
                </div>
                {editMode ? (
                  <div 
                    className="cursor-pointer text-sm font-bold text-[#f1601f] tracking-wider uppercase mb-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                    onClick={() => editSimpleTextInModal(
                      currentSector.tagline, 
                      'Edit Tagline', 
                      'Update the sector tagline',
                      (value) => handleSectorChange(activeSector, 'tagline', value)
                    )}
                  >
                    {currentSector.tagline}
                  </div>
                ) : (
                  <div className="text-sm font-bold text-[#f1601f] tracking-wider uppercase mb-3">
                    {currentSector.tagline}
                  </div>
                )}
                
                {editMode ? (
                  <div 
                    className="cursor-pointer text-5xl md:text-6xl font-black text-[#0b1d34] mb-6 p-4 rounded-lg hover:bg-gray-100 transition-all duration-300"
                    onClick={() => editSimpleTextInModal(
                      currentSector.name, 
                      'Edit Sector Name', 
                      'Update the sector name',
                      (value) => handleSectorChange(activeSector, 'name', value)
                    )}
                  >
                    {currentSector.name}
                  </div>
                ) : (
                  <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mb-6">
                    {currentSector.name}
                  </h2>
                )}
                
                {editMode ? (
                  <div 
                    className="cursor-pointer text-xl text-[#7f8994] leading-relaxed p-4 rounded-lg hover:bg-gray-100 transition-all duration-300 border-2 border-dashed border-gray-300"
                    onClick={() => editTextInModal(
                      currentSector.description, 
                      'Edit Description', 
                      'Update the sector description',
                      (value) => handleSectorChange(activeSector, 'description', value)
                    )}
                  >
                    {currentSector.description}
                  </div>
                ) : (
                  <p className="text-xl text-[#7f8994] leading-relaxed">
                    {currentSector.description}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {currentSector.stats.map((stat, i) => (
                  <div 
                    key={i} 
                    className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#f1601f] hover:shadow-xl transition-all duration-300 relative"
                  >
                    {editMode && (
                      <div className="absolute -top-2 -right-2 flex gap-1">
                        <button 
                          onClick={() => editSimpleTextInModal(
                            stat.value, 
                            'Edit Stat Value', 
                            'Update the statistic value',
                            (value) => handleStatChange(activeSector, i, 'value', value)
                          )}
                          className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
                          title="Edit value"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => editSimpleTextInModal(
                            stat.label, 
                            'Edit Stat Label', 
                            'Update the statistic label',
                            (value) => handleStatChange(activeSector, i, 'label', value)
                          )}
                          className="bg-green-500 text-white rounded-full p-1 hover:bg-green-600 transition-colors"
                          title="Edit label"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <div className="text-4xl font-black text-[#f1601f] mb-2">{stat.value}</div>
                    <div className="text-sm font-semibold text-[#7f8994]">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-lg font-black text-[#0b1d34] mb-4">Certifications & Approvals</h3>
                <div className="flex flex-wrap gap-3">
                  {currentSector.certifications.map((cert, i) => (
                    <div 
                      key={i} 
                      className="flex items-center space-x-2 bg-gradient-to-r from-gray-50 to-white border border-gray-200 px-4 py-2 rounded-lg relative"
                    >
                      {editMode && (
                        <button 
                          onClick={() => editSimpleTextInModal(
                            cert, 
                            'Edit Certification', 
                            'Update the certification text',
                            (value) => handleCertificationChange(activeSector, i, value)
                          )}
                          className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
                          title="Edit certification"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      )}
                      <Award className="text-[#f1601f]" size={16} />
                      <span className="text-sm font-semibold text-[#7f8994]">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {uploadingImages[`${activeSector}-main`] ? (
                  <div className="w-full h-[600px] flex items-center justify-center bg-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                ) : (
                  <>
                    <img src={currentSector.image} alt={currentSector.name} className="w-full h-[600px] object-cover" />
                    {editMode && (
                      <button
                        onClick={() => fileInputRefs.current[`${activeSector}-main`]?.click()}
                        className="absolute top-4 left-4 bg-blue-500 text-white rounded-full p-2 z-10 hover:bg-blue-600 transition-colors"
                        title="Change sector image"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <input
                  type="file"
                  ref={el => fileInputRefs.current[`${activeSector}-main`] = el}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, activeSector, 'main')}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {editMode ? (
              <div 
                className="cursor-pointer p-4 rounded-lg hover:bg-gray-100 transition-all duration-300"
                onClick={() => editSimpleTextInModal(
                  `Our Services in ${currentSector.name}`, 
                  'Edit Services Title', 
                  'Update the services section title',
                  (value) => {} // You can add logic to update section titles if needed
                )}
              >
                <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mb-4">
                  Our Services in {currentSector.name}
                </h2>
              </div>
            ) : (
              <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mb-4">
                Our Services in {currentSector.name}
              </h2>
            )}
            <p className="text-xl text-[#7f8994] max-w-3xl mx-auto">
              Comprehensive solutions tailored to meet the unique demands of this sector
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {currentSector.services.map((service, i) => {
              const ServiceIcon = iconComponents[service.icon] || Building2;
              return (
                <div
                  key={i}
                  className="group relative bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-[#f1601f] hover:shadow-2xl transition-all duration-500"
                >
                  {editMode && (
                    <div className="absolute -top-2 -right-2 flex gap-1 z-10">
                      <button 
                        onClick={() => editSimpleTextInModal(
                          service.title, 
                          'Edit Service Title', 
                          'Update the service title',
                          (value) => handleServiceChange(activeSector, i, 'title', value)
                        )}
                        className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
                        title="Edit title"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => editTextInModal(
                          service.desc, 
                          'Edit Service Description', 
                          'Update the service description',
                          (value) => handleServiceChange(activeSector, i, 'desc', value)
                        )}
                        className="bg-green-500 text-white rounded-full p-1 hover:bg-green-600 transition-colors"
                        title="Edit description"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <ServiceIcon className="text-white" size={32} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-[#0b1d34] group-hover:text-white mb-4 transition-colors duration-500">
                      {service.title}
                    </h3>
                    
                    <p className="text-[#7f8994] group-hover:text-white/90 leading-relaxed transition-colors duration-500">
                      {service.desc}
                    </p>

                    <div className="mt-6 flex items-center space-x-2 text-[#f1601f] group-hover:text-white font-bold opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-sm">Learn More</span>
                      <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={18} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mb-4">
              Core Capabilities
            </h2>
            <p className="text-xl text-[#7f8994] max-w-3xl mx-auto">
              Technical expertise and specialized skills that drive project success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentSector.capabilities.map((capability, i) => (
              <div
                key={i}
                className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#f1601f] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative"
              >
                {editMode && (
                  <div className="absolute -top-2 -right-2 flex gap-1">
                    <button 
                      onClick={() => editSimpleTextInModal(
                        capability, 
                        'Edit Capability', 
                        'Update the capability text',
                        (value) => handleCapabilityChange(activeSector, i, value)
                      )}
                      className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
                      title="Edit capability"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => removeCapability(activeSector, i)}
                      className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Remove capability"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-[#f1601f] flex-shrink-0 mt-1" size={24} />
                  <span className="font-bold text-[#0b1d34]">{capability}</span>
                </div>
              </div>
            ))}
            {editMode && (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer min-h-[120px] p-6 hover:bg-gray-50 transition-all duration-300"
                onClick={() => addNewCapability(activeSector)}
              >
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-gray-500 text-sm font-medium">Add Capability</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-[#7f8994] max-w-3xl mx-auto">
              Recent successful projects in the {currentSector.name.toLowerCase()} sector
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {currentSector.projects.map((project, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-3xl p-8 hover:border-[#f1601f] hover:shadow-2xl transition-all duration-300 relative">
                {editMode && (
                  <div className="absolute -top-2 -right-2 flex gap-1">
                    <button 
                      onClick={() => editSimpleTextInModal(
                        project.name, 
                        'Edit Project Name', 
                        'Update the project name',
                        (value) => handleProjectChange(activeSector, i, 'name', value)
                      )}
                      className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
                      title="Edit project name"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => editSimpleTextInModal(
                        project.value, 
                        'Edit Project Value', 
                        'Update the project value',
                        (value) => handleProjectChange(activeSector, i, 'value', value)
                      )}
                      className="bg-green-500 text-white rounded-full p-1 hover:bg-green-600 transition-colors"
                      title="Edit project value"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between mb-6">
                  <div className={`px-4 py-2 rounded-full text-xs font-bold ${
                    project.status === 'Completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {project.status}
                  </div>
                  <div className="text-2xl font-black text-[#f1601f]">{project.value}</div>
                </div>
                
                <h3 className="text-xl font-black text-[#0b1d34] mb-4">{project.name}</h3>
                
                <div className="flex items-center space-x-2 text-[#f1601f] font-bold hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                  <span className="text-sm">View Project</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us for This Sector - NOW EDITABLE */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0b1d34] to-[#13344c] rounded-3xl overflow-hidden relative">
            {editMode && (
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button 
                  onClick={() => addNewWhyChooseUs(activeSector)}
                  className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors"
                  title="Add new feature"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="p-12">
                {editMode ? (
                  <div 
                    className="cursor-pointer text-4xl md:text-5xl font-black text-white mb-6 p-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                    onClick={() => editSimpleTextInModal(
                      `Why Choose RAWASY for ${currentSector.name}`, 
                      'Edit Section Title', 
                      'Update the section title',
                      (value) => {} // You can add logic to update section titles if needed
                    )}
                  >
                    Why Choose RAWASY for {currentSector.name}
                  </div>
                ) : (
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                    Why Choose RAWASY for {currentSector.name}
                  </h2>
                )}
                <div className="space-y-6">
                  {currentSector.whyChooseUs.map((item, i) => {
                    const ItemIcon = iconComponents[item.icon] || Award;
                    return (
                      <div key={i} className="flex items-start space-x-4 group relative">
                        {editMode && (
                          <div className="absolute -top-2 -right-2 flex gap-1 z-10">
                            <button 
                              onClick={() => editIconSelection(
                                item.icon,
                                'Select Icon',
                                (value) => handleWhyChooseUsChange(activeSector, i, 'icon', value)
                              )}
                              className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
                              title="Change icon"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => editSimpleTextInModal(
                                item.title, 
                                'Edit Feature Title', 
                                'Update the feature title',
                                (value) => handleWhyChooseUsChange(activeSector, i, 'title', value)
                              )}
                              className="bg-green-500 text-white rounded-full p-1 hover:bg-green-600 transition-colors"
                              title="Edit title"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => editTextInModal(
                                item.desc, 
                                'Edit Feature Description', 
                                'Update the feature description',
                                (value) => handleWhyChooseUsChange(activeSector, i, 'desc', value)
                              )}
                              className="bg-purple-500 text-white rounded-full p-1 hover:bg-purple-600 transition-colors"
                              title="Edit description"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => removeWhyChooseUs(activeSector, i)}
                              className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              title="Remove feature"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <div className="w-12 h-12 bg-[#f1601f] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <ItemIcon className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                          <p className="text-gray-300 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative h-full min-h-[500px]">
                <img 
                  src={currentSector.image} 
                  alt={currentSector.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#13344c]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Projects;