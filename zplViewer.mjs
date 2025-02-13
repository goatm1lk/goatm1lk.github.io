function drawZPL(zplCode) {
  const parseZPL = (zplCode) => {
    let parsedFields = zplCode.split("\n");
    console.log(parsedFields);
    const commandsByLine = [];
    //For MOST of these commands, they start with the Field orginin indicating where the content should go. To keep things organized, Lets capture each line and make and index with all the commands and values for the
    parsedFields.forEach((line) => {
      let commands = line.split("^");
      let parsedCommands = [];

      commands.forEach((command) => {
        if (!command) return;
        switch (true) {
          case /^FO/.test(command):
            const matchFO = command.match(/^FO(\d+),(\d+)/);
            if (matchFO) {
              currentX = parseInt(matchFO[1], 10);
              currentY = parseInt(matchFO[2], 10);
            }
            parsedCommands.push({
              FO: {
                x: currentX,
                y: currentY,
              },
            });
            break;
          case /^GB/.test(command):
            const matchGB = command.match(/^GB(\d+),(\d+),(\d+),?([BW])?/);
            if (matchGB) {
              const [, widthGB, heightGB, thickness, color] = matchGB;
              parsedCommands.push({
                GB: {
                  width: widthGB,
                  height: heightGB,
                  thickness: thickness,
                  color: color,
                },
              });
            }
            break;
          case /^FS/.test(command):
            parsedCommands.push({
              FS: {
                FSFound: true,
              },
            });

            break;
          case /^A0N/.test(command):
            const A0NMatch = command.match(/^A0N,(\d+),(\d+)/);
            if (A0NMatch) {
              let [, fontHeight, fontWidth] = A0NMatch;
              parsedCommands.push({
                A0N: {
                  fontHeight: fontHeight,
                  fontWidth: fontWidth,
                },
              });
            }
            break;
          case /^AdN/.test(command):
            const AdNMatch = command.match(/^AdN,(\d+),(\d+)/);
            if (AdNMatch) {
              let [, fontHeight, fontWidth] = AdNMatch;
              parsedCommands.push({
                AdN: {
                  fontHeightInDots: fontHeight,
                  fontWidthInDots: fontWidth,
                },
              });
            }
            break;
          //I'm thinking about changing this to be ^FW, and the letter after being the orientation of the command.
          case /^FW/.test(command):
            const FWMatch = command.match(/^FW(.+)/);
            const [, orientation] = FWMatch;
            parsedCommands.push({
              FW: {
                orientation: orientation,
              },
            });
            break;
          case /^FH/.test(command):
            parsedCommands.push({
              FH: {
                hexadecimalValues: true,
              },
            });
            break;
          case /^FD/.test(command):
            const FDMatch = command.match(/^FD(.+)/);

            if (FDMatch) {
              const [, text] = FDMatch;
              parsedCommands.push({
                FD: {
                  text: text,
                },
              });
            }
            break;
          case /^FB/.test(command):
            const FBMatch = command.match(
              /^FB(\d+)(?:,(\d*))?(?:,(\d*))?(?:,([LCJR]))?(?:,(\d*))?/
            );
            if (FBMatch) {
              const [
                ,
                width,
                maxLines,
                lineSpacing,
                justification,
                hangingIndent,
              ] = FBMatch;
              parsedCommands.push({
                FB: {
                  width: parseInt(width, 10),
                  maxLines: maxLines ? parseInt(maxLines, 10) : null,
                  lineSpacing: lineSpacing ? parseInt(lineSpacing, 10) : null,
                  justification: justification || "L", // Default to left alignment
                  hangingIndent: hangingIndent
                    ? parseInt(hangingIndent, 10)
                    : null,
                },
              });
            }
            break;
          case /^BY/.test(command): // Barcode Configuration
            const BYMatch = command.match(/^BY(\d+),(\d+),(\d+)/);
            if (BYMatch) {
              const [, width, ratio, height] = BYMatch;
              parsedCommands.push({
                BY: {
                  width: parseInt(width, 10),
                  ratio: parseInt(ratio, 10),
                  height: parseInt(height, 10),
                },
              });
            }
            break;

          case /^BC/.test(command): // Code 128 Barcode
            const BCMatch = command.match(
              /^BC([A-Z]),(\d+),([A-Z]),([A-Z]),([A-Z]),([A-Z])/
            );
            if (BCMatch) {
              const [
                ,
                orientation,
                height,
                printLine,
                printAbove,
                uccCheck,
                mode,
              ] = BCMatch;
              parsedCommands.push({
                BC: {
                  orientation,
                  height: parseInt(height, 10),
                  printLine,
                  printAbove,
                  uccCheck,
                  mode,
                },
              });
            }
            break;

          case /^B7N/.test(command): // Code 11 Barcode
            const B7NMatch = command.match(/^B7N([A-Z]),(\d+),([A-Z]),([A-Z])/);
            if (B7NMatch) {
              const [, orientation, height, printLine, printAbove] = B7NMatch;
              parsedCommands.push({
                B7N: {
                  orientation,
                  height: parseInt(height, 10),
                  printLine,
                  printAbove,
                },
              });
            }
            break;

          case /^PQ/.test(command): // Print Quantity
            const PQMatch = command.match(/^PQ(\d+),(\d+),([A-Z])/);
            if (PQMatch) {
              const [, quantity, pause, repeat] = PQMatch;
              parsedCommands.push({
                PQ: {
                  quantity: parseInt(quantity, 10),
                  pause: parseInt(pause, 10),
                  repeat,
                },
              });
            }
            break;

          case /PW/.test(command): // Print Width
            const PWMatch = command.match(/^PW(\d+)/);
            if (PWMatch) {
              const [, width] = PWMatch;
              parsedCommands.push({
                PW: {
                  width: parseInt(width, 10),
                },
              });
            }
            break;

          case /^PO/.test(command): // Print Orientation
            const POMatch = command.match(/^PO([A-Z])?/);
            if (POMatch) {
              const [, invert] = POMatch;
              parsedCommands.push({
                PO: {
                  invert: invert === "I",
                },
              });
            }
            break;

          case /^CI/.test(command): // Character Encoding
            const CIMatch = command.match(/^CI(\d+)/);
            if (CIMatch) {
              const [, encoding] = CIMatch;
              parsedCommands.push({
                CI: {
                  encoding: parseInt(encoding, 10),
                },
              });
            }
            break;

          case /^LH/.test(command): // Label Home
            const LHMatch = command.match(/^LH(\d+),(\d+)/);
            if (LHMatch) {
              const [, x, y] = LHMatch;
              parsedCommands.push({
                LH: {
                  x: parseInt(x, 10),
                  y: parseInt(y, 10),
                },
              });
            }
            break;

          default:
            console.warn(`Unsupported command: ${command}`);
            break;
        }
      });
      console.log(parsedCommands, "Parsed Commands.");
      commandsByLine.push(parsedCommands);
    });
    console.log(commandsByLine);
    return commandsByLine;
  };

  let currentIndex = 0; // Track which index we are rendering

  // Set initial canvas properties
  function initializeCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000"; // Default text color (black)
    ctx.font = "16px Arial"; // Default font
  }

  // Function to process each index and render on canvas
  function processNextIndex() {
    if (currentIndex >= parsedZPL.length) return; // Stop if all indices processed

    const commands = parsedZPL[currentIndex];
    let lastFO = { x: 0, y: 0 }; // Store the last Field Origin position
    let rotateAngle = 0; // Default rotation angle
    let fontHeight = 20; // Default font height
    let fontWidth = 10; // Default font width
    commands.forEach((command) => {
      let gbX = null;
      let gbY = null;
      for (const key in command) {
        ctx.font = `${fontWidth}px Arial`;
        switch (key) {
          case "FO": // Ensure Field Origin is always set first
            lastFO = { x: command[key].x, y: command[key].y };
            ctx.beginPath();
            ctx.moveTo(command[key].x, command[key].y);
            break;

          case "GB": // Ensure Graphic Box is drawn AFTER FO
            ctx.lineWidth = parseInt(command[key].thickness, 10);
            ctx.strokeRect(
              lastFO.x,
              lastFO.y,
              parseInt(command[key].width, 10),
              parseInt(command[key].height, 10)
            );
            gbX = lastFO.x;
            gbY = lastFO.y;
            break;
          case "FD": // Ensure text is drawn AFTER GB
            ctx.fillText(command[key].text, gbX || lastFO.x, gbY || lastFO.y);
            break;
          case "PW": // Set canvas width
            canvas.width = command[key].width;
            break;

          case "PO": // Invert orientation (flip canvas)
            if (command[key].invert) {
              ctx.translate(canvas.width, canvas.height);
              ctx.rotate(Math.PI); // Rotate 180 degrees if "invert" is true
            }
            break;

          case "CI": // Character encoding
            console.log("Character encoding set to:", command[key].encoding);
            break;

          case "LH": // Label home (adjust start point)
            ctx.translate(command[key].x, command[key].y);
            break;

          // case "FB": // Field Box (draw a box around the field data)
          //   ctx.save(); // Save the context state before transformations

          //   // Set font size and family for the box text (if any)
          //   ctx.font = "40px Arial"; // You can adjust the font size here
          //   ctx.textBaseline = "middle"; // Ensure text is centered for better alignment

          //   // Adjusting position and dimensions of the box (assuming it’s passed as width, height, etc.)
          //   const x = command[key].x || lastFO.x; // Default to lastFO.x if not specified
          //   const y = command[key].y || lastFO.y; // Default to lastFO.y if not specified
          //   const width = parseInt(command[key].width, 10) || 100; // Default width
          //   const height = parseInt(command[key].height, 10) || 50; // Default height

          //   // Apply rotation if needed
          //   ctx.rotate(rotateAngle);

          //   // Draw the box (Graphic Box)

          //   ctx.strokeRect(x, y, width, height); // Draw the rectangle

          //   // Optionally, if there's text within the box
          //   if (command[key].text) {
          //     ctx.fillText(command[key].text, x + width / 2, y + height / 2); // Center text inside the box
          //   }

          //   ctx.restore(); // Restore the context after drawing
          //   break;

          case "FW": // Print Width (Orientation)
            const orientation = command[key].orientation;
            //console.log("Print Width orientation:", orientation);

            // Set the rotation angle based on the orientation command
            switch (orientation) {
              case "N": // Normal orientation (no rotation)
                rotateAngle = 0;
                break;
              case "R": // Rotate 90 degrees clockwise
                rotateAngle = Math.PI / 2;
                break;
              case "I": // Rotate 180 degrees
                rotateAngle = Math.PI;
                break;
              case "B": // Rotate 270 degrees clockwise
                rotateAngle = (3 * Math.PI) / 2;
                break;
              default:
                console.log("Unknown FW orientation:", orientation);
                break;
            }

            break;

          case "FH": // Field Hexadecimal/field parameter, possibly encoding or handling special characters
            // Here, just use as is, no rotation or translation needed
            break;
          case "A0N": // Font size adjustment
            fontHeight = command[key].fontHeight; // Update font height if specified
            fontWidth = command[key].fontWidth; // Update font width if specified
            ctx.font = `${5}px Arial`;
            break;

          default:
            console.log(key);
        }
      }
    });

    currentIndex++; // Move to the next command set
  }

  const canvas = document.getElementById("zplCanvas");
  const ctx = canvas.getContext("2d");
  canvas.height = 1500;
  const parsedZPL = parseZPL(zplCode);
  console.log(
    parsedZPL,
    "Here is the ZPL commands we need to go through one by one."
  );

  // Run the function iteratively
  initializeCanvas();

  const interval = setInterval(() => {
    processNextIndex();
    if (currentIndex >= parsedZPL.length) {
      clearInterval(interval); // Stop when done
    }
  }, 500); // Delay between each step
}
