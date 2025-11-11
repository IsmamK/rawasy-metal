"use client";
import { ArrowRight, Award, Building2, Globe, Mail, Phone, Users, Edit, Save, X, Upload, Plus, Trash2 } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Hero = () => {
    const heroRef = useRef(null);
    const [data, setData] = useState(null);
    const [tempData, setTempData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingBackground, setUploadingBackground] = useState(false);
    const backgroundFileInputRef = useRef(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
    const ENDPOINT = `${API_BASE}/home/hero/`;

    // Sample JSON structure expected from API
    const sampleData = {
        "preTitle": "TRUSTED SINCE 2008",
        "title": "Building",
        "highlightedTitle": "Tomorrow's",
        "subtitle": "Infrastructure",
        "description": "Leading the Gulf region's construction excellence with innovative solutions, skilled workforce, and unwavering commitment to quality.",
        "primaryButton": {
            "text": "Explore Services",
            "link": "#services"
        },
        "secondaryButton": {
            "text": "View Projects",
            "link": "#projects"
        },
        "contact": {
            "phone": "+971 XX XXX XXXX",
            "email": "info@rawasy.com"
        },
        "stats": [
            { "icon": "Award", "number": "15+", "label": "Years of Excellence", "detail": "Industry Leadership" },
            { "icon": "Building2", "number": "800+", "label": "Projects Delivered", "detail": "Across Gulf Region" },
            { "icon": "Users", "number": "2000+", "label": "Skilled Workforce", "detail": "Ready to Deploy" },
            { "icon": "Globe", "number": "50+", "label": "Major Clients", "detail": "Trusted Partners" }
        ],
        "backgroundImage": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop"
    };

    // Icon mapping
    const iconMap = {
        Award: Award,
        Building2: Building2,
        Users: Users,
        Globe: Globe,
        Phone: Phone,
        Mail: Mail,
        ArrowRight: ArrowRight
    };

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
                console.error("Error fetching hero data:", error);
                // Fallback to sample data if API fails
                setData(sampleData);
                setTempData(sampleData);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [ENDPOINT]);

    // Check admin authentication
    const isAdmin = () => {
        if (typeof window !== 'undefined') {
            const authToken = localStorage.getItem("authToken");
            return !!authToken;
        }
        return false;
    };

    // Toggle edit mode - FIXED VERSION
    const toggleEditMode = () => {
        console.log("Toggle edit mode clicked");
        console.log("isAdmin:", isAdmin());
        
        if (!isAdmin()) {
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
            setEditMode(false);
            console.log("Edit mode disabled");
        } else {
            // Entering edit mode
            setEditMode(true);
            console.log("Edit mode enabled");
        }
    };

    const triggerFileInput = () => {
    console.log("Triggering file input");
    if (backgroundFileInputRef.current) {
      backgroundFileInputRef.current.click();
    }
  };

    // Handle text changes
    const handleTextChange = (path, value) => {
        const paths = path.split('.');
        setTempData(prev => {
            const newData = {...prev};
            let current = newData;
            
            for (let i = 0; i < paths.length - 1; i++) {
                if (!current[paths[i]]) {
                    current[paths[i]] = {};
                }
                current = current[paths[i]];
            }
            
            current[paths[paths.length - 1]] = value;
            return newData;
        });
    };

    // Handle stat changes
    const handleStatChange = (index, field, value) => {
        setTempData(prev => {
            const newData = {...prev};
            if (!newData.stats[index]) {
                newData.stats[index] = {};
            }
            newData.stats[index][field] = value;
            return newData;
        });
    };

    // Add new stat
    const addNewStat = () => {
        setTempData(prev => ({
            ...prev,
            stats: [
                ...prev.stats,
                {
                    icon: "Award",
                    number: "100+",
                    label: "New Achievement",
                    detail: "Additional Info"
                }
            ]
        }));
    };

    // Remove stat with confirmation
    const removeStat = async (index) => {
        if (tempData.stats.length <= 1) {
            Swal.fire({
                title: 'Cannot Remove',
                text: 'You must have at least one statistic.',
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
                stats: prev.stats.filter((_, i) => i !== index)
            }));
            
            Swal.fire({
                title: 'Removed!',
                text: 'Statistic has been removed.',
                icon: 'success',
                confirmButtonColor: '#f1601f',
            });
        }
    };

    // Handle background image upload - FIXED VERSION
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
        formData.append("category", "hero-background");

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
            // Reset the file input
            if (backgroundFileInputRef.current) {
                backgroundFileInputRef.current.value = '';
            }
        }
    };

    // Trigger background upload click
    const triggerBackgroundUpload = () => {
        if (backgroundFileInputRef.current) {
            backgroundFileInputRef.current.click();
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

    // Edit button in modal
    const editButtonInModal = async (buttonType, currentButton) => {
        const { value: formValues } = await Swal.fire({
            title: `Edit ${buttonType === 'primary' ? 'Primary' : 'Secondary'} Button`,
            html:
                `<input id="swal-input1" class="swal2-input" placeholder="Button Text" value="${currentButton.text}">` +
                `<input id="swal-input2" class="swal2-input" placeholder="Button Link" value="${currentButton.link}">`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#f1601f',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Update',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                return {
                    text: document.getElementById('swal-input1').value,
                    link: document.getElementById('swal-input2').value
                };
            }
        });

        if (formValues) {
            handleTextChange(`${buttonType}Button.text`, formValues.text);
            handleTextChange(`${buttonType}Button.link`, formValues.link);
        }
    };

    // Edit contact in modal
    const editContactInModal = async (field, currentValue, title) => {
        const { value: newValue } = await Swal.fire({
            title: title,
            input: 'text',
            inputLabel: `Edit ${field}`,
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
            handleTextChange(`contact.${field}`, newValue);
        }
    };

    // Edit stat in modal
    const editStatInModal = async (index, currentStat) => {
        const { value: formValues } = await Swal.fire({
            title: 'Edit Statistic',
            html:
                `<select id="swal-input1" class="swal2-input">
                    <option value="Award" ${currentStat.icon === 'Award' ? 'selected' : ''}>Award</option>
                    <option value="Building2" ${currentStat.icon === 'Building2' ? 'selected' : ''}>Building</option>
                    <option value="Users" ${currentStat.icon === 'Users' ? 'selected' : ''}>Users</option>
                    <option value="Globe" ${currentStat.icon === 'Globe' ? 'selected' : ''}>Globe</option>
                </select>` +
                `<input id="swal-input2" class="swal2-input" placeholder="Number" value="${currentStat.number}">` +
                `<input id="swal-input3" class="swal2-input" placeholder="Label" value="${currentStat.label}">` +
                `<input id="swal-input4" class="swal2-input" placeholder="Detail" value="${currentStat.detail}">`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#f1601f',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Update',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                return {
                    icon: document.getElementById('swal-input1').value,
                    number: document.getElementById('swal-input2').value,
                    label: document.getElementById('swal-input3').value,
                    detail: document.getElementById('swal-input4').value
                };
            }
        });

        if (formValues) {
            handleStatChange(index, 'icon', formValues.icon);
            handleStatChange(index, 'number', formValues.number);
            handleStatChange(index, 'label', formValues.label);
            handleStatChange(index, 'detail', formValues.detail);
        }
    };

    if (isLoading) {
        return (
            <section className="relative min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                    <p className="mt-4 text-gray-300">Loading hero section...</p>
                </div>
            </section>
        );
    }

    if (!data) {
        return (
            <section className="relative min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                    <p className="text-gray-300">Failed to load hero section. Please try again later.</p>
                </div>
            </section>
        );
    }

    return (
        <>
            <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Edit Mode Toggle Button - ALWAYS VISIBLE FOR ADMIN */}
                {isAdmin() && (
                    <div className="absolute top-4 right-4 z-50">
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
                    <div className="absolute inset-0 border-4 border-yellow-400 pointer-events-none z-10 flex items-center justify-center">
                        <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                            EDIT MODE ENABLED - Click on any content to edit
                        </span>
                    </div>
                )}

                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black"></div>
                    
                    {/* Background Image with Edit Option */}
                    <div className="absolute inset-0">
                              {editMode ? (
                                <div className="relative h-full">
                                  {uploadingBackground ? (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                      <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto mb-2"></div>
                                        <p className="text-white text-sm">Uploading background...</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="absolute inset-0 opacity-10">
                                        <img src={tempData.backgroundImage} alt="" className="w-full h-full object-cover" />
                                      </div>
                                      {/* FIXED: Background upload button */}
                                      <button
                                        onClick={triggerFileInput}
                                        className="absolute top-4 left-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 z-30 shadow-lg transition-colors"
                                        title="Change background image"
                                        style={{ zIndex: 1000 }}
                                      >
                                        <Upload className="w-5 h-5" />
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
                                  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/10 rounded-full blur-3xl animate-pulse" />
                                  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                                </div>
                              ) : (
                                <>
                                  <div className="absolute inset-0 opacity-10">
                                    <img src={data.backgroundImage} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/10 rounded-full blur-3xl animate-pulse" />
                                  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                                </>
                              )}
                            </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {/* Animated shapes */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-block">
                                <div 
                                    onClick={editMode ? () => editTextInModal('preTitle', tempData.preTitle, 'Edit Pre-Title', 'Update the pre-title text') : undefined}
                                    className={`flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 ${editMode ? 'cursor-pointer hover:bg-white/20 transition-all duration-300' : ''}`}
                                >
                                    <div className="w-2 h-2 bg-[#f1601f] rounded-full animate-pulse"></div>
                                    <span className="text-white font-semibold text-sm tracking-wider">
                                        {tempData.preTitle}
                                    </span>
                                </div>
                            </div>
                            
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none">
                                {editMode ? (
                                    <div className="space-y-4">
                                        <div 
                                            onClick={() => editTextInModal('title', tempData.title, 'Edit Title', 'Update the main title text')}
                                            className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300"
                                        >
                                            <span className="text-white">
                                                {tempData.title}
                                            </span>
                                        </div>
                                        <div 
                                            onClick={() => editTextInModal('highlightedTitle', tempData.highlightedTitle, 'Edit Highlighted Title', 'Update the highlighted title text')}
                                            className="cursor-pointer bg-gradient-to-r from-[#f1601f] via-orange-500 to-[#7f3e2c] rounded-lg p-4 hover:from-[#f1601f] hover:to-orange-600 transition-all duration-300"
                                        >
                                            <span className="text-white">
                                                {tempData.highlightedTitle}
                                            </span>
                                        </div>
                                        <div 
                                            onClick={() => editTextInModal('subtitle', tempData.subtitle, 'Edit Subtitle', 'Update the subtitle text')}
                                            className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300"
                                        >
                                            <span className="text-white">
                                                {tempData.subtitle}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-white block">{data.title}</span>
                                        <span className="bg-gradient-to-r from-[#f1601f] via-orange-500 to-[#7f3e2c] bg-clip-text text-transparent block">{data.highlightedTitle}</span>
                                        <span className="text-white block">{data.subtitle}</span>
                                    </>
                                )}
                            </h1>
                            
                            {editMode ? (
                                <div 
                                    onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text')}
                                    className="cursor-pointer bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 text-xl md:text-2xl text-gray-300 w-full max-w-2xl p-6 rounded-lg hover:bg-white/20 transition-all duration-300"
                                >
                                    {tempData.description}
                                </div>
                            ) : (
                                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                                    {data.description}
                                </p>
                            )}
                            
                            <div className="flex flex-wrap gap-4">
                                {editMode ? (
                                    <>
                                        <div 
                                            onClick={() => editButtonInModal('primary', tempData.primaryButton)}
                                            className="cursor-pointer group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center space-x-3 border-2 border-dashed border-white/50"
                                        >
                                            <span>{tempData.primaryButton.text}</span>
                                            <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                                        </div>
                                        <div 
                                            onClick={() => editButtonInModal('secondary', tempData.secondaryButton)}
                                            className="cursor-pointer bg-white/10 backdrop-blur-sm text-white px-8 py-5 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300 border-dashed"
                                        >
                                            {tempData.secondaryButton.text}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <a href={data.primaryButton.link} className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center space-x-3">
                                            <span>{data.primaryButton.text}</span>
                                            <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                                        </a>
                                        <a href={data.secondaryButton.link} className="bg-white/10 backdrop-blur-sm text-white px-8 py-5 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-white hover:text-[#0b1d34] transition-all duration-300">
                                            {data.secondaryButton.text}
                                        </a>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center space-x-8 pt-8">
                                {[
                                    { icon: Phone, field: "phone", text: tempData.contact.phone, label: "Phone Number" },
                                    { icon: Mail, field: "email", text: tempData.contact.email, label: "Email Address" }
                                ].map((contact, i) => (
                                    <div 
                                        key={i} 
                                        onClick={editMode ? () => editContactInModal(contact.field, contact.text, `Edit ${contact.label}`) : undefined}
                                        className={`flex items-center space-x-3 text-gray-300 hover:text-[#f1601f] transition-colors duration-300 ${editMode ? 'cursor-pointer' : ''}`}
                                    >
                                        <contact.icon size={20} />
                                        <span className="text-sm font-medium">{contact.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative hidden lg:block">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                                <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 space-y-6">
                                    {tempData.stats.map((stat, index) => {
                                        const IconComponent = iconMap[stat.icon];
                                        return (
                                            <div 
                                                key={index} 
                                                onClick={editMode ? () => editStatInModal(index, stat) : undefined}
                                                className={`flex items-center space-x-4 group cursor-pointer relative ${editMode ? 'hover:bg-white/10 rounded-lg p-2 transition-all duration-300' : ''}`}
                                            >
                                                {editMode && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeStat(index);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-10 transition-all duration-300"
                                                        title="Remove this stat"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                )}
                                                <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <IconComponent className="text-white" size={28} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-4xl font-black text-white">{stat.number}</div>
                                                    <div className="text-gray-400 font-medium">{stat.label}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {/* Add new stat button */}
                                    {editMode && (
                                        <div 
                                            className="border-2 border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all duration-300"
                                            onClick={addNewStat}
                                        >
                                            <Plus className="w-8 h-8 text-white/50 mb-2" />
                                            <span className="text-white/70 text-sm font-medium">Add New Stat</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                        <div className="w-1.5 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="relative -mt-20 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] rounded-3xl shadow-2xl p-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {tempData.stats.map((stat, index) => {
                                const IconComponent = iconMap[stat.icon];
                                return (
                                    <div 
                                        key={index} 
                                        onClick={editMode ? () => editStatInModal(index, stat) : undefined}
                                        className={`text-center group cursor-pointer relative ${editMode ? 'hover:bg-white/10 rounded-lg p-4 transition-all duration-300' : ''}`}
                                    >
                                        {editMode && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeStat(index);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-10 transition-all duration-300"
                                                title="Remove this stat"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                                            <IconComponent className="text-white" size={32} />
                                        </div>
                                        <div className="text-5xl font-black text-white mb-2">{stat.number}</div>
                                        <div className="text-white/90 font-bold text-lg">{stat.label}</div>
                                        <div className="text-white/70 text-sm">{stat.detail}</div>
                                    </div>
                                );
                            })}
                            
                            {/* Add new stat button for mobile */}
                            {editMode && (
                                <div 
                                    className="col-span-2 lg:col-span-4 border-2 border-dashed border-white/30 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all duration-300"
                                    onClick={addNewStat}
                                >
                                    <Plus className="w-12 h-12 text-white/50 mb-4" />
                                    <span className="text-white/80 font-medium">Add New Statistic</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Hero;