// import apiKey from './config';
// require('dotenv').config();
const inputBox = document.querySelector('#place-input');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('#weatherIcon');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');

const voiceBtn = document.getElementById('voiceCommandBtn');

const location_not_found = document.querySelector('.location-not-found');

const weather_body = document.querySelector('.weather-body');

// const placeInput = document.getElementById("place-input");
const monument_Image = document.getElementById("monument-image");

// Voice Assistant setup
const recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;

recognition.addEventListener('result', handleVoiceResult);

// Fetch the OpenWeatherMap API key from the server
async function fetchOpenWeatherMapApiKey() {
  const response = await fetch('/api/getApiKey');
  const data = await response.json();
  return data.apiKey;
}

// Fetch the Unsplash API key from the server
async function fetchUnsplashApiKey() {
  const response = await fetch('/api/getUnsplashKey');
  const data = await response.json();
  return data.unsplashKey;
}


async function checkWeather(city) {
    const api_key = await fetchOpenWeatherMapApiKey();

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    const weather_data = await fetch(`${url}`).then(response => response.json());


    if (weather_data.cod === `404`) {
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
        console.log("error");
        const utterance = new SpeechSynthesisUtterance(`sorry! location not found`);
        speechSynthesis.speak(utterance);
        return;
    }
    console.log(weather_data.weather[0].icon);
    // console.log("run");
    location_not_found.style.display = "none";
    weather_body.style.display = "flex";
    temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
    description.innerHTML = `${weather_data.weather[0].description}`;

    humidity.innerHTML = `${weather_data.main.humidity}%`;
    wind_speed.innerHTML = `${weather_data.wind.speed}m/s`;
    speakWeather(weather_data);
    function speakWeather(data) {
        const weatherDescription = data.weather[0].description;
        const temperature = Math.round(data.main.temp - 273.15);
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        const textToSpeak = `The weather in ${data.name} is ${weatherDescription}. The temperature is ${temperature} degrees Celsius. Humidity is ${humidity} percent. Wind speed is ${windSpeed} meters per second.`;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        speechSynthesis.speak(utterance);
    }

    switch (weather_data.weather[0].icon) {
        case '01d':
            weather_img.src = "assets/01d.png";
            break;
        case '01n':
            weather_img.src = "assets/01n.png";
            break;
        case '02d':
            weather_img.src = "assets/02d.png";
            break;
        case '02n':
            weather_img.src = "assets/02n.png";
            break;
        case '03d':
            weather_img.src = "assets/03d.png";
            break;
        case '03n':
            weather_img.src = "assets/03n.png";
            break;
        case '04d':
            weather_img.src = "assets/04d.png";
            break;
        case '04n':
            weather_img.src = "assets/04d.png";
            break;
        case '09d':
            weather_img.src = "assets/09d.png";
            break;
        case '09n':
            weather_img.src = "assets/09d.png";
            break;
        case '10d':
            weather_img.src = "assets/10d.png";
            break;
        case '10n':
            weather_img.src = "assets/10n.png";
            break;
        case '11d':
            weather_img.src = "assets/11d.png";
            break;
        case '11n':
            weather_img.src = "assets/11d.png";
            break;
        case '13d':
            weather_img.src = "assets/13d.png";
            break;
        case '13n':
            weather_img.src = "assets/13d.png";
            break;
        case '50d':
            weather_img.src = "assets/50d.png";
            break;
        case '50n':
            weather_img.src = "assets/50d.png";
            break;
        default:
            return 'fas fa-question-circle';
    }
}

let monumentData = [];
let currentIndex = 0;


async function handleVoiceResult(event) {
    const voiceResult = event.results[0][0].transcript;
    inputBox.value = voiceResult;
    checkWeather(voiceResult);
    // const voiceResult = event.results[0][0].transcript;
//   placeInput.value = voiceResult; // Fill the input field with the recognized place
  await searchAndDisplayImages(voiceResult); // Search and display images based on the recognized place

    // getMonumentImagesByPlace(voiceResult);
}

async function searchAndDisplayImages(place) {
    try {
      monumentData = await getMonumentImagesByPlace(place);
  
      if (monumentData && monumentData.results.length > 0) {
        currentIndex = 3; // Set the desired index
        displayMonumentImage();
      } else {
        monumentImageContainer.innerHTML = "<p>No images available for this place.</p>";
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }

// Voice Assistant activation
voiceBtn.addEventListener('click', () => {
    recognition.start();
});

searchBtn.addEventListener('click', () => {
    checkWeather(inputBox.value);
});


//pictures

// const voiceBtn = document.getElementById('voiceCommandBtn');
// const searchButton = document.getElementById("searchBtn");
const placeInput = document.getElementById("place-input");
const monumentImage = document.getElementById("monument-image");

searchBtn.addEventListener("click", async () => {
  const place = placeInput.value;
  monumentData = await getMonumentImagesByPlace(place);

  if (monumentData && monumentData.results.length > 0) {
    currentIndex = 3;
    displayMonumentImage();
  } else {
    monumentImageContainer.innerHTML = "<p>No images available for this place.</p>";
  }
});

async function getMonumentImagesByPlace(place) {
  const accessKey = await fetchUnsplashApiKey();
  const apiUrl = `https://api.unsplash.com/search/photos?query=${place}&client_id=${accessKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

function displayMonumentImage() {
  monumentImage.style.display = 'block';
  const currentResult = monumentData.results[currentIndex];
  monumentImage.src = currentResult.urls.regular;
  monumentImage.alt = currentResult.description || "Monument Image";
}
