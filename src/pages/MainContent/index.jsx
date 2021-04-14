import { useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";

import { OutItemsTable } from "../../components/OutItemsTable";

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
  const [grillItems, setProducts] = useState(items.grill.grillItems);
  const [insertedItems, setInsertedItems] = useState({ 1: [] });
  const [viewRest, setViewRest] = useState(false);
  const [currentParams, setCurrentParams] = useState({
    restOfHeight: items.grill.height,
    restOfWith: items.grill.width,
    row: 1,
    step: 0,
  });

  let checkFigureFucn;

  const getSuitableSizeOfItems = (grullItemsArray, restOfWidth) => {
    let sortArray = grullItemsArray.filter((arr) => arr.width <= restOfWidth);
    const nextFigure = sortArray.find(
      (it) =>
        Math.abs(it.width - restOfWidth) ===
        Math.min(...sortArray.map((it) => Math.abs(restOfWidth - it.width)))
    );
    checkFigureFucn(nextFigure);
    return nextFigure;
  };

  const calculateTotalHeight = (object) => {
    let totalHeight = 0;
    Object.entries(object).forEach(([key, value]) => {
      totalHeight = totalHeight + value.find((i) => Math.max(i.height)).height;
    });
    return totalHeight < items.grill.height ? totalHeight : items.grill.height;
  };

  checkFigureFucn = function (nextFigure) {
    if (nextFigure) {
      let correctedParams = {
        restOfHeight: currentParams.restOfHeight,
        restOfWith: currentParams.restOfWith - nextFigure.width,
        row: currentParams.row,
        step: currentParams.step + 1,
      };

      setInsertedItems((insertedItem) => {
        let obj = { ...insertedItem };
        obj[currentParams.row] = [
          ...obj[currentParams.row],
          Object.assign({}, nextFigure),
        ];
        return obj;
      });
      setCurrentParams(correctedParams);
      return nextFigure;
    } else {
      if (currentParams.step === 0) {
        alert("No solutions to sort!");
      } else {
        if (items.grill.height <= calculateTotalHeight(insertedItems)) {
          setViewRest(true);
          alert("The END!");
        } else {
          let correctedParams = {
            restOfHeight:
              items.grill.height - calculateTotalHeight(insertedItems),
            restOfWith: items.grill.width,
            row: currentParams.row + 1,
            step: 0,
          };
          setCurrentParams(correctedParams);
          setInsertedItems((insert) => {
            let obj = { ...insert };
            obj[currentParams.row + 1] = [];
            return obj;
          });
          alert("Next row!");
        }
      }
    }
  };

  const changeCounterOfItem = (grillItemsArray, figure) => {
    for (let i = 0; i < grillItemsArray.length; i++) {
      if (grillItemsArray[i].title === figure.title) {
        if (grillItemsArray[i].count > 1) {
          debugger;
          grillItemsArray[i].count--;
        } else {
          debugger;
          grillItemsArray = grillItemsArray.filter((product) => product.title !== figure.title);
        }
      }
    }
    return grillItemsArray;
  };

  const createHtmlElement = (element) => {
    let box = document.getElementById("#box");
    let coordinates = box.getBoundingClientRect();
    let div = document.createElement("div");
    div.setAttribute(
      "style",
      `left:${
        coordinates.left + (coordinates.width - currentParams.restOfWith)
      }px; top:${
        coordinates.top + (coordinates.height - currentParams.restOfHeight)
      }px; width:${element.width}px; height:${
        element.height
      }px; background-color:green; border-radius:4px; position: absolute`
    );
    box.appendChild(div);
  };

  const onClick = () => {
      let suitableObj = getSuitableSizeOfItems(
        grillItems,
        currentParams.restOfWith
      );
      if (suitableObj) {
        createHtmlElement(suitableObj);
        let correctedProducts = changeCounterOfItem(grillItems, suitableObj);
        setProducts(correctedProducts);
      }
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
                  <OutItemsTable items={viewRest ? grillItems : null} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

MainContent.propTypes = {
  items: PropTypes.arrayOf(Object).isRequired,
};
