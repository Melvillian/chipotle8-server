/**
 * A tupe representing the pixel state for the pixel as x and y coordinates, where "true" is white and "false" is black.
 *
 * For example, we might have `let change: DisplayChange = [0, 0, true];` for a white pixel in the top left of the display
 */
type DisplayChange = [number, number, boolean];

export { DisplayChange };
