import { useState, useEffect } from "react";

export default function Home() {
  const [outfit, setOutfit] = useState(null);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const colorToCode = {
    베이지: "#f5f5dc",
    검정: "#000000",
    진청색: "#1e2d5a",
    연청색: "#add8e6",
    네이비: "#000080",
    흰색: "#ffffff",
    회색: "#808080",
    연베이지: "#f4ecd8",
    하늘색: "#87ceeb",
    연핑크: "#ffb6c1",
    크림: "#fffdd0",
    브라운: "#a52a2a",
    카키: "#bdb76b",
    아이보리: "#fffff0",
    연그레이: "#d3d3d3",
    민트: "#98ff98",
    연노랑: "#ffffcc",
    브릭레드: "#8b0000",
    그레이: "#aaaaaa",
  };

  useEffect(() => {
    const savedData = localStorage.getItem("outfitRecommendation");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setOutfit(parsed.outfit);
      setWeather(parsed.weather);
      setLocation(parsed.location);
    }
  }, []);

  const getWeatherRecommendation = () => {
    if (!navigator.geolocation) {
      alert("위치 정보를 사용할 수 없습니다.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `/api/weather?lat=${latitude}&lon=${longitude}`
          );
          if (!res.ok) throw new Error("서버 응답 오류");
          const data = await res.json();
          if (!data.outfit || !data.temp || !data.condition)
            throw new Error("응답 데이터 누락");

          const outfitData = {
            outfit: {
              top: data.outfit.top,
              bottom: data.outfit.bottom,
              outer: data.outfit.outer,
            },
            weather: {
              temp: data.temp,
              feelsLike: data.feelsLike,
              humidity: data.humidity,
              condition: data.condition,
              icon: data.icon || "01d",
            },
            location: data.location || "알 수 없음",
          };

          setOutfit(outfitData.outfit);
          setWeather(outfitData.weather);
          setLocation(outfitData.location);
          localStorage.setItem(
            "outfitRecommendation",
            JSON.stringify(outfitData)
          );
        } catch (e) {
          console.error(e);
          setError(
            "날씨 정보를 불러오는 데 문제가 발생했습니다. 나중에 다시 시도해주세요."
          );
          setOutfit(null);
          setWeather(null);
          setLocation("");
        }
        setLoading(false);
      },
      () => {
        setError("위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.");
        setLoading(false);
      }
    );
  };

  const clearRecommendation = () => {
    localStorage.removeItem("outfitRecommendation");
    setOutfit(null);
    setWeather(null);
    setLocation("");
    setError(null);
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "-apple-system, sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "20px" }}>
        오늘의 날씨 기반 옷차림 추천
      </h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={getWeatherRecommendation}
          disabled={loading}
          style={{
            padding: "10px 18px",
            fontSize: "16px",
            marginRight: "10px",
            borderRadius: "8px",
            backgroundColor: "#0070f3",
            color: "white",
          }}
        >
          {loading ? "추천 중..." : "옷차림 추천 받기"}
        </button>
        <button
          onClick={clearRecommendation}
          style={{
            padding: "10px 18px",
            fontSize: "16px",
            borderRadius: "8px",
            backgroundColor: "#e0e0e0",
          }}
        >
          추천 초기화
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>
      )}

      {weather && outfit && (
        <div
          style={{
            marginTop: "24px",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#ffffff",
            maxWidth: "420px",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}
        >
          <p>
            <strong>📍 현재 위치:</strong> {location}
          </p>
          <p>
            <strong>🌡 현재 기온:</strong> {weather.temp}℃ (체감온도{" "}
            {weather.feelsLike}℃, 습도 {weather.humidity}%)
          </p>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <strong>☁️ 날씨:</strong>&nbsp;{weather.condition}
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="날씨 아이콘"
              width={50}
              height={50}
              style={{ marginLeft: "8px" }}
            />
          </p>
          <hr style={{ margin: "12px 0" }} />
          <p>
            <strong>👕 상의:</strong> {outfit.top}
          </p>
          <p>
            <strong>👖 하의:</strong> {outfit.bottom}
          </p>
          <p>
            <strong>🧥 아우터:</strong> {outfit.outer}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: colorToCode[outfit.top.split(" ")[0]],
              }}
            >
              <img src="/상의.svg" width={60} height={60} alt="상의" />
              <p>{outfit.top}</p>
            </div>
            <div
              style={{
                textAlign: "center",
                color: colorToCode[outfit.bottom.split(" ")[0]],
              }}
            >
              <img src="/하의.svg" width={60} height={60} alt="하의" />
              <p>{outfit.bottom}</p>
            </div>
            <div
              style={{
                textAlign: "center",
                color: colorToCode[outfit.outer.split(" ")[0]],
              }}
            >
              <img src="/아우터.svg" width={60} height={60} alt="아우터" />
              <p>{outfit.outer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
