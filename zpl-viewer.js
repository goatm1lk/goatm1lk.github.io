const fs = require("fs");
const { PNG } = require("pngjs");

try {
  // Read the ZPL content
  const zplContent = fs.readFileSync("testlabel.zpl", "ascii");

  // Extract text from all the ^FD commands
  const textMatches = [...zplContent.matchAll(/\^FD([^^]+)\^FS/g)].map(match => match[1]);

  if (!textMatches.length) {
    throw new Error("No text data found in ZPL file.");
  }

  // Create a basic PNG with the extracted text
  const width = 600;  // Width of the image
  const height = 100 + textMatches.length * 40;  // Height based on the number of lines

  const png = new PNG({
    width: width,
    height: height,
    filterType: -1,
  });

  // Fill the PNG with text (simplified, one line per ^FD)
  let offs = 0;
  textMatches.forEach((text, index) => {
    const yPosition = 100 + index * 40;  // Vertical spacing for each line
    // Render the text as pixels (very basic text rendering)
    // You can improve this with a library to render text onto PNGs
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      // Draw each character as a simple pixel representation
      png.data[offs + (yPosition * width + i) * 4] = 0;   // R (black)
      png.data[offs + (yPosition * width + i) * 4 + 1] = 0; // G (black)
      png.data[offs + (yPosition * width + i) * 4 + 2] = 0; // B (black)
      png.data[offs + (yPosition * width + i) * 4 + 3] = 255; // A (fully opaque)
    }
  });

  // Save the generated PNG to a file
  png.pack().pipe(fs.createWriteStream("zpl_text.png"));

  console.log("PNG file with ZPL text data generated.");
} catch (error) {
  console.error("Error processing ZPL to PNG:", error);
}
