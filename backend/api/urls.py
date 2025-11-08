from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'forms', FormViewSet)
router.register(r'form_responses', FormResponseViewSet)

urlpatterns = [
    path('', include(router.urls)),

    path('layout/navbar/', NavbarView.as_view(), name='navbar'),
    path('layout/footer/', FooterView.as_view(), name='footer'),


    path('home/carousel/', CarouselView.as_view(), name='carousel'),
    path('home/hero/', HeroView.as_view(), name='hero'),

    path('home/new/', NewView.as_view(), name='new'),
    path('home/training/', TrainingView.as_view(), name='training'),
    path('home/professional-training/', ProfessionalTrainingView.as_view(), name='professional-training'),

    path('result-verification-data/', ResultVerificationData.as_view(), name='result-verification-data'),
    path('result-data/', ResultData.as_view(), name='result-verification-data'),
    
    # ------------------- TRAINING SECTION -------------------
    path('training/admission/', TrainingAdmissionView.as_view(), name='training-admission'),
    path('training/courses/', TrainingCoursesView.as_view(), name='training-courses'),
    path('training/fees/', TrainingFeesView.as_view(), name='training-fees'),
    path('training/accommodations/', TrainingAccommodationsView.as_view(), name='training-accommodations'),



    path('home/cards/', CardsView.as_view(), name='cards'),
    path('home/services/', ServicesView.as_view(), name='services'),
    path('home/statistics/', StatisticsView.as_view(), name='statistics'),
    path('home/timeline/', TimelineView.as_view(), name='timeline'),
    path('home/why-us/', WhyUsView.as_view(), name='why_us'),
    path('home/our-clients/', OurClientsView.as_view(), name='our_clients'),
    path('home/associates/', AssociatesView.as_view(), name='associates'),
    path('home/about-preview/', AboutPreview.as_view(), name='aboutpreview'),
    path('home/testimonials/', Testimonials.as_view(), name='testimonials'),
    path('home/contacts/', Contact.as_view(), name='contact'),
    path('home/client-logos/', ClietLogos.as_view(), name='client_logos'),
    path('home/service/', HomeService.as_view(), name='home-service'),

    path('home/industries/', IndustriesView.as_view(), name='news'),
    path('home/contact/', ContactView.as_view(), name='contact'),
    path('home/location/', LocationView.as_view(), name='location'),
    path('home/featured-video/', FeaturedVideoView.as_view(), name='featured_video'),

    # About Section
    path('about/about1/', About1View.as_view(), name='about1'),
    path('about/about2/', About2View.as_view(), name='about2'),
    path('about/message/', MessageView.as_view(), name='message'),
    path('about/core-values/', CoreValuesView.as_view(), name='core_values'),
    path('about/team/', TeamView.as_view(), name='team'),
    path('about/hero/', AboutView.as_view(), name='about'),


    # Contact Section
    path('contact/contact1/', Contact1View.as_view(), name='contact1'),
    path('contact/contact2/', Contact2View.as_view(), name='contact2'),
    path('contact/contact3/', Contact3View.as_view(), name='contact3'),

    # Projects Section
    path('projects/', ProjectsView.as_view(), name='projects'),


    ## Facilities section
    path('facilities/hero/', FacilitiesHeroView.as_view(), name='Facilities-hero'),
    path('facilities/features-section/', FacilitiesFeaturesView.as_view(), name='Facilities-features'),
    path('facilities/facilities-content/', FacilitiesContentView.as_view(), name='Facilities-content'),
    path('facilities/equipment/', FacilitiesEquipmentView.as_view(), name='Facilities-equipment'),
    path('facilities/cta/', FacilitiesCTAView.as_view(), name='Facilities-cta'),

    # Service Section
    path('service/service-list/', ServiceListView.as_view(), name='servicelist'),
    path('service/service-card/', ServiceCardView.as_view(), name='servicecard'),
    path('service-model/', ServicemodelView.as_view(), name='servicemodel'),
    path('service-hero/', ServicesHeroView.as_view(), name='servicesHero'),
    path('service-value/', ServicesValueView.as_view(), name='servicesvalue'),
    path('service-training/', ServicesTrainingView.as_view(), name='servicestraining'),
    path('service-category/', ServicesCategoryView.as_view(), name='servicescategory'),
    path('service/testing/', ServicesTestingView.as_view(), name='servicesTesting'),
    path('service/CTA/', ServicesCTAView.as_view(), name='servicesCTA'),
    path('service/red-divider/', ServicesRedDividerView.as_view(), name='servicesRedDivider'),


    ## gallery
      path('gallery/hero/', GalleryHeroView.as_view(), name='gallery-hero'),
      path('gallery/content/', GalleryContentView.as_view(), name='gallery-content'),
      path('gallery/cta/', GalleryCTAView.as_view(), name='gallery-cta'),
      path('gallery/red-divider/', GalleryRedDividerView.as_view(), name='gallery-Red'),



      # Projects Section
    path('services/', ServicesPageView.as_view(), name='services-pages'),
    path('project/project-gallery/', ProjectGallery.as_view(), name='project_gallery'),
    path('project/project-card/', ProjectCard.as_view(), name='project_card'),

    # sustainability
    path('sustainability/', Sustainability.as_view(), name='sustainability'),

    # career Info
    path('career/', Career.as_view(), name='career'),
   

   # QuoteForm
   path('quote/', QuoteForm.as_view(), name='quote'),



 # Projects Section
    path('gallery/', GalleryView.as_view(), name='projects'),

    path('get-service-slugs/', get_service_slugs, name='get_service_slugs'),

   path('contact-messages/', ContactMessageListCreate.as_view(), name='contact-message-list'),
    path('contact-messages/<int:pk>/', ContactMessageDetail.as_view(), name='contact-message-detail'),

    # MEDICAL REPORTS AND FORMS 

  
    # Medical Reports
        path('job-applications/', JobApplicationListCreateView.as_view(), name='job-applications'),

        path('images/', UploadedImageViewSet.as_view(), name='image-list-create'),
      path('images/<int:pk>/', RetrieveImage.as_view(), name='image-retrive'),
    

 
    ]

