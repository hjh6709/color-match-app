import { useEffect, useState } from "react";

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

    // 기록 저장
    const newRecord = { input: inputColor, result: data.result };
    const updated = [newRecord, ...history];
    setHistory(updated);
    localStorage.setItem("recommendHistory", JSON.stringify(updated));
  };

  // 페이지 로드시 기록 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("recommendHistory");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>오늘 뭐 입지?</h1>
      <input
        type="text"
        value={inputColor}
        onChange={(e) => setInputColor(e.target.value)}
        placeholder="상의 색상 입력 (예: 파란색)"
      />
      <button onClick={getRecommendation}>추천 받기</button>

      {recommendation && (
        <div>
          <h3>추천 결과:</h3>
          <p>{recommendation}</p>
        </div>
      )}

      <hr />
      <h3>📌 이전 추천 기록</h3>
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
