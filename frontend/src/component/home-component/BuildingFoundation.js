"use client";
import React, { useEffect, useState, useRef } from "react";
import { Edit, Save, X, Plus, Trash2, Upload } from "lucide-react";
import Swal from "sweetalert2";

const BuildingFoundation = () => {
  const [data, setData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/home/BuildingFoundation/`;

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
          preTitle: "Leading Metal & Construction Solutions",
          title: "Building Foundations for",
          highlightedTitle: "Progress",
          description: "At RAWASY, we are dedicated to delivering excellence in the metal industry through innovation, precision, and reliability.",
          primaryButton: {
            text: "Learn More About Us",
            link: "/"
          },
          secondaryButton: {
            text: "View Our Projects",
            link: "/projects"
          },
          expertiseItems: [
            { text: "Laser Cutting & Engraving" },
            { text: "CNC Bending & Fabrication" },
            { text: "Steel Structure Manufacturing" },
            { text: "Scaffolding & Formwork Systems" }
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

    const element = document.getElementById("building-foundation");
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

  // Handle expertise item changes
  const handleExpertiseChange = (index, value) => {
    setTempData(prev => ({
      ...prev,
      expertiseItems: prev.expertiseItems.map((item, i) => 
        i === index ? { ...item, text: value } : item
      )
    }));
  };

  // Add new expertise item
  const addNewExpertise = () => {
    Swal.fire({
      title: 'Add New Expertise',
      input: 'text',
      inputLabel: 'Enter expertise item',
      inputPlaceholder: 'e.g., Metal Fabrication',
      showCancelButton: true,
      confirmButtonText: 'Add',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f1601f',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter an expertise item';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setTempData(prev => ({
          ...prev,
          expertiseItems: [
            ...prev.expertiseItems,
            { text: result.value }
          ]
        }));
        
        Swal.fire({
          title: 'Added!',
          text: 'New expertise item has been added.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Remove expertise item
  const removeExpertise = (index) => {
    if (tempData.expertiseItems.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one expertise item.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f1601f'
      });
      return;
    }

    const itemToRemove = tempData.expertiseItems[index].text;
    
    Swal.fire({
      title: 'Remove Expertise Item?',
      html: `Are you sure you want to remove <strong>"${itemToRemove}"</strong>?`,
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
          expertiseItems: prev.expertiseItems.filter((_, i) => i !== index)
        }));
        
        Swal.fire({
          title: 'Removed!',
          text: 'Expertise item has been removed.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Save changes
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
              showConfirmButton: false
            });
          } else {
            throw new Error('Reset failed');
          }
        } catch (error) {
          Swal.fire({
            title: 'Reset Failed',
            text: 'Failed to reset content. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  };

  if (isLoading) {
    return (
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-white to-[#f9fafb] flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f1601f]"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-white to-[#f9fafb] flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load content. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="building-foundation"
        className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-white to-[#f9fafb] scroll-section relative"
      >
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
              <>
                <button 
                  onClick={toggleEditMode}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all"
                  title="Edit Content"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </>
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

        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left Content Section - Adjusted margins */}
            <div className="md:w-1/2 mb-10 md:mb-0 md:mr-8 lg:mr-12">
              <div className="inline-block px-4 py-1 rounded-full bg-[#f1601f]/10 text-[#f1601f] font-medium text-sm mb-6">
                {editMode ? (
                  <input
                    type="text"
                    value={tempData.preTitle}
                    onChange={(e) => handleTextChange("preTitle", e.target.value)}
                    className="bg-transparent border-none text-center text-[#f1601f] font-medium text-sm focus:ring-2 focus:ring-yellow-400 rounded min-w-[200px]"
                  />
                ) : (
                  data.preTitle
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0b1d34] mb-6 leading-tight">
                {editMode ? (
                  <div className="flex flex-wrap items-center">
                    <input
                      type="text"
                      value={tempData.title}
                      onChange={(e) => handleTextChange("title", e.target.value)}
                      className="bg-transparent border-none text-[#0b1d34] focus:ring-2 focus:ring-yellow-400 rounded min-w-[200px] text-4xl md:text-5xl lg:text-6xl font-bold"
                    />
                    {" "}
                    <input
                      type="text"
                      value={tempData.highlightedTitle}
                      onChange={(e) => handleTextChange("highlightedTitle", e.target.value)}
                      className="bg-transparent border-none text-[#f1601f] focus:ring-2 focus:ring-yellow-400 rounded min-w-[100px] text-4xl md:text-5xl lg:text-6xl font-bold"
                    />
                  </div>
                ) : (
                  <>
                    {data.title}{" "}
                    <span className="text-[#f1601f]">{data.highlightedTitle}</span>
                  </>
                )}
              </h1>
              
              {editMode ? (
                <textarea
                  value={tempData.description}
                  onChange={(e) => handleTextChange("description", e.target.value)}
                  className="text-lg text-[#7f8994] mb-8 w-full max-w-lg p-3 rounded focus:ring-2 focus:ring-yellow-400 bg-gray-100 border-none resize-vertical"
                  rows="3"
                />
              ) : (
                <p className="text-lg text-[#7f8994] mb-8 max-w-lg">
                  {data.description}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {editMode ? (
                  <>
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        value={tempData.primaryButton.text}
                        onChange={(e) => handleTextChange("primaryButton.text", e.target.value)}
                        className="px-6 py-3 bg-[#f1601f] text-white font-medium rounded-lg border-none focus:ring-2 focus:ring-yellow-400 text-center min-w-[200px]"
                      />
                      <input
                        type="text"
                        value={tempData.primaryButton.link}
                        onChange={(e) => handleTextChange("primaryButton.link", e.target.value)}
                        className="px-3 py-1 text-sm bg-gray-100 rounded border-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Button link"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        value={tempData.secondaryButton.text}
                        onChange={(e) => handleTextChange("secondaryButton.text", e.target.value)}
                        className="px-6 py-3 bg-white border border-[#a6adb5] text-[#0b1d34] font-medium rounded-lg focus:ring-2 focus:ring-yellow-400 text-center min-w-[180px]"
                      />
                      <input
                        type="text"
                        value={tempData.secondaryButton.link}
                        onChange={(e) => handleTextChange("secondaryButton.link", e.target.value)}
                        className="px-3 py-1 text-sm bg-gray-100 rounded border-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Button link"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <a
                      href={data.primaryButton.link}
                      className="px-6 py-3 bg-[#f1601f] text-white font-medium rounded-lg hover:bg-[#d95417] transition-colors text-center"
                    >
                      {data.primaryButton.text}
                    </a>
                    <a
                      href={data.secondaryButton.link}
                      className="px-6 py-3 bg-white border border-[#a6adb5] text-[#0b1d34] font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
                    >
                      {data.secondaryButton.text}
                    </a>
                  </>
                )}
              </div>
            </div>
            
            {/* Right Expertise Section - Adjusted margins */}
            <div className="md:w-1/2 flex justify-center md:ml-8 lg:ml-12">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -right-4 w-full h-full border-2 border-[#f1601f] rounded-xl"></div>
                <div className="relative bg-gradient-to-br from-[#0b1d34] to-[#13344c] rounded-xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-4">Our Expertise</h3>
                  
                  {/* Add new expertise button */}
                  {editMode && (
                    <button
                      onClick={addNewExpertise}
                      className="mb-4 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg flex items-center gap-2 text-sm w-full justify-center transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Expertise Item
                    </button>
                  )}
                  
                  <ul className="space-y-3">
                    {tempData.expertiseItems.map((item, index) => (
                      <li key={index} className="flex items-start group relative">
                        {editMode && (
                          <button
                            onClick={() => removeExpertise(index)}
                            className="absolute -left-8 top-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            title="Remove this item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                        
                        <svg
                          className="w-5 h-5 text-[#f1601f] mr-2 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        
                        {editMode ? (
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => handleExpertiseChange(index, e.target.value)}
                            className="bg-transparent border-none text-white focus:ring-2 focus:ring-yellow-400 rounded w-full py-1"
                          />
                        ) : (
                          <span>{item.text}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BuildingFoundation;