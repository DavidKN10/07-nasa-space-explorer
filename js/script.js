// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

const api = "https://api.nasa.gov/planetary/apod?api_key=vTnW00MNMMnBe6ACQqXZeZ86BhJdhTqPSxL7Rj3Z";

// Find the "Get Space Images" button on the page
const getImagesButton = document.querySelector('button');

// Find the gallery container on the page
const gallery = document.getElementById('gallery');

// Add a click event listener to the button
getImagesButton.addEventListener('click', () => {
  // Get the selected start and end dates from the inputs
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Build the API URL with the selected date range
  // We use &start_date= and &end_date= to get images for multiple days
  const url = `${api}&start_date=${startDate}&end_date=${endDate}`;

  // Fetch data from NASA's API
  fetch(url)
    .then(response => response.json()) // Convert the response to JSON
    .then(data => {
      // Remove the placeholder content
      gallery.innerHTML = '';

      // Check if we got an array (multiple days) or a single object (one day)
      const items = Array.isArray(data) ? data : [data];

      // Loop through each item and create a gallery card
      for (const item of items) {
        // Only show images (not videos)
        if (item.media_type === 'image') {
          // Create a div for each gallery item
          const card = document.createElement('div');
          card.className = 'gallery-item';

          // Create an image element
          const img = document.createElement('img');
          img.src = item.url; // Use 'url' for standard image
          img.alt = item.title;

          // Create a title element
          const title = document.createElement('h3');
          title.textContent = item.title;

          // Create a date element
          const date = document.createElement('p');
          date.textContent = `Date: ${item.date}`;

          // Add image, title, and date to the card
          card.appendChild(img);
          card.appendChild(title);
          card.appendChild(date);

          // Add the card to the gallery
          gallery.appendChild(card);
        }
      }

      // If no images found, show a message
      if (gallery.children.length === 0) {
        gallery.innerHTML = '<p>No images found for this date range.</p>';
      }
    })
    .catch(error => {
      // If there is an error, log it to the console
      console.error('Error fetching data from NASA API:', error);
      gallery.innerHTML = '<p>Sorry, something went wrong. Please try again.</p>';
    });
});