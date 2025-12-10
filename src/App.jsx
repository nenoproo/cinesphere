import { useState, useEffect } from 'react';
import axios from 'axios';
import ImageGallery from './components/ImageGallery';
import CineSphereLogo from './assets/images/cinesphere-logo.png';

function App() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = './data.json';
        const res = await axios.get(url);
        setData(res.data);
      } catch (err) {
        console.log('Error fetching movies data!', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="flex justify-center items-center mb-4">
        <img src={CineSphereLogo} className="w-20 h-20 text-white" alt="CineSphere logo" />
        <h1 className="mb-3 text-white text-3xl lg:text-4xl text-center">
          CineSphere</h1>
      </div>

      <p className="mb-4 lg:mb-8 font-inter text-gray-200 text-sm text-center uppercase animate-shimmer">In cinemas this week — choose a screening</p>

      <h4 className="lg:hidden mb-4 text-gray-300 text-sm text-center lg:text-start">
        Swipe left to see all movies 🎬
      </h4>

      <ImageGallery
        data={data}
        loading={loading}
      />
      <p className="mt-10 text-white text-sm text-center">Crafted and developed by <a href="https://github.com/nenoproo" target="_blank" className="text-blue-300">N3Shk0</a></p>
    </>
  )
}

export default App;