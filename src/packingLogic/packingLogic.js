export const PackingLogic = (grillItems, spaceWidth, spaceHeight, x, y) => {
  let boxes = Array.from(grillItems);
  let finalBoxes = [];
  let theEndFlag = 0;

  const changeCounter = (array, figure) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].title === figure.title) {
        if (array[i].count > 1) {
          array[i].count--;
        } else {
          array = array.filter((product) => product.title !== figure.title);
        }
      }
    }
    return array;
  };

  boxes.sort(function (x, y) {
    return y.width * y.height - x.width * x.height;
  }); // fit bigger boxes first

  boxes.sort(function (x, y) {
    return y.width - x.width;
  }); // fit wider boxes first

  boxes.sort(function (x, y) {
    return y.height - x.height;
  }); // keep boxes with similar heights side-by-side

  // start with a single empty space, unbounded at the bottom
  const spaces = [{ x: x, y: y, w: spaceWidth, h: spaceHeight }];

  let height = 0;

  for (let boxNum = 0; boxNum < boxes.length; boxNum += 1) {
    const box = Object.assign({}, boxes[boxNum]);

    spaces.sort(function (a, b) {
      return a.x - b.x;
    });

    for (let spaceNum1 = 0; spaceNum1 < spaces.length - 1; spaceNum1 += 1) {
      for (let spaceNum2 = spaceNum1 + 1; spaceNum2 < spaces.length; spaceNum2 += 1) {
        const space1 = spaces[spaceNum1];
        const space2 = spaces[spaceNum2];

        if (space1.x === space2.x && space2.y === space1.y + space1.h) {
          space2.y = Math.min(space1.y, space2.y);
          space2.h = space1.h + space2.h;
          spaces.splice(spaceNum1, 1);
        }
      }
    }

    // check for spaces nearer the cut edge first
    spaces.sort(function (a, b) {
      return b.x - a.x;
    });
    spaces.sort(function (a, b) {
      return a.y - b.y;
    });

    for (let i = 0; i < spaces.length; i += 1) {
      // // check smaller spaces first

      const space = spaces[i];

      // look for empty spaces that can accommodate the current box
      if (!(box.width <= space.w && box.height <= space.h)) {
        continue;
      }
      box.x = space.x;
      box.y = space.y;

      if (isNaN(spaceHeight)) {
        height = Math.max(height, box.y + box.height);
      }

      if (box.width === space.w && box.height === space.h) {
        // space matches the box exactly; remove it
        const last = spaces.pop();

        if (i < spaces.length) {
          spaces[i] = last;
        }
      } else {
        spaces.push({
          x: space.x + box.width,
          y: space.y,
          w: space.w - box.width,
          h: space.h,
        });

        finalBoxes.push(box);
        boxes = changeCounter(boxes, box);

        space.y += box.height;
        space.h -= box.height;
        space.w = box.width;
      }
      break;
    }

    if (finalBoxes.length > theEndFlag) {
      theEndFlag = finalBoxes.length;
      boxNum = -1;
      continue;
    }
  }
  return {
    boxes,
    finalBoxes,
  };
};
