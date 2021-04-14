const initialState = {
  "grill": {
    "width": 500,
    "height": 200,
    "grillItems": [{
      "width": 50,
      "height": 30,
      "count": 15,
      "title": "Steak"
    }, {
      "width": 140,
      "height": 140,
      "count": 2,
      "title": "Sausage"
    }, {
      "width": 130,
      "height": 60,
      "count": 4,
      "title": "Tomato"
    }, {
      "width": 20,
      "height": 10,
      "count": 37,
      "title": "Veal"
    }]
  }
}

export default function cvsReducer(state = initialState, action) {
  switch (action.type) {
  // some cases
    default:
      return state;
  }
}
