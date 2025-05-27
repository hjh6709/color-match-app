// pages/api/weather.js
import getColorName from "@/utils/colorName";

const getRandom = (list) => list[Math.floor(Math.random() * list.length)];

const OUTFIT_OPTIONS = [
  {
    minTemp: 28,
    top: ["반팔", "민소매"],
    bottom: ["반바지", "린넨바지"],
    outer: [],
  },
  {
    minTemp: 20,
    top: ["반팔", "얇은 긴팔"],
    bottom: ["면바지", "슬랙스"],
    outer: ["셔츠", "얇은 자켓"],
  },
  {
    minTemp: 10,
    top: ["니트", "맨투맨", "긴팔셔츠"],
    bottom: ["청바지", "면바지"],
    outer: ["자켓", "가디건", "바람막이"],
  },
  {
    minTemp: 0,
    top: ["니트", "기모 맨투맨"],
    bottom: ["기모바지", "두꺼운 슬랙스"],
    outer: ["패딩", "두꺼운 코트"],
  },
  {
    minTemp: -100,
    top: ["니트", "맨투맨"],
    bottom: ["기모바지", "두꺼운 청바지"],
    outer: ["롱패딩", "누빔코트"],
  },
];

const COLOR_PALETTE = {
  top: [
    "베이지",
    "다크그린",
    "와인",
    "브라운",
    "크림",
    "카멜",
    "흰색",
    "연노랑",
    "민트",
    "하늘색",
    "연핑크",
  ],
  bottom: ["연청색", "중청색", "검정", "흰색", "연베이지", "베이지", "진회색"],
  outer: ["검정", "네이비", "회색", "아이보리", "브라운", "카키"],
};

async function getColormindColor(baseColorName) {
  const colorMap = {
    흰색: [255, 255, 255],
    연노랑: [255, 255, 153],
    민트: [152, 255, 152],
    하늘색: [135, 206, 235],
    연핑크: [255, 182, 193],
    베이지: [245, 245, 220],
    다크그린: [0, 100, 0],
    와인: [128, 0, 32],
    브라운: [165, 42, 42],
    크림: [255, 253, 208],
    카멜: [193, 154, 107],
    검정: [0, 0, 0],
    진회색: [64, 64, 64],
    중청색: [100, 130, 180],
    연청색: [173, 216, 230],
    연베이지: [240, 234, 214],
    네이비: [0, 0, 128],
    회색: [128, 128, 128],
    아이보리: [255, 255, 240],
    카키: [195, 176, 145],
  };

  const base = colorMap[baseColorName] || [255, 255, 255];

  const res = await fetch("http://colormind.io/api/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "default",
      input: [base, "N", "N", "N", "N"],
    }),
  });

  const data = await res.json();
  const recommended = data.result[1];
  const [r, g, b] = recommended;
  const name = getColorName(r, g, b);

  return name;
}

async function getLocationName(lat, lon) {
  const key = process.env.OPENCAGE_API_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${key}&language=ko&pretty=1`;
  const res = await fetch(url);
  const data = await res.json();
  const components = data.results[0]?.components;
  return components
    ? `${components.state || ""} ${components.city || components.town || ""} ${
        components.suburb || components.village || ""
      }`.trim()
    : "주소 정보 없음";
}

export default async function handler(req, res) {
  const { lat, lon } = req.query;

  const apiKey = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const temp = data.main.temp;
    const condition = data.weather[0].description;
    const location = await getLocationName(lat, lon);

    const option = OUTFIT_OPTIONS.find((o) => temp >= o.minTemp);

    const topItem = getRandom(option.top);
    const bottomItem = getRandom(option.bottom);
    const outerItem = option.outer.length > 0 ? getRandom(option.outer) : null;

    const topColor = getRandom(COLOR_PALETTE.top);
    const bottomColor = await getColormindColor(topColor);
    const outerColor = outerItem ? getRandom(COLOR_PALETTE.outer) : null;

    res.status(200).json({
      location,
      temp,
      condition,
      outfit: {
        top: `${topColor} ${topItem}`,
        bottom: `${bottomColor} ${bottomItem}`,
        outer:
          outerItem && outerColor
            ? `${outerColor} ${outerItem}`
            : "(아우터 없음)",
      },
    });
  } catch (error) {
    console.error("날씨 API 오류:", error);
    res.status(500).json({ error: "날씨 정보를 불러올 수 없습니다." });
  }
}
