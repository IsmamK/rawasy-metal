"use client";
import { ArrowRight, Award, Building2, Calendar, CheckCircle, Droplets, Factory, Filter, Home, Hospital, MapPin, Search, TrendingUp, Users, X, Edit, Save, Plus, Trash2, Upload } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  const fileInputRefs = useRef({});

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/projects/show-projects/`;

  const categories = [
    { id: 'all', name: 'All Projects', icon: Building2, count: 800 },
    { id: 'oil-gas', name: 'Oil & Gas', icon: Droplets, count: 150 },
    { id: 'infrastructure', name: 'Infrastructure', icon: TrendingUp, count: 200 },
    { id: 'commercial', name: 'Commercial', icon: Building2, count: 250 },
    { id: 'industrial', name: 'Industrial', icon: Factory, count: 180 },
    { id: 'residential', name: 'Residential', icon: Home, count: 120 },
    { id: 'healthcare', name: 'Healthcare', icon: Hospital, count: 90 }
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
        if (!response.ok) throw new Error("Failed to fetch projects");
        const jsonData = await response.json();
        setTempData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Fallback to default data if API fails
        const defaultData = {
          projects: [
            {
              id: 1,
              title: "Al Ruwais Refinery Expansion",
              category: 'oil-gas',
              location: "Abu Dhabi, UAE",
              year: "2022-2023",
              client: "ADNOC",
              value: "$45M",
              duration: "18 months",
              image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=800&fit=crop",
              description: "Major expansion project for crude oil processing facility including new storage tanks, pipeline networks, and advanced safety systems.",
              scope: ["Civil & Structural Works", "MEP Installation", "Process Equipment", "Safety Systems"],
              challenges: "Working in operational refinery environment with strict safety protocols",
              solution: "Implemented phased execution with zero downtime to existing operations",
              results: ["Increased capacity by 30%", "Zero safety incidents", "Completed 2 weeks ahead of schedule"]
            },
            {
              id: 2,
              title: "Sheikh Zayed Highway Bridge",
              category: 'infrastructure',
              location: "Dubai, UAE",
              year: "2021-2023",
              client: "RTA Dubai",
              value: "$65M",
              duration: "24 months",
              image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&h=800&fit=crop",
              description: "Construction of 2.5km elevated highway bridge with 6 lanes, advanced drainage systems, and smart traffic management integration.",
              scope: ["Structural Engineering", "Bridge Construction", "Road Works", "Smart Systems Integration"],
              challenges: "Minimal disruption to existing traffic flow during construction",
              solution: "Night-time construction with modular bridge sections for rapid assembly",
              results: ["Reduced traffic congestion by 40%", "LEED Gold certified", "Enhanced urban connectivity"]
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

  // Handle image upload
  const handleImageUpload = async (projectId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication required for image upload");
      return;
    }

    setUploadingImages(prev => ({ ...prev, [projectId]: true }));

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "project-image");

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
      handleTextChange(projectId, "image", result.image);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed");
    } finally {
      setUploadingImages(prev => ({ ...prev, [projectId]: false }));
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
      text: 'All project modifications will be updated on the website.',
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
        text: 'Project changes saved successfully!',
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

  // Add new project - NOW CATEGORY AWARE
  const addNewProject = () => {
    const categoryToUse = selectedCategory === 'all' ? 'commercial' : selectedCategory;
    
    const newProject = {
      id: Date.now(), // Temporary ID
      title: "New Project",
      category: categoryToUse,
      location: "Location",
      year: "2024",
      client: "Client Name",
      value: "$0M",
      duration: "0 months",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop",
      description: "Project description",
      scope: ["Scope item 1"],
      challenges: "Project challenges",
      solution: "Project solution",
      results: ["Result 1"]
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
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Edit Mode Toggle Button */}
      {localStorage.getItem("authToken") && (
        <div className="fixed top-4 right-4 z-50">
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
              <button 
                onClick={addNewProject}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
                title="Add New Project"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={toggleEditMode}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
              title="Edit Projects"
            >
              <Edit className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Edit Mode Overlay Indicator */}
      {editMode && (
        <div className="fixed top-20 right-4 z-50">
          <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            EDIT MODE ENABLED
          </span>
        </div>
      )}

      <section className="py-12 bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
           
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

            
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white rounded-xl font-bold"
            >
              <Filter size={20} />
              <span>Filter by Category</span>
            </button>
          </div>

          
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

      {/* Projects Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-[#0b1d34] mb-2">
              {selectedCategory === 'all' ? 'All Projects' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-[#7f8994]">Showing {filteredProjects.length} projects</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, i) => (
              <div
                key={project.id}
                onClick={() => !editMode && setSelectedProject(project)}
                className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${
                  editMode ? 'cursor-default' : 'cursor-pointer'
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
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

                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                  {uploadingImages[project.id] ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {editMode && (
                        <button
                          onClick={() => fileInputRefs.current[project.id]?.click()}
                          className="absolute top-4 right-4 z-20 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                          title="Change Image"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      )}
                      <input
                        type="file"
                        ref={el => fileInputRefs.current[project.id] = el}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(project.id, e)}
                      />
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  
                  {/* Category Badge - NOW EDITABLE */}
                  <div className="absolute top-4 right-4">
                    <span 
                      onClick={editMode ? () => handleCategoryChange(project.id, project.category) : undefined}
                      className={`bg-white/95 backdrop-blur-sm text-[#f1601f] px-4 py-2 rounded-full text-xs font-bold tracking-wider ${
                        editMode ? 'cursor-pointer border-2 border-dashed border-yellow-400' : ''
                      }`}
                    >
                      {categories.find(c => c.id === project.category)?.name}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
                    <MapPin size={16} />
                    <span className="text-sm font-medium">{project.location}</span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      onClick={editMode ? () => editTextInModal(project.id, 'year', project.year, 'Edit Year', 'Update project year') : undefined}
                      className={`text-[#7f8994] text-sm font-semibold ${
                        editMode ? 'cursor-pointer bg-yellow-100 rounded px-2 py-1' : ''
                      }`}
                    >
                      {project.year}
                    </span>
                    <span 
                      onClick={editMode ? () => editTextInModal(project.id, 'value', project.value, 'Edit Value', 'Update project value') : undefined}
                      className={`text-[#f1601f] text-sm font-bold ${
                        editMode ? 'cursor-pointer bg-yellow-100 rounded px-2 py-1' : ''
                      }`}
                    >
                      {project.value}
                    </span>
                  </div>

                  <h3 
                    onClick={editMode ? () => editTextInModal(project.id, 'title', project.title, 'Edit Title', 'Update project title') : undefined}
                    className={`text-xl font-black text-[#0b1d34] mb-3 group-hover:text-[#f1601f] transition-colors duration-300 ${
                      editMode ? 'cursor-pointer bg-yellow-100 rounded px-3 py-2' : ''
                    }`}
                  >
                    {project.title}
                  </h3>

                  <p 
                    onClick={editMode ? () => editTextInModal(project.id, 'description', project.description, 'Edit Description', 'Update project description') : undefined}
                    className={`text-[#7f8994] text-sm leading-relaxed mb-4 line-clamp-2 ${
                      editMode ? 'cursor-pointer bg-yellow-100 rounded px-3 py-2' : ''
                    }`}
                  >
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div 
                      onClick={editMode ? () => editTextInModal(project.id, 'client', project.client, 'Edit Client', 'Update client name') : undefined}
                      className={`flex items-center space-x-2 text-sm text-[#7f8994] ${
                        editMode ? 'cursor-pointer bg-yellow-100 rounded px-2 py-1' : ''
                      }`}
                    >
                      <Users size={16} />
                      <span className="font-medium">{project.client}</span>
                    </div>
                    {!editMode && (
                      <div className="flex items-center space-x-2 text-[#f1601f] font-bold group-hover:translate-x-2 transition-transform duration-300">
                        <span className="text-sm">View Details</span>
                        <ArrowRight size={16} />
                      </div>
                    )}
                  </div>
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

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full my-8 relative animate-slideUp max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors duration-300 z-10"
            >
              <X className="text-[#0b1d34]" size={24} />
            </button>

            {/* Edit Button in Modal */}
            {editMode && (
              <button
                onClick={() => {
                  // You can implement modal-specific editing here
                  editTextInModal(selectedProject.id, 'title', selectedProject.title, 'Edit Title', 'Update project title');
                }}
                className="absolute top-6 left-6 w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 z-10"
                title="Edit Project Details"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}

            {/* Hero Image */}
            <div className="relative h-96 rounded-t-3xl overflow-hidden">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="inline-block mb-4">
                  <span 
                    onClick={editMode ? () => handleCategoryChange(selectedProject.id, selectedProject.category) : undefined}
                    className={`bg-[#f1601f] text-white px-4 py-2 rounded-full text-sm font-bold tracking-wider ${
                      editMode ? 'cursor-pointer border-2 border-dashed border-yellow-400' : ''
                    }`}
                  >
                    {categories.find(c => c.id === selectedProject.category)?.name}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{selectedProject.title}</h2>
                <div className="flex flex-wrap gap-6 text-white/90">
                  <div className="flex items-center space-x-2">
                    <MapPin size={18} />
                    <span className="font-medium">{selectedProject.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={18} />
                    <span className="font-medium">{selectedProject.year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={18} />
                    <span className="font-medium">{selectedProject.client}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <div 
                    onClick={editMode ? () => editTextInModal(selectedProject.id, 'value', selectedProject.value, 'Edit Value', 'Update project value') : undefined}
                    className={`text-3xl font-black text-[#f1601f] mb-2 ${
                      editMode ? 'cursor-pointer bg-yellow-100 rounded px-2 py-1' : ''
                    }`}
                  >
                    {selectedProject.value}
                  </div>
                  <div className="text-sm font-semibold text-[#7f8994]">Project Value</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <div 
                    onClick={editMode ? () => editTextInModal(selectedProject.id, 'duration', selectedProject.duration, 'Edit Duration', 'Update project duration') : undefined}
                    className={`text-3xl font-black text-[#f1601f] mb-2 ${
                      editMode ? 'cursor-pointer bg-yellow-100 rounded px-2 py-1' : ''
                    }`}
                  >
                    {selectedProject.duration}
                  </div>
                  <div className="text-sm font-semibold text-[#7f8994]">Duration</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <div 
                    onClick={editMode ? () => editTextInModal(selectedProject.id, 'year', selectedProject.year, 'Edit Year', 'Update project year') : undefined}
                    className={`text-3xl font-black text-[#f1601f] mb-2 ${
                      editMode ? 'cursor-pointer bg-yellow-100 rounded px-2 py-1' : ''
                    }`}
                  >
                    {selectedProject.year}
                  </div>
                  <div className="text-sm font-semibold text-[#7f8994]">Completion Year</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <Award className="text-[#f1601f] mx-auto mb-2" size={32} />
                  <div className="text-sm font-semibold text-[#7f8994]">Award Winner</div>
                </div>
              </div>

              {/* Project Description */}
              <div className="mb-10">
                <h3 className="text-2xl font-black text-[#0b1d34] mb-4">Project Overview</h3>
                <p 
                  onClick={editMode ? () => editTextInModal(selectedProject.id, 'description', selectedProject.description, 'Edit Description', 'Update project description') : undefined}
                  className={`text-lg text-[#7f8994] leading-relaxed ${
                    editMode ? 'cursor-pointer bg-yellow-100 rounded px-3 py-2' : ''
                  }`}
                >
                  {selectedProject.description}
                </p>
              </div>

              {/* Scope of Work */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-[#0b1d34]">Scope of Work</h3>
                  {editMode && (
                    <button
                      onClick={() => addArrayItem(selectedProject.id, 'scope')}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedProject.scope.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="text-[#f1601f] flex-shrink-0" size={20} />
                        <span 
                          onClick={editMode ? () => editArrayItemInModal(selectedProject.id, 'scope', i, item, 'Edit Scope Item') : undefined}
                          className={`font-semibold text-[#0b1d34] ${
                            editMode ? 'cursor-pointer bg-yellow-100 rounded px-2 py-1' : ''
                          }`}
                        >
                          {item}
                        </span>
                      </div>
                      {editMode && (
                        <button
                          onClick={() => removeArrayItem(selectedProject.id, 'scope', i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenge & Solution */}
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8">
                  <h3 className="text-xl font-black text-[#0b1d34] mb-4">Challenge</h3>
                  <p 
                    onClick={editMode ? () => editTextInModal(selectedProject.id, 'challenges', selectedProject.challenges, 'Edit Challenges', 'Update project challenges') : undefined}
                    className={`text-[#7f8994] leading-relaxed ${
                      editMode ? 'cursor-pointer bg-yellow-100 rounded px-3 py-2' : ''
                    }`}
                  >
                    {selectedProject.challenges}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
                  <h3 className="text-xl font-black text-[#0b1d34] mb-4">Solution</h3>
                  <p 
                    onClick={editMode ? () => editTextInModal(selectedProject.id, 'solution', selectedProject.solution, 'Edit Solution', 'Update project solution') : undefined}
                    className={`text-[#7f8994] leading-relaxed ${
                      editMode ? 'cursor-pointer bg-yellow-100 rounded px-3 py-2' : ''
                    }`}
                  >
                    {selectedProject.solution}
                  </p>
                </div>
              </div>

              {/* Results & Impact */}
              <div className="bg-gradient-to-br from-[#0b1d34] to-[#13344c] rounded-2xl p-8 text-white">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black">Results & Impact</h3>
                  {editMode && (
                    <button
                      onClick={() => addArrayItem(selectedProject.id, 'results')}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {selectedProject.results.map((result, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-8 h-8 bg-[#f1601f] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle size={20} />
                        </div>
                        <p 
                          onClick={editMode ? () => editArrayItemInModal(selectedProject.id, 'results', i, result, 'Edit Result') : undefined}
                          className={`text-lg text-white/90 leading-relaxed flex-1 ${
                            editMode ? 'cursor-pointer bg-yellow-500/30 rounded px-3 py-2' : ''
                          }`}
                        >
                          {result}
                        </p>
                      </div>
                      {editMode && (
                        <button
                          onClick={() => removeArrayItem(selectedProject.id, 'results', i)}
                          className="text-red-300 hover:text-red-100 ml-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;