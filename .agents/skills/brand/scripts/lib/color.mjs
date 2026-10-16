// Color conversions between the hex values Theme Settings store and the oklch triplets the theme's
// CSS reads. The triplet format matches Shopify's color.oklch: 'L% C H', such as '62.8% 0.2577 29.23'.

const toLinear = (channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
const toGamma = (channel) => (channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055);

export function parseHex(hex) {
  const value = String(hex).trim().replace(/^#/, '');
  const full = value.length <= 4 ? [...value].map((digit) => digit + digit).join('') : value;
  const red = parseInt(full.slice(0, 2), 16);
  const green = parseInt(full.slice(2, 4), 16);
  const blue = parseInt(full.slice(4, 6), 16);
  const alpha = full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1;
  if ([red, green, blue].some(Number.isNaN)) throw new Error(`Not a hex color: ${hex}`);
  return {red, green, blue, alpha};
}

export function hexToOklch(hex) {
  const {red, green, blue} = parseHex(hex);
  const [r, g, b] = [red, green, blue].map((channel) => toLinear(channel / 255));

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bAxis = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const chroma = Math.sqrt(a * a + bAxis * bAxis);
  let hue = (Math.atan2(bAxis, a) * 180) / Math.PI;
  if (hue < 0) hue += 360;

  return {lightness, chroma, hue: chroma < 0.0001 ? 0 : hue};
}

export function formatOklch({lightness, chroma, hue}) {
  const round = (number, places) => Number(number.toFixed(places));
  return `${round(lightness * 100, 2)}% ${round(chroma, 4)} ${round(hue, 2)}`;
}

// Parses 'L% C H' or 'L C H' (L from 0 to 1), the forms the sandbox may hold after an edit
export function parseOklch(triplet) {
  const parts = String(triplet).trim().split(/\s+/);
  if (parts.length < 3) throw new Error(`Not an oklch triplet: ${triplet}`);
  const lightness = parts[0].endsWith('%') ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]);
  const chroma = parts[1].endsWith('%') ? (parseFloat(parts[1]) / 100) * 0.4 : parseFloat(parts[1]);
  const hue = parts[2] === 'none' ? 0 : parseFloat(parts[2]);
  return {lightness, chroma, hue};
}

// Returns the nearest hex and whether the color had to be clipped into sRGB
export function oklchToHex(triplet) {
  const {lightness, chroma, hue} = typeof triplet === 'string' ? parseOklch(triplet) : triplet;
  const a = chroma * Math.cos((hue * Math.PI) / 180);
  const b = chroma * Math.sin((hue * Math.PI) / 180);

  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];

  let clipped = false;
  const channels = linear.map((channel) => {
    const value = toGamma(channel);
    if (value < -0.001 || value > 1.001) clipped = true;
    return Math.round(Math.min(1, Math.max(0, value)) * 255);
  });

  const hex = `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
  return {hex, clipped};
}

export function hexToHsl(hex) {
  const {red, green, blue} = parseHex(hex);
  const [r, g, b] = [red / 255, green / 255, blue / 255];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;
  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === r) hue = (g - b) / delta + (g < b ? 6 : 0);
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    hue *= 60;
  }
  return {hue: Math.round(hue), saturation: Math.round(saturation * 100), lightness: Math.round(lightness * 100)};
}
