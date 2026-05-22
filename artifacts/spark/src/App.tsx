import { Route, Switch } from "wouter";

function Home() {
  return (
    <div
      style={{
        background: "black",
        color: "lime",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "40px",
      }}
    >
      HOME PAGE
    </div>
  );
}

function About() {
  return (
    <div
      style={{
        background: "black",
        color: "cyan",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "40px",
      }}
    >
      ABOUT PAGE
    </div>
  );
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
    </Switch>
  );
}