"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Edit, Save, Upload, Trash2, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoFileInputRef = useRef(null);
  const pathname = usePathname();

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/layout/navbar/`;

  // Default data structure
  const defaultData = {
    logo: {
      image: "/rawasy.png",
      alt: "Rawasy Logo"
    },
    navLinks: [
      { name: 'Home', href: '/', order: 1 },
      { name: 'About', href: '/about', order: 2 },
      { name: 'Services', href: '/services', order: 3 },
      { name: 'Projects', href: '/projects', order: 4 },
      { name: 'Gallery', href: '/gallery', order: 5 },
      { name: 'Sectors', href: '/sectors', order: 6 },
      { name: 'Contact', href: '/contact', order: 7 }
    ],
    ctaButton: {
      text: 'Get Quote',
      href: '/quote'
    }
  };

  // Check for auth token
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      console.log("Admin authenticated, edit mode available");
    }
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(ENDPOINT);
        if (!response.ok) throw new Error("Failed to fetch navbar data");
        const jsonData = await response.json();
        setData(jsonData);
        setTempData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching navbar data:", error);
        // Fallback to default data if API fails
        setData(defaultData);
        setTempData(defaultData);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ENDPOINT]);

  // Check if a route is active
  const isActiveRoute = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Safe data access
  const getNavLinks = () => {
    return tempData?.navLinks || data?.navLinks || defaultData.navLinks;
  };

  const getLogo = () => {
    return tempData?.logo || data?.logo || defaultData.logo;
  };

  const getCtaButton = () => {
    return tempData?.ctaButton || data?.ctaButton || defaultData.ctaButton;
  };

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
      setTempData(data || defaultData);
    }
    setEditMode(!editMode);
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
    formData.append("category", "navbar-logo");

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
      setTempData(prev => ({
        ...(prev || defaultData),
        logo: {
          ...((prev || defaultData).logo),
          image: result.image
        }
      }));
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Logo upload failed");
    } finally {
      setUploadingLogo(false);
    }
  };

  // Handle nav link changes
  const handleNavLinkChange = (index, field, value) => {
    setTempData(prev => {
      const currentData = prev || defaultData;
      const newData = {...currentData};
      newData.navLinks = [...currentData.navLinks];
      newData.navLinks[index] = {
        ...newData.navLinks[index],
        [field]: value
      };
      return newData;
    });
  };

  // Add new nav link
  const addNewNavLink = () => {
    setTempData(prev => {
      const currentData = prev || defaultData;
      return {
        ...currentData,
        navLinks: [
          ...currentData.navLinks,
          {
            name: "New Link",
            href: "/new-link",
            order: currentData.navLinks.length + 1
          }
        ]
      };
    });
  };

  // Remove nav link with confirmation
  const removeNavLink = async (index) => {
    const currentNavLinks = getNavLinks();
    if (currentNavLinks.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one navigation link',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This navigation link will be removed permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setTempData(prev => {
        const currentData = prev || defaultData;
        return {
          ...currentData,
          navLinks: currentData.navLinks.filter((_, i) => i !== index)
        };
      });
      
      Swal.fire({
        title: 'Removed!',
        text: 'Navigation link has been removed.',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    }
  };

  // Handle CTA button changes
  const handleCtaButtonChange = (field, value) => {
    setTempData(prev => {
      const currentData = prev || defaultData;
      return {
        ...currentData,
        ctaButton: {
          ...currentData.ctaButton,
          [field]: value
        }
      };
    });
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
        body: JSON.stringify(tempData || defaultData)
      });

      if (!response.ok) throw new Error("Failed to save changes");

      const updatedData = await response.json();
      setData(updatedData);
      setEditMode(false);
      
      Swal.fire({
        title: 'Success!',
        text: 'Navbar changes saved successfully!',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    } catch (error) {
      console.error("Error saving navbar data:", error);
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

  // Edit nav link in modal
  const editNavLinkInModal = async (index, currentLink) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Navigation Link',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Link Name" value="${currentLink.name}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Link URL" value="${currentLink.href}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          name: document.getElementById('swal-input1').value,
          href: document.getElementById('swal-input2').value
        };
      }
    });

    if (formValues) {
      handleNavLinkChange(index, 'name', formValues.name);
      handleNavLinkChange(index, 'href', formValues.href);
    }
  };

  // Edit CTA button in modal
  const editCtaButtonInModal = async (currentButton) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit CTA Button',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Button Text" value="${currentButton.text}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Button Link" value="${currentButton.href}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          text: document.getElementById('swal-input1').value,
          href: document.getElementById('swal-input2').value
        };
      }
    });

    if (formValues) {
      handleCtaButtonChange('text', formValues.text);
      handleCtaButtonChange('href', formValues.href);
    }
  };

  if (isLoading) {
    return (
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-lg shadow-lg py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="animate-pulse bg-gray-300 rounded-lg w-36 h-12"></div>
            <div className="hidden lg:flex space-x-8">
              {[1,2,3,4,5,6,7].map(i => (
                <div key={i} className="animate-pulse bg-gray-300 rounded h-6 w-16"></div>
              ))}
            </div>
            <div className="animate-pulse bg-gray-300 rounded-lg h-12 w-32"></div>
          </div>
        </div>
      </nav>
    );
  }

  if (!data && !tempData) {
    return (
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-lg shadow-lg py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            Failed to load navbar. Please try again later.
          </div>
        </div>
      </nav>
    );
  }

  const currentLogo = getLogo();
  const currentNavLinks = getNavLinks();
  const currentCtaButton = getCtaButton();

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-2xl py-4' : 'bg-transparent py-6'
        }`}
      >
        {/* Edit Mode Overlay Indicator */}
        {editMode && (
          <div className="absolute inset-0 border-4 border-yellow-400 pointer-events-none z-40 flex items-center justify-center">
            
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Edit Mode Toggle Button */}
          {localStorage.getItem("authToken") && (
            <div className="absolute -top-2 right-4 z-50">
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
                  title="Edit Navbar"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 group cursor-pointer relative">
              {editMode ? (
                <div className="relative">
                  {uploadingLogo ? (
                    <div className="bg-black rounded-lg w-36 h-12 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={currentLogo.image}
                        alt={currentLogo.alt}
                        className="bg-black rounded-lg w-36 h-12 p-1 object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        onClick={() => logoFileInputRef.current?.click()}
                        className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 z-10 hover:bg-blue-600 transition-colors"
                        title="Change logo"
                      >
                        <Upload className="w-3 h-3" />
                      </button>
                      <input
                        type="file"
                        ref={logoFileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </>
                  )}
                </div>
              ) : (
                <a href="/">
                  <img
                    src={currentLogo.image}
                    alt={currentLogo.alt}
                    className="bg-black rounded-lg w-36 h-12 p-1 object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </a>
              )}
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-10">
              {currentNavLinks.map((item, index) => {
                const isActive = isActiveRoute(item.href);
                return (
                  <div key={index} className="relative">
                    {/* Delete button for nav links */}
                    {editMode && (
                      <button
                        onClick={() => removeNavLink(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                        title="Remove this link"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    
                    {editMode ? (
                      <div
                        onClick={() => editNavLinkInModal(index, item)}
                        className={`cursor-pointer relative font-semibold text-sm tracking-wide transition-all duration-300 group ${
                          isScrolled ? 'text-[#0b1d34]' : 'text-white'
                        } hover:bg-white/20 rounded-lg px-3 py-2 ${
                          isActive ? 'text-[#f1601f]' : ''
                        }`}
                      >
                        {item.name}
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#f1601f] transition-all duration-300 ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}></span>
                      </div>
                    ) : (
                      <a
                        href={item.href}
                        className={`relative font-semibold text-sm tracking-wide transition-all duration-300 group ${
                          isScrolled ? 'text-[#0b1d34]' : 'text-white'
                        } ${isActive ? 'text-[#f1601f]' : ''}`}
                      >
                        {item.name}
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#f1601f] transition-all duration-300 ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}></span>
                      </a>
                    )}
                  </div>
                );
              })}
              
              {/* Add new nav link button */}
              {editMode && (
                <button
                  onClick={addNewNavLink}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-colors"
                  title="Add new navigation link"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}

              {/* CTA Button */}
              {editMode ? (
                <div
                  onClick={() => editCtaButtonInModal(currentCtaButton)}
                  className="cursor-pointer bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-6 py-3 rounded-lg font-bold text-sm hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-dashed border-white/50"
                >
                  {currentCtaButton.text}
                </div>
              ) : (
                <a
                  href={currentCtaButton.href}
                  className="bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-6 py-3 rounded-lg font-bold text-sm hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  {currentCtaButton.text}
                </a>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className={isScrolled ? 'text-[#0b1d34]' : 'text-white'} size={28} />
              ) : (
                <Menu className={isScrolled ? 'text-[#0b1d34]' : 'text-white'} size={28} />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-6 bg-white rounded-2xl shadow-2xl p-6 space-y-4">
              {currentNavLinks.map((item, index) => {
                const isActive = isActiveRoute(item.href);
                return (
                  <div key={index} className="relative border-b border-gray-100 last:border-0">
                    {editMode && (
                      <button
                        onClick={() => removeNavLink(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                        title="Remove this link"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    
                    {editMode ? (
                      <div
                        onClick={() => editNavLinkInModal(index, item)}
                        className={`block py-3 font-semibold text-lg cursor-pointer ${
                          isActive ? 'text-[#f1601f]' : 'text-[#0b1d34] hover:text-[#f1601f]'
                        }`}
                      >
                        {item.name}
                      </div>
                    ) : (
                      <a
                        href={item.href}
                        className={`block py-3 font-semibold text-lg ${
                          isActive ? 'text-[#f1601f]' : 'text-[#0b1d34] hover:text-[#f1601f]'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    )}
                  </div>
                );
              })}
              
              {/* Add new nav link button in mobile */}
              {editMode && (
                <button
                  onClick={addNewNavLink}
                  className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-3 font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add New Link</span>
                </button>
              )}

              {/* Mobile CTA Button */}
              <div className="pt-4 border-t border-gray-200">
                {editMode ? (
                  <div
                    onClick={() => editCtaButtonInModal(currentCtaButton)}
                    className="cursor-pointer bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-6 py-4 rounded-lg font-bold text-lg text-center border-2 border-dashed border-white/50"
                  >
                    {currentCtaButton.text}
                  </div>
                ) : (
                  <a
                    href={currentCtaButton.href}
                    className="block bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-6 py-4 rounded-lg font-bold text-lg text-center hover:shadow-2xl transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {currentCtaButton.text}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;