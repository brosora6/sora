import { Head } from "@inertiajs/react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface HomeProps {
  auth: {
    user: any
  }
}

export default function Home({ auth }: HomeProps) {
  return (
    <>
      <Head title="Home" />
      <Navbar auth={auth} />

      <main className="bg-[#121212] text-white min-h-screen">
        {/* Hero Section */}
        <div className="relative h-screen">
          {/* Hero Background Video */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src="/videos/masak.mp4" type="video/mp4" />
              {/* Fallback image in case video doesn't load */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/horde1.jpg-M9FqtdHbTEKOupNuwHndNNdbeNZr2A.jpeg"
                alt="Motorcycle Group"
                className="w-full h-full object-cover"
              />
            </video>
          </div>

          {/* Hero Content */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo1-iDUuZx8q74HbuOfQjIPSDQbSD16WAg.png"
              alt="Solace Motorcycle Logo"
              className="w-24 h-24 mb-8"
            />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white text-center max-w-4xl">
              RIDE WITH PURPOSE, <br />
              <span className="text-gray-300">LIVE WITH PASSION</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300 text-center max-w-2xl font-light">
              Join the community of riders who embrace the freedom of the open road and the thrill of motorcycle
              culture.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-white text-black font-medium rounded-none hover:bg-gray-200 transition-colors">
                EXPLORE COLLECTION
              </button>
              <button className="px-8 py-3 border border-white text-white font-medium rounded-none hover:bg-white/10 transition-colors">
                JOIN COMMUNITY
              </button>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-left mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">FEATURED COLLECTION</h2>
            <div className="w-16 h-[1px] bg-white"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Item 1 */}
            <div className="bg-[#1a1a1a] overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/karyoku1.jpg-DEZQmHmxxk4XMZnyGOV8xJSvsoSTL6.jpeg"
                  alt="Custom Motorcycle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">CUSTOM BUILDS</h3>
                <p className="text-gray-400 mb-4 font-light">Unique motorcycles crafted with precision and passion.</p>
                <a
                  href="#"
                  className="text-white font-medium flex items-center group-hover:translate-x-2 transition-transform duration-300"
                >
                  EXPLORE MORE
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Featured Item 2 */}
            <div className="bg-[#1a1a1a] overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ride1.jpg-kbsTLaeZepyg92T6RUHog3DIAgaciw.jpeg"
                  alt="Night Rides"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">NIGHT RIDES</h3>
                <p className="text-gray-400 mb-4 font-light">Experience the thrill of urban exploration after dark.</p>
                <a
                  href="#"
                  className="text-white font-medium flex items-center group-hover:translate-x-2 transition-transform duration-300"
                >
                  JOIN EVENTS
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Featured Item 3 */}
            <div className="bg-[#1a1a1a] overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/feed11.jpg-cGKoUKFU4AYV49Cs4F96KKnZw5N1vJ.jpeg"
                  alt="Off-Road Adventures"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">OFF-ROAD ADVENTURES</h3>
                <p className="text-gray-400 mb-4 font-light">Push your limits with our dirt track experiences.</p>
                <a
                  href="#"
                  className="text-white font-medium flex items-center group-hover:translate-x-2 transition-transform duration-300"
                >
                  DISCOVER TRAILS
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
