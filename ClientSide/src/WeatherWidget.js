// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const WeatherWidget = () => {
//   const [weatherData, setWeatherData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchWeatherData = async (latitude, longitude) => {
//     try {
//       const apiKey = 'c522561cb9e19566b8ff7aa235052988';
//       const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

//       const response = await axios.get(apiUrl);
//       setWeatherData(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching weather data:', error);
//       setError(error);
//       setLoading(false);
//     }
//   };

//   const getCurrentLocation = () => {
//     return new Promise((resolve, reject) => {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
//           resolve({ latitude, longitude });
//         },
//         (error) => {
//           reject(error);
//         }
//       );
//     });
//   };

//   useEffect(() => {
//     getCurrentLocation()
//       .then(({ latitude, longitude }) => {
//         fetchWeatherData(latitude, longitude);
//       })
//       .catch((error) => {
//         console.error('Error getting current location:', error);
//         setError(error);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <div>
//       {weatherData && (
//         <div>
//           <h2>Weather Information</h2>
//           <p>Temperature: {weatherData.main.temp}°C</p>
//           <p>Weather: {weatherData.weather[0].description}</p>
//           {/* Add more weather information as needed */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default WeatherWidget;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const apiKey = 'c522561cb9e19566b8ff7aa235052988';
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

      const response = await axios.get(apiUrl);
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(error);
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  useEffect(() => {
    getCurrentLocation()
      .then(({ latitude, longitude }) => {
        fetchWeatherData(latitude, longitude);
      })
      .catch((error) => {
        console.error('Error getting current location:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div>
      {weatherData && (
        <div>
          <h2 className="mt-3">Weather Information</h2>
          <div className="card">
            <div className="card-body">
              <p className="card-text">Temperature: {weatherData.main.temp}°C</p>
              <p className="card-text">Weather: {weatherData.weather[0].description}</p>
              {/* Add more weather information as needed */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
