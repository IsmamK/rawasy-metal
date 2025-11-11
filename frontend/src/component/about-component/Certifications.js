"use client";
import { Award, Shield, Star, Target, Edit, Save, X, Upload, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

const Certifications = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRefs = useRef({});

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/about/certifications/`;

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
          sectionTitle: "Quality & Compliance",
          mainTitle: "Certifications & Accreditations",
          description: "Our commitment to excellence is validated by international certifications and industry recognitions",
          certifications: [
            {
              id: 1,
              icon: "award",
              title: "ISO 9001:2015",
              subtitle: "Quality Management",
              description: "International standard for quality management systems ensuring consistent service delivery",
              image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop"
            },
            {
              id: 2,
              icon: "shield",
              title: "OHSAS 18001",
              subtitle: "Health & Safety",
              description: "Occupational health and safety management certification for zero-harm workplace",
              image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop"
            },
            {
              id: 3,
              icon: "star",
              title: "Grade 1 License",
              subtitle: "Premium Contractor",
              description: "Highest grade contractor license for large-scale and complex project execution",
              image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
            },
            {
              id: 4,
              icon: "target",
              title: "ISO 14001",
              subtitle: "Environmental",
              description: "Environmental management system certification for sustainable practices",
              image: "https://images.unsplash.com-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop"
            }
          ],
          statsSection: {
            title: "Trusted by Leading Organizations",
            description: "We have established strong partnerships with over 50 major clients across various sectors, delivering projects that set industry benchmarks for quality and excellence.",
            stats: [
              { value: "100%", label: "Client Satisfaction Rate" },
              { value: "98%", label: "On-Time Delivery" },
              { value: "Zero", label: "Major Safety Incidents" }
            ]
          }
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

  // Handle stat changes
  const handleStatChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.statsSection.stats[index][field] = value;
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
          id: Date.now(),
          icon: "award",
          title: "New Certification",
          subtitle: "Category",
          description: "Description of the certification",
          image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop"
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

  // Add new stat
  const addNewStat = () => {
    setTempData(prev => ({
      ...prev,
      statsSection: {
        ...prev.statsSection,
        stats: [
          ...prev.statsSection.stats,
          { value: "New Value", label: "New Label" }
        ]
      }
    }));
  };

  // Remove stat with confirmation
  const removeStat = async (index) => {
    if (tempData.statsSection.stats.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one statistic',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This statistic will be removed permanently!',
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
        statsSection: {
          ...prev.statsSection,
          stats: prev.statsSection.stats.filter((_, i) => i !== index)
        }
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Statistic has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Handle image upload for certifications
  const handleImageUpload = async (event, certIndex) => {
    const file = event.target.files[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication required for image upload");
      return;
    }

    setUploadingImage(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", `certification-${certIndex}`);

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
      handleCertificationChange(certIndex, "image", result.image);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed");
    } finally {
      setUploadingImage(false);
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
        `<select id="swal-input1" class="swal2-input">
          <option value="award" ${currentCert.icon === 'award' ? 'selected' : ''}>Award</option>
          <option value="shield" ${currentCert.icon === 'shield' ? 'selected' : ''}>Shield</option>
          <option value="star" ${currentCert.icon === 'star' ? 'selected' : ''}>Star</option>
          <option value="target" ${currentCert.icon === 'target' ? 'selected' : ''}>Target</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Title" value="${currentCert.title}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Subtitle" value="${currentCert.subtitle}">` +
        `<textarea id="swal-input4" class="swal2-textarea" placeholder="Description">${currentCert.description}</textarea>`,
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
          subtitle: document.getElementById('swal-input3').value,
          description: document.getElementById('swal-input4').value
        };
      }
    });

    if (formValues) {
      handleCertificationChange(index, 'icon', formValues.icon);
      handleCertificationChange(index, 'title', formValues.title);
      handleCertificationChange(index, 'subtitle', formValues.subtitle);
      handleCertificationChange(index, 'description', formValues.description);
    }
  };

  // Edit stat in modal
  const editStatInModal = async (index, currentStat) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Statistic',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Value" value="${currentStat.value}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Label" value="${currentStat.label}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          value: document.getElementById('swal-input1').value,
          label: document.getElementById('swal-input2').value
        };
      }
    });

    if (formValues) {
      handleStatChange(index, 'value', formValues.value);
      handleStatChange(index, 'label', formValues.label);
    }
  };

  // Render icon based on icon name
  const renderIcon = (iconName, props = {}) => {
    const iconProps = { size: 40, ...props };
    
    switch (iconName) {
      case 'award':
        return <Award {...iconProps} />;
      case 'shield':
        return <Shield {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      case 'target':
        return <Target {...iconProps} />;
      default:
        return <Award {...iconProps} />;
    }
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading certifications...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load certifications. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
        
        {/* Edit Mode Overlay Indicator */}
        {editMode && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-6 py-3 rounded-full text-sm font-bold z-40 shadow-lg">
            EDIT MODE ENABLED - Click on any content to edit
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Edit Mode Toggle Button - NOW INSIDE THE COMPONENT CONTAINER */}
          {localStorage.getItem("authToken") && (
            <div className="flex justify-end mb-8">
              {editMode ? (
                <div className="flex gap-2">
                  <button 
                    onClick={saveChanges}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all duration-300"
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
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all duration-300"
                    title="Cancel Editing"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={toggleEditMode}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all duration-300"
                  title="Edit Content"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Certifications</span>
                </button>
              )}
            </div>
          )}

          <div className="text-center mb-16">
            {editMode ? (
              <div 
                onClick={() => editTextInModal('sectionTitle', tempData.sectionTitle, 'Edit Section Title', 'Update the section title/subtitle')}
                className="cursor-pointer inline-block bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white transition-all duration-300 mb-4"
              >
                <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
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
                onClick={() => editTextInModal('mainTitle', tempData.mainTitle, 'Edit Main Title', 'Update the main title text')}
                className="cursor-pointer bg-white/80 backdrop-blur-sm rounded-lg p-6 hover:bg-white transition-all duration-300 my-4"
              >
                <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34]">
                  {tempData.mainTitle}
                </h2>
              </div>
            ) : (
              <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mt-4 mb-6">
                {data.mainTitle}
              </h2>
            )}
            
            {editMode ? (
              <div 
                onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text')}
                className="cursor-pointer bg-white/80 backdrop-blur-sm rounded-lg p-4 hover:bg-white transition-all duration-300 max-w-3xl mx-auto"
              >
                <p className="text-xl text-[#7f8994]">
                  {tempData.description}
                </p>
              </div>
            ) : (
              <p className="text-xl text-[#7f8994] max-w-3xl mx-auto">
                {data.description}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {tempData.certifications.map((cert, index) => (
              <div key={cert.id} className="group bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-[#f1601f] hover:shadow-2xl transition-all duration-500 relative">
                
                {/* Delete button for certification */}
                {editMode && (
                  <button
                    onClick={() => removeCertification(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 z-10 hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove this certification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Image upload section */}
                {editMode && (
                  <div className="absolute top-2 left-2">
                    <button
                      onClick={() => fileInputRefs.current[`cert-${index}`]?.click()}
                      className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors shadow-lg"
                      title="Change certification image"
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      type="file"
                      ref={el => fileInputRefs.current[`cert-${index}`] = el}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                    />
                  </div>
                )}

                <div 
                  onClick={editMode ? () => editCertificationInModal(index, cert) : undefined}
                  className={editMode ? "cursor-pointer" : ""}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-[#f1601f] group-hover:to-[#7f3e2c] rounded-2xl flex items-center justify-center mb-6 transition-all duration-500">
                    {renderIcon(cert.icon, {
                      className: "text-[#0b1d34] group-hover:text-white transition-colors duration-500"
                    })}
                  </div>
                  
                  <h3 className="text-2xl font-black text-[#0b1d34] mb-2">
                    {cert.title}
                  </h3>
                  
                  <div className="text-sm font-bold text-[#f1601f] mb-4">
                    {cert.subtitle}
                  </div>
                  
                  <p className="text-[#7f8994] leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Add new certification button */}
            {editMode && (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer min-h-[300px] p-8 hover:bg-gray-50 transition-all duration-300"
                onClick={addNewCertification}
              >
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-gray-500 font-medium">Add New Certification</span>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#0b1d34] to-[#13344c] rounded-3xl p-12 text-white text-center relative">
            
            {/* Edit stats section title and description */}
            {editMode && (
              <div className="absolute top-4 left-4 space-y-2">
                <button
                  onClick={() => editTextInModal('statsSection.title', tempData.statsSection.title, 'Edit Stats Title', 'Update the statistics section title')}
                  className="bg-blue-500 text-white rounded-lg px-3 py-1 text-sm hover:bg-blue-600 transition-colors"
                >
                  Edit Title
                </button>
                <button
                  onClick={() => editTextInModal('statsSection.description', tempData.statsSection.description, 'Edit Stats Description', 'Update the statistics section description')}
                  className="bg-blue-500 text-white rounded-lg px-3 py-1 text-sm hover:bg-blue-600 transition-colors"
                >
                  Edit Description
                </button>
              </div>
            )}

            {editMode ? (
              <div className="space-y-6">
                <h3 
                  onClick={() => editTextInModal('statsSection.title', tempData.statsSection.title, 'Edit Stats Title', 'Update the statistics section title')}
                  className="text-3xl font-black mb-6 cursor-pointer bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-all duration-300"
                >
                  {tempData.statsSection.title}
                </h3>
                <p 
                  onClick={() => editTextInModal('statsSection.description', tempData.statsSection.description, 'Edit Stats Description', 'Update the statistics section description')}
                  className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto cursor-pointer bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-all duration-300"
                >
                  {tempData.statsSection.description}
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-black mb-6">{data.statsSection.title}</h3>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  {data.statsSection.description}
                </p>
              </>
            )}

            <div className="grid md:grid-cols-3 gap-8">
              {tempData.statsSection.stats.map((stat, index) => (
                <div key={index} className="relative">
                  
                  {/* Delete button for stat */}
                  {editMode && (
                    <button
                      onClick={() => removeStat(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                      title="Remove this statistic"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  
                  <div 
                    onClick={editMode ? () => editStatInModal(index, stat) : undefined}
                    className={editMode ? "cursor-pointer hover:bg-white/10 rounded-lg p-4 transition-all duration-300" : ""}
                  >
                    <div className="text-5xl font-black text-[#f1601f] mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add new stat button */}
              {editMode && (
                <div 
                  className="border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center cursor-pointer min-h-[120px] p-4 hover:bg-white/10 transition-all duration-300"
                  onClick={addNewStat}
                >
                  <Plus className="w-8 h-8 text-white/50 mb-2" />
                  <span className="text-white/70 text-sm font-medium">Add Statistic</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section> 
    </>
  );
};

export default Certifications;