"use client";
import { Globe, Target, Award, Shield, Clock, Users, Zap, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Mission = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/about/mission/`;

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
        if (!response.ok) throw new Error("Failed to fetch mission data");
        const jsonData = await response.json();
        setData(jsonData);
        setTempData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching mission data:", error);
        // Fallback to default data if API fails
        const defaultData = {
          sectionTitle: "Our Foundation",
          mainTitle: "Mission, Vision & Values",
          mission: {
            title: "Our Mission",
            description: "To deliver exceptional construction, manpower, and industrial solutions that exceed client expectations through innovation, quality craftsmanship, and unwavering commitment to safety and sustainability.",
            additionalText: "We strive to be the partner of choice for clients seeking reliable, efficient, and comprehensive solutions for projects of any scale and complexity across the Gulf region."
          },
          vision: {
            title: "Our Vision",
            description: "To be recognized as the leading contracting and trading company in the Gulf region, setting industry standards for excellence, innovation, and sustainable development.",
            additionalText: "We envision a future where RAWASY continues to shape the region's infrastructure landscape while fostering long-term partnerships built on trust, quality, and mutual success."
          },
          values: {
            title: "Core Values That Drive Us",
            items: [
              { icon: "award", title: "Excellence", description: "Pursuing the highest standards in every project, ensuring quality craftsmanship and attention to detail" },
              { icon: "shield", title: "Safety First", description: "Maintaining zero-harm workplace culture with comprehensive safety protocols and OHSAS 18001 compliance" },
              { icon: "clock", title: "Reliability", description: "Delivering projects on time and within budget without compromising quality or safety standards" },
              { icon: "users", title: "Integrity", description: "Conducting business with transparency, honesty, and ethical practices in all our dealings" },
              { icon: "zap", title: "Innovation", description: "Embracing cutting-edge technologies and methodologies to deliver superior results" },
              { icon: "target", title: "Client Focus", description: "Prioritizing client satisfaction through responsive service and exceeding expectations" }
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

  // Handle value item changes
  const handleValueItemChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.values.items[index][field] = value;
      return newData;
    });
  };

  // Add new value item
  const addNewValueItem = () => {
    setTempData(prev => ({
      ...prev,
      values: {
        ...prev.values,
        items: [
          ...prev.values.items,
          {
            icon: "award",
            title: "New Value",
            description: "Value description"
          }
        ]
      }
    }));
  };

  // Remove value item with confirmation
  const removeValueItem = async (index) => {
    if (tempData.values.items.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one value item',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This value item will be removed permanently!',
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
        values: {
          ...prev.values,
          items: prev.values.items.filter((_, i) => i !== index)
        }
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Value item has been removed.',
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

  // Edit value item in modal
  const editValueItemInModal = async (index, currentValue) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Value Item',
      html:
        `<select id="swal-input1" class="swal2-input">
          <option value="award" ${currentValue.icon === 'award' ? 'selected' : ''}>Excellence</option>
          <option value="shield" ${currentValue.icon === 'shield' ? 'selected' : ''}>Safety</option>
          <option value="clock" ${currentValue.icon === 'clock' ? 'selected' : ''}>Reliability</option>
          <option value="users" ${currentValue.icon === 'users' ? 'selected' : ''}>Integrity</option>
          <option value="zap" ${currentValue.icon === 'zap' ? 'selected' : ''}>Innovation</option>
          <option value="target" ${currentValue.icon === 'target' ? 'selected' : ''}>Client Focus</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Title" value="${currentValue.title}">` +
        `<textarea id="swal-input3" class="swal2-textarea" placeholder="Description">${currentValue.description}</textarea>`,
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
      handleValueItemChange(index, 'icon', formValues.icon);
      handleValueItemChange(index, 'title', formValues.title);
      handleValueItemChange(index, 'description', formValues.description);
    }
  };

  // Render icon based on icon name
  const renderIcon = (iconName, props = {}) => {
    const iconProps = { size: 40, className: "text-white", ...props };
    
    switch (iconName) {
      case 'target':
        return <Target {...iconProps} />;
      case 'globe':
        return <Globe {...iconProps} />;
      case 'award':
        return <Award {...iconProps} />;
      case 'shield':
        return <Shield {...iconProps} />;
      case 'clock':
        return <Clock {...iconProps} />;
      case 'users':
        return <Users {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
      default:
        return <Award {...iconProps} />;
    }
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-500">Loading mission section...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">Failed to load mission section. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
        {/* Edit Mode Toggle Button - Now inside the component */}
        {localStorage.getItem("authToken") && (
          <div className="absolute top-8 right-8 z-10">
            {editMode ? (
              <div className="flex gap-2">
                <button 
                  onClick={saveChanges}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
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
                  className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                  title="Cancel Editing"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={toggleEditMode}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                title="Edit Content"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Edit Mode Overlay Indicator */}
        {editMode && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold z-10">
            EDIT MODE ENABLED - Click on any content to edit
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            {editMode ? (
              <div className="space-y-4">
                <div 
                  onClick={() => editTextInModal('sectionTitle', tempData.sectionTitle, 'Edit Section Title', 'Update the section subtitle text')}
                  className="cursor-pointer inline-block bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white transition-all duration-300 border-2 border-dashed border-orange-200"
                >
                  <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                    {tempData.sectionTitle}
                  </span>
                </div>
                <div 
                  onClick={() => editTextInModal('mainTitle', tempData.mainTitle, 'Edit Main Title', 'Update the main title text')}
                  className="cursor-pointer bg-white/80 backdrop-blur-sm rounded-lg p-4 hover:bg-white transition-all duration-300 border-2 border-dashed border-orange-200"
                >
                  <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34]">
                    {tempData.mainTitle}
                  </h2>
                </div>
              </div>
            ) : (
              <>
                <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                  {data.sectionTitle}
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mt-4">
                  {data.mainTitle}
                </h2>
              </>
            )}
          </div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white rounded-2xl shadow-lg p-2">
              <button
                onClick={() => setActiveTab('mission')}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${activeTab === 'mission' ? 'bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white' : 'text-[#7f8994] hover:text-[#f1601f]'}`}
              >
                Mission
              </button>
              <button
                onClick={() => setActiveTab('vision')}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${activeTab === 'vision' ? 'bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white' : 'text-[#7f8994] hover:text-[#f1601f]'}`}
              >
                Vision
              </button>
              <button
                onClick={() => setActiveTab('values')}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${activeTab === 'values' ? 'bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white' : 'text-[#7f8994] hover:text-[#f1601f]'}`}
              >
                Values
              </button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Mission Tab */}
            {activeTab === 'mission' && (
              <div className="bg-white rounded-3xl shadow-xl p-12 animate-fadeIn relative">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Target className="text-white" size={40} />
                  </div>
                  <div className="flex-1">
                    {editMode ? (
                      <div className="space-y-4">
                        <div 
                          onClick={() => editTextInModal('mission.title', tempData.mission.title, 'Edit Mission Title', 'Update the mission title')}
                          className="cursor-pointer bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300 border-2 border-dashed border-gray-300"
                        >
                          <h3 className="text-3xl font-black text-[#0b1d34]">
                            {tempData.mission.title}
                          </h3>
                        </div>
                        <div 
                          onClick={() => editTextInModal('mission.description', tempData.mission.description, 'Edit Mission Description', 'Update the main mission description')}
                          className="cursor-pointer bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300 border-2 border-dashed border-gray-300"
                        >
                          <p className="text-xl text-[#7f8994] leading-relaxed">
                            {tempData.mission.description}
                          </p>
                        </div>
                        <div 
                          onClick={() => editTextInModal('mission.additionalText', tempData.mission.additionalText, 'Edit Additional Text', 'Update the additional mission text')}
                          className="cursor-pointer bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300 border-2 border-dashed border-gray-300"
                        >
                          <p className="text-lg text-[#7f8994] leading-relaxed">
                            {tempData.mission.additionalText}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-3xl font-black text-[#0b1d34] mb-6">
                          {data.mission.title}
                        </h3>
                        <p className="text-xl text-[#7f8994] leading-relaxed mb-6">
                          {data.mission.description}
                        </p>
                        <p className="text-lg text-[#7f8994] leading-relaxed">
                          {data.mission.additionalText}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Vision Tab */}
            {activeTab === 'vision' && (
              <div className="bg-white rounded-3xl shadow-xl p-12 animate-fadeIn relative">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Globe className="text-white" size={40} />
                  </div>
                  <div className="flex-1">
                    {editMode ? (
                      <div className="space-y-4">
                        <div 
                          onClick={() => editTextInModal('vision.title', tempData.vision.title, 'Edit Vision Title', 'Update the vision title')}
                          className="cursor-pointer bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300 border-2 border-dashed border-gray-300"
                        >
                          <h3 className="text-3xl font-black text-[#0b1d34]">
                            {tempData.vision.title}
                          </h3>
                        </div>
                        <div 
                          onClick={() => editTextInModal('vision.description', tempData.vision.description, 'Edit Vision Description', 'Update the main vision description')}
                          className="cursor-pointer bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300 border-2 border-dashed border-gray-300"
                        >
                          <p className="text-xl text-[#7f8994] leading-relaxed">
                            {tempData.vision.description}
                          </p>
                        </div>
                        <div 
                          onClick={() => editTextInModal('vision.additionalText', tempData.vision.additionalText, 'Edit Additional Text', 'Update the additional vision text')}
                          className="cursor-pointer bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300 border-2 border-dashed border-gray-300"
                        >
                          <p className="text-lg text-[#7f8994] leading-relaxed">
                            {tempData.vision.additionalText}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-3xl font-black text-[#0b1d34] mb-6">
                          {data.vision.title}
                        </h3>
                        <p className="text-xl text-[#7f8994] leading-relaxed mb-6">
                          {data.vision.description}
                        </p>
                        <p className="text-lg text-[#7f8994] leading-relaxed">
                          {data.vision.additionalText}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Values Tab */}
            {activeTab === 'values' && (
              <div className="bg-white rounded-3xl shadow-xl p-12 animate-fadeIn relative">
                {editMode ? (
                  <div 
                    onClick={() => editTextInModal('values.title', tempData.values.title, 'Edit Values Title', 'Update the values section title')}
                    className="cursor-pointer bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300 border-2 border-dashed border-gray-300 mb-8 text-center"
                  >
                    <h3 className="text-3xl font-black text-[#0b1d34]">
                      {tempData.values.title}
                    </h3>
                  </div>
                ) : (
                  <h3 className="text-3xl font-black text-[#0b1d34] mb-8 text-center">
                    {data.values.title}
                  </h3>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  {tempData.values.items.map((value, index) => (
                    <div key={index} className="relative">
                      {/* Delete button for value item */}
                      {editMode && (
                        <button
                          onClick={() => removeValueItem(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors shadow-lg"
                          title="Remove this value"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div 
                        onClick={editMode ? () => editValueItemInModal(index, value) : undefined}
                        className={`flex items-start space-x-4 p-6 bg-gray-50 rounded-xl transition-all duration-300 group ${
                          editMode ? 'cursor-pointer hover:bg-gray-100 border-2 border-dashed border-gray-300' : 'hover:bg-gradient-to-br hover:from-[#f1601f] hover:to-[#7f3e2c] hover:text-white'
                        }`}
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-xl flex items-center justify-center flex-shrink-0 ${
                          !editMode && 'group-hover:bg-white'
                        }`}>
                          {renderIcon(value.icon, {
                            className: !editMode ? "text-white group-hover:text-[#f1601f]" : "text-white"
                          })}
                        </div>
                        <div className="flex-1">
                          {editMode ? (
                            <div className="space-y-2">
                              <h4 className="text-lg font-bold text-[#0b1d34]">
                                {value.title}
                              </h4>
                              <p className="text-sm text-[#7f8994]">
                                {value.description}
                              </p>
                            </div>
                          ) : (
                            <>
                              <h4 className="text-lg font-bold text-[#0b1d34] group-hover:text-white mb-2">
                                {value.title}
                              </h4>
                              <p className="text-sm text-[#7f8994] group-hover:text-white/90">
                                {value.description}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add new value item button */}
                  {editMode && (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer min-h-[120px] p-6 hover:bg-gray-50 transition-all duration-300"
                      onClick={addNewValueItem}
                    >
                      <Plus className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-gray-500 text-sm font-medium">Add New Value</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>  
    </>
  );
};

export default Mission;