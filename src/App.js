import React, { useState, useEffect } from 'react';
import './App.css';

/* Material Ui */
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

function App() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Get the images from local storage on first render
    let storedImages = JSON.parse(localStorage.getItem('images')) || [];
    setImages(storedImages);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: inputValue
      })
    })
    .then(response => response.json())
    .then(data => {
      let newImages = JSON.parse(localStorage.getItem('images')) || [];
      newImages.push(data.data[0].url);
      setImages(newImages);
      setIsLoading(false);
      localStorage.setItem('images', JSON.stringify(newImages));
    });
  }


  return (
    <div className="App">
      <div className='container'>
        <h2>Create images with DALL-E</h2>
        <form className='create_image' onSubmit={handleSubmit}>
          <div className='item'>
            <TextField
              id="standard-multiline-static"
              label="Create an image"
              multiline
              rows={4}
              variant="standard"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              type="text"
            />
          </div>
          <div className='item submit'>
            <Button type="submit" variant="outlined">Create</Button>
          </div>
        </form>
      </div>

      <div className='result'>
        {isLoading && 
            <div className='loading'>
              <CircularProgress />
            </div>
          }
        {images && images.map((image, index) => {
          return(
            <div className='image' key={index}>
                <a href={image} download='image.jpg' target="_blank" rel="noreferrer">
                  <img src={image} alt='Generated'/>
                  <Button variant="contained">Download</Button>
                </a>
            </div>
          )
        })}
      </div>
    </div>
  );
}
export default App;