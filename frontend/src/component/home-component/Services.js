import { ArrowRight, Briefcase, Building2, CheckCircle, HardHat, Users, Wrench, Edit, Save, X, Plus, Trash2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2';

const Services = () => {
    const [activeService, setActiveService] = useState(0);
    const [data, setData] = useState(null);
    const [tempData, setTempData] = useState(null);
    const [editMode, setEditMode] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [showServiceModal, setShowServiceModal] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
    const ENDPOINT = `${API_BASE}/home/services/`;

    // Sample JSON structure expected from API
    const sampleData = {
        "preTitle": "Our Services",
        "title": "Comprehensive Solutions for",
        "highlightedTitle": "Every Construction Need",
        "description": "From groundbreaking to project completion, we deliver integrated services that exceed expectations",
        "services": [
            {
                "icon": "Building2",
                "title": "General Contracting",
                "subtitle": "Building Excellence",
                "description": "From concept to completion, we deliver comprehensive construction solutions with unmatched precision and quality.",
                "features": ["Commercial Buildings", "Industrial Facilities", "Infrastructure Projects", "Turnkey Solutions"],
                "color": "from-orange-500 to-red-600",
                "modalContent": {
                    "title": "General Contracting Services",
                    "description": "Our general contracting services encompass the entire construction lifecycle, from initial planning and design to final execution and project delivery. We combine technical expertise with practical experience to ensure your project is completed on time, within budget, and to the highest quality standards.",
                    "details": [
                        "Complete project management and supervision",
                        "Quality control and assurance systems",
                        "Budget management and cost optimization",
                        "Timeline planning and execution",
                        "Stakeholder coordination and communication"
                    ]
                }
            },
            {
                "icon": "HardHat",
                "title": "Civil & MEP Works",
                "subtitle": "Engineering Mastery",
                "description": "Advanced mechanical, electrical, and plumbing solutions that power modern infrastructure.",
                "features": ["HVAC Systems", "Electrical Installations", "Plumbing Networks", "Fire Safety Systems"],
                "color": "from-blue-900 to-blue-700",
                "modalContent": {
                    "title": "Civil & MEP Engineering",
                    "description": "Specialized civil engineering and MEP services that form the backbone of modern infrastructure. Our team of certified engineers and technicians deliver innovative solutions for complex mechanical, electrical, and plumbing systems.",
                    "details": [
                        "HVAC system design and installation",
                        "Electrical power distribution systems",
                        "Plumbing and sanitation networks",
                        "Fire protection and safety systems",
                        "Building automation and controls"
                    ]
                }
            },
            {
                "icon": "Users",
                "title": "Manpower Supply",
                "subtitle": "Skilled Workforce",
                "description": "Access to highly trained professionals across all construction disciplines and specializations.",
                "features": ["Engineers & Technicians", "Skilled Labor", "Project Management", "Quality Assurance Teams"],
                "color": "from-orange-600 to-orange-800",
                "modalContent": {
                    "title": "Skilled Manpower Solutions",
                    "description": "We provide comprehensive manpower solutions with qualified professionals across all construction domains. Our rigorous selection process ensures you get the right talent for your specific project requirements.",
                    "details": [
                        "Certified engineers and supervisors",
                        "Skilled and semi-skilled labor",
                        "Safety officers and quality inspectors",
                        "Project managers and coordinators",
                        "Technical support staff"
                    ]
                }
            },
            {
                "icon": "Wrench",
                "title": "Maintenance Services",
                "subtitle": "Ongoing Support",
                "description": "Comprehensive facility management and maintenance solutions to ensure optimal performance.",
                "features": ["Preventive Maintenance", "Emergency Repairs", "Facility Management", "Asset Optimization"],
                "color": "from-slate-700 to-slate-900",
                "modalContent": {
                    "title": "Maintenance & Facility Management",
                    "description": "Our maintenance services ensure your facilities operate at peak efficiency with minimal downtime. We offer both preventive and corrective maintenance solutions tailored to your specific needs.",
                    "details": [
                        "Scheduled preventive maintenance programs",
                        "24/7 emergency repair services",
                        "Facility management and optimization",
                        "Equipment lifecycle management",
                        "Energy efficiency improvements"
                    ]
                }
            },
            {
                "icon": "Briefcase",
                "title": "Trading & Supply",
                "subtitle": "Quality Materials",
                "description": "Premium construction materials and equipment sourced from trusted global suppliers.",
                "features": ["Construction Materials", "Heavy Equipment", "Safety Gear", "Technical Supplies"],
                "color": "from-orange-500 to-orange-700",
                "modalContent": {
                    "title": "Trading & Material Supply",
                    "description": "We supply high-quality construction materials and equipment from reputable manufacturers worldwide. Our extensive network ensures competitive pricing and timely delivery for all your project needs.",
                    "details": [
                        "Construction materials and aggregates",
                        "Heavy machinery and equipment",
                        "Safety equipment and personal protective gear",
                        "Tools and technical supplies",
                        "Import and logistics support"
                    ]
                }
            }
        ]
    };

    // Icon mapping
    const iconMap = {
        Building2: Building2,
        HardHat: HardHat,
        Users: Users,
        Wrench: Wrench,
        Briefcase: Briefcase,
        ArrowRight: ArrowRight,
        CheckCircle: CheckCircle
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
                console.error("Error fetching services data:", error);
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
        return localStorage.getItem("authToken");
    };

    // Toggle edit mode for individual service
    const toggleServiceEditMode = (index) => {
        if (!isAdmin()) {
            Swal.fire({
                icon: 'warning',
                title: 'Admin Access Required',
                text: 'Please log in to edit services.',
                confirmButtonColor: '#f1601f',
            });
            return;
        }

        if (editMode[index]) {
            // Exiting edit mode for this service - reset to original data
            setTempData(prev => {
                const newData = {...prev};
                newData.services[index] = {...data.services[index]};
                return newData;
            });
        }
        
        setEditMode(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
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

    // Handle service changes
    const handleServiceChange = (index, field, value) => {
        setTempData(prev => {
            const newData = {...prev};
            newData.services[index][field] = value;
            return newData;
        });
    };

    // Handle modal content changes
    const handleModalContentChange = (serviceIndex, field, value) => {
        setTempData(prev => {
            const newData = {...prev};
            newData.services[serviceIndex].modalContent[field] = value;
            return newData;
        });
    };

    // Handle feature changes
    const handleFeatureChange = (serviceIndex, featureIndex, value) => {
        setTempData(prev => {
            const newData = {...prev};
            newData.services[serviceIndex].features[featureIndex] = value;
            return newData;
        });
    };

    // Handle modal detail changes
    const handleModalDetailChange = (serviceIndex, detailIndex, value) => {
        setTempData(prev => {
            const newData = {...prev};
            newData.services[serviceIndex].modalContent.details[detailIndex] = value;
            return newData;
        });
    };

    // Add new feature
    const addNewFeature = (serviceIndex) => {
        setTempData(prev => {
            const newData = {...prev};
            newData.services[serviceIndex].features.push("New Feature");
            return newData;
        });
    };

    // Remove feature
    const removeFeature = (serviceIndex, featureIndex) => {
        setTempData(prev => {
            const newData = {...prev};
            newData.services[serviceIndex].features = newData.services[serviceIndex].features.filter((_, i) => i !== featureIndex);
            return newData;
        });
    };

    // Add new modal detail
    const addNewModalDetail = (serviceIndex) => {
        setTempData(prev => {
            const newData = {...prev};
            newData.services[serviceIndex].modalContent.details.push("New Detail");
            return newData;
        });
    };

    // Remove modal detail
    const removeModalDetail = (serviceIndex, detailIndex) => {
        setTempData(prev => {
            const newData = {...prev};
            newData.services[serviceIndex].modalContent.details = newData.services[serviceIndex].modalContent.details.filter((_, i) => i !== detailIndex);
            return newData;
        });
    };

    // Add new service with SweetAlert
    const addNewService = () => {
        if (!isAdmin()) {
            Swal.fire({
                icon: 'warning',
                title: 'Admin Access Required',
                text: 'Please log in to add services.',
                confirmButtonColor: '#f1601f',
            });
            return;
        }

        Swal.fire({
            title: 'Add New Service',
            html: `
                <input type="text" id="serviceTitle" class="swal2-input" placeholder="Service Title">
                <input type="text" id="serviceSubtitle" class="swal2-input" placeholder="Service Subtitle">
                <textarea id="serviceDescription" class="swal2-textarea" placeholder="Service Description" rows="3"></textarea>
                <select id="serviceIcon" class="swal2-input">
                    <option value="Building2">Building</option>
                    <option value="HardHat">Hard Hat</option>
                    <option value="Users">Users</option>
                    <option value="Wrench">Wrench</option>
                    <option value="Briefcase">Briefcase</option>
                </select>
                <select id="serviceColor" class="swal2-input">
                    <option value="from-orange-500 to-red-600">Orange to Red</option>
                    <option value="from-blue-900 to-blue-700">Blue to Dark Blue</option>
                    <option value="from-orange-600 to-orange-800">Orange to Dark Orange</option>
                    <option value="from-slate-700 to-slate-900">Slate to Dark Slate</option>
                    <option value="from-orange-500 to-orange-700">Orange Gradient</option>
                </select>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#f1601f',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Add Service',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                const title = Swal.getPopup().querySelector('#serviceTitle').value;
                const subtitle = Swal.getPopup().querySelector('#serviceSubtitle').value;
                const description = Swal.getPopup().querySelector('#serviceDescription').value;
                const icon = Swal.getPopup().querySelector('#serviceIcon').value;
                const color = Swal.getPopup().querySelector('#serviceColor').value;

                if (!title || !subtitle || !description) {
                    Swal.showValidationMessage('Please fill in all required fields');
                    return false;
                }

                return { title, subtitle, description, icon, color };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const newService = {
                    icon: result.value.icon,
                    title: result.value.title,
                    subtitle: result.value.subtitle,
                    description: result.value.description,
                    color: result.value.color,
                    features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
                    modalContent: {
                        title: result.value.title + " Details",
                        description: result.value.description,
                        details: ["Detail 1", "Detail 2", "Detail 3", "Detail 4"]
                    }
                };

                setTempData(prev => ({
                    ...prev,
                    services: [...prev.services, newService]
                }));

                Swal.fire({
                    icon: 'success',
                    title: 'Service Added',
                    text: 'New service has been added successfully.',
                    confirmButtonColor: '#f1601f',
                    timer: 1500
                });
            }
        });
    };

    // Remove service with SweetAlert confirmation
    const removeService = (index) => {
        if (tempData.services.length <= 1) {
            Swal.fire({
                icon: 'warning',
                title: 'Cannot Remove',
                text: 'You must have at least one service.',
                confirmButtonColor: '#f1601f',
            });
            return;
        }

        Swal.fire({
            title: 'Remove Service?',
            text: `Are you sure you want to remove "${tempData.services[index].title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Remove',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                setTempData(prev => ({
                    ...prev,
                    services: prev.services.filter((_, i) => i !== index)
                }));
                // Also exit edit mode if this service was being edited
                setEditMode(prev => ({
                    ...prev,
                    [index]: false
                }));
                Swal.fire({
                    icon: 'success',
                    title: 'Removed',
                    text: 'Service has been removed successfully.',
                    confirmButtonColor: '#f1601f',
                    timer: 1500
                });
            }
        });
    };

    // Save changes with SweetAlert
    const saveChanges = async () => {
        if (!isAdmin()) {
            Swal.fire({
                icon: 'warning',
                title: 'Authentication Required',
                text: 'Please log in to save changes.',
                confirmButtonColor: '#f1601f',
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
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify(tempData)
            });

            if (!response.ok) throw new Error("Failed to save changes");

            const updatedData = await response.json();
            setData(updatedData);
            // Exit all edit modes
            setEditMode({});
            
            Swal.fire({
                icon: 'success',
                title: 'Changes Saved!',
                text: 'All changes have been saved successfully.',
                confirmButtonColor: '#f1601f',
                timer: 2000
            });
        } catch (error) {
            console.error("Error saving services data:", error);
            Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: 'Failed to save changes. Please try again.',
                confirmButtonColor: '#f1601f',
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Handle learn more button click
    const handleLearnMore = (service, index) => {
        if (editMode[index]) {
            // In edit mode, don't open modal, allow editing instead
            return;
        }
        setSelectedService(service);
        setShowServiceModal(true);
    };

    // Close service modal
    const closeServiceModal = () => {
        setShowServiceModal(false);
        setSelectedService(null);
    };

    if (isLoading) {
        return (
            <section className="py-32 bg-gradient-to-b from-gray-50 to-white flex justify-center items-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                    <p className="mt-4 text-gray-600">Loading services...</p>
                </div>
            </section>
        );
    }

    if (!data) {
        return (
            <section className="py-32 bg-gradient-to-b from-gray-50 to-white flex justify-center items-center">
                <div className="text-center">
                    <p className="text-gray-600">Failed to load services. Please try again later.</p>
                </div>
            </section>
        );
    }

    return (
        <>
            <section
                id="services"
                className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
            >
                <div className="absolute inset-0 opacity-5">
                    <div
                        className="absolute top-0 left-0 w-full h-full"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle, #f1601f 1px, transparent 1px)",
                            backgroundSize: "50px 50px",
                        }}
                    ></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                            {data.preTitle}
                        </span>
                        
                        <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
                            {data.title}
                            <br />
                            {data.highlightedTitle}
                        </h2>
                        
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {data.description}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        {tempData.services.map((service, i) => {
                            const IconComponent = iconMap[service.icon];
                            const isEditing = editMode[i];
                            
                            return (
                                <div
                                    key={i}
                                    onMouseEnter={() => setActiveService(i)}
                                    className={`group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ${
                                        activeService === i ? "scale-105 z-10" : ""
                                    }`}
                                >
                                    {/* Service Edit Controls */}
                                    {isAdmin() && (
                                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => toggleServiceEditMode(i)}
                                                        className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-all duration-300"
                                                        title="Cancel Editing"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={saveChanges}
                                                        disabled={isSaving}
                                                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-all duration-300"
                                                        title="Save Changes"
                                                    >
                                                        {isSaving ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                                        ) : (
                                                            <Save className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => toggleServiceEditMode(i)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-300"
                                                    title="Edit Service"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => removeService(i)}
                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-300"
                                                title="Remove Service"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Edit Mode Overlay for individual service */}
                                    {isEditing && (
                                        <div className="absolute inset-0 border-4 border-yellow-400 pointer-events-none z-10 rounded-3xl">
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                                                EDITING SERVICE
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-0 group-hover:opacity-95 transition-opacity duration-500"></div>

                                    <div className="relative p-10">
                                        <div className="flex items-start justify-between mb-6">
                                            <div
                                                className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                                            >
                                                <IconComponent className="text-white" size={36} />
                                            </div>
                                            <div className="text-6xl font-black text-gray-100 group-hover:text-white/10 transition-colors duration-500">
                                                0{i + 1}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                {isEditing ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={service.subtitle}
                                                            onChange={(e) => handleServiceChange(i, "subtitle", e.target.value)}
                                                            className="text-sm font-bold text-[#f1601f] bg-transparent border-none focus:ring-2 focus:ring-yellow-400 rounded w-full mb-1 p-1 bg-white/80"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={service.title}
                                                            onChange={(e) => handleServiceChange(i, "title", e.target.value)}
                                                            className="text-3xl font-black text-[#0b1d34] bg-transparent border-none focus:ring-2 focus:ring-yellow-400 rounded w-full p-1 bg-white/80"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="text-sm font-bold text-[#f1601f] group-hover:text-orange-400 transition-colors duration-300">
                                                            {service.subtitle}
                                                        </div>
                                                        <h3 className="text-3xl font-black text-[#0b1d34] group-hover:text-white transition-colors duration-300">
                                                            {service.title}
                                                        </h3>
                                                    </>
                                                )}
                                            </div>

                                            {isEditing ? (
                                                <textarea
                                                    value={service.description}
                                                    onChange={(e) => handleServiceChange(i, "description", e.target.value)}
                                                    className="text-gray-600 bg-transparent border-none focus:ring-2 focus:ring-yellow-400 rounded w-full leading-relaxed p-2 bg-white/80"
                                                    rows="3"
                                                />
                                            ) : (
                                                <p className="text-gray-600 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                                                    {service.description}
                                                </p>
                                            )}

                                            <div className="grid grid-cols-2 gap-3 pt-4">
                                                {service.features.map((feature, j) => (
                                                    <div
                                                        key={j}
                                                        className="flex items-center space-x-2 text-sm relative"
                                                    >
                                                        <CheckCircle
                                                            className="text-[#f1601f] group-hover:text-green-400 flex-shrink-0"
                                                            size={16}
                                                        />
                                                        {isEditing ? (
                                                            <div className="flex items-center space-x-1 w-full">
                                                                <input
                                                                    type="text"
                                                                    value={feature}
                                                                    onChange={(e) => handleFeatureChange(i, j, e.target.value)}
                                                                    className="text-gray-700 bg-transparent border-none focus:ring-2 focus:ring-yellow-400 rounded flex-1 p-1 bg-white/80"
                                                                />
                                                                <button
                                                                    onClick={() => removeFeature(i, j)}
                                                                    className="text-red-500 hover:text-red-700"
                                                                    title="Remove feature"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-700 group-hover:text-white transition-colors duration-300">
                                                                {feature}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                                
                                                {/* Add new feature button */}
                                                {isEditing && (
                                                    <div 
                                                        className="flex items-center space-x-2 text-sm text-gray-500 cursor-pointer hover:text-gray-700 col-span-2"
                                                        onClick={() => addNewFeature(i)}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        <span>Add Feature</span>
                                                    </div>
                                                )}
                                            </div>

                                            <button 
                                                onClick={() => handleLearnMore(service, i)}
                                                className="mt-6 inline-flex items-center space-x-2 text-[#f1601f] group-hover:text-white font-bold transition-colors duration-300"
                                            >
                                                <span>Learn More</span>
                                                <ArrowRight
                                                    className="group-hover:translate-x-2 transition-transform duration-300"
                                                    size={20}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* Add new service button */}
                        {isAdmin() && (
                            <div 
                                className="border-2 border-dashed border-gray-300 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all duration-300 min-h-[400px]"
                                onClick={addNewService}
                            >
                                <Plus className="w-16 h-16 text-gray-400 mb-4" />
                                <span className="text-gray-600 font-medium text-lg">Add New Service</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Service Detail Modal */}
            {showServiceModal && selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-3xl font-black text-[#0b1d34] mb-2">
                                        {selectedService.modalContent?.title || selectedService.title}
                                    </h3>
                                    <p className="text-[#f1601f] font-bold">
                                        {selectedService.subtitle}
                                    </p>
                                </div>
                                <button
                                    onClick={closeServiceModal}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <p className="text-gray-600 mb-6">
                                {selectedService.modalContent?.description || selectedService.description}
                            </p>

                            <div className="space-y-3">
                                <h4 className="font-bold text-[#0b1d34] text-lg">Key Features:</h4>
                                {(selectedService.modalContent?.details || selectedService.features).map((detail, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <CheckCircle className="text-[#f1601f] mt-1 flex-shrink-0" size={18} />
                                        <span className="text-gray-700">{detail}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={closeServiceModal}
                                    className="bg-[#f1601f] text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors duration-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Services;