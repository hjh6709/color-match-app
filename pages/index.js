// pages/index.js
import { useState } from "react";

export default function Home() {
  const [outfit, setOutfit] = useState(null);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeatherRecommendation = () => {
    if (!navigator.geolocation) {
      alert("위치 정보를 사용할 수 없습니다.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(
          `/api/weather?lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        setOutfit(data.outfit);
        setWeather({
          temp: data.temp,
          feelsLike: data.feelsLike,
          humidity: data.humidity,
          condition: data.condition,
          icon: data.icon || "01d", // 기본 아이콘
        });
        setLocation(data.location);
      } catch (e) {
        alert("날씨 정보를 불러오지 못했습니다.");
      }
      setLoading(false);
    });
  };

  const cardStyle = {
    marginTop: "24px",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
    maxWidth: "400px",
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
        오늘의 날씨 기반 옷차림 추천
      </h1>

      <button
        onClick={getWeatherRecommendation}
        disabled={loading}
        style={{ padding: "10px 16px", fontSize: "16px" }}
      >
        {loading ? "추천 중..." : "옷차림 추천 받기"}
      </button>

      {weather && outfit && (
        <div style={cardStyle}>
          <p>
            <strong>📍 현재 위치:</strong> {location}
          </p>
          <p>
            <strong>🌡 현재 기온:</strong> {weather.temp}℃ (체감온도{" "}
            {weather.feelsLike}℃, 습도 {weather.humidity}%)
          </p>
          <p>
            <strong>☁️ 날씨:</strong> {weather.condition}
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="날씨 아이콘"
              style={{ verticalAlign: "middle", marginLeft: "8px" }}
            />
          </p>
          <p>
            <strong>👕 상의:</strong> {outfit.top}
          </p>
          <p>
            <strong>👖 하의:</strong> {outfit.bottom}
          </p>
          <p>
            <strong>🧥 아우터:</strong> {outfit.outer}
          </p>
        </div>
      )}
    </div>
  );
}
