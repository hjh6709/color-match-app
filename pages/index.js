import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [outfit, setOutfit] = useState(null);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const colorCombinations = {
    베이지: {
      bottom: ["진청색", "검정", "네이비"],
      outer: ["브라운", "카키", "아이보리"],
    },
    검정: {
      bottom: ["흰색", "연청색", "회색"],
      outer: ["아이보리", "회색", "연베이지"],
    },
    하늘색: {
      bottom: ["흰색", "베이지", "네이비"],
      outer: ["연그레이", "아이보리"],
    },
    흰색: { bottom: ["검정", "진청색", "베이지"], outer: ["회색", "네이비"] },
    네이비: {
      bottom: ["연청색", "흰색", "연베이지"],
      outer: ["아이보리", "회색"],
    },
    연핑크: { bottom: ["흰색", "베이지"], outer: ["아이보리", "회색"] },
    크림: { bottom: ["네이비", "연청색"], outer: ["브라운", "베이지"] },
    민트: { bottom: ["흰색", "회색", "연청색"], outer: ["아이보리", "그레이"] },
    연노랑: { bottom: ["베이지", "진청색"], outer: ["카키", "브라운"] },
    브릭레드: { bottom: ["검정", "네이비"], outer: ["회색", "아이보리"] },
  };

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

  // 🔽 텍스트 색상을 배경 밝기에 따라 결정하는 함수
  const getTextColor = (bgColor) => {
    const color = bgColor.substring(1);
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? "#000000" : "#ffffff";
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

  const getRandom = (list) => list[Math.floor(Math.random() * list.length)];

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

          const topColors = Object.keys(colorCombinations);
          const topColor = getRandom(topColors);
          const bottomColor = getRandom(colorCombinations[topColor].bottom);
          const outerColor = getRandom(colorCombinations[topColor].outer);

          const outfitData = {
            outfit: {
              top: `${topColor} ${data.outfit.top.split(" ").slice(-1)}`,
              bottom: `${bottomColor} ${data.outfit.bottom
                .split(" ")
                .slice(-1)}`,
              outer: `${outerColor} ${data.outfit.outer.split(" ").slice(-1)}`,
            },
            weather: {
              temp: data.temp,
              feelsLike: data.feelsLike,
              humidity: data.humidity,
              condition: data.condition,
              icon: data.icon || "01d",
            },
            location: data.location,
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

  const cardStyle = {
    marginTop: "24px",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    maxWidth: "420px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: 1.6,
  };

  const buttonStyle = {
    padding: "10px 18px",
    fontSize: "16px",
    marginRight: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
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
          style={{ ...buttonStyle, backgroundColor: "#0070f3", color: "white" }}
        >
          {loading ? "추천 중..." : "옷차림 추천 받기"}
        </button>
        <button
          onClick={clearRecommendation}
          style={{ ...buttonStyle, backgroundColor: "#e0e0e0" }}
        >
          추천 초기화
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>
      )}

      {weather && outfit && (
        <div style={cardStyle}>
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
            <Image
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
              gap: "10px",
              marginTop: "16px",
            }}
          >
            {["top", "bottom", "outer"].map((part) => {
              const colorName = outfit[part].split(" ")[0];
              const bgColor = colorToCode[colorName];
              return (
                <div
                  key={part}
                  style={{
                    backgroundColor: bgColor,
                    color: getTextColor(bgColor),
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  {part === "top"
                    ? "상의"
                    : part === "bottom"
                    ? "하의"
                    : "아우터"}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
