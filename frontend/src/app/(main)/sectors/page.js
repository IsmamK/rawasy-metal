"use client"
import React, { useState, useEffect } from 'react';
import { Droplets, Building2, Factory, Home, Hospital, TrendingUp, ArrowRight, CheckCircle, Award, Shield, Users, Zap, Target, ChevronRight, Wrench, HardHat, Briefcase, Package, Flame, Wind, Power, Cpu, Layers } from 'lucide-react';

const RawasySectorsPage = () => {
  const [activeSector, setActiveSector] = useState(0);
  const [hoveredCapability, setHoveredCapability] = useState(null);

  const sectors = [
    {
      id: 'oil-gas',
      name: 'Oil & Gas',
      icon: Droplets,
      tagline: 'Energy Sector Excellence',
      description: 'Comprehensive solutions for the oil and gas industry, delivering world-class infrastructure for refineries, processing plants, and storage facilities with unwavering focus on safety and operational excellence.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=800&fit=crop',
      stats: [
        { label: 'Projects Completed', value: '150+' },
        { label: 'Safety Record', value: '100%' },
        { label: 'Client Retention', value: '98%' },
        { label: 'Years Experience', value: '15+' }
      ],
      services: [
        {
          title: 'Refinery Construction',
          desc: 'Complete construction services for oil refineries including structural works, piping systems, and equipment installation',
          icon: Factory
        },
        {
          title: 'Processing Plants',
          desc: 'Design and construction of petrochemical processing facilities with advanced automation and safety systems',
          icon: Cpu
        },
        {
          title: 'Storage Facilities',
          desc: 'Tank farms and storage infrastructure with leak detection and environmental protection systems',
          icon: Package
        },
        {
          title: 'Pipeline Networks',
          desc: 'Installation and maintenance of pipeline systems for crude oil, gas, and refined products transportation',
          icon: Layers
        }
      ],
      capabilities: [
        'Civil & Structural Works',
        'Process Equipment Installation',
        'Piping & Instrumentation',
        'Electrical & Automation Systems',
        'Fire Fighting & Safety Systems',
        'Tank Farm Construction',
        'Maintenance & Shutdown Services',
        'HAZOP & Safety Studies'
      ],
      projects: [
        { name: 'Al Ruwais Refinery Expansion', value: '$45M', status: 'Completed' },
        { name: 'Petrochemical Processing Plant', value: '$95M', status: 'Completed' },
        { name: 'Gas Processing Facility', value: '$62M', status: 'Ongoing' }
      ],
      certifications: ['ISO 9001:2015', 'OHSAS 18001', 'Grade 1 Contractor License', 'ADNOC Approved']
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure',
      icon: TrendingUp,
      tagline: 'Building Tomorrow\'s Foundations',
      description: 'Delivering large-scale infrastructure projects including highways, bridges, airports, and urban development with cutting-edge engineering and sustainable practices.',
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&h=800&fit=crop',
      stats: [
        { label: 'Projects Delivered', value: '200+' },
        { label: 'Total Value', value: '$850M+' },
        { label: 'On-Time Delivery', value: '98%' },
        { label: 'Coverage Area', value: 'Gulf Region' }
      ],
      services: [
        {
          title: 'Highway Construction',
          desc: 'Multi-lane highway development with modern interchanges, drainage systems, and smart traffic management',
          icon: TrendingUp
        },
        {
          title: 'Bridge Engineering',
          desc: 'Design-build services for bridges and elevated structures using advanced construction methodologies',
          icon: Layers
        },
        {
          title: 'Urban Development',
          desc: 'Comprehensive urban infrastructure including utilities, streetscapes, and public amenities',
          icon: Building2
        },
        {
          title: 'Transportation Systems',
          desc: 'Metro stations, bus terminals, and integrated transportation hubs with modern facilities',
          icon: Cpu
        }
      ],
      capabilities: [
        'Road & Highway Construction',
        'Bridge & Flyover Construction',
        'Underground Utilities',
        'Drainage & Storm Water Systems',
        'Street Lighting & Signage',
        'Landscaping & Public Spaces',
        'Traffic Management Systems',
        'Sustainable Infrastructure Solutions'
      ],
      projects: [
        { name: 'Sheikh Zayed Highway Bridge', value: '$65M', status: 'Completed' },
        { name: 'Metro Station Development', value: '$72M', status: 'Completed' },
        { name: 'Urban Infrastructure Package', value: '$48M', status: 'Ongoing' }
      ],
      certifications: ['ISO 9001:2015', 'ISO 14001', 'RTA Approved', 'Municipality Approved']
    },
    {
      id: 'commercial',
      name: 'Commercial',
      icon: Building2,
      tagline: 'Iconic Business Destinations',
      description: 'Creating landmark commercial properties including office towers, retail centers, and mixed-use developments that define modern business environments.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
      stats: [
        { label: 'Buildings Delivered', value: '250+' },
        { label: 'Square Meters', value: '5M+' },
        { label: 'LEED Certified', value: '85%' },
        { label: 'Tenant Satisfaction', value: '96%' }
      ],
      services: [
        {
          title: 'Office Towers',
          desc: 'Grade A office buildings with smart building technologies, energy efficiency, and premium amenities',
          icon: Building2
        },
        {
          title: 'Retail Centers',
          desc: 'Shopping malls and retail complexes with modern design, optimal circulation, and tenant facilities',
          icon: Package
        },
        {
          title: 'Mixed-Use Developments',
          desc: 'Integrated developments combining commercial, residential, and hospitality components',
          icon: Layers
        },
        {
          title: 'Hospitality Projects',
          desc: 'Hotels and serviced apartments with luxury finishes and operational excellence',
          icon: Award
        }
      ],
      capabilities: [
        'High-Rise Construction',
        'Structural Engineering',
        'MEP Systems Integration',
        'Facade & Curtain Wall Installation',
        'Interior Fit-Out',
        'Smart Building Systems',
        'LEED & Green Building Certification',
        'Facility Management Setup'
      ],
      projects: [
        { name: 'Dubai Marina Commercial Tower', value: '$85M', status: 'Completed' },
        { name: 'Business Bay Office Complex', value: '$78M', status: 'Ongoing' },
        { name: 'Premium Retail Center', value: '$52M', status: 'Completed' }
      ],
      certifications: ['ISO 9001:2015', 'LEED Accredited', 'DM Approved', 'Emaar Approved']
    },
    {
      id: 'industrial',
      name: 'Industrial',
      icon: Factory,
      tagline: 'Manufacturing Excellence',
      description: 'Specialized construction services for manufacturing facilities, warehouses, and industrial complexes with focus on operational efficiency and safety.',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop',
      stats: [
        { label: 'Facilities Built', value: '180+' },
        { label: 'Industrial Space', value: '3M+ sqm' },
        { label: 'Zero Defects', value: '92%' },
        { label: 'Operational Uptime', value: '99.5%' }
      ],
      services: [
        {
          title: 'Manufacturing Plants',
          desc: 'Purpose-built factories with specialized foundations, heavy-duty infrastructure, and utility systems',
          icon: Factory
        },
        {
          title: 'Warehouses & Logistics',
          desc: 'Modern warehousing facilities with racking systems, loading docks, and automated systems',
          icon: Package
        },
        {
          title: 'Industrial Infrastructure',
          desc: 'Heavy industrial construction including power plants, water treatment facilities, and utilities',
          icon: Power
        },
        {
          title: 'Equipment Installation',
          desc: 'Installation and commissioning of heavy machinery and production line equipment',
          icon: Wrench
        }
      ],
      capabilities: [
        'Heavy Foundation Works',
        'Steel Structure Fabrication & Erection',
        'Industrial Flooring Systems',
        'Overhead Crane Installation',
        'Process Piping & Utilities',
        'Electrical Power Distribution',
        'HVAC & Ventilation Systems',
        'Automated Material Handling'
      ],
      projects: [
        { name: 'Industrial Manufacturing Complex', value: '$55M', status: 'Completed' },
        { name: 'Automotive Manufacturing Plant', value: '$68M', status: 'Completed' },
        { name: 'Logistics Warehouse Hub', value: '$42M', status: 'Ongoing' }
      ],
      certifications: ['ISO 9001:2015', 'OHSAS 18001', 'CE Marking', 'Industrial Approved']
    },
    {
      id: 'residential',
      name: 'Residential',
      icon: Home,
      tagline: 'Luxury Living Spaces',
      description: 'Creating premium residential communities, luxury villas, and high-rise apartments that redefine modern living standards.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
      stats: [
        { label: 'Homes Delivered', value: '120+' },
        { label: 'Communities Built', value: '15+' },
        { label: 'Owner Satisfaction', value: '97%' },
        { label: 'Quality Rating', value: '4.8/5' }
      ],
      services: [
        {
          title: 'Luxury Villas',
          desc: 'Custom-designed luxury villas with premium finishes, smart home systems, and landscaped gardens',
          icon: Home
        },
        {
          title: 'Residential Towers',
          desc: 'High-rise apartment buildings with modern amenities, parking, and recreational facilities',
          icon: Building2
        },
        {
          title: 'Gated Communities',
          desc: 'Integrated residential communities with infrastructure, amenities, and landscape development',
          icon: Shield
        },
        {
          title: 'Townhouse Developments',
          desc: 'Contemporary townhouse clusters with shared amenities and community spaces',
          icon: Layers
        }
      ],
      capabilities: [
        'Residential Construction',
        'Interior Design & Fit-Out',
        'Landscaping & Hardscaping',
        'Swimming Pool Construction',
        'Smart Home Integration',
        'Security & Access Control',
        'Community Facilities',
        'Maintenance Services'
      ],
      projects: [
        { name: 'Palm Jumeirah Luxury Villas', value: '$42M', status: 'Completed' },
        { name: 'Waterfront Residential Community', value: '$92M', status: 'Completed' },
        { name: 'Premium Apartment Tower', value: '$58M', status: 'Ongoing' }
      ],
      certifications: ['ISO 9001:2015', 'Estidama Certified', 'Nakheel Approved', 'Aldar Approved']
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: Hospital,
      tagline: 'Healing Environment Design',
      description: 'Specialized construction of healthcare facilities with stringent quality standards, infection control, and patient-centric design principles.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop',
      stats: [
        { label: 'Healthcare Projects', value: '90+' },
        { label: 'Hospital Beds', value: '5,000+' },
        { label: 'JCI Ready', value: '100%' },
        { label: 'Sterile Rooms', value: '300+' }
      ],
      services: [
        {
          title: 'Hospital Construction',
          desc: 'Complete hospital construction including operation theaters, ICUs, and specialized medical departments',
          icon: Hospital
        },
        {
          title: 'Medical Centers',
          desc: 'Outpatient clinics and specialized medical centers with modern diagnostic facilities',
          icon: Building2
        },
        {
          title: 'Laboratory Facilities',
          desc: 'Medical research labs and diagnostic centers with clean rooms and precision environments',
          icon: Cpu
        },
        {
          title: 'Medical Equipment',
          desc: 'Installation and integration of advanced medical equipment and imaging systems',
          icon: Wrench
        }
      ],
      capabilities: [
        'Healthcare Construction',
        'Medical Gas Systems',
        'Clean Room Construction',
        'HVAC Precision Control',
        'Infection Control Systems',
        'Emergency Power Systems',
        'Medical Equipment Installation',
        'JCI Compliance'
      ],
      projects: [
        { name: 'Modern Healthcare Center', value: '$38M', status: 'Completed' },
        { name: 'Specialized Medical Research Center', value: '$48M', status: 'Completed' },
        { name: 'Multispecialty Hospital', value: '$65M', status: 'Ongoing' }
      ],
      certifications: ['ISO 9001:2015', 'OHSAS 18001', 'MOH Approved', 'JCI Standards']
    }
  ];

  const currentSector = sectors[activeSector];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-[#0b1d34]">
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop" alt="" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <div className="w-2 h-2 bg-[#f1601f] rounded-full animate-pulse"></div>
                <span className="text-white font-semibold text-sm tracking-wider">INDUSTRY EXPERTISE</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Sectors We <span className="bg-gradient-to-r from-[#f1601f] to-orange-500 bg-clip-text text-transparent">Serve</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Delivering specialized solutions across diverse industries with deep sector knowledge and proven expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Sector Navigation */}
      <section className="py-12 bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
            {sectors.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <button
                  key={sector.id}
                  onClick={() => setActiveSector(index)}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-bold whitespace-nowrap transition-all duration-300 ${
                    activeSector === index
                      ? 'bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-[#7f8994] hover:bg-gray-200'
                  }`}
                >
                  <Icon size={24} />
                  <span>{sector.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sector Hero */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center space-x-3 mb-4">
                  {React.createElement(currentSector.icon, {
                    className: "text-[#f1601f]",
                    size: 48
                  })}
                </div>
                <div className="text-sm font-bold text-[#f1601f] tracking-wider uppercase mb-3">
                  {currentSector.tagline}
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-[#0b1d34] mb-6">
                  {currentSector.name}
                </h2>
                <p className="text-xl text-[#7f8994] leading-relaxed">
                  {currentSector.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {currentSector.stats.map((stat, i) => (
                  <div key={i} className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#f1601f] hover:shadow-xl transition-all duration-300">
                    <div className="text-4xl font-black text-[#f1601f] mb-2">{stat.value}</div>
                    <div className="text-sm font-semibold text-[#7f8994]">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-lg font-black text-[#0b1d34] mb-4">Certifications & Approvals</h3>
                <div className="flex flex-wrap gap-3">
                  {currentSector.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center space-x-2 bg-gradient-to-r from-gray-50 to-white border border-gray-200 px-4 py-2 rounded-lg">
                      <Award className="text-[#f1601f]" size={16} />
                      <span className="text-sm font-semibold text-[#7f8994]">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img src={currentSector.image} alt={currentSector.name} className="w-full h-[600px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mb-4">
              Our Services in {currentSector.name}
            </h2>
            <p className="text-xl text-[#7f8994] max-w-3xl mx-auto">
              Comprehensive solutions tailored to meet the unique demands of this sector
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {currentSector.services.map((service, i) => {
              const ServiceIcon = service.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-[#f1601f] hover:shadow-2xl transition-all duration-500"
                  onMouseEnter={() => setHoveredCapability(i)}
                  onMouseLeave={() => setHoveredCapability(null)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#f1601f] to-[#7f3e2c] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <ServiceIcon className="text-white" size={32} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-[#0b1d34] group-hover:text-white mb-4 transition-colors duration-500">
                      {service.title}
                    </h3>
                    
                    <p className="text-[#7f8994] group-hover:text-white/90 leading-relaxed transition-colors duration-500">
                      {service.desc}
                    </p>

                    <div className="mt-6 flex items-center space-x-2 text-[#f1601f] group-hover:text-white font-bold opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-sm">Learn More</span>
                      <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={18} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mb-4">
              Core Capabilities
            </h2>
            <p className="text-xl text-[#7f8994] max-w-3xl mx-auto">
              Technical expertise and specialized skills that drive project success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentSector.capabilities.map((capability, i) => (
              <div
                key={i}
                className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#f1601f] hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-[#f1601f] flex-shrink-0 mt-1" size={24} />
                  <span className="font-bold text-[#0b1d34]">{capability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#0b1d34] mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-[#7f8994] max-w-3xl mx-auto">
              Recent successful projects in the {currentSector.name.toLowerCase()} sector
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {currentSector.projects.map((project, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-3xl p-8 hover:border-[#f1601f] hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className={`px-4 py-2 rounded-full text-xs font-bold ${
                    project.status === 'Completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {project.status}
                  </div>
                  <div className="text-2xl font-black text-[#f1601f]">{project.value}</div>
                </div>
                
                <h3 className="text-xl font-black text-[#0b1d34] mb-4">{project.name}</h3>
                
                <div className="flex items-center space-x-2 text-[#f1601f] font-bold hover:translate-x-2 transition-transform duration-300 cursor-pointer">
                  <span className="text-sm">View Project</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us for This Sector */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0b1d34] to-[#13344c] rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="p-12">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Why Choose RAWASY for {currentSector.name}
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: Award,
                      title: 'Sector Expertise',
                      desc: 'Deep understanding of industry-specific requirements and regulations'
                    },
                    {
                      icon: Users,
                      title: 'Specialized Workforce',
                      desc: 'Certified professionals with extensive sector experience'
                    },
                    {
                      icon: Shield,
                      title: 'Safety Excellence',
                      desc: 'Industry-leading safety protocols and zero-harm culture'
                    },
                    {
                      icon: Zap,
                      title: 'Proven Track Record',
                      desc: 'Hundreds of successfully delivered projects in this sector'
                    }
                  ].map((item, i) => {
                    const ItemIcon = item.icon;
                    return (
                      <div key={i} className="flex items-start space-x-4 group">
                        <div className="w-12 h-12 bg-[#f1601f] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <ItemIcon className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                          <p className="text-gray-300 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative h-full min-h-[500px]">
                <img 
                  src={currentSector.image} 
                  alt={currentSector.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#13344c]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-[#0b1d34] via-[#13344c] to-[#0b1d34] relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f1601f]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7f3e2c]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-8">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full border border-white/20">
                <div className="w-3 h-3 bg-[#f1601f] rounded-full animate-pulse"></div>
                <span className="text-white font-bold text-lg tracking-wider">READY TO START YOUR PROJECT?</span>
              </div>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Let's Build <span className="bg-gradient-to-r from-[#f1601f] to-orange-500 bg-clip-text text-transparent">Together</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12 max-w-3xl mx-auto">
              Partner with RAWASY for your next {currentSector.name.toLowerCase()} project and experience unparalleled expertise and commitment to excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white font-bold text-lg px-12 py-5 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-3">
                <span>Start Your Project</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
              </button>
              
              <button className="group bg-white/10 backdrop-blur-sm text-white font-bold text-lg px-12 py-5 rounded-2xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-300 flex items-center space-x-3">
                <span>Download Brochure</span>
                <TrendingUp className="group-hover:scale-110 transition-transform duration-300" size={20} />
              </button>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: 'Years Experience', value: '25+' },
                { label: 'Projects Completed', value: '800+' },
                { label: 'Happy Clients', value: '200+' },
                { label: 'Countries Served', value: '12+' }
              ].map((stat, i) => (
                <div key={i} className="text-white">
                  <div className="text-3xl md:text-4xl font-black text-[#f1601f] mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sector Navigation Footer */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-black text-[#0b1d34] mb-4">
              Explore Other Sectors
            </h3>
            <p className="text-[#7f8994] max-w-2xl mx-auto">
              Discover how RAWASY delivers excellence across multiple industries with specialized expertise
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sectors.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <button
                  key={sector.id}
                  onClick={() => setActiveSector(index)}
                  className={`flex flex-col items-center space-y-3 p-6 rounded-2xl font-bold transition-all duration-300 ${
                    activeSector === index
                      ? 'bg-gradient-to-r from-[#f1601f] to-[#7f3e2c] text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-[#7f8994] hover:bg-gray-200'
                  }`}
                >
                  <Icon size={32} />
                  <span className="text-sm">{sector.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RawasySectorsPage;