import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage, TokenPage } from "../pages/index";
import MainLayout from "../layouts/MainLayout";
import useWeb3 from "../hooks/useWeb3";

function App() {
  const { web3 } = useWeb3();

  if (!web3) return null;

  return (
    <Router>
      <Switch>
        <MainLayout>
          <Route path="/" exact={true}>
            <HomePage />
          </Route>
          <Route path="/token/:tokenAddress">
            <TokenPage />
          </Route>
        </MainLayout>
      </Switch>
    </Router>
  );
}

export default App;
