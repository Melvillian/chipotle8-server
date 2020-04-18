/**
 * DisplayChange represents the pixel state for the pixel at x and y coordinates, where "true" is white and "false" is black.
 *
 * For example, we might have `let change: DisplayChange = { x: 0, x: 0, isAlive: true };` for a white pixel in the top left of the display
 */
type DisplayChange = { x: number; y: number; isAlive: boolean };

export { DisplayChange };
