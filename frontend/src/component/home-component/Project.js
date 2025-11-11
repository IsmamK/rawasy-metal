"use client";
import React, { useEffect, useState, useRef } from "react";
import { ArrowRight, Edit, Save, X, Plus, Trash2, Upload } from "lucide-react";
import Swal from "sweetalert2";

const Project = () => {
  const [data, setData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  const fileInputRefs = useRef({});

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/home/project/`;

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
          preTitle: "Featured Projects",
          title: "Excellence in",
          highlightedTitle: "Every Project",
          description: "From large-scale infrastructure to precision industrial facilities, our portfolio showcases versatility, innovation, and unwavering commitment to quality.",
          stats: [
            {
              number: "150+",
              label: "Oil & Gas Projects"
            },
            {
              number: "200+",
              label: "Infrastructure Works"
            },
            {
              number: "250+",
              label: "Commercial Buildings"
            },
            {
              number: "180+",
              label: "Industrial Facilities"
            }
          ],
          projects: [
            {
              img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
              title: "Petrochemical Complex",
              category: "Oil & Gas",
              description: "State-of-the-art processing facility with advanced safety systems",
              buttonText: "View Details"
            },
            {
              img: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&h=600&fit=crop",
              title: "Highway Infrastructure",
              category: "Infrastructure",
              description: "200km highway development with modern interchanges",
              buttonText: "View Details"
            },
            {
              img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
              title: "Corporate Headquarters",
              category: "Commercial",
              description: "LEED-certified sustainable office complex",
              buttonText: "View Details"
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

  // Animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("projects");
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [data]);

  // Toggle edit mode with confirmation
  const toggleEditMode = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      Swal.fire({
        title: 'Admin Access Required',
        text: 'Please log in to access edit mode.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f1601f'
      });
      return;
    }
    
    if (editMode) {
      Swal.fire({
        title: 'Discard Changes?',
        text: 'Are you sure you want to exit edit mode? All unsaved changes will be lost.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, Discard',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          setTempData(data);
          setEditMode(false);
          Swal.fire({
            title: 'Changes Discarded',
            icon: 'info',
            timer: 1500,
            showConfirmButton: false
          });
        }
      });
    } else {
      setEditMode(true);
      Swal.fire({
        title: 'Edit Mode Enabled',
        text: 'You can now edit all content. Click on any text to modify it.',
        icon: 'info',
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#f1601f',
        timer: 3000
      });
    }
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

  // Handle stat changes
  const handleStatChange = (index, field, value) => {
    setTempData(prev => ({
      ...prev,
      stats: prev.stats.map((stat, i) => 
        i === index ? { ...stat, [field]: value } : stat
      )
    }));
  };

  // Handle project changes
  const handleProjectChange = (index, field, value) => {
    setTempData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  // Add new stat
  const addNewStat = () => {
    Swal.fire({
      title: 'Add New Statistic',
      html: `
        <input type="text" id="statNumber" class="swal2-input" placeholder="Number (e.g., 150+)">
        <input type="text" id="statLabel" class="swal2-input" placeholder="Label (e.g., Oil & Gas Projects)">
      `,
      showCancelButton: true,
      confirmButtonText: 'Add',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f1601f',
      preConfirm: () => {
        const number = document.getElementById('statNumber').value;
        const label = document.getElementById('statLabel').value;
        if (!number || !label) {
          Swal.showValidationMessage('Please fill in both fields');
          return false;
        }
        return { number, label };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setTempData(prev => ({
          ...prev,
          stats: [
            ...prev.stats,
            {
              number: result.value.number,
              label: result.value.label
            }
          ]
        }));
        
        Swal.fire({
          title: 'Added!',
          text: 'New statistic has been added.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Remove stat
  const removeStat = (index) => {
    if (tempData.stats.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one statistic.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f1601f'
      });
      return;
    }

    const statToRemove = tempData.stats[index];
    
    Swal.fire({
      title: 'Remove Statistic?',
      html: `Are you sure you want to remove <strong>"${statToRemove.number} ${statToRemove.label}"</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Remove it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setTempData(prev => ({
          ...prev,
          stats: prev.stats.filter((_, i) => i !== index)
        }));
        
        Swal.fire({
          title: 'Removed!',
          text: 'Statistic has been removed.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Add new project
  const addNewProject = () => {
    Swal.fire({
      title: 'Add New Project',
      html: `
        <input type="text" id="projectTitle" class="swal2-input" placeholder="Project Title">
        <input type="text" id="projectCategory" class="swal2-input" placeholder="Category">
        <textarea id="projectDescription" class="swal2-textarea" placeholder="Description"></textarea>
        <input type="text" id="projectButtonText" class="swal2-input" placeholder="Button Text" value="View Details">
      `,
      showCancelButton: true,
      confirmButtonText: 'Add',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f1601f',
      preConfirm: () => {
        const title = document.getElementById('projectTitle').value;
        const category = document.getElementById('projectCategory').value;
        const description = document.getElementById('projectDescription').value;
        const buttonText = document.getElementById('projectButtonText').value;
        
        if (!title || !category || !description) {
          Swal.showValidationMessage('Please fill in all required fields');
          return false;
        }
        return { title, category, description, buttonText };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setTempData(prev => ({
          ...prev,
          projects: [
            ...prev.projects,
            {
              img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
              title: result.value.title,
              category: result.value.category,
              description: result.value.description,
              buttonText: result.value.buttonText
            }
          ]
        }));
        
        Swal.fire({
          title: 'Added!',
          text: 'New project has been added.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Remove project
  const removeProject = (index) => {
    if (tempData.projects.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one project.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f1601f'
      });
      return;
    }

    const projectToRemove = tempData.projects[index];
    
    Swal.fire({
      title: 'Remove Project?',
      html: `Are you sure you want to remove <strong>"${projectToRemove.title}"</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Remove it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setTempData(prev => ({
          ...prev,
          projects: prev.projects.filter((_, i) => i !== index)
        }));
        
        Swal.fire({
          title: 'Removed!',
          text: 'Project has been removed.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Handle image upload for projects - IMPROVED VERSION
  const handleImageUpload = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Invalid File',
        text: 'Please select an image file (JPEG, PNG, etc.)',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f1601f'
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'File Too Large',
        text: 'Please select an image smaller than 5MB',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f1601f'
      });
      return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to upload images.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f1601f'
      });
      return;
    }

    setUploadingImages(prev => ({ ...prev, [index]: true }));

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "project-images");

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
      handleProjectChange(index, "img", result.image);
      
      Swal.fire({
        title: 'Success!',
        text: 'Image uploaded successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: '#f1601f'
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        title: 'Upload Failed',
        text: 'Failed to upload image. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33'
      });
    } finally {
      setUploadingImages(prev => ({ ...prev, [index]: false }));
    }
  };

  // Trigger file input for image upload
  const triggerImageUpload = (index) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.onchange = (e) => handleImageUpload(e, index);
    document.body.appendChild(fileInput);
    fileInput.click();
    
    // Clean up
    fileInput.addEventListener('change', function cleanup() {
      document.body.removeChild(fileInput);
    }, { once: true });
  };

  // Save changes with confirmation
  const saveChanges = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to save changes.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f1601f'
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
    
    Swal.fire({
      title: 'Saving Changes...',
      text: 'Please wait while we update the content.',
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
        title: 'Success!',
        text: 'Changes have been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f1601f',
        timer: 2000
      });
    } catch (error) {
      console.error("Error saving data:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save changes. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default data
  const resetToDefault = () => {
    Swal.fire({
      title: 'Reset to Default?',
      text: 'This will restore all original content and remove any changes. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Reset!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          Swal.fire({
            title: 'Authentication Required',
            text: 'Please log in to reset content.',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
          return;
        }

        try {
          const response = await fetch(ENDPOINT, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${authToken}`
            }
          });

          if (response.ok) {
            // Refetch the data
            const fetchResponse = await fetch(ENDPOINT);
            const jsonData = await fetchResponse.json();
            setData(jsonData);
            setTempData(jsonData);
            setEditMode(false);
            
            Swal.fire({
              title: 'Reset Complete!',
              text: 'Content has been restored to default.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
              confirmButtonColor: '#f1601f'
            });
          } else {
            throw new Error('Reset failed');
          }
        } catch (error) {
          Swal.fire({
            title: 'Reset Failed',
            text: 'Failed to reset content. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#d33'
          });
        }
      }
    });
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
        `<input id="swal-input1" class="swal2-input" placeholder="Number" value="${currentStat.number}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Label" value="${currentStat.label}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          number: document.getElementById('swal-input1').value,
          label: document.getElementById('swal-input2').value
        };
      }
    });

    if (formValues) {
      handleStatChange(index, 'number', formValues.number);
      handleStatChange(index, 'label', formValues.label);
    }
  };

  // Edit project in modal
  const editProjectInModal = async (index, currentProject) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Project',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Title" value="${currentProject.title}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Category" value="${currentProject.category}">` +
        `<textarea id="swal-input3" class="swal2-textarea" placeholder="Description">${currentProject.description}</textarea>` +
        `<input id="swal-input4" class="swal2-input" placeholder="Button Text" value="${currentProject.buttonText}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          title: document.getElementById('swal-input1').value,
          category: document.getElementById('swal-input2').value,
          description: document.getElementById('swal-input3').value,
          buttonText: document.getElementById('swal-input4').value
        };
      }
    });

    if (formValues) {
      handleProjectChange(index, 'title', formValues.title);
      handleProjectChange(index, 'category', formValues.category);
      handleProjectChange(index, 'description', formValues.description);
      handleProjectChange(index, 'buttonText', formValues.buttonText);
    }
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-32 bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f1601f]"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section id="projects" className="py-32 bg-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load projects. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-32 bg-white relative">
      {/* Edit Mode Toggle Button */}
      {localStorage.getItem("authToken") && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {editMode ? (
            <>
              <button 
                onClick={saveChanges}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg flex items-center justify-center transition-all"
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
                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-all"
                title="Cancel Editing"
              >
                <X className="w-5 h-5" />
              </button>
              <button 
                onClick={resetToDefault}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-all"
                title="Reset to Default"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button 
              onClick={toggleEditMode}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all"
              title="Edit Content"
            >
              <Edit className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Edit Mode Overlay Indicator */}
      {editMode && (
        <div className="absolute inset-0 border-4 border-yellow-400 pointer-events-none z-0 flex items-center justify-center">
          <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
            EDIT MODE ENABLED - Click on any content to edit
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
              {editMode ? (
                <div 
                  onClick={() => editTextInModal('preTitle', tempData.preTitle, 'Edit Pre-Title', 'Update the small text above the main title')}
                  className="cursor-pointer bg-gray-100 rounded px-2 py-1 hover:bg-gray-200 transition-colors"
                >
                  {tempData.preTitle}
                </div>
              ) : (
                data.preTitle
              )}
            </span>
            
            <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
              {editMode ? (
                <div className="flex flex-col space-y-4">
                  <div 
                    onClick={() => editTextInModal('title', tempData.title, 'Edit Title', 'Update the main title text')}
                    className="cursor-pointer bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-all duration-300"
                  >
                    {tempData.title}
                  </div>
                  <div 
                    onClick={() => editTextInModal('highlightedTitle', tempData.highlightedTitle, 'Edit Highlighted Title', 'Update the highlighted part of the title')}
                    className="cursor-pointer bg-[#0b1d34] text-white rounded-lg p-4 hover:bg-[#0f2a4a] transition-all duration-300"
                  >
                    {tempData.highlightedTitle}
                  </div>
                </div>
              ) : (
                <>
                  {data.title}<br />
                  <span className="text-[#0b1d34]">{data.highlightedTitle}</span>
                </>
              )}
            </h2>
            
            {editMode ? (
              <div 
                onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text')}
                className="cursor-pointer text-xl text-gray-600 leading-relaxed w-full p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 border-2 border-dashed border-gray-300"
              >
                {tempData.description}
              </div>
            ) : (
              <p className="text-xl text-gray-600 leading-relaxed">
                {data.description}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Add new stat button */}
            {editMode && (
              <div 
                className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer min-h-[120px] hover:bg-gray-100 transition-all duration-300"
                onClick={addNewStat}
              >
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-gray-600 text-sm">Add Statistic</span>
              </div>
            )}
            
            {tempData.stats.map((stat, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-2xl relative group">
                {editMode && (
                  <button
                    onClick={() => removeStat(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                    title="Remove this statistic"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                
                {editMode ? (
                  <div 
                    onClick={() => editStatInModal(index, stat)}
                    className="cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-all duration-300"
                  >
                    <div className="text-4xl font-black text-[#0b1d34] mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-4xl font-black text-[#0b1d34] mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add new project button */}
          {editMode && (
            <div 
              className="group relative rounded-3xl overflow-hidden shadow-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer min-h-[500px] hover:bg-gray-50 transition-all duration-300"
              onClick={addNewProject}
            >
              <Plus className="w-12 h-12 text-gray-400 mb-4" />
              <span className="text-gray-600 font-medium">Add New Project</span>
            </div>
          )}
          
          {tempData.projects.map((project, index) => (
            <div key={index} className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
              {editMode && (
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <button
                    onClick={() => removeProject(index)}
                    className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    title="Remove this project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => triggerImageUpload(index)}
                    className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
                    title="Change project image"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="relative h-96">
                {editMode && uploadingImages[index] ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f1601f]"></div>
                    <span className="ml-2 text-gray-600">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <img
                      src={project.img}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {editMode && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => triggerImageUpload(index)}
                          className="bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-gray-100 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Change Image
                        </button>
                      </div>
                    )}
                    {!editMode && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    )}
                  </>
                )}
              </div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="inline-block mb-3">
                  {editMode ? (
                    <div 
                      onClick={() => editProjectInModal(index, project)}
                      className="cursor-pointer bg-[#f1601f] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider hover:bg-[#e15515] transition-colors"
                    >
                      {project.category}
                    </div>
                  ) : (
                    <span className="bg-[#f1601f] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider">
                      {project.category}
                    </span>
                  )}
                </div>
                
                {editMode ? (
                  <div 
                    onClick={() => editProjectInModal(index, project)}
                    className="cursor-pointer text-3xl font-black text-white mb-3 hover:text-gray-200 transition-colors"
                  >
                    {project.title}
                  </div>
                ) : (
                  <h3 className="text-3xl font-black text-white mb-3">{project.title}</h3>
                )}
                
                {editMode ? (
                  <div 
                    onClick={() => editProjectInModal(index, project)}
                    className="cursor-pointer text-white/80 text-sm leading-relaxed mb-4 hover:text-white transition-colors"
                  >
                    {project.description}
                  </div>
                ) : (
                  <p className="text-white/80 text-sm leading-relaxed mb-4">{project.description}</p>
                )}
                
                {editMode ? (
                  <div 
                    onClick={() => editProjectInModal(index, project)}
                    className="cursor-pointer flex items-center space-x-2 text-white font-bold opacity-100 transform translate-y-0 hover:text-gray-200 transition-colors"
                  >
                    <span>{project.buttonText}</span>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-white font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span>{project.buttonText}</span>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Project;