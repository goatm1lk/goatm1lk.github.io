function drawZPL(zplCode) {
  const parseZPL = (zplCode) => {
    const canvas = document.getElementById("zplCanvas");
    if (!canvas) {
      console.error("Canvas element not found!");
      return;
    }
    const ctx = canvas.getContext("2d");

    // Set canvas size (adjust as needed)
    canvas.width = 800;
    canvas.height = 1200;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Default settings
    let currentX = 0,
      currentY = 0,
      fontSize = 12,
      fontFamily = "Arial",
      isFieldReverse = false,
      textAlign = "left",
      barcodeModuleWidth = 2, // Default barcode module width
      barcodeWideBarWidth = 2; // Default wide bar width

    // Split ZPL code into lines
    const lines = zplCode.split("\n");
    for (const line of lines) {
      // Split each line into commands
      const commands = line.split("^");
      for (const command of commands) {
        if (!command) continue; // Skip empty commands

        // Handle Field Origin (^FO)
        if (/^FO/.test(command)) {
          const matchFO = command.match(/^FO(\d+),(\d+)/);
          if (matchFO) {
            currentX = parseInt(matchFO[1], 10);
            currentY = parseInt(matchFO[2], 10);
          }
        }

        // Handle Field Data (^FD)
        else if (/^FD/.test(command)) {
          const matchFD = command.match(/^FD(.+)/);
          if (matchFD) {
            let text = matchFD[1];
            // Handle hexadecimal encoding (^FH)
            if (command.includes("^FH")) {
              text = text.replace(/_([0-9A-F]{2})/g, (match, hex) =>
                String.fromCharCode(parseInt(hex, 16))
              );
            }

            ctx.fillStyle = isFieldReverse ? "white" : "black";
            ctx.font = `${fontSize}px ${fontFamily}`;
            ctx.textAlign = textAlign;
            ctx.fillText(text, currentX, currentY);
          }
        }

        // Handle Graphic Box (^GB)
        else if (/^GB/.test(command)) {
          const matchGB = command.match(/^GB(\d+),(\d+),(\d+),?([BW])?/);
          if (matchGB) {
            const [, widthGB, heightGB, thickness, color] = matchGB;
            const strokeColor = isFieldReverse
              ? "white"
              : color === "W"
              ? "white"
              : "black";

            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = parseInt(thickness, 10);

            // Draw the box
            ctx.strokeRect(currentX, currentY, parseInt(widthGB, 10), parseInt(heightGB, 10));

            // Fill the box if thickness equals width and height
            if (parseInt(thickness, 10) >= parseInt(widthGB, 10) && parseInt(thickness, 10) >= parseInt(heightGB, 10)) {
              ctx.fillStyle = strokeColor;
              ctx.fillRect(currentX, currentY, parseInt(widthGB, 10), parseInt(heightGB, 10));
            }
          }
        }

        // Handle Field Reverse (^FR)
        else if (/^FR/.test(command)) {
          isFieldReverse = true;
        }

        // Handle Field Separator (^FS)
        else if (/^FS/.test(command)) {
          isFieldReverse = false; // Reset Field Reverse
        }

        // Handle Font Configuration (^A)
        else if (/^A/.test(command)) {
          const matchA = command.match(/^A(\w+),(\d+),(\d+)/);
          if (matchA) {
            const [, fontType, height, width] = matchA;
            fontSize = parseInt(height, 10);
            fontFamily = fontType === "0" ? "Arial" : "Courier";
          }
        }

        // Handle Barcode Configuration (^BY)
        else if (/^BY/.test(command)) {
          const matchBY = command.match(/^BY(\d+),(\d+),(\d+)/);
          if (matchBY) {
            barcodeModuleWidth = parseInt(matchBY[1], 10);
            barcodeWideBarWidth = parseInt(matchBY[2], 10);
          }
        }

        // Handle Code 128 Barcode (^BCN)
        else if (/^BCN/.test(command)) {
          const matchBCN = command.match(/^BCN,(\d+),(\d+),(\d+),(\d+),(\d+)\^FD(.+)/);
          if (matchBCN) {
            const [, height, width, ratio, text] = matchBCN;
            ctx.fillStyle = "black";
            ctx.fillRect(currentX, currentY, parseInt(width, 10), parseInt(height, 10));
            ctx.fillText(text, currentX, currentY + parseInt(height, 10) + 10); // Label for barcode
          }
        }

        // Handle Field Block (^FB)
        else if (/^FB/.test(command)) {
          const matchFB = command.match(/^FB(\d+)(?:,(\d+))?(?:,(\d+))?(?:,(\w))?/);
          if (matchFB) {
            const [, widthFB, lines, spacing, justification] = matchFB;
            textAlign =
              justification === "L"
                ? "left"
                : justification === "C"
                ? "center"
                : "right";
          }
        }

        // Handle Field Orientation (^FWN, ^FWB)
        else if (/^FW/.test(command)) {
          const matchFW = command.match(/^FW(\w)/);
          if (matchFW) {
            const [, orientation] = matchFW;
            if (orientation === "N") {
              ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset rotation
            } else if (orientation === "B") {
              ctx.setTransform(-1, 0, 0, -1, canvas.width, canvas.height); // Rotate 180 degrees
            }
          }
        }

        // Handle Print Quantity (^PQ)
        else if (/^PQ/.test(command)) {
          const matchPQ = command.match(/^PQ(\d+)/);
          if (matchPQ) {
            const quantity = parseInt(matchPQ[1], 10);
            // Handle print quantity (e.g., repeat rendering)
          }
        }

        // Handle End of ZPL (^XZ)
        else if (/^XZ/.test(command)) {
          // Finalize rendering (no action needed here)
        }

        // Log unsupported commands
        else {
          console.warn(`Unsupported command: ${command}`);
        }
      }
    }
  };

  parseZPL(zplCode);
}
