import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import TV from "./Routes/TV";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL + "/"}>
      <Switch>
        <Route path="/tv">
          <TV />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path={["/", "/movies/:movieId", "/tv/:tvId"]}>
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
