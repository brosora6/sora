const Hero = () => {
  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        >
          <source src="/videos/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      <div className="relative h-full flex items-end">
        <div className="max-w-7xl px-8 sm:px-10 lg:px-12">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight text-white">
            EXPLORING THE<br />
            BOUNDARIES<br />
            <span className="text-2xl md:text-3xl font-normal">
              OF CRAFTSMANSHIP AND DESIGN
            </span>
          </h2>
          <button className="px-6 py-3 border border-white hover:bg-white hover:text-black transition-colors mb-8 mt-4">
          EXPLORE OUR BUILDS →
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero