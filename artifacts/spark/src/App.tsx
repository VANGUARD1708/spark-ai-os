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
import SignUp from "@/pages/sign-up";
import SuccessPage from "@/pages/success"; // NEW
import Settings from "@/pages/settings";
import Insights from "@/pages/insights";
import Storefronts from "@/pages/storefronts";
import ContentPlanner from "@/pages/content-planner";
import Performance from "@/pages/performance";
import Compose from "@/pages/compose";
import Schedule from "@/pages/schedule";
import Distribute from "@/pages/distribute";
import ABTesting from "@/pages/ab-testing";
import Orders from "@/pages/orders";
import Assets from "@/pages/assets";
import Files from "@/pages/files";
import Agents from "@/pages/agents";
import CreatorDNA from "@/pages/creator-dna";
import AudienceMap from "@/pages/audience-map";
import AttentionMap from "@/pages/attention-map";
import GrowthEvolution from "@/pages/growth-evolution";
import AdGenerator from "@/pages/ad-generator";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 15000),
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

            {/* SIGN-UP */}
            <Route path="/sign-up" component={SignUp} />

            {/* STRIPE SUCCESS PAGE */}
            <Route path="/success" component={SuccessPage} />

            <Route path="/settings" component={Settings} />
            <Route path="/insights" component={Insights} />
            <Route path="/storefronts" component={Storefronts} />
            <Route path="/content-planner" component={ContentPlanner} />
            <Route path="/performance" component={Performance} />
            <Route path="/compose" component={Compose} />
            <Route path="/schedule" component={Schedule} />
            <Route path="/distribute" component={Distribute} />
            <Route path="/ab-testing" component={ABTesting} />
            <Route path="/orders" component={Orders} />
            <Route path="/assets" component={Assets} />
            <Route path="/files" component={Files} />
            <Route path="/agents" component={Agents} />
            <Route path="/creator-dna" component={CreatorDNA} />
            <Route path="/audience-map" component={AudienceMap} />
            <Route path="/attention-map" component={AttentionMap} />
            <Route path="/growth-evolution" component={GrowthEvolution} />
            <Route path="/ad-generator" component={AdGenerator} />

            <Route component={NotFound} />
          </Switch>
        </Router>
      </OnboardingProvider>
    </QueryClientProvider>
  );
}