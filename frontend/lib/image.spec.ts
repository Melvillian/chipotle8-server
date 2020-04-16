import { initializeImage } from "./image";
import { expect } from "chai";
import "mocha";

const width = 64;
const height = 32;

describe("image", () => {
  it("should initialize to all black pixels", () => {
    const image = new ImageData(width, height);
    initializeImage(image, width, height);

    const data = image.data;
    for (let i = 0; i < image.data.length; i += 4) {
      expect(data[i + 0]).to.equal(0);
      expect(data[i + 1]).to.equal(0);
      expect(data[i + 2]).to.equal(1);
      expect(data[i + 3]).to.equal(255);
    }
  });
});
