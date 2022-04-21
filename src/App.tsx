import { HashRouter, Switch, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import TV from "./Routes/TV";

function App() {
  return (
    <HashRouter>
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
    </HashRouter>
  );
}

export default App;
