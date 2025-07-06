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

// Create a modal element and add it to the page (hidden by default)
const modal = document.createElement('div');
modal.id = 'image-modal';
modal.style.display = 'none'; // Hide modal initially
modal.innerHTML = `
  <div class="modal-content">
    <span class="modal-close">&times;</span>
    <br>
    <img class="modal-img" src="" alt="">
    <h2 class="modal-title"></h2>
    <p class="modal-date"></p>
    <p class="modal-explanation"></p>
  </div>
`;
document.body.appendChild(modal);

// Get modal elements for later use
const modalImg = modal.querySelector('.modal-img');
const modalTitle = modal.querySelector('.modal-title');
const modalDate = modal.querySelector('.modal-date');
const modalExplanation = modal.querySelector('.modal-explanation');
const modalClose = modal.querySelector('.modal-close');

// Function to open the modal with image data
function openModal(item) {
  modalImg.src = item.hdurl || item.url; // Use HD image if available
  modalImg.alt = item.title;
  modalTitle.textContent = item.title;
  modalDate.textContent = `Date: ${item.date}`;
  modalExplanation.textContent = item.explanation;
  modal.style.display = 'flex';
}

// Function to close the modal
function closeModal() {
  modal.style.display = 'none';
}

// Close modal when clicking the close button
modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Add a click event listener to the button
getImagesButton.addEventListener('click', () => {
  // Get the selected start and end dates from the inputs
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Build the API URL with the selected date range
  const url = `${api}&start_date=${startDate}&end_date=${endDate}`;

  // Show a loading message before fetching data
  gallery.innerHTML = '<p>Loading images, please wait...</p>';

  // Fetch data from NASA's API
  fetch(url)
    .then(response => response.json()) // Convert the response to JSON
    .then(data => {
      // Remove the loading message and show the gallery
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
          card.appendChild(document.createElement("br"));   // <br> spacing between img and title
          card.appendChild(title);
          card.appendChild(date);

          // When the card is clicked, open the modal with this item's data
          card.addEventListener('click', () => {
            openModal(item);
          });

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

// Array of placeholder "Did You Know?" space facts
const spaceFacts = [
  "It takes our solar system about 230 million years to complete one orbit around the galactic center.",
  "Space is completely silent. There is no air or atmosphere in space. Since it is a vacuum, sound waves will have no medium to travel to.",
  "When you look at a star, what you actually see is how it was in the past. Light takes time to reach Earth. The bright star, Sirius, for example, is roughly 8.6 light-years away. That means when you see it in the sky tonight, you are actually seeing Sirius the way it was 8.6 years ago!",
  "Hailey's Comet won't orbit past Earth again until 2061.",
  "There are about 2 trillion galaxies in the observable universe."
];

// Function to show a random space fact
function showRandomSpaceFact() {
  // Pick a random index from the array
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  // Get the fact
  const fact = spaceFacts[randomIndex];
  // Find the space fact section and display the fact
  const factDiv = document.getElementById('space-fact');
  factDiv.textContent = `Did You Know? ${fact}`;
}

// Show a random fact when the app loads
showRandomSpaceFact();