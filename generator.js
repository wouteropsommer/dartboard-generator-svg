import { SVG, registerWindow } from "@svgdotjs/svg.js";
import { createSVGWindow } from "svgdom";
import fs from "fs";
import path from "path";
import {
  calculateDartScore,
  drawBoard,
  drawRealisticDart,
} from "./dartboard.helper.js";
import { convertSVGToPNG } from "./utils.js";

const { random, cos, sin, PI } = Math;

// Register the window and document for svg.js
const window = createSVGWindow();
const document = window.document;
registerWindow(window, document);

function generateDartboardWithDartsSVG() {
  const draw = SVG(document.documentElement).size(500, 500);
  draw.clear();
  draw.rect(500, 500).fill("black");

  let dartboard = drawBoard(document, draw);

  let dartsInfo = drawDarts(dartboard);

  // Apply a skew to simulate perspective from one side
  dartboard.transform({
    // scaleX between 0.8 and 1.0
    scaleX: random() > 0.5 ? 0.8 + random() * 0.2 : 0.8 + random() * 0.2 * -1,
    scaleY: random() > 0.5 ? 0.8 + random() * 0.2 : 0.8 + random() * 0.2 * -1,
    origin: "0 0",
  });

  return {
    svg: draw,
    dartsInfo,
  };
}

function drawDarts(dartboard) {
  let dartWithScore = [];
  let numberOfDarts = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < numberOfDarts; i++) {
    let dartAngle = Math.random() * 360;
    let distance = Math.random() * 240;
    let dart_x = 250 + distance * Math.cos((dartAngle * Math.PI) / 180);
    let dart_y = 250 - distance * Math.sin((dartAngle * Math.PI) / 180);

    drawRealisticDart(dartboard, dart_x, dart_y, dartAngle);

    let scoreWithAngle = calculateDartScore(dart_x, dart_y);

    dartWithScore.push({
      dart_x,
      dart_y,
      angle: scoreWithAngle.angle,
      score: scoreWithAngle.score,
    });
  }

  return {
    totalScore: dartWithScore.reduce((acc, dart) => acc + dart.score, 0),
    dartWithScore,
  };
}

// Create output directory if it doesn't exist
const outputDir = "output_images";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Generate darboards and save images
for (let i = 0; i < 10; i++) {
  const resp = generateDartboardWithDartsSVG();

  // Create file name based on the total score and coordinates of the darts
  const scoreStr = `score(${resp.dartsInfo.totalScore})`;

  let coordStr = "coords(";
  resp.dartsInfo.dartWithScore.forEach((dart) => {
    coordStr += `${Math.round(dart.dart_x * 100) / 100},${
      Math.round(dart.dart_y * 100) / 100
    }-`;
  });

  const pngFileName = path.join(
    outputDir,
    `NR${i}_${scoreStr}_${coordStr}.png`
  );

  // Convert and save as PNG
  convertSVGToPNG(resp.svg, pngFileName);
}
