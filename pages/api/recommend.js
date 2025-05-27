export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST allowed");
  }

  const { color } = req.body;

  try {
    // Colormind에 전달할 색상 이름 → RGB 값으로 변환
    const colorMap = {
      빨간색: [255, 0, 0],
      파란색: [0, 0, 255],
      노란색: [255, 255, 0],
      초록색: [0, 128, 0],
      보라색: [128, 0, 128],
      분홍색: [255, 105, 180],
      하늘색: [135, 206, 235],
      검정색: [0, 0, 0],
      흰색: [255, 255, 255],
      회색: [128, 128, 128],
    };

    const baseColor = colorMap[color.trim()] || null;

    if (!baseColor) {
      return res.status(400).json({ result: "지원하지 않는 색상입니다." });
    }

    const response = await fetch("http://colormind.io/api/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "default",
        input: [baseColor, "N", "N", "N", "N"],
      }),
    });

    const data = await response.json();
    const recommended = data.result[1]; // 두 번째 색상을 추천

    const [r, g, b] = recommended;
    const rgbString = `rgb(${r}, ${g}, ${b})`;

    res.status(200).json({ result: `추천 색상: ${rgbString}` });
  } catch (error) {
    console.error("Colormind API Error:", error);
    res.status(500).json({ error: "색상 추천 실패" });
  }
}
