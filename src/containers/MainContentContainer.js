import { connect } from "react-redux";

import { MainContent } from "../pages/MainContent";

const items = (state) => ({
  items: state.items,
});

export default connect(items, {})(
  MainContent
);
