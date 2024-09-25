import { useState, useEffect } from "react";
import './Preloader.css'; // Import the CSS file

const Preloader = () => {
  const [loading, setLoading] = useState(true); // Preloader starts as visible
  const [fadeOut, setFadeOut] = useState(false); // State for fade-out effect

  useEffect(() => {
    const handlePageLoad = () => {
      setFadeOut(true); // Start fade-out when loading completes
      const timer = setTimeout(() => {
        setLoading(false); // Set loading to false after fade-out
      }, 3000); // Adjust based on the fade-out duration

      return () => clearTimeout(timer); // Clean up timer
    };

    window.addEventListener("load", handlePageLoad);

    // Fallback timeout in case the load event doesn't fire
    const timeout = setTimeout(() => {
      setFadeOut(true);
      setLoading(false);
    }, 3000); // Minimum loading time of 1 second

    return () => {
      window.removeEventListener("load", handlePageLoad);
      clearTimeout(timeout); // Clean up timeout
    };
  }, []);

  // If loading is complete, do not render the preloader
  if (!loading) {
    return null;
  }

  // Render the preloader while loading is true
  return (
    <div className={`preloader ${fadeOut ? 'fade-out' : ''}`}>
      <img
        src={`${process.env.PUBLIC_URL}/loader.gif`} // Replace with your actual preloader image or gif
        alt="Loading..."
        className="preloader-image"
      />
      <p className="preloader-text">Loading...</p>
    </div>
  );
};

export default Preloader;
