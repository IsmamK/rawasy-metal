"use client";
import { Sparkles, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Testimonial = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const ENDPOINT = `${API_BASE}/quote/testimonial/`;

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
          sectionTitle: "Client Success Stories",
          mainTitle: "What Our Clients Say",
          testimonials: [
            {
              quote: "RAWASY delivered our industrial facility on time and within budget. Their professionalism and quality of work exceeded our expectations.",
              author: "Ahmed Al-Mansouri",
              position: "Project Director",
              company: "Major Oil & Gas Company",
              rating: 5
            },
            {
              quote: "The team's expertise in MEP works is outstanding. They handled complex installations with precision and maintained highest safety standards.",
              author: "Sarah Johnson",
              position: "Facilities Manager",
              company: "Healthcare Provider",
              rating: 5
            },
            {
              quote: "From initial consultation to project handover, RAWASY demonstrated exceptional project management and technical capabilities.",
              author: "Mohamed Al-Hashimi",
              position: "CEO",
              company: "Commercial Real Estate",
              rating: 5
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

  // Handle testimonial changes
  const handleTestimonialChange = (index, field, value) => {
    setTempData(prev => {
      const newData = {...prev};
      newData.testimonials[index][field] = value;
      return newData;
    });
  };

  // Add new testimonial
  const addNewTestimonial = () => {
    setTempData(prev => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        {
          quote: "New testimonial quote...",
          author: "New Author",
          position: "Position",
          company: "Company",
          rating: 5
        }
      ]
    }));
  };

  // Remove testimonial with confirmation
  const removeTestimonial = async (index) => {
    if (tempData.testimonials.length <= 1) {
      Swal.fire({
        title: 'Cannot Remove',
        text: 'You must have at least one testimonial',
        icon: 'warning',
        confirmButtonColor: '#f1601f',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This testimonial will be removed permanently!',
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
        testimonials: prev.testimonials.filter((_, i) => i !== index)
      }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Testimonial has been removed.',
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

  // Edit testimonial in modal
  const editTestimonialInModal = async (index, currentTestimonial) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Testimonial',
      html:
        `<textarea id="swal-input1" class="swal2-textarea" placeholder="Testimonial Quote" style="min-height: 100px;">${currentTestimonial.quote}</textarea>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Author Name" value="${currentTestimonial.author}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Position" value="${currentTestimonial.position}">` +
        `<input id="swal-input4" class="swal2-input" placeholder="Company" value="${currentTestimonial.company}">` +
        `<select id="swal-input5" class="swal2-input">
          <option value="1" ${currentTestimonial.rating === 1 ? 'selected' : ''}>1 Star</option>
          <option value="2" ${currentTestimonial.rating === 2 ? 'selected' : ''}>2 Stars</option>
          <option value="3" ${currentTestimonial.rating === 3 ? 'selected' : ''}>3 Stars</option>
          <option value="4" ${currentTestimonial.rating === 4 ? 'selected' : ''}>4 Stars</option>
          <option value="5" ${currentTestimonial.rating === 5 ? 'selected' : ''}>5 Stars</option>
        </select>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#f1601f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          quote: document.getElementById('swal-input1').value,
          author: document.getElementById('swal-input2').value,
          position: document.getElementById('swal-input3').value,
          company: document.getElementById('swal-input4').value,
          rating: parseInt(document.getElementById('swal-input5').value)
        };
      }
    });

    if (formValues) {
      handleTestimonialChange(index, 'quote', formValues.quote);
      handleTestimonialChange(index, 'author', formValues.author);
      handleTestimonialChange(index, 'position', formValues.position);
      handleTestimonialChange(index, 'company', formValues.company);
      handleTestimonialChange(index, 'rating', formValues.rating);
    }
  };

  // Render star rating
  const renderStars = (rating, isEditable = false, onRatingChange = null) => {
    return (
      <div className="flex mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <Sparkles 
            key={star} 
            className={`${star <= rating ? 'text-[#f1601f]' : 'text-gray-400'} ${isEditable ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`} 
            size={20}
            onClick={() => isEditable && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className="py-32 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black relative overflow-hidden flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-300">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-32 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black relative overflow-hidden flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-300">Failed to load testimonials. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-32 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-black relative overflow-hidden">
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

        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            {editMode ? (
              <div className="space-y-4">
                <div 
                  onClick={() => editTextInModal('sectionTitle', tempData.sectionTitle, 'Edit Section Title', 'Update the section title text')}
                  className="cursor-pointer inline-block bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300"
                >
                  <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">
                    {tempData.sectionTitle}
                  </span>
                </div>
                <div 
                  onClick={() => editTextInModal('mainTitle', tempData.mainTitle, 'Edit Main Title', 'Update the main title text')}
                  className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-6 hover:bg-white/30 transition-all duration-300"
                >
                  <h2 className="text-5xl md:text-6xl font-black text-white">
                    {tempData.mainTitle}
                  </h2>
                </div>
              </div>
            ) : (
              <>
                <span className="text-[#f1601f] font-bold text-sm tracking-widest uppercase">{data.sectionTitle}</span>
                <h2 className="text-5xl md:text-6xl font-black text-white mt-4 mb-6">
                  {data.mainTitle}
                </h2>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {tempData.testimonials.map((testimonial, i) => (
              <div key={i} className="relative">
                {/* Delete button for testimonial */}
                {editMode && (
                  <button
                    onClick={() => removeTestimonial(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                    title="Remove this testimonial"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <div 
                  onClick={editMode ? () => editTestimonialInModal(i, testimonial) : undefined}
                  className={`bg-white/10 backdrop-blur-sm border-2 ${editMode ? 'border-dashed border-white/40 cursor-pointer' : 'border-white/20'} rounded-2xl p-8 hover:bg-white/20 transition-all duration-500 h-full flex flex-col`}
                >
                  {editMode ? (
                    renderStars(testimonial.rating, true, (newRating) => {
                      handleTestimonialChange(i, 'rating', newRating);
                    })
                  ) : (
                    renderStars(testimonial.rating)
                  )}
                  
                  {editMode ? (
                    <div className="space-y-4 flex-1">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          editTextInModal(`testimonials[${i}].quote`, testimonial.quote, 'Edit Testimonial Quote', 'Update the testimonial quote text');
                        }}
                        className="cursor-pointer bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all"
                      >
                        <p className="text-white leading-relaxed italic">"{testimonial.quote}"</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white leading-relaxed italic mb-6 flex-1">"{testimonial.quote}"</p>
                  )}
                  
                  <div className="border-t border-white/20 pt-6 mt-auto">
                    {editMode ? (
                      <div className="space-y-2">
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            editTextInModal(`testimonials[${i}].author`, testimonial.author, 'Edit Author Name', 'Update the author name');
                          }}
                          className="cursor-pointer hover:bg-white/5 rounded p-1"
                        >
                          <h4 className="text-white font-bold">{testimonial.author}</h4>
                        </div>
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            editTextInModal(`testimonials[${i}].position`, testimonial.position, 'Edit Position', 'Update the author position');
                          }}
                          className="cursor-pointer hover:bg-white/5 rounded p-1"
                        >
                          <p className="text-gray-400 text-sm">{testimonial.position}</p>
                        </div>
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            editTextInModal(`testimonials[${i}].company`, testimonial.company, 'Edit Company', 'Update the company name');
                          }}
                          className="cursor-pointer hover:bg-white/5 rounded p-1"
                        >
                          <p className="text-gray-500 text-xs">{testimonial.company}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="text-white font-bold">{testimonial.author}</h4>
                        <p className="text-gray-400 text-sm">{testimonial.position}</p>
                        <p className="text-gray-500 text-xs">{testimonial.company}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add new testimonial button */}
            {editMode && (
              <div 
                className="border-2 border-dashed border-white/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer min-h-[300px] p-8 hover:bg-white/10 transition-all duration-300"
                onClick={addNewTestimonial}
              >
                <Plus className="w-12 h-12 text-white/50 mb-4" />
                <span className="text-white/70 text-lg font-medium">Add New Testimonial</span>
              </div>
            )}
          </div>
        </div>
      </section> 
    </>
  );
};

export default Testimonial;