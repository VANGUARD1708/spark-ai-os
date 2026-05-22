import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/react";
import { Route, Switch } from "wouter";

import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

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
      CLERK WORKS
    </div>
  );
}

export default function App() {
  if (!clerkKey) {
    return (
      <div
        style={{
          background: "black",
          color: "red",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
        }}
      >
        Missing Clerk Key
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkKey}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Switch>
            <Route path="/" component={Home} />
          </Switch>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}