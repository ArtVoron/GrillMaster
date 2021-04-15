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
import { PackingLogic } from "../../packingLogic/packingLogic";

let styles = {
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
  const [restItems, setRestItems] = useState({});

  const defaultJSON = {};

  const createHtmlElement = (elements, box) => {
    elements.forEach((element) => {
      let div = document.createElement("div");
      div.setAttribute(
        "style",
        `left:${element.x}px; top:${element.y}px; width:${element.width}px; height:${element.height}px; 
      background-color:#7AB956; border-radius:4px; position: absolute; box-sizing: border-box;
      border: 1px solid #FFFFFF;`
      );

      box.appendChild(div);
    });
  };

  const parseTextArea = () => {
    const area = document.getElementById("#area");

    try {
      return JSON.parse(area.value);
    } catch (error) {
      if (error instanceof SyntaxError) {
        alert("There was a syntax error. Please correct it and try again: ");
      } else {
        throw error;
      }
    }
  };

  const onClick = () => {


    let box = document.getElementById("#box");
    let coordinates = box.getBoundingClientRect();

    let resultBoxes = PackingLogic(
      items.grill.grillItems,
      items.grill.width,
      items.grill.height,
      coordinates.x,
      coordinates.y
    );

    createHtmlElement(resultBoxes.finalBoxes, box);
    setRestItems(resultBoxes.boxes);
    setViewRest(true);
  };

  return (
    <Grid item lg={12} xs={12}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item lg={12} xs={12}>
              <Button variant="contained" color="primary" onClick={onClick}>
                Sort items
              </Button>
            </Grid>
            <Grid item lg={8} xs={8}>
              <Box id="#box" style={styles.box} />
            </Grid>
            <Grid item lg={4} xs={4}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h6"
                    style={{ backgroundColor: "#F7F8FF " }}
                  >
                    Items out of grill
                  </Typography>
                  <OutItemsTable items={viewRest ? restItems : null} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item lg={5} xs={5} style={{ display: "grid" }}>
              <TextareaAutosize
                id="#area"
                fullWith
                rowsMin={30}
                placeholder="Enter your JSON"
                defaultValue={JSON.stringify(data, null, 2)}
              ></TextareaAutosize>
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
