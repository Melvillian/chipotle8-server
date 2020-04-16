// a canvas RGBA value requires 4 bytes
const NUM_BYTES_IN_RGBA = 4;
type CanvasChange = { x: number; y: number };

// Create the initial black pixel map
export const initializeImage = (
  imageData: ImageData,
  width: number,
  height: number
) => {
  // Loop over all of the pixels
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      writeRGBAValue(imageData, x, y, width, false);
    }
  }
};

const getIndex = (x: number, y: number, width: number) => {
  return (y * width + x) * NUM_BYTES_IN_RGBA;
};

// Update a canvas pixels with the change coming in from the game server. This will
// change multiple pixels on the canvas because a single pixel on the emulator
// display is represented by multiple pixels on the canvas, the exact number
// of which is determined by widthMultiplier and heightMultiplier
export const updateCanvasImageData = (
  imageData: ImageData,
  change: any,
  width: number,
  widthMultiplier: number,
  heightMultiplier: number
) => {
  const { x: chipX, y: chipY, isAlive } = change;

  for (let canvasChange of getCanvasChangesFromChange(
    chipX,
    chipY,
    width,
    widthMultiplier,
    heightMultiplier
  )) {
    const { x, y } = canvasChange;
    writeRGBAValue(imageData, x, y, width, isAlive);
  }
};

// given a pixel change from the emulator, return the corresponding
const getCanvasChangesFromChange = (
  chipX: number,
  chipY: number,
  width: number,
  widthMultiplier: number,
  heightMultiplier: number
): CanvasChange[] => {
  const canvasChanges: CanvasChange[] = [];

  const startingX = chipX * widthMultiplier;
  const startingY = chipY * heightMultiplier;
  for (let w = 0; w < widthMultiplier; w++) {
    for (let h = 0; h < heightMultiplier; h++) {
      const x = startingX + w;
      const y = startingY + h;
      canvasChanges.push({ x, y });
    }
  }

  return canvasChanges;
};

// a Canvas ImageData object is a widthxheightx4 array where each pixel is represented by an RGBA value
// of 4 numbers.
const writeRGBAValue = (
  imageData: ImageData,
  x: number,
  y: number,
  width: number,
  isWhite: boolean
) => {
  // Get the pixel index
  const pixelIndex = getIndex(x, y, width);

  // Set the pixel data
  const pixelValue = isWhite ? 255 : 0;

  imageData.data[pixelIndex + 0] ^= pixelValue;
  imageData.data[pixelIndex + 1] ^= pixelValue;
  imageData.data[pixelIndex + 2] ^= pixelValue;
  imageData.data[pixelIndex + 3] = 255; // alpha value is always maxed out, because 0 is fully transparant
};
