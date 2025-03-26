import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Card, CardContent, Typography, CircularProgress, IconButton } from "@mui/material";
import { WiDaySunny, WiRain, WiSnow, WiThunderstorm, WiCloudy, WiStrongWind } from "weather-icons-react";
import { motion } from "framer-motion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8080/weather-service/api/weather/forecast?city=${city}`
      );
      setWeatherData(response.data);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
    }
    setLoading(false);
  };


  const getWeatherAnimation = (condition) => {
    switch (condition.toLowerCase()) {
      case "clouds":
        return (
          <motion.div animate={{ x: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 3 }}>
            <WiCloudy size={100} color="#90a4ae" />
          </motion.div>
        );
      case "rain":
        return (
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>
            <WiRain size={100} color="#1e88e5" />
          </motion.div>
        );
      case "thunderstorm":
        return (
          <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>
            <WiThunderstorm size={100} color="#ff9800" />
          </motion.div>
        );
      case "clear":
        return (
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
            <WiDaySunny size={100} color="#f9d71c" />
          </motion.div>
        );
      case "snow":
        return (
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
            <WiSnow size={100} color="#90caf9" />
          </motion.div>
        );
      case "windy":
        return (
          <motion.div animate={{ x: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <WiStrongWind size={100} color="#607d8b" />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="sm"
        style={{ textAlign: "center", marginTop: "2rem", position: "relative", backgroundColor: darkMode ? "#121212" : "#ffffff", color: darkMode ? "#ffffff" : "#000000", padding: "2rem", borderRadius: "10px" }}
      >
        <IconButton onClick={() => setDarkMode(!darkMode)} style={{ position: "absolute", top: 10, right: 10 }}>
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Weather Prediction App
        </Typography>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "1rem" }}>
          <TextField
            label="Enter city name"
            variant="outlined"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={fetchWeather}>
            Get Weather
          </Button>
        </div>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {weatherData && (
          <Card style={{ marginTop: "1rem", padding: "1rem", backgroundColor: darkMode ? "#333" : "#fff", color: darkMode ? "#fff" : "#000" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Weather in {weatherData.city}
              </Typography>
              {weatherData.forecasts.map((forecast, index) => (
                <div key={index} style={{ borderBottom: "1px solid #ddd", padding: "10px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  {getWeatherAnimation(forecast.condition)}
                  <div>
                    <Typography><strong>Date:</strong> {forecast.date}</Typography>
                    <Typography><strong>Temperature:</strong> {forecast.tempMax}°C / {forecast.tempMin}°C</Typography>
                    <Typography><strong>Condition:</strong> {forecast.condition}</Typography>
                    <Typography><strong>Wind Speed:</strong> {forecast.windSpeed} m/s</Typography>
                    <Typography color="primary" style={{ fontWeight: "bold" }}>{forecast.recommendation}</Typography>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
