import { stringToColor, hsl, xmlEscape, wrapText } from '@/lib/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Book';
  const author = searchParams.get('author') || 'Author';
  const width = parseInt(searchParams.get('width') || '96');
  const height = parseInt(searchParams.get('height') || '128');

  const hue = stringToColor(title + author);
  const lightColor = hsl(hue, 60, 85);
  const darkColor = hsl(hue, 60, 65);

  const padding = 8;
  const maxTextWidth = width - 2 * padding;

  const maxCharsTitle = Math.floor(maxTextWidth / 7);
  const maxCharsAuthor = Math.floor(maxTextWidth / 6.5);

  const titleLines = wrapText(title, maxCharsTitle).slice(0, 3);
  const authorLines = wrapText(author, maxCharsAuthor).slice(0, 2);

  const titleFontSize = 14;
  const authorFontSize = 11;
  const lineSpacing = 5;

  const titleSvgLines = titleLines.map((line, idx) => {
    const y = 20 + idx * (titleFontSize + lineSpacing);
    return `<text x="50%" y="${y}" text-anchor="middle" font-size="${titleFontSize}" font-family="Arial, sans-serif" fill="#222" font-weight="bold">${xmlEscape(line)}</text>`;
  }).join('\n');

  const authorStartY = height - (authorLines.length * (authorFontSize + lineSpacing)) - 3;

  const authorSvgLines = authorLines.map((line, idx) => {
    const y = authorStartY + idx * (authorFontSize + lineSpacing);
    return `<text x="50%" y="${y}" text-anchor="middle" font-size="${authorFontSize}" font-family="Arial, sans-serif" fill="#333">${xmlEscape(line)}</text>`;
  }).join('\n');

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="coverGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${lightColor}" />
        <stop offset="100%" stop-color="${darkColor}" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" rx="10" fill="url(#coverGradient)" />
    ${titleSvgLines}
    ${authorSvgLines}
  </svg>
  `.trim();

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    }
  });
}