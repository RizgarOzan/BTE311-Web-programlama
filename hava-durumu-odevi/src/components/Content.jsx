import React, { useState, useEffect } from 'react';

const Content = () => {
  const [search, setSearch] = useState('Ankara');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "c42a29ff2e05323a420afb944c0d7d82";

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=tr`
      );
      
      if (!response.ok) {
        throw new Error('Şehir bulunamadı!');
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(search);
  };

  const getBackgroundClass = () => {
    if (!weather) return 'normal';
    if (weather.main.temp < 10) return 'soguk';
    return 'sicak';
  };

  const getWeatherIcon = () => {
    if (!weather) return '🌤';
    
    const condition = weather.weather[0].main.toLowerCase();
    const description = weather.weather[0].description.toLowerCase();
    
    if (condition === 'clear') {
      return '☀️';
    } else if (condition === 'clouds') {
      if (description.includes('few')) return '🌤';
      if (description.includes('scattered')) return '⛅';
      return '☁️';
    } else if (condition === 'rain') {
      if (description.includes('light')) return '🌦';
      return '🌧';
    } else if (condition === 'drizzle') {
      return '🌦';
    } else if (condition === 'thunderstorm') {
      return '⛈';
    } else if (condition === 'snow') {
      return '❄️';
    } else if (condition === 'mist' || condition === 'fog' || condition === 'haze') {
      return '🌫';
    } else if (condition === 'smoke') {
      return '💨';
    } else if (condition === 'dust' || condition === 'sand') {
      return '🌪';
    } else if (condition === 'tornado') {
      return '🌪';
    }
    
    return '🌤';
  };

  return (
    <div className={`content-container ${getBackgroundClass()}`}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="🔍 Şehir adı giriniz..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">
          🌤 Ara
        </button>
      </form>

      {loading && <h2 style={{color: 'white'}}>Yükleniyor...</h2>}
      {error && <h2 style={{color: 'red'}}>Hata: {error}</h2>}

      {weather && !loading && !error && (
        <div className="weather-card">
          <h2>📍 {weather.name}, {weather.sys.country}</h2>
          <div className="weather-icon">{getWeatherIcon()}</div>
          <h1>{Math.round(weather.main.temp)}°C</h1>
          <p className="weather-description">{weather.weather[0].description}</p>
          <p>🌡️ Hissedilen: {Math.round(weather.main.feels_like)}°C</p>
          <p>💧 Nem: {weather.main.humidity}%</p>
          <p>💨 Rüzgar: {Math.round(weather.wind.speed * 3.6)} km/s</p>
        </div>
      )}
    </div>
  );
};

export default Content;