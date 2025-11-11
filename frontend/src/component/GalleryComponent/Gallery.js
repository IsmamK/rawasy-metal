"use client";
import { ArrowRight, Building2, Calendar, ChevronLeft, ChevronRight, Download, Factory, Filter, HardHat, MapPin, Package, Search, Settings, Share2, Users, Wrench, X, ZoomIn, Edit, Save, Plus, Trash2, Upload } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  const fileInputRefs = useRef({});

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/gallery/viewGallery/`;

  const categories = [
    { id: 'all', name: 'All Projects', icon: Building2, count: 156 },
    { id: 'metal-fabrication', name: 'Metal Fabrication', icon: Factory, count: 42 },
    { id: 'structural-steel', name: 'Structural Steel', icon: HardHat, count: 38 },
    { id: 'industrial-installation', name: 'Industrial Installation', icon: Settings, count: 28 },
    { id: 'mep-works', name: 'MEP Works', icon: Wrench, count: 24 },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench, count: 16 },
    { id: 'trading-supply', name: 'Trading & Supply', icon: Package, count: 8 }
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
        if (!response.ok) throw new Error("Failed to fetch gallery");
        const jsonData = await response.json();
        setTempData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching gallery:", error);
        // Fallback to default data if API fails
        const defaultData = {
          projects: [
            {
              id: 1,
              title: "Steel Structure Manufacturing",
              category: 'metal-fabrication',
              location: "Dubai Industrial City",
              year: "2023",
              client: "Emirates Steel",
              description: "Precision fabrication of structural steel components for industrial facility expansion",
              images: [
                "https://images.unsplash.com/photo-1565717791661-a8d9edab7c8c?w=1200&h=800&fit=crop",
                "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop",
                "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"
              ],
              features: ["CNC Cutting", "Laser Welding", "Quality Testing", "Custom Fabrication"]
            },
            {
              id: 2,
              title: "Oil & Gas Pipeline Support",
              category: 'structural-steel',
              location: "Abu Dhabi",
              year: "2023",
              client: "ADNOC",
              description: "Heavy-duty structural steel supports for offshore pipeline infrastructure",
              images: [
                "https://images.unsplash.com/photo-1613843661100-3ec9e97a80bc?w=1200&h=800&fit=crop",
                "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"
              ],
              features: ["Marine Grade Steel", "Corrosion Protection", "Heavy Load Capacity"]
            }
          ]
        };
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
    
    setEditMode(!editMode);
  };

  // Handle text changes
  const handleTextChange = (projectId, field, value) => {
    setTempData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === projectId ? { ...project, [field]: value } : project
      )
    }));
  };

  // Handle category change
  const handleCategoryChange = async (projectId, currentCategory) => {
    const { value: newCategory } = await Swal.fire({
      title: 'Change Project Category',
      input: 'select',
      inputOptions: categories.reduce((options, cat) => {
        if (cat.id !== 'all') {
          options[cat.id] = cat.name;
        }
        return options;
      }, {}),
      inputValue: currentCategory,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update Category',
      cancelButtonText: 'Cancel'
    });

    if (newCategory) {
      handleTextChange(projectId, 'category', newCategory);
    }
  };

  // Handle array field changes
  const handleArrayFieldChange = (projectId, field, index, value) => {
    setTempData(prev => ({
      ...prev,
      projects: prev.projects.map(project => {
        if (project.id === projectId) {
          const newArray = [...project[field]];
          newArray[index] = value;
          return { ...project, [field]: newArray };
        }
        return project;
      })
    }));
  };

  // Add new item to array field
  const addArrayItem = (projectId, field) => {
    setTempData(prev => ({
      ...prev,
      projects: prev.projects.map(project => {
        if (project.id === projectId) {
          return { 
            ...project, 
            [field]: [...project[field], `New ${field} item`] 
          };
        }
        return project;
      })
    }));
  };

  // Remove item from array field
  const removeArrayItem = async (projectId, field, index) => {
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
        projects: prev.projects.map(project => {
          if (project.id === projectId) {
            const newArray = project[field].filter((_, i) => i !== index);
            return { ...project, [field]: newArray };
          }
          return project;
        })
      }));
    }
  };

  // Handle image upload for project
  const handleProjectImageUpload = async (projectId, imageIndex, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication required for image upload");
      return;
    }

    const uploadKey = `${projectId}-${imageIndex}`;
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "gallery-image");

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
      
      // Update the specific image in the project
      setTempData(prev => ({
        ...prev,
        projects: prev.projects.map(project => {
          if (project.id === projectId) {
            const newImages = [...project.images];
            newImages[imageIndex] = result.image;
            return { ...project, images: newImages };
          }
          return project;
        })
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed");
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  // Add new image to project
  const addNewImageToProject = (projectId) => {
    setTempData(prev => ({
      ...prev,
      projects: prev.projects.map(project => {
        if (project.id === projectId) {
          return { 
            ...project, 
            images: [...project.images, "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"] 
          };
        }
        return project;
      })
    }));
  };

  // Remove image from project
  const removeImageFromProject = async (projectId, imageIndex) => {
    const project = tempData.projects.find(p => p.id === projectId);
    if (project.images.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'Project must have at least one image',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This image will be removed permanently!',
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
        projects: prev.projects.map(project => {
          if (project.id === projectId) {
            const newImages = project.images.filter((_, i) => i !== imageIndex);
            return { ...project, images: newImages };
          }
          return project;
        })
      }));
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
      text: 'All gallery modifications will be updated on the website.',
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
        method: "PUT",
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
        text: 'Gallery changes saved successfully!',
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

  // Add new project
  const addNewProject = () => {
    const categoryToUse = selectedCategory === 'all' ? 'metal-fabrication' : selectedCategory;
    
    const newProject = {
      id: Date.now(), // Temporary ID
      title: "New Gallery Project",
      category: categoryToUse,
      location: "Location",
      year: "2024",
      client: "Client Name",
      description: "Project description",
      images: [
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop"
      ],
      features: ["Feature 1", "Feature 2"]
    };

    setTempData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  // Delete project
  const deleteProject = async (projectId) => {
    const result = await Swal.fire({
      title: 'Delete Project?',
      text: 'This project will be removed permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setTempData(prev => ({
        ...prev,
        projects: prev.projects.filter(project => project.id !== projectId)
      }));
      
      Swal.fire({
        title: 'Deleted!',
        text: 'Project has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Edit text in modal
  const editTextInModal = async (projectId, field, currentValue, title, description) => {
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
      handleTextChange(projectId, field, newValue);
    }
  };

  // Edit array item in modal
  const editArrayItemInModal = async (projectId, field, index, currentValue, title) => {
    const { value: newValue } = await Swal.fire({
      title: title,
      input: 'text',
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
      handleArrayFieldChange(projectId, field, index, newValue);
    }
  };

  const handleImageLoad = (imageId) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
  };

  const nextImage = () => {
    if (selectedImage) {
      const currentProject = tempData.projects.find(p => p.id === selectedImage.projectId);
      const currentIndex = currentProject.images.findIndex(img => img === selectedImage.src);
      const nextIndex = (currentIndex + 1) % currentProject.images.length;
      setSelectedImage({
        ...selectedImage,
        src: currentProject.images[nextIndex],
        imageIndex: nextIndex
      });
    }
  };

  const prevImage = () => {
    if (selectedImage) {
      const currentProject = tempData.projects.find(p => p.id === selectedImage.projectId);
      const currentIndex = currentProject.images.findIndex(img => img === selectedImage.src);
      const prevIndex = (currentIndex - 1 + currentProject.images.length) % currentProject.images.length;
      setSelectedImage({
        ...selectedImage,
        src: currentProject.images[prevIndex],
        imageIndex: prevIndex
      });
    }
  };

  const filteredProjects = tempData?.projects?.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7f8994]" size={20} />
              <input
                type="text"
                placeholder="Search projects, locations, clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#f1601f] focus:outline-none transition-colors duration-300 font-medium"
              />
            </div>

            {/* Category Filter - Desktop */}
            <div className="hidden lg:flex items-center space-x-3 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-bold transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white shadow-lg'
                      : 'bg-gray-100 text-[#7f8994] hover:bg-gray-200'
                  }`}
                >
                  <cat.icon size={18} />
                  <span>{cat.name}</span>
                  <span className="text-xs opacity-80">({cat.count})</span>
                </button>
              ))}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white rounded-xl font-bold"
            >
              <Filter size={20} />
              <span>Filter by Category</span>
            </button>
          </div>

          {/* Mobile Filter Dropdown */}
          {isFilterOpen && (
            <div className="lg:hidden mt-4 bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-4 space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-xl font-bold transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white'
                      : 'bg-gray-50 text-[#7f8994] hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <cat.icon size={20} />
                    <span>{cat.name}</span>
                  </div>
                  <span className="text-sm opacity-80">{cat.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Edit Button INSIDE the section */}
          <div className="mb-12 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black text-[#0b1d34] mb-2">
                {selectedCategory === 'all' ? 'All Projects' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-[#7f8994]">Showing {filteredProjects.length} projects with {filteredProjects.reduce((acc, proj) => acc + proj.images.length, 0)} images</p>
            </div>

            {/* Edit Mode Toggle Button INSIDE the section */}
            {localStorage.getItem("authToken") && (
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <button 
                      onClick={saveChanges}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all duration-300"
                      title="Save Changes"
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      <span>Save</span>
                    </button>
                    <button 
                      onClick={toggleEditMode}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all duration-300"
                      title="Cancel Editing"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancel</span>
                    </button>
                    <button 
                      onClick={addNewProject}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all duration-300"
                      title="Add New Project"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Project</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={toggleEditMode}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all duration-300"
                    title="Edit Gallery"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit Gallery</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Edit Mode Indicator */}
          {editMode && (
            <div className="mb-6 bg-yellow-500 text-black px-4 py-3 rounded-xl text-center font-bold">
              EDIT MODE ENABLED - Click on any content to edit
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, i) => (
              <div
                key={project.id}
                className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  editMode ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                {/* Delete Project Button */}
                {editMode && (
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="absolute top-4 left-4 z-20 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Project Images */}
                <div className="relative h-80 overflow-hidden">
                  {uploadingImages[`${project.id}-0`] ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onLoad={() => handleImageLoad(`${project.id}-0`)}
                      />
                      {editMode && (
                        <button
                          onClick={() => fileInputRefs.current[`${project.id}-0`]?.click()}
                          className="absolute top-4 right-16 z-20 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                          title="Change Image"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      )}
                      <input
                        type="file"
                        ref={el => fileInputRefs.current[`${project.id}-0`] = el}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleProjectImageUpload(project.id, 0, e)}
                      />
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Image Count Badge */}
                  {project.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-bold">
                      +{project.images.length - 1}
                    </div>
                  )}

                  {/* Category Badge - EDITABLE */}
                  <div className="absolute top-4 left-4">
                    <span 
                      onClick={editMode ? () => handleCategoryChange(project.id, project.category) : undefined}
                      className={`bg-[#f1601f] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                        editMode ? 'cursor-pointer border-2 border-dashed border-yellow-400' : ''
                      }`}
                    >
                      {categories.find(c => c.id === project.category)?.name}
                    </span>
                  </div>

                  {/* Zoom Button */}
                  <button
                    onClick={() => !editMode && setSelectedImage({
                      src: project.images[0],
                      projectId: project.id,
                      project: project,
                      imageIndex: 0
                    })}
                    className="absolute top-4 right-16 bg-black/80 text-white p-2 rounded-full hover:bg-[#f1601f] transition-colors duration-300"
                  >
                    <ZoomIn size={16} />
                  </button>

                  {/* Project Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 
                      onClick={editMode ? () => editTextInModal(project.id, 'title', project.title, 'Edit Title', 'Update project title') : undefined}
                      className={`text-xl font-black text-white mb-2 group-hover:text-[#f1601f] transition-colors duration-300 ${
                        editMode ? 'cursor-pointer bg-yellow-500/30 rounded px-2 py-1' : ''
                      }`}
                    >
                      {project.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-white/90 text-sm">
                      <MapPin size={14} />
                      <span 
                        onClick={editMode ? () => editTextInModal(project.id, 'location', project.location, 'Edit Location', 'Update project location') : undefined}
                        className={editMode ? 'cursor-pointer bg-yellow-500/30 rounded px-1' : ''}
                      >
                        {project.location}
                      </span>
                      <Calendar size={14} />
                      <span 
                        onClick={editMode ? () => editTextInModal(project.id, 'year', project.year, 'Edit Year', 'Update project year') : undefined}
                        className={editMode ? 'cursor-pointer bg-yellow-500/30 rounded px-1' : ''}
                      >
                        {project.year}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6">
                  <p 
                    onClick={editMode ? () => editTextInModal(project.id, 'description', project.description, 'Edit Description', 'Update project description') : undefined}
                    className={`text-[#7f8994] text-sm leading-relaxed mb-4 ${
                      editMode ? 'cursor-pointer bg-yellow-100 rounded px-3 py-2' : ''
                    }`}
                  >
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-[#7f8994]">
                      <Users size={16} />
                      <span 
                        onClick={editMode ? () => editTextInModal(project.id, 'client', project.client, 'Edit Client', 'Update client name') : undefined}
                        className={`font-medium ${
                          editMode ? 'cursor-pointer bg-yellow-100 rounded px-2 py-1' : ''
                        }`}
                      >
                        {project.client}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.features.map((feature, j) => (
                      <span
                        key={j}
                        onClick={editMode ? () => editArrayItemInModal(project.id, 'features', j, feature, 'Edit Feature') : undefined}
                        className={`bg-gray-100 text-[#7f8994] px-3 py-1 rounded-full text-xs font-medium ${
                          editMode ? 'cursor-pointer bg-yellow-100' : ''
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                    {editMode && (
                      <button
                        onClick={() => addArrayItem(project.id, 'features')}
                        className="bg-green-500 text-white p-1 rounded-full text-xs"
                        title="Add Feature"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* View Gallery Button */}
                  <button
                    onClick={() => !editMode && setSelectedImage({
                      src: project.images[0],
                      projectId: project.id,
                      project: project,
                      imageIndex: 0
                    })}
                    className="w-full bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <span>View Gallery</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-[#7f8994]" size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#0b1d34] mb-3">No Projects Found</h3>
              <p className="text-[#7f8994] mb-8">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col">
            
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/80 rounded-full flex items-center justify-center hover:bg-[#f1601f] transition-colors duration-300"
            >
              <X className="text-white" size={24} />
            </button>

            {/* Edit Button in Modal */}
            {editMode && (
              <button
                onClick={() => {
                  const project = tempData.projects.find(p => p.id === selectedImage.projectId);
                  editTextInModal(selectedImage.projectId, 'title', project.title, 'Edit Title', 'Update project title');
                }}
                className="absolute top-4 left-4 z-10 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                title="Edit Project Details"
              >
                <Edit className="text-white" size={20} />
              </button>
            )}
            
            {selectedImage.project.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 rounded-full flex items-center justify-center hover:bg-[#f1601f] transition-colors duration-300"
                >
                  <ChevronLeft className="text-white" size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 rounded-full flex items-center justify-center hover:bg-[#f1601f] transition-colors duration-300"
                >
                  <ChevronRight className="text-white" size={24} />
                </button>
              </>
            )}

            {/* Image Display with Edit Options */}
            <div className="flex-1 flex items-center justify-center relative">
              {editMode && (
                <div className="absolute top-4 right-20 z-10 flex gap-2">
                  <button
                    onClick={() => fileInputRefs.current[`modal-${selectedImage.projectId}-${selectedImage.imageIndex}`]?.click()}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                    title="Change Image"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeImageFromProject(selectedImage.projectId, selectedImage.imageIndex)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="Remove Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => addNewImageToProject(selectedImage.projectId)}
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                    title="Add Image"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <input
                    type="file"
                    ref={el => fileInputRefs.current[`modal-${selectedImage.projectId}-${selectedImage.imageIndex}`] = el}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleProjectImageUpload(selectedImage.projectId, selectedImage.imageIndex, e)}
                  />
                </div>
              )}
              <img
                src={selectedImage.src}
                alt={selectedImage.project.title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-b-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 
                    onClick={editMode ? () => editTextInModal(selectedImage.projectId, 'title', selectedImage.project.title, 'Edit Title', 'Update project title') : undefined}
                    className={`text-2xl font-black text-[#0b1d34] mb-2 ${
                      editMode ? 'cursor-pointer bg-yellow-100 rounded px-3 py-2' : ''
                    }`}
                  >
                    {selectedImage.project.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-[#7f8994]">
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span 
                        onClick={editMode ? () => editTextInModal(selectedImage.projectId, 'location', selectedImage.project.location, 'Edit Location', 'Update project location') : undefined}
                        className={editMode ? 'cursor-pointer bg-yellow-100 rounded px-1' : ''}
                      >
                        {selectedImage.project.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span 
                        onClick={editMode ? () => editTextInModal(selectedImage.projectId, 'year', selectedImage.project.year, 'Edit Year', 'Update project year') : undefined}
                        className={editMode ? 'cursor-pointer bg-yellow-100 rounded px-1' : ''}
                      >
                        {selectedImage.project.year}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span 
                        onClick={editMode ? () => editTextInModal(selectedImage.projectId, 'client', selectedImage.project.client, 'Edit Client', 'Update client name') : undefined}
                        className={editMode ? 'cursor-pointer bg-yellow-100 rounded px-1' : ''}
                      >
                        {selectedImage.project.client}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span 
                    onClick={editMode ? () => handleCategoryChange(selectedImage.projectId, selectedImage.project.category) : undefined}
                    className={`bg-[#f1601f] text-white px-3 py-1 rounded-full text-sm font-bold ${
                      editMode ? 'cursor-pointer border-2 border-dashed border-yellow-400' : ''
                    }`}
                  >
                    {categories.find(c => c.id === selectedImage.project.category)?.name}
                  </span>
                </div>
              </div>

              <p 
                onClick={editMode ? () => editTextInModal(selectedImage.projectId, 'description', selectedImage.project.description, 'Edit Description', 'Update project description') : undefined}
                className={`text-gray-600 mb-4 ${
                  editMode ? 'cursor-pointer bg-yellow-100 rounded px-3 py-2' : ''
                }`}
              >
                {selectedImage.project.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Image {selectedImage.imageIndex + 1} of {selectedImage.project.images.length}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                    <Download size={16} />
                    <span className="text-sm font-medium">Download</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                    <Share2 size={16} />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;