import React, { useEffect } from 'react';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
const QUOTE_API = "https://api.api-ninjas.com/v1/quotes"; // You can change the category if needed
const API_KEY = process.env.API_KEY;


function App() {
  const [quote, setQuote] = React.useState({ text: '', author: '' });

  const changeBackgroundColor = (color) => {
    const backgroundContainer = document.getElementById('background-container');
    backgroundContainer.style.backgroundColor = color;

    const buttons = document.querySelectorAll('#quote-box button, #quote-box a');

    // Apply the same color to buttons and icon buttons
    buttons.forEach(button => {
      button.style.backgroundColor = color;
    });
  };

  const fetchQuote = async () => {
    try {
      const response = await fetch(QUOTE_API, {
        headers: {
          'X-Api-Key': API_KEY
        }
      });

      // Debug: Log response
      console.log("Fetch response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Debug: Log received data
      console.log("Quote data:", data);

      const randomQuote = data[0]; // API returns an array of 1 quote

      // Hide text before updating
      const textElement = document.getElementById('text');
      const authorElement = document.getElementById('author');
      textElement.classList.remove('show');
      authorElement.classList.remove('show');

      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Generate a random hex color

      setTimeout(() => {
        setQuote({
          text: randomQuote.quote,
          author: randomQuote.author || 'Unknown'
        });

        // Show text after updating
        textElement.classList.add('show');
        authorElement.classList.add('show');

        // Change background color after text update
        changeBackgroundColor(randomColor);
      }, 500); // Match the CSS transition duration
    } catch (error) {
      console.error('Fetch failed:', error);
      setQuote({ text: 'Failed to fetch quote', author: '' });
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div id="background-container">
      <div id="quote-box">
        <h1 id="text">{quote.text ? quote.text : 'Loading...'}</h1>
        <h2 id="author">— {quote.author}</h2>
        <div id="quote-controls">
          <div className="social-buttons">
            <a 
              href={`https://twitter.com/intent/tweet?text="${quote.text}" - ${quote.author}`} 
              id="tweet-quote" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-twitter" aria-hidden="true"></i> {/* Twitter icon */}
            </a>

            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote="${quote.text}" - ${quote.author}`} 
              id="facebook-quote" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-facebook" aria-hidden="true"></i> {/* Facebook icon */}
            </a>
          </div>

          <div id="button">
            <button id="new-quote" onClick={fetchQuote}>
              New Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
