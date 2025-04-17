// src/components/About.jsx
import { useState } from 'react'
import Transition from '../components/anim/Transistion'

const About = () => {
  const features = [
    { title: "Custom Design", description: "Tailored motorcycles that reflect your unique style and preferences." },
    { title: "Expert Craftsmanship", description: "Skilled artisans with years of experience in motorcycle building." },
    { title: "Quality Materials", description: "Only the finest materials used to ensure durability and performance." },
    { title: "Innovative Technology", description: "Cutting-edge tech integrated seamlessly with classic designs." },
  ]

  const workshopImages = [
    "/images/workshop/1.jpg",
    "/images/workshop/2.jpg",
  ]

  const [lightboxImage, setLightboxImage] = useState(null)

  const openLightbox = (image) => {
    setLightboxImage(image)
  }

  const closeLightbox = () => {
    setLightboxImage(null)
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-20">
            <div className="relative h-[50vh] overflow-hidden rounded-lg">
                <video 
                    src="/videos/background2.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <h2 className="absolute bottom-28 left-1/2 transform -translate-x-1/2 text-8xl font-bold text-center">
                        ABOUT
                    </h2>
            </div>    
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold">Our Story</h2>
            <p className="text-gray-400">
              Founded in 2015, Solace Motor began as a passion project by a group of motorcycle enthusiasts 
              who wanted to push the boundaries of custom bike building. What started in a small garage 
              has now grown into a full-fledged workshop, creating some of the most unique and sought-after 
              custom motorcycles in the industry.
            </p>
            <p className="text-gray-400">
              Our team combines years of experience with a relentless pursuit of innovation, resulting in 
              motorcycles that are not just modes of transportation, but true works of art.
            </p>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img 
              src="/images/about/about.jpg"
              alt="Solace Motor Workshop" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-semibold mb-10 text-center">Why Choose Solace Motor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-20">
          <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            At Solace Motor, our mission is to create motorcycles that inspire, excite, and push the 
            boundaries of what's possible. We're committed to preserving the soul of classic motorcycles 
            while infusing them with modern technology and unparalleled craftsmanship.
          </p>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-semibold mb-10 text-center">Our Workshop</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workshopImages.map((image, index) => (
              <div 
                key={index} 
                className="relative h-80 rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => openLightbox(image)}
              >
                <img 
                  src={image || "/images/workshop/1.jpg"} 
                  alt={`Workshop Image ${index + 1}`} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white text-lg font-semibold">Click to enlarge</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our state-of-the-art workshop is where dreams become reality. Equipped with the latest tools 
              and staffed by skilled craftsmen, it's the birthplace of our custom motorcycles.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-10 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((member) => (
              <div key={member} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                  <img 
                    src={`/images/about/about3.jpg`} 
                    alt={`Team Member ${member}`} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Team Member {member}</h3>
                <p className="text-gray-400">Master Craftsman</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {lightboxImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" 
            onClick={closeLightbox}
          >
            <img 
              src={lightboxImage || "/placeholder.svg"} 
              alt="Enlarged workshop image" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default About