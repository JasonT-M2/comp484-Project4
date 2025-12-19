// Global variables to track the map and quiz state
let map;
let currentQuestion = 0;
let score = 0;
let locations = [];

/**
 * Initializes the Google Map and quiz locations
 */
const blankMapStyle = [
  {
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }]
  }
];

function initMap() {
  // Create the Google Map centered on CSUN
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.2380, lng: -118.5289 },
    zoom: 17,

    styles: blankMapStyle, // hides all labels

    // Disable all user interactions (pan, zoom, controls)
    disableDefaultUI: true,
    draggable: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    keyboardShortcuts: false
  });

  // Define quiz locations using RECTANGLES
  // Each rectangle represents the acceptable answer area
  locations = [
    {
      name: "The Soraya",
      rectangle: new google.maps.Rectangle({
        bounds: {
          north: 34.23663,
          south: 34.23579,
          west: -118.52876,
          east: -118.52757
        }
      })
    },
    {
      name: "University Student Union",
      rectangle: new google.maps.Rectangle({
        bounds: {
          north: 34.24026,
          south: 34.23983,
          east: -118.52680,
          west: -118.52722
        }
      })
    },
    {
      name: "Matador Bookstore",
      rectangle: new google.maps.Rectangle({
        bounds: {
          north: 34.23778,
          south: 34.23703,
          east: -118.52769,
          west: -118.52865
        }
      })
    },
    {
      name: "Library",
      rectangle: new google.maps.Rectangle({
        bounds: {
          north: 34.24038,
          south: 34.23991,
          east: -118.52862,
          west: -118.53003
        }
      })
    },
    {
      name: "Jacaranda Hall",
      rectangle: new google.maps.Rectangle({
        bounds: {
          north: 34.24205,
          south: 34.24104,
          east: -118.52787,
          west: -118.52941
        }
      })
    }
  ];

  // Show first question
  showMessage(`Find this location: <strong>${locations[0].name}</strong>`);

  // Listen for double-click guesses
  map.addListener("dblclick", (event) => {
    handleGuess(event.latLng);
  });
}

/**
 * Handles a user's guess when they double-click the map
 */
function handleGuess(clickedLatLng) {
  // Stop if quiz is already complete
  if (currentQuestion >= locations.length) return;

  const location = locations[currentQuestion];
  const bounds = location.rectangle.getBounds();

  // Check if the clicked point is inside the rectangle bounds
  const isCorrect = bounds.contains(clickedLatLng);

  // Display the rectangle on the map with color feedback
  location.rectangle.setOptions({
    fillColor: isCorrect ? "green" : "red",
    fillOpacity: 0.4,
    strokeColor: isCorrect ? "green" : "red",
    map: map
  });

  // Update score and message
  if (isCorrect) {
    score++;
  } 
  // Add result to history
addToHistory(location.name, isCorrect);

// Show feedback message
showMessage(isCorrect ? "✅Correct!" : "❌Incorrect!");
  // Move to the next question
  currentQuestion++;

  // Delay before showing the next prompt
  setTimeout(() => {
    if (currentQuestion < locations.length) {
      showMessage(`Find this location: <strong>${locations[currentQuestion].name}</strong>`);
    } else {
      showMessage("<strong>Quiz Complete!</strong>");

      document.getElementById("finalScore").innerHTML = `Final Score: ${score} / ${locations.length}`;

      resetBtn.style.display = "inline-block";
    }
  }, 1500);
}

/**
 * Displays messages in the left information panel
 */
function showMessage(text) {
  document.getElementById("message").innerHTML = text;
}

function addToHistory(locationName, isCorrect) {
  const historyList = document.getElementById("history");

  const listItem = document.createElement("li");
  listItem.textContent = `${locationName}: ${isCorrect ? "Correct" : "Incorrect"}`;
  listItem.className = isCorrect ? "correct" : "incorrect";

  historyList.appendChild(listItem);
}

/**
 * Reset Button
 */

const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", resetQuiz);

function resetQuiz() {
  // Remove all rectangles from map
  locations.forEach(loc => loc.rectangle.setMap(null));

  // Reset quiz state
  currentQuestion = 0;
  score = 0;

  // Clear history and final score
  document.getElementById("history").innerHTML = "";
  document.getElementById("finalScore").innerHTML = "";
  showMessage(`Find this location: <strong>${locations[0].name}</strong>`);

  // Hide reset button again
  resetBtn.style.display = "none";
}