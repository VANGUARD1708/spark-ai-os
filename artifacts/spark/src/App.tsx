import { Router, Route, Switch } from "wouter";
import Dashboard from "@/pages/dashboard";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Dashboard} />
      </Switch>
    </Router>
  );
}