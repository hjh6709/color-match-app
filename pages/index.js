import { useState, useEffect } from "react";

export default function Home() {
  const [inputColor, setInputColor] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [history, setHistory] = useState([]);

  // 추천 API 호출
  const getRecommendation = async () => {
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color: inputColor }),
    });

    const data = await res.json();
    setRecommendation(data.result);

    const newRecord = { input: inputColor, result: data.result };
    const updated = [newRecord, ...history];
    setHistory(updated);
    localStorage.setItem("recommendHistory", JSON.stringify(updated));
  };

  // 기록 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("recommendHistory");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // 기록 지우기
  const clearHistory = () => {
    localStorage.removeItem("recommendHistory");
    setHistory([]);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>오늘 뭐 입지?</h1>

      <input
        type="text"
        value={inputColor}
        onChange={(e) => setInputColor(e.target.value)}
        placeholder="상의 색상 입력 (예: 파란색)"
        style={{ padding: "8px", marginRight: "8px", width: "60%" }}
      />

      <button onClick={getRecommendation} style={{ padding: "8px 12px" }}>
        추천 받기
      </button>

      {recommendation && (
        <div style={{ marginTop: "20px" }}>
          <h3>추천 결과:</h3>
          <p>{recommendation}</p>
        </div>
      )}

      <hr style={{ margin: "24px 0" }} />

      <h3>📌 이전 추천 기록</h3>
      {history.length > 0 && (
        <button onClick={clearHistory} style={{ marginBottom: "10px" }}>
          기록 지우기
        </button>
      )}

      <ul>
        {history.map((item, idx) => (
          <li key={idx}>
            <strong>{item.input}</strong> → {item.result}
          </li>
        ))}
      </ul>
    </div>
  );
}
