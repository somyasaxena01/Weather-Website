const weatherContainer = document.getElementById("weather-div");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const cityName = document.getElementById("city-name");
const dateDisplay = document.getElementById("date");
const tempInfo = document.getElementById("temp-value");
const sunriseTime = document.getElementById("sunrise"); 
const sunsetTime = document.getElementById("sunset");
const humidity = document.getElementById("humidity");
const pressureDisplay = document.getElementById("pressure");
const windSpeed = document.getElementById("wind-speed");
const visibilityDisplay = document.getElementById("visibility");
const description = document.getElementById("description");
const errorMessageDiv = document.getElementById("error-message");
const weatherTipsDiv = document.getElementById("weather-tips");
const tipsContent = document.getElementById("tips");
const apiKey = "52d352a996bb57b213366c1efc06a150"

function showError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = "block";
    weatherContainer.style.display = "none"; 
}

function hideError() {
    errorMessageDiv.style.display = "none";
}

function convertUnixToTime(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert from seconds to milliseconds
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';  // Determine AM/PM
    const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    return formattedTime;
}

function formatDate() {
    const now = new Date();

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();

    return `${day}, ${month} ${date}, ${year}`;
}

function getWeatherTips(data) {
    const temp = data.main.temp;

    let tip = "";

    if (temp >= 30) {
        tip += "It's quite hot today! Stay hydrated and don't forget your sunglasses and sunscreen.";
        document.getElementById("weather-tips").classList.add("sunny"); 
    } 
    else if (temp >= 20) {
        tip += "The weather is warm. A light jacket should be enough.";
        document.getElementById("weather-tips").classList.add("cold");
    } 
    else if (temp >= 10 && temp < 20) {
        tip += "Cool weather ahead! A sweater will keep you comfortable.";
        document.getElementById("weather-tips").classList.add("cold"); 
    } 
    else {
        tip += "It's cold outside! Dress warmly and stay cozy.";
    }

    // Assuming we want to display the tips somewhere
    document.getElementById("weather-tips").innerText = tip;
}

function displayWeather() {
    const city = searchInput.value;
    console.log("clicked");
    console.log(city);

    if (!city) {
        showError("Please enter a valid city name.");
        return;
    }

    weatherContainer.style.display = "block";

    document.getElementById("weather-div").style.display = "none";
    document.getElementById("weather-tips").style.display = "none";
    document.getElementById("error-message").style.display = "none";

    const currentDate = formatDate();
    dateDisplay.textContent = currentDate;
  
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    
    hideError();

    fetch(api)
    .then((response)=>response.json())
    .then((data)=>{
        if (!data || data.cod !== 200) {
            // Check if the API response is valid and if the city was found
            showError("City not found. Please try again.");
            weatherContainer.style.display = "none";
            return;
        }

        document.getElementById("weather-div").style.display = "block";
        document.getElementById("weather-tips").style.display = "block";

        console.log(data);

        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; 
        const weatherIcon = document.getElementById("weather-icon");
        weatherIcon.src = iconUrl;

        console.log(data.main.temp);
        tempInfo.textContent=data.main.temp;
        cityName.textContent = `${data.name}, ${data.sys.country}`;
        humidity.textContent = `Humidity: ${data.main.humidity} %`;
        pressureDisplay.textContent = `Pressure: ${data.main.pressure} hPa`;
        windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
        description.textContent = `Weather: ${data.weather[0].description}`;

        const sunrise = convertUnixToTime(data.sys.sunrise);
        const sunset = convertUnixToTime(data.sys.sunset);
        sunriseTime.textContent = `Sunrise: ${sunrise}`;
        sunsetTime.textContent = `Sunset: ${sunset}`;

        let visibilityInKm = data.visibility / 1000;
        if (visibilityInKm === 0) {
            visibilityInKm = "Unknown"; // If visibility data is zero or not provided
        }
        visibilityDisplay.textContent = `Visibility: ${visibilityInKm} km`;

        hideError();

        getWeatherTips(data);
        weatherTipsDiv.classList.add("show");
    })
    // .catch((error) => {
    //     console.error(error);
    //     alert("An error occured while fetching the weather data, please try again.");
    // })
};

searchBtn.addEventListener("click", displayWeather);
searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        displayWeather();
    }
});
