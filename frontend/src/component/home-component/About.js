import {
  Award,
  Clock,
  Shield,
  Star,
  Target,
  Zap,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";

const About = () => {
  const [data, setData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  const fileInputRefs = useRef({});

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/home/about/`;

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
          preTitle: "About RAWASY",
          title: "Engineering Excellence Since 2008",
          description:
            "RAWASY stands as a premier contracting and trading company, delivering comprehensive construction, manpower, and industrial solutions across the Gulf region.",
          additionalDescription:
            "With over 15 years of proven expertise, we've built our reputation on reliability, innovation, and excellence. Our multidisciplinary team tackles projects of any scale and complexity, ensuring quality craftsmanship and timely delivery.",
          values: [
            {
              icon: "Target",
              title: "Excellence",
              desc: "Uncompromising quality in every project",
            },
            {
              icon: "Shield",
              title: "Safety First",
              desc: "Zero-harm workplace culture",
            },
            {
              icon: "Clock",
              title: "Timely Delivery",
              desc: "Meeting deadlines without exception",
            },
            {
              icon: "Zap",
              title: "Innovation",
              desc: "Cutting-edge construction methods",
            },
          ],
          certifications: [
            {
              title: "ISO 9001:2015",
              desc: "Quality Management",
              icon: "Award",
            },
            { title: "OHSAS 18001", desc: "Safety Standards", icon: "Shield" },
            {
              title: "Grade 1 License",
              desc: "Premium Contractor",
              icon: "Star",
            },
            { title: "ISO 14001", desc: "Environmental", icon: "Target" },
          ],
          stats: {
            completedProjects: "800+",
          },
          images: [
            "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=500&fit=crop",
            "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=600&fit=crop",
            "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=600&fit=crop",
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=500&fit=crop",
          ],
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
  }, [data]);

  // Toggle edit mode
  const toggleEditMode = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      Swal.fire({
        icon: "warning",
        title: "Admin Access Required",
        text: "Please log in to access edit mode.",
        confirmButtonColor: "#f1601f",
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
    const paths = path.split(".");
    setTempData((prev) => {
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < paths.length - 1; i++) {
        current = current[paths[i]];
      }

      current[paths[paths.length - 1]] = value;
      return newData;
    });
  };

  // Handle value changes
  const handleValueChange = (index, field, value) => {
    setTempData((prev) => {
      const newData = { ...prev };
      newData.values[index][field] = value;
      return newData;
    });
  };

  // Handle certification changes
  const handleCertificationChange = (index, field, value) => {
    setTempData((prev) => {
      const newData = { ...prev };
      newData.certifications[index][field] = value;
      return newData;
    });
  };

  // Add new value
  const addNewValue = () => {
    setTempData((prev) => ({
      ...prev,
      values: [
        ...prev.values,
        {
          icon: "Target",
          title: "New Value",
          desc: "Value description",
        },
      ],
    }));
  };

  // Add new certification
  const addNewCertification = () => {
    setTempData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          title: "New Certification",
          desc: "Certification description",
          icon: "Award",
        },
      ],
    }));
  };

  // Remove value
  const removeValue = async (index) => {
    if (tempData.values.length <= 1) {
      Swal.fire({
        icon: "warning",
        title: "Cannot Remove",
        text: "You must have at least one value",
        confirmButtonColor: "#f1601f",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setTempData((prev) => ({
        ...prev,
        values: prev.values.filter((_, i) => i !== index),
      }));

      Swal.fire({
        title: "Removed!",
        text: "The value has been removed.",
        icon: "success",
        confirmButtonColor: "#f1601f",
      });
    }
  };

  // Remove certification
  const removeCertification = async (index) => {
    if (tempData.certifications.length <= 1) {
      Swal.fire({
        icon: "warning",
        title: "Cannot Remove",
        text: "You must have at least one certification",
        confirmButtonColor: "#f1601f",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setTempData((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((_, i) => i !== index),
      }));

      Swal.fire({
        title: "Removed!",
        text: "The certification has been removed.",
        icon: "success",
        confirmButtonColor: "#f1601f",
      });
    }
  };

  // Handle image upload - EXACTLY LIKE CallToAction
  const handleImageUpload = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to upload images',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    setUploadingImages((prev) => ({ ...prev, [index]: true }));

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "about-images");

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

      // Update the specific image in the images array
      setTempData((prev) => {
        const newData = { ...prev };
        const newImages = [...newData.images];
        newImages[index] = result.image;
        return {
          ...newData,
          images: newImages,
        };
      });

      Swal.fire({
        icon: "success",
        title: "Image Uploaded!",
        text: "Image has been successfully updated.",
        confirmButtonColor: "#f1601f",
        timer: 2000,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to upload image. Please try again.",
        confirmButtonColor: "#f1601f",
      });
    } finally {
      setUploadingImages((prev) => ({ ...prev, [index]: false }));
    }
  };

  // Trigger file input click - EXACTLY LIKE CallToAction
  const triggerFileInput = (index) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].click();
    }
  };

  // Save changes - EXACTLY LIKE CallToAction
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

  // Cancel editing - EXACTLY LIKE CallToAction
  const cancelEditing = async () => {
    const result = await Swal.fire({
      title: "Cancel Editing?",
      text: "All unsaved changes will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel!",
      cancelButtonText: "Continue editing",
    });

    if (result.isConfirmed) {
      setTempData(data);
      setEditMode(false);
    }
  };

  // Edit text in modal - EXACTLY LIKE CallToAction
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

  // Edit value in modal - EXACTLY LIKE CallToAction
  const editValueInModal = async (index, currentValue) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Value',
      html:
        `<select id="swal-input1" class="swal2-input">
          <option value="Target" ${currentValue.icon === 'Target' ? 'selected' : ''}>Target</option>
          <option value="Shield" ${currentValue.icon === 'Shield' ? 'selected' : ''}>Shield</option>
          <option value="Clock" ${currentValue.icon === 'Clock' ? 'selected' : ''}>Clock</option>
          <option value="Zap" ${currentValue.icon === 'Zap' ? 'selected' : ''}>Zap</option>
          <option value="Award" ${currentValue.icon === 'Award' ? 'selected' : ''}>Award</option>
          <option value="Star" ${currentValue.icon === 'Star' ? 'selected' : ''}>Star</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Title" value="${currentValue.title}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Description" value="${currentValue.desc}">`,
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
          desc: document.getElementById('swal-input3').value
        };
      }
    });

    if (formValues) {
      handleValueChange(index, 'icon', formValues.icon);
      handleValueChange(index, 'title', formValues.title);
      handleValueChange(index, 'desc', formValues.desc);
    }
  };

  // Edit certification in modal - EXACTLY LIKE CallToAction
  const editCertificationInModal = async (index, currentCert) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Certification',
      html:
        `<select id="swal-input1" class="swal2-input">
          <option value="Award" ${currentCert.icon === 'Award' ? 'selected' : ''}>Award</option>
          <option value="Shield" ${currentCert.icon === 'Shield' ? 'selected' : ''}>Shield</option>
          <option value="Star" ${currentCert.icon === 'Star' ? 'selected' : ''}>Star</option>
          <option value="Target" ${currentCert.icon === 'Target' ? 'selected' : ''}>Target</option>
          <option value="Clock" ${currentCert.icon === 'Clock' ? 'selected' : ''}>Clock</option>
          <option value="Zap" ${currentCert.icon === 'Zap' ? 'selected' : ''}>Zap</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Title" value="${currentCert.title}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Description" value="${currentCert.desc}">`,
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
          desc: document.getElementById('swal-input3').value
        };
      }
    });

    if (formValues) {
      handleCertificationChange(index, 'icon', formValues.icon);
      handleCertificationChange(index, 'title', formValues.title);
      handleCertificationChange(index, 'desc', formValues.desc);
    }
  };

  // Icon mapping
  const iconMap = {
    Award: Award,
    Clock: Clock,
    Shield: Shield,
    Star: Star,
    Target: Target,
    Zap: Zap,
  };

  if (isLoading) {
    return (
      <section className="py-32 bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f1601f]"></div>
          <p className="mt-4 text-gray-600">Loading about section...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-32 bg-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">
            Failed to load about section. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="about"
        className="py-32 bg-white relative overflow-hidden"
        data-animate
      >
        {/* Edit Mode Toggle Button - EXACTLY LIKE CallToAction */}
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
                  onClick={cancelEditing}
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

        {/* Edit Mode Overlay Indicator - EXACTLY LIKE CallToAction */}
        {editMode && (
          <div className="absolute inset-0 border-4 border-yellow-400 pointer-events-none z-10 flex items-center justify-center">
            <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
              EDIT MODE ENABLED - Click on any content to edit
            </span>
          </div>
        )}

        <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 -skew-x-12 transform translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -left-8 -top-8 text-9xl font-black text-gray-100">
                01
              </div>
              <div className="relative space-y-6">
                <div className="inline-block">
                  {editMode ? (
                    <div 
                      onClick={() => editTextInModal('preTitle', tempData.preTitle, 'Edit Pre-Title', 'Update the small text above the main title')}
                      className="cursor-pointer bg-white/80 backdrop-blur-sm rounded-lg p-2 hover:bg-white transition-all duration-300"
                    >
                      <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                        {tempData.preTitle}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                      {data.preTitle}
                    </span>
                  )}
                  <div className="w-20 h-1 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] mt-2"></div>
                </div>

                {editMode ? (
                  <div 
                    onClick={() => editTextInModal('title', tempData.title, 'Edit Main Title', 'Update the main title text')}
                    className="cursor-pointer bg-white/80 backdrop-blur-sm rounded-lg p-4 hover:bg-white transition-all duration-300"
                  >
                    <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] leading-tight">
                      {tempData.title}
                    </h2>
                  </div>
                ) : (
                  <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] leading-tight">
                    {data.title}
                  </h2>
                )}

                {editMode ? (
                  <div 
                    onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the main description text')}
                    className="cursor-pointer bg-white/80 backdrop-blur-sm rounded-lg p-4 hover:bg-white transition-all duration-300"
                  >
                    <p className="text-xl text-[#7f8994] leading-relaxed">
                      {tempData.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-xl text-[#7f8994] leading-relaxed">
                    {data.description}
                  </p>
                )}

                {editMode ? (
                  <div 
                    onClick={() => editTextInModal('additionalDescription', tempData.additionalDescription, 'Edit Additional Description', 'Update the additional description text')}
                    className="cursor-pointer bg-white/80 backdrop-blur-sm rounded-lg p-4 hover:bg-white transition-all duration-300"
                  >
                    <p className="text-lg text-[#7f8994] leading-relaxed">
                      {tempData.additionalDescription}
                    </p>
                  </div>
                ) : (
                  <p className="text-lg text-[#7f8994] leading-relaxed">
                    {data.additionalDescription}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 pt-6">
                  {tempData.values.map((value, i) => {
                    const IconComponent = iconMap[value.icon] || Target;
                    return (
                      <div
                        key={i}
                        className="bg-gray-50 p-6 rounded-xl hover:bg-gradient-to-br hover:from-[#f1601f] hover:to-[#7f3e2c] hover:text-white transition-all duration-300 group relative"
                      >
                        {editMode && (
                          <button
                            onClick={() => removeValue(i)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-10 transition-all duration-200"
                            title="Remove this value"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        <div 
                          onClick={editMode ? () => editValueInModal(i, value) : undefined}
                          className={editMode ? "cursor-pointer" : ""}
                        >
                          <IconComponent
                            className="mb-4 text-[#f1601f] group-hover:text-white"
                            size={32}
                          />

                          <h3 className="font-bold text-lg mb-2">
                            {value.title}
                          </h3>
                          <p className="text-sm opacity-80">{value.desc}</p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add new value button */}
                  {editMode && (
                    <div
                      className="bg-gray-50 border-2 border-dashed border-gray-300 p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer min-h-[160px] hover:border-[#f1601f] hover:bg-gray-100 transition-all duration-200"
                      onClick={addNewValue}
                    >
                      <Plus className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-gray-600 text-sm">
                        Add New Value
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  {[0, 1].map((index) => (
                    <div
                      key={index}
                      className="relative h-64 rounded-2xl overflow-hidden group"
                    >
                      {/* Hidden file input - EXACTLY LIKE CallToAction */}
                      {editMode && (
                        <input
                          ref={(el) => (fileInputRefs.current[index] = el)}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, index)}
                          className="hidden"
                        />
                      )}

                      {editMode ? (
                        <div className="relative h-full">
                          {uploadingImages[index] ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f1601f] mb-2"></div>
                              <span className="text-gray-600 text-sm">
                                Uploading...
                              </span>
                            </div>
                          ) : (
                            <>
                              <img
                                src={tempData.images[index]}
                                alt={`About ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button 
                                onClick={() => triggerFileInput(index)}
                                className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-all duration-200"
                                title="Change image"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <img
                          src={data.images[index]}
                          alt={`About ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-6 pt-12">
                  {[2, 3].map((index) => (
                    <div
                      key={index}
                      className="relative h-64 rounded-2xl overflow-hidden group"
                    >
                      {/* Hidden file input - EXACTLY LIKE CallToAction */}
                      {editMode && (
                        <input
                          ref={(el) => (fileInputRefs.current[index] = el)}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, index)}
                          className="hidden"
                        />
                      )}

                      {editMode ? (
                        <div className="relative h-full">
                          {uploadingImages[index] ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f1601f] mb-2"></div>
                              <span className="text-gray-600 text-sm">
                                Uploading...
                              </span>
                            </div>
                          ) : (
                            <>
                              <img
                                src={tempData.images[index]}
                                alt={`About ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button 
                                onClick={() => triggerFileInput(index)}
                                className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-all duration-200"
                                title="Change image"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <img
                          src={data.images[index]}
                          alt={`About ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-12 -right-12 bg-white rounded-2xl shadow-2xl p-8 max-w-xs">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-xl flex items-center justify-center">
                    <Award className="text-white" size={24} />
                  </div>
                  <div>
                    {editMode ? (
                      <div 
                        onClick={() => editTextInModal('stats.completedProjects', tempData.stats.completedProjects, 'Edit Completed Projects', 'Update the number of completed projects')}
                        className="cursor-pointer bg-white/80 backdrop-blur-sm rounded-lg p-2 hover:bg-white transition-all duration-300"
                      >
                        <div className="text-3xl font-black text-[#0b1d34]">
                          {tempData.stats.completedProjects}
                        </div>
                      </div>
                    ) : (
                      <div className="text-3xl font-black text-[#0b1d34]">
                        {data.stats.completedProjects}
                      </div>
                    )}
                    <div className="text-sm text-gray-600 font-medium">
                      Completed Projects
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {tempData.certifications.map((cert, i) => {
              const IconComponent = iconMap[cert.icon] || Award;
              return (
                <div
                  key={i}
                  className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#f1601f] hover:shadow-xl transition-all duration-300 group relative"
                >
                  {editMode && (
                    <button
                      onClick={() => removeCertification(i)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-10 transition-all duration-200"
                      title="Remove this certification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div 
                    onClick={editMode ? () => editCertificationInModal(i, cert) : undefined}
                    className={editMode ? "cursor-pointer" : ""}
                  >
                    <IconComponent
                      className="text-[#f1601f] mb-4 group-hover:scale-110 transition-transform duration-300"
                      size={36}
                    />

                    <h3 className="font-black text-lg text-[#0b1d34] mb-1">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-gray-600">{cert.desc}</p>
                  </div>
                </div>
              );
            })}

            {/* Add new certification button */}
            {editMode && (
              <div
                className="bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer min-h-[160px] hover:border-[#f1601f] hover:bg-gray-100 transition-all duration-200"
                onClick={addNewCertification}
              >
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-gray-600 text-sm">
                  Add New Certification
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
export default About;