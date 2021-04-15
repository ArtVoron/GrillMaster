import { Redirect, Route, Switch } from "react-router-dom";

import { Container, Grid } from "@material-ui/core";

import { Header } from "./components/Header";
import { Routers } from "./constants/Routers";
import MainContentContainer from "./containers/MainContentContainer";
import "./App.css";

function App() {
  return (
    <Container maxWidth="lg" style={{ marginTop: 24}}>
      <Grid container spacing={3}>
        <Header />
        <Switch>
          <Route path={Routers.MAIN_PAGE} exact component={MainContentContainer} />
          {/* some routers */}
          <Redirect to={Routers.MAIN_PAGE} />
        </Switch>
      </Grid>
    </Container>
  );
}

export default App;