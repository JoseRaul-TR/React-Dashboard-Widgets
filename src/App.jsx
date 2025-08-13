import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import BackgroundImage from "./components/BackgroundImage";
import "./App.css";

function App() {
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect (() => {
    // Load background from local storage on initial load
    const lastImageUrl = localStorage.getItem('lastBackgroundImage');
    if (lastImageUrl) {
      setBackgroundImage(lastImageUrl);
    }
  }, []);
  
  return (
    <div style={{
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
    }}>
      <BackgroundImage onBackgroundChange={setBackgroundImage}/>
        <Header />
        <Main />
        <Footer />
    </div>
  );
}

export default App;
