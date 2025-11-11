"use client";
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const FAQ = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/quote/faq/`;

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
          sectionTitle: "FAQ",
          sectionSubtitle: "Common Questions",
          sectionDescription: "Everything you need to know about our quote process",
          faqs: [
            {
              id: 1,
              question: "How long does it take to receive a quote?",
              answer: "You will receive a comprehensive quote within 24-48 hours of submitting your request. For urgent projects, we can provide preliminary estimates within 24 hours.",
              order: 1
            },
            {
              id: 2,
              question: "Is the quote obligation-free?",
              answer: "Yes, absolutely! Our quotes are completely free with no obligation. You can review our proposal and pricing without any commitment.",
              order: 2
            },
            {
              id: 3,
              question: "What information do I need to provide?",
              answer: "The more details you provide, the more accurate your quote will be. Essential information includes project type, location, size, timeline, and any specific requirements or specifications.",
              order: 3
            },
            {
              id: 4,
              question: "Can I modify my project after receiving the quote?",
              answer: "Yes, we understand that projects evolve. We'll work with you to adjust the quote based on any changes to scope, timeline, or requirements.",
              order: 4
            },
            {
              id: 5,
              question: "Do you offer financing options?",
              answer: "Yes, we work with several financial institutions to provide flexible payment plans and financing options for qualified projects.",
              order: 5
            },
            {
              id: 6,
              question: "What areas do you serve?",
              answer: "RAWASY primarily serves the Gulf region with a strong presence in the United Arab Emirates and surrounding countries.",
              order: 6
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

  // Handle FAQ changes
  const handleFAQChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.faqs[index][field] = value;
      return newData;
    });
  };

  // Add new FAQ
  const addNewFAQ = () => {
    setTempData(prev => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          id: Date.now(), // Temporary ID
          question: "New Question?",
          answer: "Answer to the new question.",
          order: prev.faqs.length + 1
        }
      ]
    }));
  };

  // Remove FAQ with confirmation
  const removeFAQ = async (index) => {
    if (tempData.faqs.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one FAQ',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This FAQ will be removed permanently!',
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
        text: 'FAQ has been removed.',
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

  // Edit FAQ in modal
  const editFAQInModal = async (index, currentFAQ) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit FAQ',
      html:
        `<textarea id="swal-input1" class="swal2-textarea" placeholder="Question" style="width: 100%; height: 100px; padding: 10px;">${currentFAQ.question}</textarea>` +
        `<textarea id="swal-input2" class="swal2-textarea" placeholder="Answer" style="width: 100%; height: 150px; padding: 10px; margin-top: 10px;">${currentFAQ.answer}</textarea>`,
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
      },
      didOpen: () => {
        document.getElementById('swal-input1').focus();
      }
    });

    if (formValues) {
      handleFAQChange(index, 'question', formValues.question);
      handleFAQChange(index, 'answer', formValues.answer);
    }
  };

  // Reorder FAQs
  const moveFAQUp = (index) => {
    if (index === 0) return;
    
    setTempData(prev => {
      const newFAQs = [...prev.faqs];
      [newFAQs[index - 1], newFAQs[index]] = [newFAQs[index], newFAQs[index - 1]];
      return { ...prev, faqs: newFAQs };
    });
  };

  const moveFAQDown = (index) => {
    if (index === tempData.faqs.length - 1) return;
    
    setTempData(prev => {
      const newFAQs = [...prev.faqs];
      [newFAQs[index], newFAQs[index + 1]] = [newFAQs[index + 1], newFAQs[index]];
      return { ...prev, faqs: newFAQs };
    });
  };

  if (isLoading) {
    return (
      <section className="py-32 bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading FAQs...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-32 bg-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load FAQs. Please try again later.</p>
        </div>
      </section>
    );
  }

  const displayData = editMode ? tempData : data;

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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            {editMode ? (
              <>
                <div 
                  onClick={() => editTextInModal('sectionTitle', tempData.sectionTitle, 'Edit Section Title', 'Update the section title (e.g., FAQ)')}
                  className="cursor-pointer inline-block bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition-all duration-300 mb-4"
                >
                  <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                    {tempData.sectionTitle}
                  </span>
                </div>
                <h2 
                  onClick={() => editTextInModal('sectionSubtitle', tempData.sectionSubtitle, 'Edit Section Subtitle', 'Update the main heading text')}
                  className="cursor-pointer bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300 text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6"
                >
                  {tempData.sectionSubtitle}
                </h2>
                <div 
                  onClick={() => editTextInModal('sectionDescription', tempData.sectionDescription, 'Edit Section Description', 'Update the description text below the heading')}
                  className="cursor-pointer bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300"
                >
                  <p className="text-xl text-gray-600">
                    {tempData.sectionDescription}
                  </p>
                </div>
              </>
            ) : (
              <>
                <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                  {data.sectionTitle}
                </span>
                <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mt-4 mb-6">
                  {data.sectionSubtitle}
                </h2>
                <p className="text-xl text-gray-600">
                  {data.sectionDescription}
                </p>
              </>
            )}
          </div>

          <div className="space-y-6">
            {displayData.faqs.map((faq, index) => (
              <div
                key={faq.id || index}
                className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#f1601f] hover:shadow-xl transition-all duration-300 relative"
              >
                {/* Edit controls for FAQ */}
                {editMode && (
                  <div className="absolute -top-2 -right-2 flex gap-1">
                    <button
                      onClick={() => moveFAQUp(index)}
                      disabled={index === 0}
                      className={`bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveFAQDown(index)}
                      disabled={index === tempData.faqs.length - 1}
                      className={`bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors ${index === tempData.faqs.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeFAQ(index)}
                      className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Remove this FAQ"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                <h3 
                  onClick={editMode ? () => editFAQInModal(index, faq) : undefined}
                  className={`text-xl font-black text-[#0b1d34] mb-4 flex items-start ${editMode ? 'cursor-pointer hover:bg-gray-100 rounded-lg p-2 -m-2' : ''}`}
                >
                  <span className="w-8 h-8 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-lg flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">
                    {index + 1}
                  </span>
                  {faq.question}
                </h3>
                <p 
                  onClick={editMode ? () => editFAQInModal(index, faq) : undefined}
                  className={`text-gray-600 leading-relaxed ml-12 ${editMode ? 'cursor-pointer hover:bg-gray-100 rounded-lg p-2 -m-2' : ''}`}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
            
            {/* Add new FAQ button */}
            {editMode && (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer min-h-[120px] p-8 hover:bg-gray-50 transition-all duration-300"
                onClick={addNewFAQ}
              >
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-gray-500 font-medium">Add New FAQ</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;