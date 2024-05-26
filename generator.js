import { SVG, registerWindow } from "@svgdotjs/svg.js";
import { createSVGWindow } from "svgdom";
import fs from "fs";
import path from "path";
import {
  calculateDartScore,
  drawBoard,
  drawRealisticDart,
  generateRandomDartPosition,
} from "./dartboard.helper.js";
import { convertSVGToPNG } from "./utils.js";

const { random, cos, sin, PI } = Math;

const AMOUNT_OF_DARTS_TO_GENERATE = 1;
const AMOUNT_OF_IMAGES_TO_GENERATE = 3000;

// Register the window and document for svg.js
const window = createSVGWindow();
const document = window.document;
registerWindow(window, document);

function generateDartboardWithDartsSVG() {
  const draw = SVG(document.documentElement).size(512, 512);
  draw.clear();
  draw.rect(512, 512).fill("black");

  drawBoard(document, draw);

  let dartsInfo = drawDarts(draw);

  //Draw red circle on dart tip
  // draw
  //   .circle(10)
  //   .center(
  //     dartsInfo.dartsWithScore[0].dart_x,
  //     dartsInfo.dartsWithScore[0].dart_y
  //   )
  //   .fill("red");

  return {
    svg: draw,
    dartsInfo,
  };
}

function drawDarts(svg) {
  let dartsWithScore = [];
  let numberOfDarts = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < AMOUNT_OF_DARTS_TO_GENERATE; i++) {
    let position = generateRandomDartPosition(250, 250, 200, 0.05);

    drawRealisticDart(
      svg,
      position.dart_x,
      position.dart_y,
      position.dartAngle
    );

    let scoreWithAngle = calculateDartScore(position.dart_x, position.dart_y);

    dartsWithScore.push({
      dart_x: position.dart_x,
      dart_y: position.dart_y,
      angle: scoreWithAngle.angle,
      score: scoreWithAngle.score,
    });
  }

  return {
    totalScore: dartsWithScore.reduce((acc, dart) => acc + dart.score, 0),
    dartsWithScore: dartsWithScore,
  };
}

// Create output directory if it doesn't exist
const outputDir = "output_images";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Generate darboards and save images
for (let i = 0; i < AMOUNT_OF_IMAGES_TO_GENERATE; i++) {
  const resp = generateDartboardWithDartsSVG();

  // Create file name based on the total score and coordinates of the darts
  const scoreStr = `score(${resp.dartsInfo.totalScore})`;

  let coordStr = "coords[";
  resp.dartsInfo.dartsWithScore.forEach((dart) => {
    coordStr += `(${Math.round(dart.dart_x * 100) / 100},${
      Math.round(dart.dart_y * 100) / 100
    }),`;
  });
  coordStr = coordStr.slice(0, coordStr.length - 1) + "]";

  const pngFileName = path.join(outputDir, `${scoreStr}_${coordStr}.png`);

  // Convert and save as PNG
  convertSVGToPNG(resp.svg, pngFileName);
}
