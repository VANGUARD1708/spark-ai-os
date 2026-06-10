import { Router, Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OnboardingProvider } from "@/components/onboarding-context";

import Dashboard from "@/pages/dashboard";
import Trending from "@/pages/trending";
import Winning from "@/pages/winning";
import Ideas from "@/pages/ideas";
import BrandBuilder from "@/pages/brand-builder";
import Bundle from "@/pages/bundle";
import DigitalProduct from "@/pages/digital-product";
import ViralHooks from "@/pages/viral-hooks";
import Scripts from "@/pages/scripts";
import Campaigns from "@/pages/campaigns";
import Publish from "@/pages/publish";
import Analytics from "@/pages/analytics";
import Command from "@/pages/command";
import BusinessProfile from "@/pages/business-profile";
import Pricing from "@/pages/pricing";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OnboardingProvider>
        <Router>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/trending" component={Trending} />
            <Route path="/winning" component={Winning} />
            <Route path="/ideas" component={Ideas} />
            <Route path="/brand-builder" component={BrandBuilder} />
            <Route path="/bundle" component={Bundle} />
            <Route path="/digital-product" component={DigitalProduct} />
            <Route path="/viral-hooks" component={ViralHooks} />
            <Route path="/scripts" component={Scripts} />
            <Route path="/campaigns" component={Campaigns} />
            <Route path="/publish" component={Publish} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/command" component={Command} />
            <Route path="/business-profile" component={BusinessProfile} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </OnboardingProvider>
    </QueryClientProvider>
  );
}
