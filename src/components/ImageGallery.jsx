import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function ImageGallery({ data, loading }) {
  console.log('Data with Movies info received!', data); // тест дали е примена датата
  const [selectedMovie, setSelectedMovie] = useState(null); // избраниот филм / објект
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // boolean state за отворен/затворен модал, се користи за show/hide и за click outside
  const modalBoxRef = useRef();
  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState('details');

  const handleThumbnailClick = (movie) => {
    setImageLoaded(false);
    setSelectedMovie(movie);
    setActiveTab('details');
  };

  useEffect(() => {
    let handler = (e) => {
      if (modalBoxRef.current && !modalBoxRef.current.contains(e.target)) {
        // првин проверуваме дали рефот постои и не е кликнато на него
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  // функција за скролање на лево
  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -200,
      behavior: 'smooth',
    });
  };

  // функција за скролање на десно
  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 200,
      behavior: 'smooth',
    });
  };

  // функција за форматирање датум
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // 01
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 12
    const year = String(date.getFullYear()); // 2025
    return `${day}. ${month}. ${year}`;
  }

  // функција за прикажување алерт на buy tickets
  function handleBuyTickets() {
    alert('Sorry, this is a demo project. This future is not implemented yet!');
  }

  return (
    <div className="mx-auto max-w-5xl">
      {loading ? (
        <p className="text-gray-200">Loading Movies...</p>
      ) : (
        <div className="relative">
          <div className="relative">
            {/* Thumbnails container*/}
            <ul
              ref={scrollRef}
              className="flex gap-3 mb-5 overflow-visible overflow-x-auto scrollbar-hide"
            >
              {data.map((movie) => {
                return (
                  <li key={movie.id} className="shrink-0">
                    <img
                      src={movie.image_thumb}
                      className="rounded-sm w-20 h-auto cursor-pointer"
                      alt={`Poster of: ${movie.title} (${movie.year}) directed by ${movie.director}`}
                      onClick={() => handleThumbnailClick(movie)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Arrows for horizontal scroll */}
          <button
            className="hidden lg:block top-8 lg:top-8 left-2 lg:-left-17 absolute bg-amber-50 p-0.5 rounded-sm text-4xl scroll-left-btn cursor-pointer"
            onClick={scrollLeft}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            className="hidden lg:block top-8 -right-17 absolute bg-amber-50 p-0.5 rounded-sm text-4xl scroll-left-btn cursor-pointer"
            onClick={scrollRight}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>

          <figure className="lg:flex lg:items-start lg:gap-7 mx-auto max-w-full lg:max-w-4xl">
            {/* Main image */}
            <div className="w-full lg:w-1/2">
              <img
                key={selectedMovie ? selectedMovie.image : data[0].image}
                className={`mx-auto max-w-full h-auto transition-opacity duration-700 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                src={
                  selectedMovie
                    ? selectedMovie.image
                    : data && data.length > 0
                      ? data[0].image
                      : 'Loading...'
                }
                alt={`Cover image of ${selectedMovie
                  ? selectedMovie.title
                  : data && data.length > 0
                    ? data[0].title
                    : 'Loading'
                  }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            <figcaption className="mt-5 lg:mt-0 px-4 py-5 rounded-xl w-full lg:w-1/2 text-gray-200">
              {/* Детали за филмот и термини */}
              <nav className="flex justify-center tabs">
                <button
                  className={`tab-btn ${activeTab === 'details' ? 'active' : ''
                    }`}
                  onClick={() => setActiveTab('details')}
                >
                  Movie Details
                </button>
                <button
                  className={`tab-btn ${activeTab === 'showtimes' ? 'active' : ''
                    }`}
                  onClick={() => setActiveTab('showtimes')}
                >
                  Showtimes
                </button>
              </nav>

              {/* Најпрвин провери дали е избран филм / објект и доколку е, земи ја од него вредноста од title и стави ја како текст, но ако не е избран (null), тогаш земи ја вредноста од title од првиот објект од масивот data и стави ја како дифолтент текст, но претходно провери дали воопшто постои масивот  */}
              <h2 className="mb-5 text-xl lg:text-3xl">
                {selectedMovie
                  ? `${selectedMovie.title} (${selectedMovie.year})`
                  : data && data.length > 0
                    ? data[0].title
                    : 'Loading...'}
              </h2>

              <div className="relative lg:w-full lg:min-h-62 overflow-hidden">
                {/* Movie Details div */}
                <div className={`relative lg:absolute top-0 left-0 w-full space-y-2 ${activeTab === 'details' ? 'slide-in-right' : 'slide-out-right'}`}>
                  <p>
                    <span className="font-semibold">Director: </span>
                    {selectedMovie
                      ? selectedMovie.director
                      : data && data.length > 0
                        ? data[0].director
                        : 'Loading...'}
                  </p>
                  <p>
                    <span className="font-semibold">Genre: </span>
                    {selectedMovie
                      ? selectedMovie.genre.join(', ')
                      : data && data.length > 0
                        ? data[0].genre.join(', ')
                        : 'Loading...'}{' '}
                    | <span className="font-semibold">Raiting: </span>
                    {selectedMovie
                      ? selectedMovie.rating
                      : data && data.length > 0
                        ? data[0].rating
                        : 'Loading...'}
                  </p>
                  <p className="text-sm">
                    {selectedMovie
                      ? selectedMovie.description
                      : data && data.length > 0
                        ? data[0].description
                        : 'Loading'}
                  </p>
                  <button
                    className="bg-[#F7BE38] hover:bg-[#ffce47] mt-5 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 text-black transition cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    🎬 Watch trailer
                  </button>
                </div>

                {/* Showtimes div */}
                <div className={`absolute top-0 left-0 w-full space-y-2  ${activeTab === 'showtimes' ? 'slide-in-right' : 'slide-out-right'}`}>
                  <p>
                    <span className="font-semibold">Date: </span>
                    {selectedMovie
                      ? formatDate(selectedMovie.showtimes?.date)
                      : data && data.length > 0
                        ? formatDate(data[0].showtimes?.date)
                        : 'Loading'}
                  </p>
                  <p>
                    <span className="font-semibold">Hall: </span>
                    {selectedMovie ? selectedMovie.showtimes?.hall : data && data.length > 0 ? data[0].showtimes?.hall : 'Loading'}
                  </p>
                  <p className="mb-5">
                    <span className="font-semibold">Time: </span>
                    {selectedMovie ? selectedMovie.showtimes?.time : data && data.length > 0 ? data[0].showtimes?.time : 'Loading'}
                  </p>

                   <button className="bg-[#fdcf50] hover:bg-[#ffd86d] shadow-md hover:shadow-lg px-3 py-1 rounded-md font-medium text-black transition cursor-pointer"
                   onClick={() => handleBuyTickets()}
                   >
                  <span>🎟️ </span>
                  Buy Tickets</button>
                </div>              
              </div>

            </figcaption>
          </figure>

          {isModalOpen && (
            // Backdrop
            <div className="z-40 fixed inset-0 flex justify-center items-center bg-black/70">
              {/* Modal box */}
              <div
                ref={modalBoxRef}
                className="relative bg-black mx-4 lg:mx-0 p-4 rounded-lg lg:w-2/3 animate-modal-pop"
              >
                <button
                  className="top-2 right-2 absolute font-bold text-white text-4xl leading-none cursor-pointer"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>

                {/* Youtube iframe */}
                <div className="w-full aspect-video">
                  {selectedMovie && (
                    <iframe
                      className="w-full h-full"
                      src={selectedMovie.trailer}
                      title={`Trailer for ${selectedMovie.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
