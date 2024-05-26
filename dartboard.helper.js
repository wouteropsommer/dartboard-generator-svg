export function drawBoard(document, draw) {
  const dartboard = draw.group().id("dartboard").stroke("black");

  dartboard.circle(400).center(250, 250).fill("white");

  // Draw the segments, ensuring "20" is on top
  for (let i = 0; i < 20; i++) {
    let angle = i * 18 + 9;
    let x = 250 + 220 * 0.9 * Math.cos((angle * Math.PI) / 180);
    let y = 250 - 220 * 0.9 * Math.sin((angle * Math.PI) / 180);
    dartboard.line(250, 250, x, y).stroke("black");
  }
  return dartboard;
}

export function drawRealisticDart(draw, x, y, angle) {
  const dart = draw.group();

  // Define dart dimensions
  const bodyLength = 100;
  const bodyWidth = 5;
  const pointLength = 10;
  const flightWidth = 20;
  const flightHeight = 30;
  const flightOffset = 5;

  // Draw the dart point (triangle) with (x, y) as the tip
  dart
    .polygon([
      [x, y],
      [x - pointLength, y - bodyWidth / 2],
      [x - pointLength, y + bodyWidth / 2],
    ])
    .fill("#" + Math.floor(Math.random() * 16777215).toString(16))
    .rotate(angle, x, y);

  // Draw the dart body extending from the point
  dart
    .rect(bodyLength, bodyWidth)
    .move(x - bodyLength - pointLength, y - bodyWidth / 2)
    .fill("#" + Math.floor(Math.random() * 16777215).toString(16))
    .rotate(angle, x, y);

  // Draw the dart flights (wings)
  dart
    .polygon([
      [x - bodyLength - pointLength + flightOffset, y - flightHeight / 2],
      [x - bodyLength - pointLength, y + bodyWidth / 2],
      [
        x - bodyLength - pointLength + flightOffset,
        y + bodyWidth + flightHeight / 2,
      ],
      [
        x - bodyLength - pointLength - flightWidth + flightOffset,
        y + bodyWidth + flightHeight / 4,
      ],
      [
        x - bodyLength - pointLength - flightWidth + flightOffset,
        y + bodyWidth / 2 - flightHeight / 4,
      ],
    ])
    .fill("#" + Math.floor(Math.random() * 16777215).toString(16))
    .rotate(angle, x, y);

  dart
    .polygon([
      [
        x - bodyLength - pointLength + flightOffset,
        y + bodyWidth + flightHeight / 2,
      ],
      [x - bodyLength - pointLength, y + bodyWidth / 2],
      [x - bodyLength - pointLength + flightOffset, y - flightHeight / 2],
      [
        x - bodyLength - pointLength - flightWidth + flightOffset,
        y - flightHeight / 4,
      ],
      [
        x - bodyLength - pointLength - flightWidth + flightOffset,
        y + bodyWidth / 2 + flightHeight / 4,
      ],
    ])
    .fill("#" + Math.floor(Math.random() * 16777215).toString(16))
    .rotate(angle, x, y);

  // Add the dart to the main draw context
  draw.add(dart);
}

export function calculateDartScore(dart_x, dart_y) {
  const centerX = 250; // Center x-coordinate of the dartboard
  const centerY = 250; // Center y-coordinate of the dartboard
  const radius = 200; // Effective radius of the scoring area of the dartboard

  // Calculate the distance and angle from the center
  const dx = dart_x - centerX;
  const dy = dart_y - centerY;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 180; // Adjusting angle to be from 0 to 360

  // Determine the scoring sector based on the angle
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance > radius) {
    return { score: 0, angle }; // Outside the dartboard
  } else {
    const segmentAngle = 18; // Each segment is 18 degrees
    const baseScore = [
      20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
    ];
    const segmentIndex = Math.floor((angle + 90 + 180 + 9) / segmentAngle) % 20; // Adding 9 degrees to adjust starting point to the top
    return { score: baseScore[segmentIndex], angle };
  }
}

export function generateRandomDartPosition(
  centerX,
  centerY,
  radius,
  outsidePercentage = 0.05
) {
  // Generate a random angle between 0 and 360 degrees
  const dartAngle = Math.random() * 360;

  // Determine if the dart should be inside or outside the dartboard
  const isOutside = Math.random() < outsidePercentage;

  // Generate a random distance
  let distance;
  if (isOutside) {
    distance = radius + Math.random() * 50; // Randomly place outside up to 50 units
  } else {
    distance = Math.random() * radius;
  }

  // Convert polar coordinates to Cartesian coordinates
  let dart_x = centerX + distance * Math.cos(dartAngle);
  let dart_y = centerY + distance * Math.sin(dartAngle);

  dart_x = Math.round(dart_x);
  dart_y = Math.round(dart_y);
  return { dart_x, dart_y, dartAngle };
}
