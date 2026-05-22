import { Router, Route, Switch } from "wouter";

function Home() {
  return (
    <div className="min-h-screen bg-black text-lime-500 flex items-center justify-center text-5xl">
      WOUTER WORKS
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}