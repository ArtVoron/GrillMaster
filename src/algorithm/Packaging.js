export const Packaging = (grillItems, spaceWidth, spaceHeight, x, y) => {
  let boxes = Array.from(grillItems);
  let finalBoxes = [];
  let theEndFlag = 0;

  const changeCounterOfItem = (array, figure) => {
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
  let spaces = [{ x: x, y: y, w: spaceWidth, h: spaceHeight }];

  let height = 0;

  for (let i$2 = 0; i$2 < boxes.length; i$2 += 1) {
    let box$1 = Object.assign({}, boxes[i$2]);

    spaces.sort(function (a, b) {
      return a.x - b.x;
    });

    for (let i$3 = 0; i$3 < spaces.length - 1; i$3 += 1) {
      for (let i$4 = i$3 + 1; i$4 < spaces.length; i$4 += 1) {
        let space1 = spaces[i$3];
        let space2 = spaces[i$4];

        if (space1.x === space2.x && space2.y === space1.y + space1.h) {
          space2.y = Math.min(space1.y, space2.y);
          space2.h = space1.h + space2.h;
          spaces.splice(i$3, 1);
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

      let space = spaces[i];

      // look for empty spaces that can accommodate the current box
      if (!(box$1.width <= space.w && box$1.height <= space.h)) {
        continue;
      }
      box$1.x = space.x;
      box$1.y = space.y;

      if (isNaN(spaceHeight)) {
        height = Math.max(height, box$1.y + box$1.height);
      }

      if (box$1.width === space.w && box$1.height === space.h) {
        // space matches the box exactly; remove it
        let last = spaces.pop();

        if (i < spaces.length) {
          spaces[i] = last;
        }
      } else {
        spaces.push({
          x: space.x + box$1.width,
          y: space.y,
          w: space.w - box$1.width,
          h: space.h,
        });

        finalBoxes.push(box$1);
        boxes = changeCounterOfItem(boxes, box$1);

        space.y += box$1.height;
        space.h -= box$1.height;
        space.w = box$1.width;
      }
      break;
    }

    if (finalBoxes.length > theEndFlag) {
      theEndFlag = finalBoxes.length;
      i$2 = -1;
      continue;
    }
  }
  return {
    boxes,
    finalBoxes,
  };
};
