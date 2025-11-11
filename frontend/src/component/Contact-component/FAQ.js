"use client";
import { ArrowRight, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const FAQ = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/contact/faq/`;

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
        if (!response.ok) throw new Error("Failed to fetch FAQ data");
        const jsonData = await response.json();
        setData(jsonData);
        setTempData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
        // Fallback to default data if API fails
        const defaultData = {
          title: "Frequently Asked Questions",
          subtitle: "FAQ",
          description: "Find answers to common questions about our services and operations",
          faqs: [
            {
              id: 1,
              question: "What services does RAWASY offer?",
              answer: "We offer comprehensive construction and industrial solutions including general contracting, civil & MEP works, manpower supply, maintenance services, trading & supply, and metal fabrication."
            },
            {
              id: 2,
              question: "What regions do you serve?",
              answer: "RAWASY primarily serves the Gulf region with a strong presence in the United Arab Emirates and surrounding countries."
            },
            {
              id: 3,
              question: "How quickly can you start a project?",
              answer: "Project timelines vary based on scope and complexity. Contact us for a detailed assessment and we'll provide a realistic timeline for your specific requirements."
            },
            {
              id: 4,
              question: "Do you provide emergency services?",
              answer: "Yes, we offer 24/7 emergency response services for maintenance and critical repairs. Contact our emergency hotline for immediate assistance."
            }
          ],
          contactButton: {
            text: "Contact Us",
            link: "#contact-form"
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

  // Handle FAQ item changes
  const handleFAQChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.faqs[index][field] = value;
      return newData;
    });
  };

  // Add new FAQ item
  const addNewFAQ = () => {
    setTempData(prev => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          id: Date.now(), // Temporary ID
          question: "New Question?",
          answer: "Answer to the new question."
        }
      ]
    }));
  };

  // Remove FAQ item with confirmation
  const removeFAQ = async (index) => {
    if (tempData.faqs.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one FAQ item',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This FAQ item will be removed permanently!',
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
        faqs: prev.faqs.filter((_, i) => i !== index)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'FAQ item has been removed.',
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
      text: 'All FAQ modifications will be updated on the website.',
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

      if (!response.ok) throw new Error("Failed to save FAQ changes");

      const updatedData = await response.json();
      setData(updatedData);
      setEditMode(false);
      
      Swal.fire({
        title: 'Success!',
        text: 'FAQ changes saved successfully!',
        icon: 'success',
        confirmButtonColor: '#f1601f',
      });
    } catch (error) {
      console.error("Error saving FAQ data:", error);
      Swal.fire({
        title: 'Save Failed',
        text: 'Failed to save FAQ changes. Please try again.',
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

  // Edit FAQ item in modal
  const editFAQInModal = async (index, currentFAQ) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit FAQ Item',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Question" value="${currentFAQ.question}">` +
        `<textarea id="swal-input2" class="swal2-textarea" placeholder="Answer" style="width: 100%; height: 100px; margin: 10px 0;">${currentFAQ.answer}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          question: document.getElementById('swal-input1').value,
          answer: document.getElementById('swal-input2').value
        };
      }
    });

    if (formValues) {
      handleFAQChange(index, 'question', formValues.question);
      handleFAQChange(index, 'answer', formValues.answer);
    }
  };

  // Edit button in modal
  const editButtonInModal = async (currentButton) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Contact Button',
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
      handleTextChange('contactButton.text', formValues.text);
      handleTextChange('contactButton.link', formValues.link);
    }
  };

  if (isLoading) {
    return (
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading FAQ...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load FAQ. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white relative">
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
                title="Edit FAQ Content"
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            {editMode ? (
              <div 
                onClick={() => editTextInModal('subtitle', tempData.subtitle, 'Edit Subtitle', 'Update the FAQ subtitle text')}
                className="cursor-pointer inline-block bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white transition-all duration-300"
              >
                <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                  {tempData.subtitle}
                </span>
              </div>
            ) : (
              <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                {data.subtitle}
              </span>
            )}
            
            {editMode ? (
              <div 
                onClick={() => editTextInModal('title', tempData.title, 'Edit Main Title', 'Update the main FAQ title text')}
                className="cursor-pointer bg-white/80 backdrop-blur-sm rounded-lg p-6 mt-4 hover:bg-white transition-all duration-300"
              >
                <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34]">
                  {tempData.title}
                </h2>
              </div>
            ) : (
              <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
                {data.title}
              </h2>
            )}
          </div>

          <div className="space-y-6">
            {tempData.faqs.map((faq, index) => (
              <div key={faq.id || index} className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#f1601f] hover:shadow-xl transition-all duration-300 relative">
                {/* Delete button for FAQ item */}
                {editMode && (
                  <button
                    onClick={() => removeFAQ(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                    title="Remove this FAQ item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <h3 
                  onClick={editMode ? () => editFAQInModal(index, faq) : undefined}
                  className={`text-xl font-black text-[#0b1d34] mb-4 flex items-start ${editMode ? 'cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2' : ''}`}
                >
                  <span className="w-8 h-8 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-lg flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">
                    {index + 1}
                  </span>
                  {faq.question}
                </h3>
                <p 
                  onClick={editMode ? () => editFAQInModal(index, faq) : undefined}
                  className={`text-gray-600 leading-relaxed ml-12 ${editMode ? 'cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2' : ''}`}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
            
            {/* Add new FAQ button */}
            {editMode && (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer min-h-[120px] p-8 hover:bg-gray-50 hover:border-[#f1601f] transition-all duration-300"
                onClick={addNewFAQ}
              >
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-gray-500 font-medium">Add New FAQ Item</span>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              {editMode ? (
                <span 
                  onClick={() => editTextInModal('description', tempData.description, 'Edit Description', 'Update the description text below FAQ items')}
                  className="cursor-pointer bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white transition-all duration-300"
                >
                  {tempData.description}
                </span>
              ) : (
                data.description
              )}
            </p>
            
            {editMode ? (
              <div 
                onClick={() => editButtonInModal(tempData.contactButton)}
                className="cursor-pointer inline-flex items-center space-x-3 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 group border-2 border-dashed border-white/50"
              >
                <span>{tempData.contactButton.text}</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
              </div>
            ) : (
              <a 
                href={data.contactButton.link} 
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 group"
              >
                <span>{data.contactButton.text}</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
              </a>
            )}
          </div>
        </div>
      </section> 
    </>
  );
};

export default FAQ;