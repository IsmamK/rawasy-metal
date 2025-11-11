"use client";
import { CheckCircle, Package, Settings, Sparkles, Edit, Save, X, Plus, Trash2, Upload } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

const Process = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/gallery/process/`;

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
        if (!response.ok) throw new Error("Failed to fetch process data");
        const jsonData = await response.json();
        setData(jsonData);
        setTempData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching process data:", error);
        // Fallback to default data if API fails
        const defaultData = {
          sectionTitle: "Our Process",
          mainTitle: "From Concept to Completion",
          description: "Our systematic approach ensures precision, quality, and timely delivery in every metal fabrication project",
          processes: [
            {
              step: "01",
              title: "Design & Engineering",
              description: "Advanced CAD/CAM design and structural engineering analysis",
              icon: "sparkles"
            },
            {
              step: "02",
              title: "Material Selection",
              description: "Careful selection of high-quality metals and materials",
              icon: "package"
            },
            {
              step: "03",
              title: "Precision Fabrication",
              description: "State-of-the-art CNC machinery and skilled craftsmanship",
              icon: "settings"
            },
            {
              step: "04",
              title: "Quality Assurance",
              description: "Rigorous testing and inspection before delivery",
              icon: "check-circle"
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

  // Handle process changes
  const handleProcessChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.processes[index][field] = value;
      return newData;
    });
  };

  // Add new process
  const addNewProcess = () => {
    setTempData(prev => ({
      ...prev,
      processes: [
        ...prev.processes,
        {
          step: `${prev.processes.length + 1}`.padStart(2, '0'),
          title: "New Process Step",
          description: "Describe this process step",
          icon: "sparkles"
        }
      ]
    }));
  };

  // Remove process with confirmation
  const removeProcess = async (index) => {
    if (tempData.processes.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one process step',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This process step will be removed permanently!',
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
        processes: prev.processes.filter((_, i) => i !== index)
      }));
      
      // Reorder steps after removal
      setTimeout(() => {
        setTempData(prev => ({
          ...prev,
          processes: prev.processes.map((process, i) => ({
            ...process,
            step: `${i + 1}`.padStart(2, '0')
          }))
        }));
      }, 0);
      
      Swal.fire({
        title: 'Removed!',
        text: 'Process step has been removed.',
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

  // Edit process in modal
  const editProcessInModal = async (index, currentProcess) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Process Step',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Step Number" value="${currentProcess.step}" readonly>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Title" value="${currentProcess.title}">` +
        `<textarea id="swal-input3" class="swal2-textarea" placeholder="Description" style="width: 100%; height: 100px; padding: 10px;">${currentProcess.description}</textarea>` +
        `<select id="swal-input4" class="swal2-input">
          <option value="sparkles" ${currentProcess.icon === 'sparkles' ? 'selected' : ''}>Sparkles</option>
          <option value="package" ${currentProcess.icon === 'package' ? 'selected' : ''}>Package</option>
          <option value="settings" ${currentProcess.icon === 'settings' ? 'selected' : ''}>Settings</option>
          <option value="check-circle" ${currentProcess.icon === 'check-circle' ? 'selected' : ''}>Check Circle</option>
        </select>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          step: document.getElementById('swal-input1').value,
          title: document.getElementById('swal-input2').value,
          description: document.getElementById('swal-input3').value,
          icon: document.getElementById('swal-input4').value
        };
      }
    });

    if (formValues) {
      handleProcessChange(index, 'title', formValues.title);
      handleProcessChange(index, 'description', formValues.description);
      handleProcessChange(index, 'icon', formValues.icon);
    }
  };

  // Render icon based on icon name
  const renderIcon = (iconName, props = {}) => {
    const iconProps = { size: 24, className: "text-[#f1601f]", ...props };
    
    switch (iconName) {
      case 'sparkles':
        return <Sparkles {...iconProps} />;
      case 'package':
        return <Package {...iconProps} />;
      case 'settings':
        return <Settings {...iconProps} />;
      case 'check-circle':
        return <CheckCircle {...iconProps} />;
      default:
        return <Sparkles {...iconProps} />;
    }
  };

  if (isLoading) {
    return (
      <section className="py-32 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black relative overflow-hidden flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-300">Loading process section...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-32 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black relative overflow-hidden flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-300">Failed to load process section. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-32 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black relative overflow-hidden">
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

        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            {editMode ? (
              <div 
                onClick={() => editTextInModal('sectionTitle', tempData.sectionTitle, 'Edit Section Title', 'Update the section title text')}
                className="cursor-pointer inline-block bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/30 transition-all duration-300 mb-4"
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
                className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-6 hover:bg-white/30 transition-all duration-300 my-4"
              >
                <h2 className="text-5xl md:text-6xl font-black text-white">
                  {tempData.mainTitle}
                </h2>
              </div>
            ) : (
              <h2 className="text-5xl md:text-6xl font-black text-white mt-4 mb-6">
                {data.mainTitle}
              </h2>
            )}
            
            {editMode ? (
              <div 
                onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text')}
                className="cursor-pointer bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 text-xl text-gray-300 max-w-3xl mx-auto w-full p-6 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                {tempData.description}
              </div>
            ) : (
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {data.description}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tempData.processes.map((process, index) => (
              <div key={index} className="group text-center relative">
                {/* Delete button for process */}
                {editMode && (
                  <button
                    onClick={() => removeProcess(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                    title="Remove this process step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <div 
                  onClick={editMode ? () => editProcessInModal(index, process) : undefined}
                  className={editMode ? "cursor-pointer hover:bg-white/10 rounded-2xl p-4 transition-all duration-300" : ""}
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                      <span className="text-white font-black text-xl">{process.step}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 text-[#f1601f]">
                      {renderIcon(process.icon)}
                    </div>
                  </div>
                  
                  {editMode ? (
                    <div className="space-y-3">
                      <div className="text-xl font-black text-white bg-white/10 rounded-lg p-2">
                        {process.title}
                      </div>
                      <div className="text-gray-400 leading-relaxed bg-white/5 rounded-lg p-2">
                        {process.description}
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-black text-white mb-3">{process.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{process.description}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add new process button */}
            {editMode && (
              <div 
                className="border-2 border-dashed border-white/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer min-h-[280px] p-6 hover:bg-white/10 transition-all duration-300"
                onClick={addNewProcess}
              >
                <Plus className="w-12 h-12 text-white/50 mb-4" />
                <span className="text-white/70 text-lg font-medium">Add Process Step</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Process;