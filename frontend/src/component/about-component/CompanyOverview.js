"use client";
import { Edit, Save, X, Plus, Trash2, Upload } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

const CompanyOverview = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  const fileInputRefs = useRef({});

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/about/company-overview/`;

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
          preTitle: "Our Story",
          title: "Building Excellence Since 2008",
          description: "RAWASY is a premier contracting and trading company based in the Gulf region, specializing in comprehensive construction solutions, skilled manpower supply, and industrial services. With over 15 years of proven expertise, we have established ourselves as a trusted partner for projects of all scales and complexities.",
          additionalDescription: "Our commitment to excellence, safety, and innovation has enabled us to successfully deliver over 800 projects across diverse sectors including oil & gas, infrastructure, commercial, industrial, and residential developments.",
          stats: [
            {
              number: "15+",
              label: "Years of Excellence"
            },
            {
              number: "800+",
              label: "Projects Completed"
            },
            {
              number: "2000+",
              label: "Skilled Workforce"
            },
            {
              number: "50+",
              label: "Major Clients"
            }
          ],
          images: [
            {
              url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop",
              alt: "Construction"
            },
            {
              url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=500&fit=crop",
              alt: "Industrial"
            },
            {
              url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=500&fit=crop",
              alt: "Infrastructure"
            },
            {
              url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
              alt: "Commercial"
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

  // Handle image changes
  const handleImageChange = (index, field, value) => {
    setTempData(prev => ({
      ...prev,
      images: prev.images.map((image, i) => 
        i === index ? { ...image, [field]: value } : image
      )
    }));
  };

  // Add new stat
  const addNewStat = () => {
    Swal.fire({
      title: 'Add New Statistic',
      html: `
        <input type="text" id="statNumber" class="swal2-input" placeholder="Number (e.g., 15+)">
        <input type="text" id="statLabel" class="swal2-input" placeholder="Label (e.g., Years of Excellence)">
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

  // Add new image
  const addNewImage = () => {
    Swal.fire({
      title: 'Add New Image',
      html: `
        <input type="text" id="imageAlt" class="swal2-input" placeholder="Image Alt Text">
      `,
      showCancelButton: true,
      confirmButtonText: 'Add',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f1601f',
      preConfirm: () => {
        const alt = document.getElementById('imageAlt').value;
        if (!alt) {
          Swal.showValidationMessage('Please enter alt text for the image');
          return false;
        }
        return { alt };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setTempData(prev => ({
          ...prev,
          images: [
            ...prev.images,
            {
              url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop",
              alt: result.value.alt
            }
          ]
        }));
        
        Swal.fire({
          title: 'Added!',
          text: 'New image placeholder has been added. You can now upload an image.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Remove image
  const removeImage = (index) => {
    if (tempData.images.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one image.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f1601f'
      });
      return;
    }

    const imageToRemove = tempData.images[index];
    
    Swal.fire({
      title: 'Remove Image?',
      html: `Are you sure you want to remove <strong>"${imageToRemove.alt}"</strong>?`,
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
          images: prev.images.filter((_, i) => i !== index)
        }));
        
        Swal.fire({
          title: 'Removed!',
          text: 'Image has been removed.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Handle image upload
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
    formData.append("category", "company-overview");

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
      handleImageChange(index, "url", result.image);
      
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

  // Edit image alt text in modal
  const editImageAltInModal = async (index, currentImage) => {
    const { value: newAlt } = await Swal.fire({
      title: 'Edit Image Alt Text',
      input: 'text',
      inputLabel: 'Update the alternative text for this image',
      inputValue: currentImage.alt,
      inputAttributes: {
        'aria-label': 'Edit image alt text'
      },
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Alt text cannot be empty!';
        }
      }
    });

    if (newAlt) {
      handleImageChange(index, 'alt', newAlt);
    }
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f1601f]"></div>
          <p className="mt-4 text-gray-600">Loading company overview...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-24 bg-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load company overview. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white relative">
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
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
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
              
              <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mt-4 mb-6 leading-tight">
                {editMode ? (
                  <div 
                    onClick={() => editTextInModal('title', tempData.title, 'Edit Title', 'Update the main title text')}
                    className="cursor-pointer bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-all duration-300"
                  >
                    {tempData.title}
                  </div>
                ) : (
                  data.title
                )}
              </h2>
            </div>

            {editMode ? (
              <div 
                onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the main description text')}
                className="cursor-pointer text-lg text-[#7f8994] leading-relaxed w-full p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 border-2 border-dashed border-gray-300"
              >
                {tempData.description}
              </div>
            ) : (
              <p className="text-lg text-[#7f8994] leading-relaxed">
                {data.description}
              </p>
            )}

            {editMode ? (
              <div 
                onClick={() => editTextInModal('additionalDescription', tempData.additionalDescription, 'Edit Additional Description', 'Update the additional description text')}
                className="cursor-pointer text-lg text-[#7f8994] leading-relaxed w-full p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 border-2 border-dashed border-gray-300"
              >
                {tempData.additionalDescription}
              </div>
            ) : (
              <p className="text-lg text-[#7f8994] leading-relaxed">
                {data.additionalDescription}
              </p>
            )}

            <div className="grid grid-cols-2 gap-6">
              {/* Add new stat button */}
              {editMode && (
                <div 
                  className="bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer min-h-[120px] hover:bg-gray-100 transition-all duration-300"
                  onClick={addNewStat}
                >
                  <Plus className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-gray-600 text-sm">Add Statistic</span>
                </div>
              )}
              
              {tempData.stats.map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#f1601f] hover:shadow-xl transition-all duration-300 relative group">
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
                      <div className="text-sm font-semibold text-[#7f8994]">
                        {stat.label}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl font-black text-[#0b1d34] mb-2">
                        {stat.number}
                      </div>
                      <div className="text-sm font-semibold text-[#7f8994]">
                        {stat.label}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Add new image button */}
              {editMode && (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer min-h-[200px] hover:bg-gray-50 transition-all duration-300"
                  onClick={addNewImage}
                >
                  <Plus className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-gray-600 font-medium">Add New Image</span>
                </div>
              )}
              
              {tempData.images.map((image, index) => (
                <div key={index} className={`relative rounded-2xl overflow-hidden group ${
                  index === 1 || index === 2 ? 'h-64' : 'h-48'
                }`}>
                  {editMode && (
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <button
                        onClick={() => removeImage(index)}
                        className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        title="Remove this image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => triggerImageUpload(index)}
                        className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
                        title="Change image"
                      >
                        <Upload className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  
                  {editMode && uploadingImages[index] ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f1601f]"></div>
                      <span className="ml-2 text-gray-600">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {editMode && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => triggerImageUpload(index)}
                              className="bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-gray-100 transition-colors"
                            >
                              <Upload className="w-4 h-4" />
                              Change Image
                            </button>
                            <button
                              onClick={() => editImageAltInModal(index, image)}
                              className="bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-gray-100 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Alt Text
                            </button>
                          </div>
                        </div>
                      )}
                      {!editMode && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyOverview;