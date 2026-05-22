import { useEffect, useRef } from "react";
import {
  Switch,
  Route,
  Router as WouterRouter,
  useLocation,
} from "wouter";

import { useHashLocation } from "wouter/use-hash-location";

import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, SignIn, SignUp, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Ideas from "@/pages/ideas";
import Bundle from "@/pages/bundle";
import Scripts from "@/pages/scripts";
import Assets from "@/pages/assets";
import Trending from "@/pages/trending";
import Winning from "@/pages/winning";
import DigitalProduct from "@/pages/digital-product";
import BrandBuilder from "@/pages/brand-builder";
import Storefronts from "@/pages/storefronts";
import ProductPages from "@/pages/product-pages";
import Orders from "@/pages/orders";
import ContentPlanner from "@/pages/content-planner";
import ViralHooks from "@/pages/viral-hooks";
import Analytics from "@/pages/analytics";
import ABTesting from "@/pages/ab-testing";
import Insights from "@/pages/insights";
import SavedBundles from "@/pages/saved-bundles";
import Files from "@/pages/files";
import Distribute from "@/pages/distribute";
import Compose from "@/pages/compose";
import Publish from "@/pages/publish";
import Schedule from "@/pages/schedule";
import Performance from "@/pages/performance";
import Settings from "@/pages/settings";
import Pricing from "@/pages/pricing";
import Trust from "@/pages/trust";
import Campaigns from "@/pages/campaigns";
import Command from "@/pages/command";
import Agents from "@/pages/agents";
import Onboarding from "@/pages/onboarding";
import BusinessProfile from "@/pages/business-profile";

const queryClient = new QueryClient();

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;

      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        qc.clear();
      }

      prevUserIdRef.current = userId;
    });

    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
      />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
      />
    </div>
  );
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />

      <Route path="/" component={Dashboard} />
      <Route path="/ideas" component={Ideas} />
      <Route path="/bundle" component={Bundle} />
      <Route path="/scripts" component={Scripts} />
      <Route path="/assets" component={Assets} />
      <Route path="/saved" component={Assets} />
      <Route path="/trending" component={Trending} />
      <Route path="/winning" component={Winning} />
      <Route path="/digital-product" component={DigitalProduct} />
      <Route path="/brand-builder" component={BrandBuilder} />
      <Route path="/storefronts" component={Storefronts} />
      <Route path="/product-pages" component={ProductPages} />
      <Route path="/orders" component={Orders} />
      <Route path="/content-planner" component={ContentPlanner} />
      <Route path="/viral-hooks" component={ViralHooks} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/ab-testing" component={ABTesting} />
      <Route path="/insights" component={Insights} />
      <Route path="/saved-bundles" component={SavedBundles} />
      <Route path="/files" component={Files} />
      <Route path="/distribute" component={Distribute} />
      <Route path="/compose" component={Compose} />
      <Route path="/publish" component={Publish} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/performance" component={Performance} />
      <Route path="/settings" component={Settings} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/trust" component={Trust} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/command" component={Command} />
      <Route path="/agents" component={Agents} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/business-profile" component={BusinessProfile} />

      <Route component={NotFound} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey!}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) =>
        setLocation(stripBase(to), { replace: true })
      }
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />

        <TooltipProvider>
          <AppRoutes />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter hook={useHashLocation} base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;