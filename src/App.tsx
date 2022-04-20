import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import TV from "./Routes/TV";
import Header from "./Components/Header";

function App() {
  return (
    <Router>
      <Header />
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
    </Router>
  );
}

export default App;
