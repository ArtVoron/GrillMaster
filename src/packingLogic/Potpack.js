export const Potpack = (
  boxes,
  fabric_width,
  fabric_height,
  hspace,
  vspace,
  hfuse,
  vfuse
) =>{

    // calculate total box area and maximum box width
    let area = 0;

    for (let numBox = 0, list = boxes; numBox < list.length; numBox += 1) {
        const box = list[numBox];
        area += box.a;
    }

    // determine packing order of boxes
    boxes.sort(function (x, y) { return y.a - x.a; }); // fit bigger boxes first
    boxes.sort(function (x, y) { return y.w - x.w; }); // fit wider boxes first
    boxes.sort(function (x, y) { return y.h - x.h; }); // keep boxes with similar heights side-by-side
    
    // start with a single empty space, unbounded at the bottom
    let spaces = [{x: 0, y: 0, w: fabric_width, h: Infinity}];

    const width = fabric_width;
    let height = 0;

    if (!isNaN(fabric_height)) {
        height = fabric_height;
        spaces = [{x: 0, y: 0, w: fabric_width, h: fabric_height}];
    }

    for (let num1Box = 0, listBoxes = boxes; num1Box < listBoxes.length; num1Box += 1) {
        
        const currentBox = listBoxes[num1Box];


        if (vfuse === 1) {

            // fuse vertically adjacent spaces like
            // |-------------------|
            // |     |             |
            // |     |   space #1  |
            // |     |_____________|
            // |     |             |
            // |     |   space #2  |
            // |_____|_____________|
            spaces.sort(function (a, b) { return a.x - b.x; });
            for (let num1Space = 0; num1Space < spaces.length - 1; num1Space += 1) {
                for (let num2Space = num1Space + 1; num2Space < spaces.length; num2Space += 1) {
                    
                    let space1 = spaces[num1Space];
                    let space2 = spaces[num2Space];

                    if (space1.x === space2.x && space2.y === (space1.y + space1.h)) {
                        space2.y = Math.min(space1.y, space2.y);
                        space2.h = space1.h + space2.h;
                        spaces.splice(num1Space, 1);
                    }
                }
            }

        }


        if (hfuse === 1) {

            // fuse horizontally adjacent spaces like
            // |-----------------------|
            // |        |        |     |
            // |        |        |     |
            // | space1 | space2 |     |
            // |        |        |     |
            // |        |        |     |
            // |________|________|_____|

            spaces.sort(function (a, b) { return a.y - b.y; }); 
            if (spaces.length > 1) {
                for (let num1Space = spaces.length - 1; num1Space >=1; num1Space--) {

                    let space1 = spaces[num1Space];
                    let space2 = spaces[num1Space - 1];

                    if (space1.y === space2.y && space2.x === (space1.x + space1.w)) {

                        space2.x = Math.min(space1.x, space2.x);
                        space2.w = space1.w + space2.w;
                        spaces.splice(num1Space, 1);
                    }
                }
            }
        }


        // check for spaces nearer the cut edge first
        spaces.sort(function (a, b) { return b.x - a.x; });
        spaces.sort(function (a, b) { return a.y - b.y; });
        for (let i = 0; i < spaces.length; i += 1) {

        // // check smaller spaces first
        // for (var i = spaces.length - 1; i >= 0; i--) {

            const space = spaces[i];

            // look for empty spaces that can accommodate the current box
            if (!(currentBox.w <= space.w && currentBox.h <= space.h)) { continue; }

            // found the space; add the box to its top-left corner
            // |-------|-------|
            // |  box  |       |
            // |_______|       |
            // |         space |
            // |_______________|
            currentBox.x = space.x;
            currentBox.y = space.y;

            if (isNaN(fabric_height)) { height = Math.max(height, currentBox.y + currentBox.h); }

            if (currentBox.w === space.w && currentBox.h === space.h) {
                // space matches the box exactly; remove it
                const last = spaces.pop();
                if (i < spaces.length) { spaces[i] = last; }

            } else if (currentBox.h === space.h) {
                // space matches the box height; update it accordingly
                // |-------|---------------|
                // |  box  | updated space |
                // |_______|_______________|
                space.x += currentBox.w;
                space.w -= currentBox.w;

            } else if (currentBox.w === space.w) {
                // space matches the box width; update it accordingly
                // |---------------|
                // |      box      |
                // |_______________|
                // | updated space |
                // |_______________|
                space.y += currentBox.h;
                space.h -= currentBox.h;

            } else {

                if (hspace === 1) {

                    // otherwise the box splits the space into two spaces
                    // |-------|-----------|
                    // |  box  | new space |
                    // |_______|___________|
                    // | updated space     |
                    // |___________________|
                    spaces.push({
                        x: space.x + currentBox.w,
                        y: space.y,
                        w: space.w - currentBox.w,
                        h: currentBox.h
                    });
                    space.y += currentBox.h;
                    space.h -= currentBox.h;

                }

                if (vspace === 1) {

                // otherwise the box splits the space into two spaces
                // |-------|-----------|
                // |  box  |           |
                // |_______| new space |
                // |updated|           |
                // | space |           |
                // |_______|___________|
                spaces.push({
                    x: space.x + currentBox.w,
                    y: space.y,
                    w: space.w - currentBox.w,
                    h: space.h
                });
                space.y += currentBox.h;
                space.h -= currentBox.h;
                space.w = currentBox.w;

                }



            }
            break;
        }
    }

    return {
        w: width, // container width
        h: height, // container height
        fill: area || 0 // space utilization
    };
}