// utils/colorName.js

const COLOR_NAMES = [
  { name: "검정", r: 0, g: 0, b: 0 },
  { name: "흰색", r: 255, g: 255, b: 255 },
  { name: "빨간색", r: 255, g: 0, b: 0 },
  { name: "녹색", r: 0, g: 128, b: 0 },
  { name: "파란색", r: 0, g: 0, b: 255 },
  { name: "노란색", r: 255, g: 255, b: 0 },
  { name: "보라색", r: 128, g: 0, b: 128 },
  { name: "하늘색", r: 135, g: 206, b: 235 },
  { name: "회색", r: 128, g: 128, b: 128 },
  { name: "주황색", r: 255, g: 165, b: 0 },
  { name: "연핑크", r: 255, g: 182, b: 193 },
  { name: "진핑크", r: 255, g: 105, b: 180 },
  { name: "올리브", r: 128, g: 128, b: 0 },
  { name: "네이비", r: 0, g: 0, b: 128 },
  { name: "청록색", r: 0, g: 128, b: 128 },
  { name: "민트", r: 152, g: 255, b: 152 },
  { name: "살구색", r: 255, g: 218, b: 185 },
  { name: "진회색", r: 64, g: 64, b: 64 },
  { name: "라이트그레이", r: 211, g: 211, b: 211 },
  { name: "버건디", r: 128, g: 0, b: 32 },
  { name: "베이지", r: 245, g: 245, b: 220 },
  { name: "진청색", r: 31, g: 56, b: 111 },
  { name: "라벤더", r: 230, g: 230, b: 250 },
  { name: "카키", r: 195, g: 176, b: 145 },
  { name: "인디고", r: 75, g: 0, b: 130 },
  { name: "카멜", r: 193, g: 154, b: 107 },
  { name: "모카", r: 111, g: 78, b: 55 },
  { name: "샌드", r: 237, g: 201, b: 175 },
];

function getColorName(r, g, b) {
  let closest = null;
  let closestDistance = Infinity;

  COLOR_NAMES.forEach((color) => {
    const dr = color.r - r;
    const dg = color.g - g;
    const db = color.b - b;
    const distance = Math.sqrt(dr * dr + dg * dg + db * db);
    if (distance < closestDistance) {
      closest = color;
      closestDistance = distance;
    }
  });

  return closest?.name || "이름 없는 색상";
}

export default getColorName;
