import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONTS = [
  {
    name: "Nunito-Regular",
    url: "https://fonts.gstatic.com/s/nunito/v25/XRXV3I6Li01BKofINeaBTMnFcQ.woff2",
    weight: 400,
  },
  {
    name: "Nunito-SemiBold",
    url: "https://fonts.gstatic.com/s/nunito/v25/XRXV3I6Li01BKofIO-aBTMnFcQ.woff2",
    weight: 600,
  },
  {
    name: "Nunito-Bold",
    url: "https://fonts.gstatic.com/s/nunito/v25/XRXV3I6Li01BKofINeaBTMnFcQ.woff2",
    weight: 700,
  },
];

const downloadFont = (font) => {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "fonts",
    `${font.name}.woff2`
  );

  https
    .get(font.url, (response) => {
      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);

      fileStream.on("finish", () => {
        console.log(`Downloaded ${font.name}`);
        fileStream.close();
      });
    })
    .on("error", (err) => {
      console.error(`Error downloading ${font.name}:`, err.message);
    });
};

// Create fonts directory if it doesn't exist
const fontsDir = path.join(__dirname, "..", "public", "fonts");
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Download all fonts
FONTS.forEach(downloadFont);
