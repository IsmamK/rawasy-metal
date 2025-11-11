"use client";
import { Award, Edit, Save, X, Upload } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

const Certifications = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const backgroundFileInputRef = useRef(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/services/certifications/`;

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
          title: "Certified Excellence",
          subtitle: "Backed by international standards and industry certifications",
          certifications: [
            { title: "ISO 9001:2015", description: "Quality Management System" },
            { title: "ISO 14001", description: "Environmental Management" },
            { title: "OHSAS 18001", description: "Occupational Health & Safety" },
            { title: "Grade 1 License", description: "Premium Contractor" }
          ],
          backgroundImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop"
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

  // Handle certification changes
  const handleCertificationChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.certifications[index][field] = value;
      return newData;
    });
  };

  // Add new certification
  const addNewCertification = () => {
    setTempData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          title: "New Certification",
          description: "Certification description"
        }
      ]
    }));
  };

  // Remove certification with confirmation
  const removeCertification = async (index) => {
    if (tempData.certifications.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one certification',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This certification will be removed permanently!',
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
        certifications: prev.certifications.filter((_, i) => i !== index)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Certification has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Handle background image upload
  const handleBackgroundImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication required for image upload");
      return;
    }

    setUploadingBackground(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "certifications-background");

    try {
      const response = await fetch(`${API_BASE}/images/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`
        },
        body: formData
      });

      if (!response.ok) throw new Error("Background image upload failed");

      const result = await response.json();
      handleTextChange("backgroundImage", result.image);
    } catch (error) {
      console.error("Error uploading background image:", error);
      alert("Background image upload failed");
    } finally {
      setUploadingBackground(false);
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

  // Edit certification in modal
  const editCertificationInModal = async (index, currentCert) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Certification',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Certification Title" value="${currentCert.title}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Certification Description" value="${currentCert.description}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          title: document.getElementById('swal-input1').value,
          description: document.getElementById('swal-input2').value
        };
      }
    });

    if (formValues) {
      handleCertificationChange(index, 'title', formValues.title);
      handleCertificationChange(index, 'description', formValues.description);
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-r from-[#0b1d34] to-[#13344c] flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-300">Loading certifications...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-20 bg-gradient-to-r from-[#0b1d34] to-[#13344c] flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-300">Failed to load certifications. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 bg-gradient-to-r from-[#0b1d34] to-[#13344c] relative overflow-hidden">
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

        {/* Background Image */}
        <div className="absolute inset-0">
          {editMode ? (
            <div className="relative h-full">
              {uploadingBackground ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 opacity-10">
                    <img src={tempData.backgroundImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={() => backgroundFileInputRef.current?.click()}
                    className="absolute top-4 left-4 bg-blue-500 text-white rounded-full p-2 z-10"
                    title="Change background image"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <input
                    type="file"
                    ref={backgroundFileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleBackgroundImageUpload}
                  />
                </>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 opacity-10">
              <img src={data.backgroundImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-12">
            {editMode ? (
              <>
                <div 
                  onClick={() => editTextInModal('title', tempData.title, 'Edit Main Title', 'Update the main title text')}
                  className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300 mb-4"
                >
                  <h3 className="text-3xl font-black text-white">{tempData.title}</h3>
                </div>
                <div 
                  onClick={() => editTextInModal('subtitle', tempData.subtitle, 'Edit Subtitle', 'Update the subtitle text')}
                  className="cursor-pointer bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-lg p-4 hover:bg-white/20 transition-all duration-300"
                >
                  <p className="text-gray-300">{tempData.subtitle}</p>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-3xl font-black text-white mb-2">{data.title}</h3>
                <p className="text-gray-300">{data.subtitle}</p>
              </>
            )}
          </div>
          
          {/* Certifications Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {tempData.certifications.map((cert, index) => (
              <div key={index} className="text-center group relative">
                {/* Delete button for certification */}
                {editMode && (
                  <button
                    onClick={() => removeCertification(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                    title="Remove this certification"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                
                <div 
                  onClick={editMode ? () => editCertificationInModal(index, cert) : undefined}
                  className={editMode ? "cursor-pointer hover:bg-white/10 rounded-xl p-4 transition-all duration-300" : ""}
                >
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                    <Award className="text-[#f1601f]" size={36} />
                  </div>
                  
                  {editMode ? (
                    <>
                      <h4 className="text-white font-bold mb-1 bg-transparent border-none text-center">
                        {cert.title}
                      </h4>
                      <p className="text-gray-400 text-sm bg-transparent border-none text-center">
                        {cert.description}
                      </p>
                    </>
                  ) : (
                    <>
                      <h4 className="text-white font-bold mb-1">{cert.title}</h4>
                      <p className="text-gray-400 text-sm">{cert.description}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add new certification button */}
            {editMode && (
              <div 
                className="border-2 border-dashed border-white/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer min-h-[200px] p-4 hover:bg-white/10 transition-all duration-300"
                onClick={addNewCertification}
              >
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="text-white/50" size={36} />
                </div>
                <span className="text-white/70 text-sm font-medium">Add New Certification</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Certifications;