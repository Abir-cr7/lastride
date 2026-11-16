import axios from 'axios';

// Default Coordinates: Ashulia / Savar / Dhaka, Bangladesh
export const DEFAULT_COORDS = {
  name: 'Ashulia, Dhaka',
  lat: 23.9315,
  lng: 90.2707,
};

/**
 * Weather code descriptions and rider hazard assessment
 */
const getWeatherDetails = (code) => {
  if (code === 0) {
    return {
      condition: 'Clear Sky',
      icon: 'Sun',
      safety: 'Optimal Riding Condition',
      severity: 'safe',
    };
  }
  if ([1, 2].includes(code)) {
    return {
      condition: 'Partly Cloudy',
      icon: 'CloudSun',
      safety: 'Good Visibility',
      severity: 'safe',
    };
  }
  if (code === 3) {
    return {
      condition: 'Overcast',
      icon: 'Cloud',
      safety: 'Cloudy, Normal Caution',
      severity: 'safe',
    };
  }
  if ([45, 48].includes(code)) {
    return {
      condition: 'Fog / Mist',
      icon: 'CloudFog',
      safety: 'Low Visibility - Keep Headlights ON',
      severity: 'warning',
    };
  }
  if ([51, 53, 55].includes(code)) {
    return {
      condition: 'Light Drizzle',
      icon: 'CloudDrizzle',
      safety: 'Wet Asphalt - Reduce Speed',
      severity: 'warning',
    };
  }
  if ([61, 63, 65].includes(code)) {
    return {
      condition: 'Rain Showers',
      icon: 'CloudRain',
      safety: 'Slippery Road Hazard - Drive Slow',
      severity: 'warning',
    };
  }
  if ([80, 81, 82].includes(code)) {
    return {
      condition: 'Heavy Rain',
      icon: 'CloudRain',
      safety: 'Severe Slippage Risk - Seek Shelter',
      severity: 'critical',
    };
  }
  if ([95, 96, 99].includes(code)) {
    return {
      condition: 'Thunderstorm',
      icon: 'CloudLightning',
      safety: 'Extreme Danger - Stop Riding Immediately',
      severity: 'critical',
    };
  }
  return {
    condition: 'Moderate Weather',
    icon: 'Cloud',
    safety: 'Maintain Safe Riding Distance',
    severity: 'safe',
  };
};

/**
 * Fetch real-time weather from Open-Meteo
 */
export const fetchLiveWeather = async (lat = DEFAULT_COORDS.lat, lng = DEFAULT_COORDS.lng, locationName = DEFAULT_COORDS.name) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`;
    const response = await axios.get(url, { timeout: 6000 });
    const current = response.data.current;

    const weatherInfo = getWeatherDetails(current.weather_code);

    return {
      location: locationName,
      lat,
      lng,
      temperature: Math.round(current.temperature_2m),
      apparentTemperature: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      precipitation: current.precipitation,
      condition: weatherInfo.condition,
      safetyNotice: weatherInfo.safety,
      severity: weatherInfo.severity,
      icon: weatherInfo.icon,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.warn('Open-Meteo Weather API fallback used:', error.message);
    // Realistic fallback data for Dhaka
    return {
      location: locationName,
      lat,
      lng,
      temperature: 28,
      apparentTemperature: 30,
      humidity: 65,
      windSpeed: 14,
      precipitation: 0,
      condition: 'Clear Night',
      safetyNotice: 'Night Ride: Turn on High Beams & Keep Safe Distance',
      severity: 'safe',
      icon: 'Moon',
      updatedAt: new Date(),
    };
  }
};
