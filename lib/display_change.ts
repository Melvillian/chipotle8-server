/**
 * An objects representing the pixel state for the pixel as x and y coordinates, where "true" is white and "false" is black.
 *
 * For example, we might have `let change: DisplayChange = { x: 0, x: 0, isOn: true };` for a white pixel in the top left of the display
 */
type DisplayChange = { x: number; y: number; isOn: boolean };

export { DisplayChange };
