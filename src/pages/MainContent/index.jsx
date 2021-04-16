/* eslint-disable no-throw-literal */
import { useState } from "react";

import * as data from "../../sample-data.json";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextareaAutosize,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";

import { OutItemsTable } from "../../components/OutItemsTable";
import { Potpack } from "../../packingLogic/Potpack";

const styles = {
  box: {
    width: 500,
    height: 200,
    border: "1px solid #CACBD1",
    borderRadius: 4,
    display: "flex",
    flexWrap: "wrap",
  },
};

export const MainContent = ({ items }) => {
  const [viewRest, setViewRest] = useState(false);
  const [restBoxes, setRestBoxes] = useState([]);

  const parseTextArea = () => {
    const area = document.getElementById("#area");
    try {
      const data = JSON.parse(area.value).default;
      if (data instanceof Object) {
        return data;
      } else {
        throw new Error();
      }
    } catch (error) {
      throw error;
    }
  };

  const sort = (grillItems, grillWidth, grillHeight, startX, startY) => {
    var n_box = grillItems.length;
    var fabric_width = grillWidth;
    var fabric_height = grillHeight;

    const col_start = 35;
    const col_interval = Math.round((80 - 20) / n_box);

    let boxes = [];
    let i;

    for (i = 0; i < n_box; i++) {
      const box_w = grillItems[i].width;
      const box_h = grillItems[i].height;
      const box_c = grillItems[i].count;
      const box_title = grillItems[i].title;

      try {
        if (isNaN(box_w) || isNaN(box_h) || isNaN(box_c)) throw "Please input numbers.";
        if (box_w < 1 || box_h < 1 || box_c < 1) throw "Minimum value is 1.";
        if (box_w > fabric_width) throw "Width exceeds fabric width.";
        if (!Number.isInteger(box_c)) throw "Number of rectangles must be a whole number.";
        if (box_c > 100) throw "Number of rectangles cannot exceed 100";
        const box_a = box_w * box_h;
        let bc;
        for (bc = 0; bc < box_c; bc += 1) {
          if (i === 0) {
            boxes.push({
              w: box_w,
              h: box_h,
              a: box_a,
              title: box_title,
              col: `hsl(195,100%,${col_start}%)`,
            });
          } else {
            boxes.push({
              w: box_w,
              h: box_h,
              a: box_a,
              title: box_title,
              col: `hsl(195,100%,${i * col_interval + col_start}%)`,
            });
          }
        }
      } catch (err) {
        console.log("Error format!: ", err);
      }
    }

    const { w, h, fill } = Potpack(
      boxes,
      fabric_width,
      fabric_height,
      startX,
      startY,
      1,
      0,
      0,
      1
    );

    let leftover_total = 0;
    let leftover_total_area = 0;

    // identify boxes that can't fit
    for (let j = 0; j < n_box; j++) {
      var box_w = grillItems[j].width;
      var box_h = grillItems[j].height;

      var leftover = 0;
      var leftover_area = 0;

      for (const box$1 of boxes) {
        if (isNaN(box$1.x) && box$1.w === box_w && box$1.h === box_h) {
          leftover += 1;
          leftover_area += box$1.a;
          setRestBoxes((restBoxes) => [...restBoxes, box$1]);
        }
      }
      leftover_total += leftover;
      leftover_total_area += leftover_area;
    }

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const coords = document.getElementById("#box");

    const cw = coords.clientWidth;
    const ch = coords.clientHeight;

    canvas.width = cw;
    canvas.height = ch;
    canvas.style.width = cw + "px";
    canvas.style.height = ch + "px";

    const r = cw / w;

    ctx.lineWidth = 0.5;
    for (const box of boxes) {
      ctx.beginPath();

      // color
      ctx.fillStyle = box.col;
      ctx.rect(box.x * r, box.y * r, box.w * r, box.h * r);
      ctx.fill();
      ctx.stroke();
    }

    document.getElementById("info").innerHTML = `
            Packed <em>${boxes.length - leftover_total}</em> out of <em>
            ${boxes.length}</em> rectangle(s), using <em>
            ${Math.round(
              (100 * (fill - leftover_total_area)) / (w * h)
            )}%</em> of a <em>${w}x${h}</em> (WxH) fabric.`;

    setViewRest(true);
    debugger;
  };

  const onClick = () => {
    let mainData;
    let grillItems;
    let width;
    let height;
    const box = document.getElementById("#box");
    const coordinates = box.getBoundingClientRect();

    try {
      mainData = parseTextArea();
      grillItems = mainData.grill.grillItems;
      width = mainData.grill.width;
      height = mainData.grill.height;
    } catch {
      alert("There was a syntax error! We take the default data.");
      grillItems = items.grill.grillItems;
      width = items.grill.width;
      height = items.grill.height;
    }

    sort(grillItems, width, height, coordinates.x, coordinates.y);
  };

  return (
    <Grid item lg={12} xs={12}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item lg={8} xs={8}>
              <Grid container spacing={3}>
                <Grid item lg={12} xs={12}>
                  <Button variant="contained" color="primary" onClick={onClick}>
                    Sort items
                  </Button>
                </Grid>
                <Grid item lg={12} xs={12}>
                  <Box id="#box" style={styles.box}>
                    <canvas id="canvas" />
                  </Box>
                </Grid>
                <Grid item lg={8} xs={8} style={{ display: "grid" }}>
                  <TextareaAutosize
                    id="#area"
                    rowsMin={30}
                    placeholder="Enter your JSON"
                    defaultValue={JSON.stringify(data, null, 2)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={4} xs={4}>
              <Grid container spacing={3}>
                <Grid item lg={12} xs={12}>
                  <Card>
                    <CardContent>
                      <Typography
                        variant="h6"
                        style={{ backgroundColor: "#F7F8FF " }}
                      >
                        Items out of grill
                      </Typography>
                      <OutItemsTable boxes={viewRest ? restBoxes : null} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item lg={12} xs={12}>
                  <Typography id="info"></Typography>
                </Grid>
              </Grid>
              <Grid></Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

MainContent.propTypes = {
  items: PropTypes.object.isRequired,
};
