"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Edit, Save, X, Upload, Plus, Trash2 } from "lucide-react";
import Swal from 'sweetalert2';

const Footer = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoFileInputRef = useRef(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/layout/footer/`;

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
          logo: "/rawasy.png",
          description: "Delivering quality contracting and trading services across multiple sectors with precision, trust, and innovation.",
          quickLinks: [
            { name: "Home", url: "/" },
            { name: "About", url: "/about" },
            { name: "Services", url: "/services" },
            { name: "Projects", url: "/projects" },
            { name: "Sectors", url: "/sectors" },
            { name: "Contact", url: "/contact" }
          ],
          contactInfo: [
            { icon: "map-pin", text: "Doha, Qatar" },
            { icon: "phone", text: "+974 1234 5678" },
            { icon: "mail", text: "info@rawasy.qa" }
          ],
          socialLinks: [
            { platform: "facebook", url: "#", icon: "facebook" },
            { platform: "instagram", url: "#", icon: "instagram" },
            { platform: "linkedin", url: "#", icon: "linkedin" }
          ],
          copyright: `© ${new Date().getFullYear()} RAWASY. All Rights Reserved.`
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

  // Handle logo upload
  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication required for image upload");
      return;
    }

    setUploadingLogo(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "footer-logo");

    try {
      const response = await fetch(`${API_BASE}/images/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`
        },
        body: formData
      });

      if (!response.ok) throw new Error("Logo upload failed");

      const result = await response.json();
      handleTextChange("logo", result.image);
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Logo upload failed");
    } finally {
      setUploadingLogo(false);
    }
  };

  // Handle quick links changes
  const handleQuickLinkChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.quickLinks[index][field] = value;
      return newData;
    });
  };

  // Add new quick link
  const addNewQuickLink = () => {
    setTempData(prev => ({
      ...prev,
      quickLinks: [
        ...prev.quickLinks,
        { name: "New Link", url: "#" }
      ]
    }));
  };

  // Remove quick link
  const removeQuickLink = async (index) => {
    if (tempData.quickLinks.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one quick link',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This link will be removed permanently!',
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
        quickLinks: prev.quickLinks.filter((_, i) => i !== index)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Link has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Handle contact info changes
  const handleContactInfoChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.contactInfo[index][field] = value;
      return newData;
    });
  };

  // Add new contact info
  const addNewContactInfo = () => {
    setTempData(prev => ({
      ...prev,
      contactInfo: [
        ...prev.contactInfo,
        { icon: "phone", text: "New contact info" }
      ]
    }));
  };

  // Remove contact info
  const removeContactInfo = async (index) => {
    if (tempData.contactInfo.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one contact info',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This contact information will be removed permanently!',
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
        contactInfo: prev.contactInfo.filter((_, i) => i !== index)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Contact information has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Handle social links changes
  const handleSocialLinkChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.socialLinks[index][field] = value;
      return newData;
    });
  };

  // Add new social link
  const addNewSocialLink = () => {
    setTempData(prev => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { platform: "new-platform", url: "#", icon: "facebook" }
      ]
    }));
  };

  // Remove social link
  const removeSocialLink = async (index) => {
    if (tempData.socialLinks.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one social link',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This social link will be removed permanently!',
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
        socialLinks: prev.socialLinks.filter((_, i) => i !== index)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Social link has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Save changes
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

  // Edit quick link in modal
  const editQuickLinkInModal = async (index, currentLink) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Quick Link',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Link Name" value="${currentLink.name}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Link URL" value="${currentLink.url}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          name: document.getElementById('swal-input1').value,
          url: document.getElementById('swal-input2').value
        };
      }
    });

    if (formValues) {
      handleQuickLinkChange(index, 'name', formValues.name);
      handleQuickLinkChange(index, 'url', formValues.url);
    }
  };

  // Edit contact info in modal
  const editContactInfoInModal = async (index, currentContact) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Contact Information',
      html:
        `<select id="swal-input1" class="swal2-input">
          <option value="map-pin" ${currentContact.icon === 'map-pin' ? 'selected' : ''}>Location</option>
          <option value="phone" ${currentContact.icon === 'phone' ? 'selected' : ''}>Phone</option>
          <option value="mail" ${currentContact.icon === 'mail' ? 'selected' : ''}>Email</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Contact Text" value="${currentContact.text}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          icon: document.getElementById('swal-input1').value,
          text: document.getElementById('swal-input2').value
        };
      }
    });

    if (formValues) {
      handleContactInfoChange(index, 'icon', formValues.icon);
      handleContactInfoChange(index, 'text', formValues.text);
    }
  };

  // Edit social link in modal
  const editSocialLinkInModal = async (index, currentSocial) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Social Link',
      html:
        `<select id="swal-input1" class="swal2-input">
          <option value="facebook" ${currentSocial.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
          <option value="instagram" ${currentSocial.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
          <option value="linkedin" ${currentSocial.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
          <option value="twitter" ${currentSocial.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
          <option value="youtube" ${currentSocial.platform === 'youtube' ? 'selected' : ''}>YouTube</option>
        </select>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Platform Name" value="${currentSocial.platform}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Link URL" value="${currentSocial.url}">` +
        `<select id="swal-input4" class="swal2-input">
          <option value="facebook" ${currentSocial.icon === 'facebook' ? 'selected' : ''}>Facebook Icon</option>
          <option value="instagram" ${currentSocial.icon === 'instagram' ? 'selected' : ''}>Instagram Icon</option>
          <option value="linkedin" ${currentSocial.icon === 'linkedin' ? 'selected' : ''}>LinkedIn Icon</option>
        </select>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          platform: document.getElementById('swal-input2').value,
          url: document.getElementById('swal-input3').value,
          icon: document.getElementById('swal-input4').value
        };
      }
    });

    if (formValues) {
      handleSocialLinkChange(index, 'platform', formValues.platform);
      handleSocialLinkChange(index, 'url', formValues.url);
      handleSocialLinkChange(index, 'icon', formValues.icon);
    }
  };

  // Render icon based on icon name
  const renderIcon = (iconName, props = {}) => {
    const iconProps = { size: 18, className: "text-[#f1601f] mt-1", ...props };
    
    switch (iconName) {
      case 'phone':
        return <Phone {...iconProps} />;
      case 'mail':
        return <Mail {...iconProps} />;
      case 'map-pin':
        return <MapPin {...iconProps} />;
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      default:
        return <Phone {...iconProps} />;
    }
  };

  if (isLoading) {
    return (
      <footer className="bg-[#0b1d34] text-gray-300 pt-16 pb-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-300">Loading footer...</p>
        </div>
      </footer>
    );
  }

  if (!data) {
    return (
      <footer className="bg-[#0b1d34] text-gray-300 pt-16 pb-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center py-8">
          <p className="text-gray-300">Failed to load footer. Please try again later.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#0b1d34] text-gray-300 pt-16 pb-10 relative overflow-hidden">
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
              title="Edit Footer"
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

      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {/* Logo and Info */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            {/* Logo with upload functionality */}
            {editMode ? (
              <div className="relative">
                <div 
                  className="w-56 h-24 rounded-xl overflow-hidden flex items-center justify-center bg-white/5 border-2 border-dashed border-[#f1601f]/50 cursor-pointer hover:bg-white/10 transition-all duration-300"
                  onClick={() => logoFileInputRef.current?.click()}
                >
                  {uploadingLogo ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                  ) : (
                    <>
                      <img
                        src={tempData.logo}
                        alt="Rawasy Logo"
                        className="w-full h-full object-contain p-1"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  ref={logoFileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </div>
            ) : (
              <div className="w-56 h-24 rounded-xl overflow-hidden flex items-center justify-center bg-white/5 border border-[#f1601f]/30">
                <img
                  src={data.logo}
                  alt="Rawasy Logo"
                  className="w-full h-full object-contain p-1"
                />
              </div>
            )}
          </div>

          {editMode ? (
            <div 
              onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the company description')}
              className="cursor-pointer bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 text-sm leading-relaxed p-4 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              {tempData.description}
            </div>
          ) : (
            <p className="text-sm leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-3">
            {tempData.quickLinks.map((link, index) => (
              <li key={index} className="relative">
                {editMode && (
                  <button
                    onClick={() => removeQuickLink(index)}
                    className="absolute -top-1 -right-6 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                    title="Remove this link"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                {editMode ? (
                  <div 
                    onClick={() => editQuickLinkInModal(index, link)}
                    className="cursor-pointer hover:text-[#f1601f] transition-colors duration-300 bg-white/5 p-2 rounded hover:bg-white/10"
                  >
                    {link.name}
                  </div>
                ) : (
                  <a
                    href={link.url}
                    className="hover:text-[#f1601f] transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                )}
              </li>
            ))}
            
            {/* Add new quick link button */}
            {editMode && (
              <li>
                <div 
                  className="border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center cursor-pointer p-2 hover:bg-white/10 transition-all duration-300 text-sm"
                  onClick={addNewQuickLink}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Link
                </div>
              </li>
            )}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
          <ul className="space-y-3">
            {tempData.contactInfo.map((contact, index) => (
              <li key={index} className="flex items-start space-x-3 relative">
                {editMode && (
                  <button
                    onClick={() => removeContactInfo(index)}
                    className="absolute -top-1 -right-6 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                    title="Remove this contact info"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                {renderIcon(contact.icon)}
                {editMode ? (
                  <div 
                    onClick={() => editContactInfoInModal(index, contact)}
                    className="cursor-pointer hover:text-[#f1601f] transition-colors duration-300 bg-white/5 p-2 rounded hover:bg-white/10 flex-1"
                  >
                    {contact.text}
                  </div>
                ) : (
                  <span>{contact.text}</span>
                )}
              </li>
            ))}
            
            {/* Add new contact info button */}
            {editMode && (
              <li>
                <div 
                  className="border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center cursor-pointer p-2 hover:bg-white/10 transition-all duration-300 text-sm"
                  onClick={addNewContactInfo}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact Info
                </div>
              </li>
            )}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            {tempData.socialLinks.map((social, index) => (
              <div key={index} className="relative">
                {editMode && (
                  <button
                    onClick={() => removeSocialLink(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                    title="Remove this social link"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                {editMode ? (
                  <div 
                    onClick={() => editSocialLinkInModal(index, social)}
                    className="p-2 bg-white/10 rounded-full hover:bg-[#f1601f] transition-all duration-300 cursor-pointer border-2 border-dashed border-white/30"
                  >
                    {renderIcon(social.icon, { size: 20, className: "text-white" })}
                  </div>
                ) : (
                  <a
                    href={social.url}
                    className="p-2 bg-white/10 rounded-full hover:bg-[#f1601f] transition-all duration-300"
                  >
                    {renderIcon(social.icon, { size: 20, className: "text-white" })}
                  </a>
                )}
              </div>
            ))}
            
            {/* Add new social link button */}
            {editMode && (
              <div 
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 cursor-pointer border-2 border-dashed border-white/30 flex items-center justify-center"
                onClick={addNewSocialLink}
              >
                <Plus className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 mt-12 pt-6 text-center text-sm text-gray-400">
        {editMode ? (
          <div 
            onClick={() => editTextInModal('copyright', tempData.copyright, 'Edit Copyright Text', 'Update the copyright text')}
            className="cursor-pointer bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 p-3 rounded-lg hover:bg-white/20 transition-all duration-300 max-w-md mx-auto"
          >
            {tempData.copyright}
          </div>
        ) : (
          data.copyright
        )}
      </div>
    </footer>
  );
};

export default Footer;