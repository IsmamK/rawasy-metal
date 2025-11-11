"use client";
import { Briefcase, Building2, Factory, Settings, Shield, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const IndustriesServed = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/services/industries-served/`;

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
          sectionTitle: "Industries We Serve",
          sectionSubtitle: "Diverse Sector Expertise",
          sectionDescription: "Proven track record across multiple industries throughout the Gulf region",
          industries: [
            { id: 1, name: "Oil & Gas", icon: "Factory", projects: "150+", color: "from-orange-500 to-red-600" },
            { id: 2, name: "Infrastructure", icon: "Building2", projects: "200+", color: "from-blue-900 to-blue-700" },
            { id: 3, name: "Commercial", icon: "Briefcase", projects: "250+", color: "from-[#f1601f] to-[#7f3e2c]" },
            { id: 4, name: "Industrial", icon: "Settings", projects: "180+", color: "from-slate-700 to-slate-900" },
            { id: 5, name: "Residential", icon: "Building2", projects: "120+", color: "from-[#13344c] to-[#0b1d34]" },
            { id: 6, name: "Healthcare", icon: "Shield", projects: "90+", color: "from-[#7f3e2c] to-[#7f8994]" }
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

  // Handle industry changes
  const handleIndustryChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.industries[index][field] = value;
      return newData;
    });
  };

  // Add new industry
  const addNewIndustry = () => {
    setTempData(prev => ({
      ...prev,
      industries: [
        ...prev.industries,
        {
          id: Date.now(), // Temporary ID
          name: "New Industry",
          icon: "Briefcase",
          projects: "0+",
          color: "from-gray-500 to-gray-700"
        }
      ]
    }));
  };

  // Remove industry with confirmation
  const removeIndustry = async (index) => {
    if (tempData.industries.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one industry',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This industry will be removed permanently!',
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
        industries: prev.industries.filter((_, i) => i !== index)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Industry has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
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

  // Edit industry in modal
  const editIndustryInModal = async (index, currentIndustry) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Industry Information',
      html:
        `<select id="swal-input1" class="swal2-input">
          <option value="Factory" ${currentIndustry.icon === 'Factory' ? 'selected' : ''}>Factory</option>
          <option value="Building2" ${currentIndustry.icon === 'Building2' ? 'selected' : ''}>Building</option>
          <option value="Briefcase" ${currentIndustry.icon === 'Briefcase' ? 'selected' : ''}>Briefcase</option>
          <option value="Settings" ${currentIndustry.icon === 'Settings' ? 'selected' : ''}>Settings</option>
          <option value="Shield" ${currentIndustry.icon === 'Shield' ? 'selected' : ''}>Shield</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Industry Name" value="${currentIndustry.name}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Projects Count (e.g., 150+)" value="${currentIndustry.projects}">` +
        `<input id="swal-input4" class="swal2-input" placeholder="Color Gradient (e.g., from-orange-500 to-red-600)" value="${currentIndustry.color}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          icon: document.getElementById('swal-input1').value,
          name: document.getElementById('swal-input2').value,
          projects: document.getElementById('swal-input3').value,
          color: document.getElementById('swal-input4').value
        };
      }
    });

    if (formValues) {
      handleIndustryChange(index, 'icon', formValues.icon);
      handleIndustryChange(index, 'name', formValues.name);
      handleIndustryChange(index, 'projects', formValues.projects);
      handleIndustryChange(index, 'color', formValues.color);
    }
  };

  // Render icon based on icon name
  const renderIcon = (iconName, props = {}) => {
    const iconProps = { size: 36, className: "text-white", ...props };
    
    switch (iconName) {
      case 'Factory':
        return <Factory {...iconProps} />;
      case 'Building2':
        return <Building2 {...iconProps} />;
      case 'Briefcase':
        return <Briefcase {...iconProps} />;
      case 'Settings':
        return <Settings {...iconProps} />;
      case 'Shield':
        return <Shield {...iconProps} />;
      default:
        return <Briefcase {...iconProps} />;
    }
  };

  if (isLoading) {
    return (
      <section className="py-32 bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading industries...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-32 bg-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load industries. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-32 bg-white">
        {/* Edit Mode Toggle Button */}
        {localStorage.getItem("authToken") && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute top-0 right-0 z-20">
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
          </div>
        )}

        {/* Edit Mode Overlay Indicator */}
        {editMode && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold z-50">
            EDIT MODE ENABLED - Click on any content to edit
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            {editMode ? (
              <div 
                onClick={() => editTextInModal('sectionTitle', tempData.sectionTitle, 'Edit Section Title', 'Update the section title text')}
                className="cursor-pointer bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-all duration-300 inline-block"
              >
                <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase bg-transparent border-none focus:ring-2 focus:ring-yellow-400 rounded">
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
                onClick={() => editTextInModal('sectionSubtitle', tempData.sectionSubtitle, 'Edit Section Subtitle', 'Update the main heading text')}
                className="cursor-pointer bg-gray-100 rounded-lg p-6 hover:bg-gray-200 transition-all duration-300 mt-4"
              >
                <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] bg-transparent border-none text-center focus:ring-2 focus:ring-yellow-400 rounded">
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
                onClick={() => editTextInModal('sectionDescription', tempData.sectionDescription, 'Edit Section Description', 'Update the description text')}
                className="cursor-pointer bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-all duration-300 max-w-3xl mx-auto"
              >
                <p className="text-xl text-gray-600 bg-transparent border-none text-center focus:ring-2 focus:ring-yellow-400 rounded">
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
            {tempData.industries.map((industry, index) => (
              <div key={industry.id} className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-10 hover:border-[#f1601f] hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Delete button for industry */}
                {editMode && (
                  <button
                    onClick={() => removeIndustry(index)}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 z-10 hover:bg-red-600 transition-colors"
                    title="Remove this industry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div 
                  className="relative"
                  onClick={editMode ? () => editIndustryInModal(index, industry) : undefined}
                >
                  {editMode ? (
                    <div className="cursor-pointer">
                      <div className={`w-20 h-20 bg-gradient-to-br ${industry.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-2 border-dashed border-white/50`}>
                        {renderIcon(industry.icon)}
                      </div>
                      
                      <h3 className="text-3xl font-black text-[#0b1d34] mb-3 bg-transparent border-none">
                        {industry.name}
                      </h3>
                      
                      <div className="flex items-center space-x-3 text-[#f1601f] font-bold">
                        <span className="text-4xl bg-transparent border-none">{industry.projects}</span>
                        <span className="text-sm bg-transparent border-none">Completed Projects</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={`w-20 h-20 bg-gradient-to-br ${industry.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        {renderIcon(industry.icon)}
                      </div>
                      
                      <h3 className="text-3xl font-black text-[#0b1d34] mb-3">
                        {industry.name}
                      </h3>
                      
                      <div className="flex items-center space-x-3 text-[#f1601f] font-bold">
                        <span className="text-4xl">{industry.projects}</span>
                        <span className="text-sm">Completed Projects</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add new industry button */}
            {editMode && (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer min-h-[300px] p-10 hover:border-[#f1601f] hover:bg-gray-50 transition-all duration-300"
                onClick={addNewIndustry}
              >
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-gray-500 text-lg font-medium">Add New Industry</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default IndustriesServed;