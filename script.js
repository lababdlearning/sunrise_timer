const locationEl = document.getElementById("location");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");
const refreshBtn = document.getElementById("refresh");
const latInput = document.getElementById("lat");
const lonInput = document.getElementById("lon");
const useManualBtn = document.getElementById("use-manual");

async function fetchSunTimes(lat, lon) {
  try {
    const res = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`);
    const data = await res.json();

    const sunrise = new Date(data.results.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(data.results.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    sunriseEl.textContent = sunrise;
    sunsetEl.textContent = sunset;
  } catch (err) {
    sunriseEl.textContent = "Error";
    sunsetEl.textContent = "Error";
    console.error(err);
  }
}


function getLocationAndFetch() {
  // If manual values are present, use them
  const latVal = latInput.value.trim();
  const lonVal = lonInput.value.trim();
  if (latVal && lonVal) {
    const latitude = parseFloat(latVal);
    const longitude = parseFloat(lonVal);
    locationEl.textContent = `Manual location: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    fetchSunTimes(latitude, longitude);
    return;
  }
  // Otherwise, use geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      locationEl.textContent = `Your location: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      fetchSunTimes(latitude, longitude);
    }, () => {
      locationEl.textContent = "Location access denied.";
    });
  } else {
    locationEl.textContent = "Geolocation not supported.";
  }
}

useManualBtn.addEventListener("click", () => {
  // Only fetch if both fields are filled
  if (latInput.value.trim() && lonInput.value.trim()) {
    getLocationAndFetch();
  } else {
    locationEl.textContent = "Please enter both latitude and longitude.";
  }
});

refreshBtn.addEventListener("click", getLocationAndFetch);

// Run on load
getLocationAndFetch();

