"use client";
import { Award, Clock, Shield, Target, Users, Zap, Edit, Save, X, Plus, Trash2, Upload } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";

const WhyChooseUs = () => {
  const [data, setData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  const fileInputRefs = useRef({});

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/home/why-choose-us/`;

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
        setData({
          preTitle: "Why Choose RAWASY",
          title: "What Sets Us Apart",
          features: [
            {
              icon: "Target",
              title: "Proven Track Record",
              desc: "Over 800 successfully delivered projects across diverse sectors with 100% client satisfaction rate",
            },
            {
              icon: "Users",
              title: "Expert Workforce",
              desc: "2000+ certified professionals including engineers, technicians, and skilled craftsmen ready to deploy",
            },
            {
              icon: "Shield",
              title: "Safety Excellence",
              desc: "Zero-harm workplace culture with OHSAS 18001 certification and rigorous safety protocols",
            },
            {
              icon: "Clock",
              title: "Timely Delivery",
              desc: "Advanced project management systems ensuring on-time completion without compromising quality",
            },
            {
              icon: "Award",
              title: "Quality Assurance",
              desc: "ISO 9001:2015 certified processes with comprehensive quality control at every project phase",
            },
            {
              icon: "Zap",
              title: "Innovation Driven",
              desc: "Cutting-edge construction technologies and methodologies for optimal efficiency and results",
            },
          ]
        });
        setTempData({
          preTitle: "Why Choose RAWASY",
          title: "What Sets Us Apart",
          features: [
            {
              icon: "Target",
              title: "Proven Track Record",
              desc: "Over 800 successfully delivered projects across diverse sectors with 100% client satisfaction rate",
            },
            {
              icon: "Users",
              title: "Expert Workforce",
              desc: "2000+ certified professionals including engineers, technicians, and skilled craftsmen ready to deploy",
            },
            {
              icon: "Shield",
              title: "Safety Excellence",
              desc: "Zero-harm workplace culture with OHSAS 18001 certification and rigorous safety protocols",
            },
            {
              icon: "Clock",
              title: "Timely Delivery",
              desc: "Advanced project management systems ensuring on-time completion without compromising quality",
            },
            {
              icon: "Award",
              title: "Quality Assurance",
              desc: "ISO 9001:2015 certified processes with comprehensive quality control at every project phase",
            },
            {
              icon: "Zap",
              title: "Innovation Driven",
              desc: "Cutting-edge construction technologies and methodologies for optimal efficiency and results",
            },
          ]
        });
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
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [data]); // Re-run when data changes

  // Toggle edit mode
  const toggleEditMode = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Admin access required. Please log in.");
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

  // Handle feature changes
  const handleFeatureChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.features[index][field] = value;
      return newData;
    });
  };

  // Add new feature
  const addNewFeature = () => {
    setTempData(prev => ({
      ...prev,
      features: [
        ...prev.features,
        {
          icon: "Target",
          title: "New Feature",
          desc: "Description of the new feature",
        }
      ]
    }));
  };

  // Remove feature
  const removeFeature = (index) => {
    if (tempData.features.length <= 1) {
      alert("You must have at least one feature");
      return;
    }
    
    setTempData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Save changes
  const saveChanges = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication required to save changes");
      return;
    }

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
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  // Icon mapping
  const iconMap = {
    Target: Target,
    Users: Users,
    Shield: Shield,
    Clock: Clock,
    Award: Award,
    Zap: Zap,
  };

  if (isLoading) {
    return (
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f1601f]"></div>
          <p className="mt-4 text-gray-600">Loading features...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load features. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white relative" id="why-choose-us" data-animate>
        {/* Edit Mode Toggle Button */}
        {localStorage.getItem("authToken") && (
          <div className="absolute top-8 right-8 z-10">
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
          <div className="absolute inset-0 border-4 border-yellow-400 pointer-events-none z-0 flex items-center justify-center">
            <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
              EDIT MODE ENABLED - Click on any content to edit
            </span>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-1">
          <div className="text-center mb-20">
            {editMode ? (
              <input
                type="text"
                value={tempData.preTitle}
                onChange={(e) => handleTextChange("preTitle", e.target.value)}
                className="text-[#f1601f] font-bold text-sm tracking-widest uppercase bg-transparent border-none text-center focus:ring-2 focus:ring-yellow-400 rounded block mx-auto"
                style={{ width: `${tempData.preTitle.length + 2}ch` }}
              />
            ) : (
              <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                {data.preTitle}
              </span>
            )}
            
            {editMode ? (
              <input
                type="text"
                value={tempData.title}
                onChange={(e) => handleTextChange("title", e.target.value)}
                className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6 bg-transparent border-none text-center focus:ring-2 focus:ring-yellow-400 rounded block mx-auto w-full max-w-4xl"
              />
            ) : (
              <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
                {data.title}
              </h2>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {tempData.features.map((feature, i) => {
              const IconComponent = iconMap[feature.icon] || Target;
              
              return (
                <div key={i} className="relative group">
                  {/* Delete button for features */}
                  {editMode && (
                    <button
                      onClick={() => removeFeature(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10"
                      title="Remove this feature"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white border-2 border-gray-100 group-hover:border-transparent rounded-3xl p-10 group-hover:text-white transition-all duration-500">
                    <div className="flex items-center gap-4 mb-6">
                      <IconComponent
                        className="text-[#f1601f] group-hover:text-white group-hover:scale-110 transition-all duration-500 flex-shrink-0"
                        size={48}
                      />
                      {editMode && (
                        <select
                          value={feature.icon}
                          onChange={(e) => handleFeatureChange(i, "icon", e.target.value)}
                          className="bg-gray-100 border-none rounded px-2 py-1 text-sm focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="Target">Target</option>
                          <option value="Users">Users</option>
                          <option value="Shield">Shield</option>
                          <option value="Clock">Clock</option>
                          <option value="Award">Award</option>
                          <option value="Zap">Zap</option>
                        </select>
                      )}
                    </div>
                    
                    {editMode ? (
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => handleFeatureChange(i, "title", e.target.value)}
                        className="text-2xl font-black text-[#0b1d34] group-hover:text-white mb-4 w-full bg-transparent border-none focus:ring-2 focus:ring-yellow-400 rounded transition-colors duration-500"
                      />
                    ) : (
                      <h3 className="text-2xl font-black text-[#0b1d34] group-hover:text-white mb-4 transition-colors duration-500">
                        {feature.title}
                      </h3>
                    )}
                    
                    {editMode ? (
                      <textarea
                        value={feature.desc}
                        onChange={(e) => handleFeatureChange(i, "desc", e.target.value)}
                        className="text-gray-600 group-hover:text-white/90 leading-relaxed w-full bg-transparent border-none focus:ring-2 focus:ring-yellow-400 rounded transition-colors duration-500 resize-none"
                        rows="3"
                      />
                    ) : (
                      <p className="text-gray-600 group-hover:text-white/90 leading-relaxed transition-colors duration-500">
                        {feature.desc}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Add new feature button */}
            {editMode && (
              <div 
                className="bg-white rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer min-h-[300px] p-10"
                onClick={addNewFeature}
              >
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-gray-600 font-medium">Add New Feature</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyChooseUs;