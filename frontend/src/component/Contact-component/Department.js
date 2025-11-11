"use client";
import { Building2, FileText, Headphones, Mail, Phone, Users, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Department = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/contact/departments/`;

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
        if (!response.ok) throw new Error("Failed to fetch departments data");
        const jsonData = await response.json();
        setData(jsonData);
        setTempData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching departments data:", error);
        // Fallback to default data if API fails
        const defaultData = {
          sectionTitle: "Reach the Right Team",
          sectionSubtitle: "Connect directly with the department that best suits your needs",
          departments: [
            {
              icon: "building",
              title: "General Inquiries",
              email: "info@rawasy.com",
              phone: "+971 XX XXX XXXX",
              description: "For general questions and information"
            },
            {
              icon: "file-text",
              title: "Project Quotes",
              email: "sales@rawasy.com",
              phone: "+971 XX XXX XXXX",
              description: "Request project quotations and proposals"
            },
            {
              icon: "users",
              title: "HR & Recruitment",
              email: "hr@rawasy.com",
              phone: "+971 XX XXX XXXX",
              description: "Career opportunities and employment"
            },
            {
              icon: "headphones",
              title: "Customer Support",
              email: "support@rawasy.com",
              phone: "+971 XX XXX XXXX",
              description: "Technical support and assistance"
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

  // Handle section text changes
  const handleSectionTextChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle department changes
  const handleDepartmentChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.departments[index][field] = value;
      return newData;
    });
  };

  // Add new department
  const addNewDepartment = () => {
    setTempData(prev => ({
      ...prev,
      departments: [
        ...prev.departments,
        {
          icon: "building",
          title: "New Department",
          email: "email@rawasy.com",
          phone: "+971 XX XXX XXXX",
          description: "Department description"
        }
      ]
    }));
  };

  // Remove department with confirmation
  const removeDepartment = async (index) => {
    if (tempData.departments.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one department',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This department will be removed permanently!',
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
        departments: prev.departments.filter((_, i) => i !== index)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Department has been removed.',
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
      handleSectionTextChange(field, newValue);
    }
  };

  // Edit department in modal
  const editDepartmentInModal = async (index, currentDepartment) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Department Information',
      html:
        `<select id="swal-input1" class="swal2-input">
          <option value="building" ${currentDepartment.icon === 'building' ? 'selected' : ''}>General</option>
          <option value="file-text" ${currentDepartment.icon === 'file-text' ? 'selected' : ''}>Projects</option>
          <option value="users" ${currentDepartment.icon === 'users' ? 'selected' : ''}>HR</option>
          <option value="headphones" ${currentDepartment.icon === 'headphones' ? 'selected' : ''}>Support</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Department Title" value="${currentDepartment.title}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Email" value="${currentDepartment.email}">` +
        `<input id="swal-input4" class="swal2-input" placeholder="Phone" value="${currentDepartment.phone}">` +
        `<textarea id="swal-input5" class="swal2-textarea" placeholder="Description">${currentDepartment.description}</textarea>`,
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
          email: document.getElementById('swal-input3').value,
          phone: document.getElementById('swal-input4').value,
          description: document.getElementById('swal-input5').value
        };
      }
    });

    if (formValues) {
      handleDepartmentChange(index, 'icon', formValues.icon);
      handleDepartmentChange(index, 'title', formValues.title);
      handleDepartmentChange(index, 'email', formValues.email);
      handleDepartmentChange(index, 'phone', formValues.phone);
      handleDepartmentChange(index, 'description', formValues.description);
    }
  };

  // Render icon based on icon name
  const renderIcon = (iconName, props = {}) => {
    const iconProps = { size: 40, className: "text-[#f1601f] mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500", ...props };
    
    switch (iconName) {
      case 'building':
        return <Building2 {...iconProps} />;
      case 'file-text':
        return <FileText {...iconProps} />;
      case 'users':
        return <Users {...iconProps} />;
      case 'headphones':
        return <Headphones {...iconProps} />;
      default:
        return <Building2 {...iconProps} />;
    }
  };

  if (isLoading) {
    return (
      <section className="py-32 bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading departments...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-32 bg-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load departments. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-32 bg-white relative">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            {editMode ? (
              <>
                <div 
                  onClick={() => editTextInModal('sectionSubtitle', tempData.sectionSubtitle, 'Edit Section Subtitle', 'Update the section subtitle text')}
                  className="cursor-pointer inline-block bg-gray-100 rounded-lg px-4 py-2 hover:bg-gray-200 transition-all duration-300"
                >
                  <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                    Contact Departments
                  </span>
                </div>
                <div 
                  onClick={() => editTextInModal('sectionTitle', tempData.sectionTitle, 'Edit Section Title', 'Update the main section title')}
                  className="cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 my-4 hover:border-[#f1601f] hover:bg-gray-50 transition-all duration-300"
                >
                  <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34]">
                    {tempData.sectionTitle}
                  </h2>
                </div>
                <div 
                  onClick={() => editTextInModal('sectionSubtitle', tempData.sectionSubtitle, 'Edit Section Subtitle', 'Update the section subtitle text')}
                  className="cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 max-w-3xl mx-auto hover:border-[#f1601f] hover:bg-gray-50 transition-all duration-300"
                >
                  <p className="text-xl text-gray-600">
                    {tempData.sectionSubtitle}
                  </p>
                </div>
              </>
            ) : (
              <>
                <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">Contact Departments</span>
                <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
                  {data.sectionTitle}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {data.sectionSubtitle}
                </p>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tempData.departments.map((dept, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#f1601f] hover:shadow-2xl transition-all duration-500 relative">
                
                {/* Delete button for department */}
                {editMode && (
                  <button
                    onClick={() => removeDepartment(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                    title="Remove this department"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div 
                  onClick={editMode ? () => editDepartmentInModal(index, dept) : undefined}
                  className={editMode ? "cursor-pointer" : ""}
                >
                  {renderIcon(dept.icon)}
                  
                  {editMode ? (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-[#0b1d34] border-2 border-dashed border-transparent hover:border-gray-300 rounded-lg p-2">
                        {dept.title}
                      </h3>
                      <p className="text-sm text-gray-600 border-2 border-dashed border-transparent hover:border-gray-300 rounded-lg p-2 min-h-[60px]">
                        {dept.description}
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-gray-700 border-2 border-dashed border-transparent hover:border-gray-300 rounded-lg p-2">
                          <Mail size={18} />
                          <span className="text-sm font-semibold">{dept.email}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700 border-2 border-dashed border-transparent hover:border-gray-300 rounded-lg p-2">
                          <Phone size={18} />
                          <span className="text-sm font-semibold">{dept.phone}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-black text-[#0b1d34] mb-4">{dept.title}</h3>
                      <p className="text-sm text-gray-600 mb-6">{dept.description}</p>
                      <div className="space-y-3">
                        <a href={`mailto:${dept.email}`} className="flex items-center space-x-3 text-gray-700 hover:text-[#f1601f] transition-colors duration-300">
                          <Mail size={18} />
                          <span className="text-sm font-semibold">{dept.email}</span>
                        </a>
                        <a href={`tel:${dept.phone}`} className="flex items-center space-x-3 text-gray-700 hover:text-[#f1601f] transition-colors duration-300">
                          <Phone size={18} />
                          <span className="text-sm font-semibold">{dept.phone}</span>
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add new department button */}
            {editMode && (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer min-h-[300px] p-8 hover:border-[#f1601f] hover:bg-gray-50 transition-all duration-300"
                onClick={addNewDepartment}
              >
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-gray-500 font-medium">Add New Department</span>
              </div>
            )}
          </div>
        </div>
      </section> 
    </>
  );
};

export default Department;