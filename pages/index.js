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
        setWeather({ temp: data.temp, condition: data.condition });
        setLocation(data.location);
      } catch (e) {
        alert("날씨 정보를 불러오지 못했습니다.");
      }
      setLoading(false);
    });
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
        <div style={{ marginTop: "24px", lineHeight: 1.6 }}>
          <p>
            <strong>📍 현재 위치:</strong> {location}
          </p>
          <p>
            <strong>🌡 현재 날씨:</strong> {weather.condition} / {weather.temp}℃
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
