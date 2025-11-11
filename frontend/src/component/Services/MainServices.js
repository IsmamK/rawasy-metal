"use client";
import { CheckCircle, Edit, Save, X, Upload, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

const MainServices = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  
  const fileInputRefs = useRef({});

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/services/main-services/`;

  // Icons import
  const icons = {
    Building2: require('lucide-react').Building2,
    HardHat: require('lucide-react').HardHat,
    Users: require('lucide-react').Users,
    Wrench: require('lucide-react').Wrench,
    Briefcase: require('lucide-react').Briefcase,
    Factory: require('lucide-react').Factory,
    Zap: require('lucide-react').Zap,
    Shield: require('lucide-react').Shield,
    Award: require('lucide-react').Award,
    ArrowRight: require('lucide-react').ArrowRight,
    Target: require('lucide-react').Target,
    Hammer: require('lucide-react').Hammer,
    Lightbulb: require('lucide-react').Lightbulb,
    Settings: require('lucide-react').Settings,
    Package: require('lucide-react').Package,
    Truck: require('lucide-react').Truck,
    ClipboardCheck: require('lucide-react').ClipboardCheck,
    PenTool: require('lucide-react').PenTool,
    Cpu: require('lucide-react').Cpu,
    Sparkles: require('lucide-react').Sparkles,
    TrendingUp: require('lucide-react').TrendingUp,
    Clock: require('lucide-react').Clock,
    Globe: require('lucide-react').Globe,
    Phone: require('lucide-react').Phone,
    Mail: require('lucide-react').Mail,
    CheckCircle: require('lucide-react').CheckCircle
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = (window.scrollY / documentHeight) * 100;
      setScrollProgress(scrolled);

      const sections = document.querySelectorAll('.fade-section');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < windowHeight * 0.8) {
          setVisibleSections(prev => new Set([...prev, section.id]));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
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
          title: "Comprehensive Construction & Industrial Solutions",
          subtitle: "Core Capabilities",
          description: "Six decades of combined expertise delivering excellence across every facet of construction and industrial services",
          services: [
            {
              id: 'general-contracting',
              icon: 'Building2',
              title: "General Contracting",
              tagline: "Building Excellence, Delivering Quality",
              description: "As a Grade 1 licensed general contractor, RAWASY delivers comprehensive construction solutions for projects of any scale and complexity across the Gulf region.",
              color: "from-[#f1601f] to-[#7f3e2c]",
              image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop",
              capabilities: [
                {
                  icon: 'Building2',
                  title: "Commercial Construction",
                  desc: "Office buildings, retail spaces, shopping malls, and mixed-use developments"
                },
                {
                  icon: 'Factory',
                  title: "Industrial Facilities",
                  desc: "Manufacturing plants, warehouses, distribution centers, and processing facilities"
                },
                {
                  icon: 'Hammer',
                  title: "Infrastructure Projects",
                  desc: "Roads, bridges, utilities, and civil engineering works"
                },
                {
                  icon: 'Target',
                  title: "Turnkey Solutions",
                  desc: "Complete project delivery from design to handover with single-point responsibility"
                }
              ],
              features: [
                "Grade 1 Contractor License",
                "ISO 9001:2015 Quality Management",
                "Advanced Project Management",
                "Value Engineering Solutions",
                "BIM Implementation",
                "Safety Excellence (OHSAS 18001)"
              ]
            },
            {
              id: 'civil-mep',
              icon: 'Settings',
              title: "Civil & MEP Works",
              tagline: "Engineering Solutions for Modern Infrastructure",
              description: "Comprehensive mechanical, electrical, and plumbing installations combined with civil engineering expertise to create fully integrated building systems.",
              color: "from-[#0b1d34] to-[#13344c]",
              image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&h=800&fit=crop",
              capabilities: [
                {
                  icon: 'Zap',
                  title: "Electrical Systems",
                  desc: "Complete power distribution, lighting systems, and automation controls"
                },
                {
                  icon: 'Settings',
                  title: "Mechanical Systems",
                  desc: "HVAC installations, ventilation, and climate control solutions"
                },
                {
                  icon: 'Wrench',
                  title: "Plumbing & Drainage",
                  desc: "Water supply networks, sanitary systems, and drainage infrastructure"
                },
                {
                  icon: 'Shield',
                  title: "Fire Protection",
                  desc: "Fire detection, suppression systems, and emergency safety installations"
                }
              ],
              features: [
                "Certified MEP Engineers",
                "Energy-Efficient Designs",
                "Preventive Maintenance Plans",
                "24/7 Emergency Support",
                "Smart Building Integration",
                "Code Compliance Assurance"
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

  // Handle service changes
  const handleServiceChange = (serviceIndex, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.services[serviceIndex][field] = value;
      return newData;
    });
  };

  // Handle capability changes
  const handleCapabilityChange = (serviceIndex, capabilityIndex, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.services[serviceIndex].capabilities[capabilityIndex][field] = value;
      return newData;
    });
  };

  // Handle feature changes
  const handleFeatureChange = (serviceIndex, featureIndex, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.services[serviceIndex].features[featureIndex] = value;
      return newData;
    });
  };

  // Add new service
  const addNewService = () => {
    const newService = {
      id: `service-${Date.now()}`,
      icon: 'Building2',
      title: "New Service",
      tagline: "Service tagline",
      description: "Service description",
      color: "from-[#f1601f] to-[#7f3e2c]",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop",
      capabilities: [
        {
          icon: 'Building2',
          title: "Capability 1",
          desc: "Capability description"
        }
      ],
      features: ["Feature 1", "Feature 2"]
    };
    
    setTempData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  };

  // Remove service with confirmation
  const removeService = async (serviceIndex) => {
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
        services: prev.services.filter((_, i) => i !== serviceIndex)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Service has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Add capability to service
  const addCapability = (serviceIndex) => {
    const newCapability = {
      icon: 'Building2',
      title: "New Capability",
      desc: "Capability description"
    };
    
    setTempData(prev => {
      const newData = {...prev};
      newData.services[serviceIndex].capabilities.push(newCapability);
      return newData;
    });
  };

  // Remove capability
  const removeCapability = async (serviceIndex, capabilityIndex) => {
    if (tempData.services[serviceIndex].capabilities.length <= 1) {
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
      text: 'This capability will be removed!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setTempData(prev => {
        const newData = {...prev};
        newData.services[serviceIndex].capabilities = newData.services[serviceIndex].capabilities.filter((_, i) => i !== capabilityIndex);
        return newData;
      });
    }
  };

  // Add feature to service
  const addFeature = (serviceIndex) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.services[serviceIndex].features.push("New Feature");
      return newData;
    });
  };

  // Remove feature
  const removeFeature = async (serviceIndex, featureIndex) => {
    if (tempData.services[serviceIndex].features.length <= 1) {
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
      text: 'This feature will be removed!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setTempData(prev => {
        const newData = {...prev};
        newData.services[serviceIndex].features = newData.services[serviceIndex].features.filter((_, i) => i !== featureIndex);
        return newData;
      });
    }
  };

  // Handle service image upload
  const handleServiceImageUpload = async (serviceIndex, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication required for image upload");
      return;
    }

    setUploadingImages(prev => ({ ...prev, [serviceIndex]: true }));

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", `service-${serviceIndex}`);

    try {
      const response = await fetch(`${API_BASE}/images/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`
        },
        body: formData
      });

      if (!response.ok) throw new Error("Service image upload failed");

      const result = await response.json();
      handleServiceChange(serviceIndex, "image", result.image);
    } catch (error) {
      console.error("Error uploading service image:", error);
      alert("Service image upload failed");
    } finally {
      setUploadingImages(prev => ({ ...prev, [serviceIndex]: false }));
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

  // Edit service in modal
  const editServiceInModal = async (serviceIndex, currentService) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Service Details',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Service Title" value="${currentService.title}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Tagline" value="${currentService.tagline}">` +
        `<textarea id="swal-input3" class="swal2-textarea" placeholder="Description">${currentService.description}</textarea>` +
        `<input id="swal-input4" class="swal2-input" placeholder="Color Gradient (from-[color] to-[color])" value="${currentService.color}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          title: document.getElementById('swal-input1').value,
          tagline: document.getElementById('swal-input2').value,
          description: document.getElementById('swal-input3').value,
          color: document.getElementById('swal-input4').value
        };
      }
    });

    if (formValues) {
      handleServiceChange(serviceIndex, 'title', formValues.title);
      handleServiceChange(serviceIndex, 'tagline', formValues.tagline);
      handleServiceChange(serviceIndex, 'description', formValues.description);
      handleServiceChange(serviceIndex, 'color', formValues.color);
    }
  };

  // Edit capability in modal
  const editCapabilityInModal = async (serviceIndex, capabilityIndex, currentCapability) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Capability',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Capability Title" value="${currentCapability.title}">` +
        `<textarea id="swal-input2" class="swal2-textarea" placeholder="Description">${currentCapability.desc}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          title: document.getElementById('swal-input1').value,
          desc: document.getElementById('swal-input2').value
        };
      }
    });

    if (formValues) {
      handleCapabilityChange(serviceIndex, capabilityIndex, 'title', formValues.title);
      handleCapabilityChange(serviceIndex, capabilityIndex, 'desc', formValues.desc);
    }
  };

  // Edit feature in modal
  const editFeatureInModal = async (serviceIndex, featureIndex, currentFeature) => {
    const { value: newValue } = await Swal.fire({
      title: 'Edit Feature',
      input: 'text',
      inputLabel: 'Feature Text',
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
      handleFeatureChange(serviceIndex, featureIndex, newValue);
    }
  };

  // Render icon component
  const renderIcon = (iconName, props = {}) => {
    const IconComponent = icons[iconName];
    if (!IconComponent) return <icons.Building2 {...props} />;
    return <IconComponent {...props} />;
  };

  if (isLoading) {
    return (
      <section className="py-32 bg-gradient-to-b from-white to-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-32 bg-gradient-to-b from-white to-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load services. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="main-services" className="py-32 bg-gradient-to-b from-white to-gray-50 relative">
        {/* Edit Mode Toggle Button */}
        {localStorage.getItem("authToken") && (
          <div className="fixed top-20 right-4 z-50">
            {editMode ? (
              <div className="flex gap-2">
                <button 
                  onClick={saveChanges}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
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
                  className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg"
                  title="Cancel Editing"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={toggleEditMode}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
                title="Edit Content"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Edit Mode Overlay Indicator */}
        {editMode && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold z-50">
            EDIT MODE ENABLED - Click on any content to edit
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-20 fade-section" id="services-intro">
            {editMode ? (
              <>
                <div 
                  onClick={() => editTextInModal('subtitle', tempData.subtitle, 'Edit Subtitle', 'Update the subtitle text')}
                  className="cursor-pointer inline-block bg-white/80 backdrop-blur-sm border-2 border-dashed border-orange-300 rounded-lg px-4 py-2 mb-4 hover:bg-white transition-all duration-300"
                >
                  <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                    {tempData.subtitle}
                  </span>
                </div>
                <div 
                  onClick={() => editTextInModal('title', tempData.title, 'Edit Main Title', 'Update the main title text')}
                  className="cursor-pointer bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 hover:bg-white transition-all duration-300"
                >
                  <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34]">
                    {tempData.title}
                  </h2>
                </div>
                <div 
                  onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text')}
                  className="cursor-pointer bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-lg p-4 max-w-3xl mx-auto hover:bg-white transition-all duration-300"
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

          {/* Services List */}
          <div className="space-y-32">
            {tempData.services.map((service, index) => (
              <div 
                key={service.id}
                id={service.id}
                className={`fade-section ${visibleSections.has(service.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-1000 relative`}
              >
                {/* Service Delete Button */}
                {editMode && (
                  <button
                    onClick={() => removeService(index)}
                    className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 z-10 hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove this service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Content Side */}
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    {/* Service Icon and Title */}
                    <div className="inline-block mb-6">
                      <div 
                        onClick={editMode ? () => editServiceInModal(index, service) : undefined}
                        className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-300 ${editMode ? 'cursor-pointer ring-4 ring-yellow-400' : ''}`}
                      >
                        {renderIcon(service.icon, { className: "text-white", size: 40 })}
                      </div>
                    </div>

                    {editMode ? (
                      <>
                        <div 
                          onClick={() => editServiceInModal(index, service)}
                          className="cursor-pointer bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 hover:bg-white transition-all duration-300"
                        >
                          <h3 className="text-4xl md:text-5xl font-black text-[#0b1d34]">
                            {service.title}
                          </h3>
                        </div>
                        <div 
                          onClick={() => editServiceInModal(index, service)}
                          className="cursor-pointer bg-white/80 backdrop-blur-sm border-2 border-dashed border-orange-300 rounded-lg p-3 mb-6 hover:bg-white transition-all duration-300"
                        >
                          <p className="text-[#f1601f] font-bold text-lg">
                            {service.tagline}
                          </p>
                        </div>
                        <div 
                          onClick={() => editServiceInModal(index, service)}
                          className="cursor-pointer bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-lg p-4 mb-8 hover:bg-white transition-all duration-300"
                        >
                          <p className="text-xl text-gray-600 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-4xl md:text-5xl font-black text-[#0b1d34] mb-4">
                          {service.title}
                        </h3>
                        <p className="text-[#f1601f] font-bold text-lg mb-6">
                          {service.tagline}
                        </p>
                        <p className="text-xl text-gray-600 leading-relaxed mb-8">
                          {service.description}
                        </p>
                      </>
                    )}

                    {/* Capabilities Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      {service.capabilities.map((capability, capIndex) => (
                        <div 
                          key={capIndex}
                          onClick={editMode ? () => editCapabilityInModal(index, capIndex, capability) : undefined}
                          className={`bg-white border-2 ${editMode ? 'border-dashed border-yellow-400 cursor-pointer' : 'border-gray-100'} rounded-xl p-5 hover:border-[#f1601f] hover:shadow-lg transition-all duration-300 group relative`}
                        >
                          {/* Capability Delete Button */}
                          {editMode && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCapability(index, capIndex);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                              title="Remove this capability"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}

                          {renderIcon(capability.icon, { 
                            className: "text-[#f1601f] mb-3 group-hover:scale-110 transition-transform duration-300", 
                            size: 28 
                          })}
                          <h4 className="font-bold text-[#0b1d34] mb-2">{capability.title}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{capability.desc}</p>
                        </div>
                      ))}
                      
                      {/* Add Capability Button */}
                      {editMode && (
                        <div 
                          className="border-2 border-dashed border-gray-300 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer min-h-[140px] hover:border-[#f1601f] hover:bg-gray-50 transition-all duration-300"
                          onClick={() => addCapability(index)}
                        >
                          <Plus className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-gray-500 text-sm font-medium">Add Capability</span>
                        </div>
                      )}
                    </div>

                    {/* Features Section */}
                    <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-8">
                      <h4 className="font-black text-lg text-[#0b1d34] mb-4 flex items-center">
                        <CheckCircle className="text-[#f1601f] mr-3" size={24} />
                        Key Features
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {service.features.map((feature, featureIndex) => (
                          <div 
                            key={featureIndex}
                            onClick={editMode ? () => editFeatureInModal(index, featureIndex, feature) : undefined}
                            className={`flex items-center space-x-2 ${editMode ? 'cursor-pointer bg-white/80 rounded p-2 hover:bg-white' : ''}`}
                          >
                            <div className="w-2 h-2 bg-[#f1601f] rounded-full flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                            
                            {/* Feature Delete Button */}
                            {editMode && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFeature(index, featureIndex);
                                }}
                                className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                                title="Remove this feature"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                        
                        {/* Add Feature Button */}
                        {editMode && (
                          <div 
                            className="flex items-center space-x-2 cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={() => addFeature(index)}
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-sm">Add Feature</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image Side */}
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="relative group">
                      <div className={`absolute -inset-4 bg-gradient-to-br ${service.color} rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                        {editMode ? (
                          <>
                            {uploadingImages[index] ? (
                              <div className="w-full h-[600px] flex items-center justify-center bg-gray-200">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                              </div>
                            ) : (
                              <>
                                <img 
                                  src={service.image} 
                                  alt={service.title}
                                  className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <button
                                  onClick={() => fileInputRefs.current[`service-${index}`]?.click()}
                                  className="absolute top-4 right-4 bg-blue-500 text-white rounded-full p-2 z-10 hover:bg-blue-600 transition-colors"
                                  title="Change service image"
                                >
                                  <Upload className="w-4 h-4" />
                                </button>
                                <input
                                  type="file"
                                  ref={el => fileInputRefs.current[`service-${index}`] = el}
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleServiceImageUpload(index, e)}
                                />
                              </>
                            )}
                          </>
                        ) : (
                          <img 
                            src={service.image} 
                            alt={service.title}
                            className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8">
                          <div className={`inline-block bg-gradient-to-r ${service.color} text-white px-6 py-3 rounded-xl font-bold mb-4`}>
                            Premium Service
                          </div>
                          <h4 className="text-3xl font-black text-white">{service.title}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add New Service Button */}
            {editMode && (
              <div className="text-center">
                <button
                  onClick={addNewService}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center space-x-3 transition-all duration-300 shadow-lg"
                >
                  <Plus className="w-6 h-6" />
                  <span>Add New Service</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MainServices;