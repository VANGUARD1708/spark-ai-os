import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";

import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

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
      TOOLTIP WORKS
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}