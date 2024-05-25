import svg2img from "svg2img";
import fs from "fs";

export function convertSVGToPNG(svg, outputFile) {
  svg2img(svg.svg(), { width: 500, height: 500 }, (error, buffer) => {
    if (error) {
      console.error("Error converting SVG to PNG:", error);
      return;
    }

    fs.writeFile(outputFile, buffer, (err) => {
      if (err) {
        console.error("Error writing PNG file:", err);
      } else {
        console.log(`SVG has been converted to PNG: ${outputFile}`);
      }
    });
  });
}
