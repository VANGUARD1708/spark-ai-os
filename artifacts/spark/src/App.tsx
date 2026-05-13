import { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser } from "@clerk/react";
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
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "hsl(82 100% 55%)",
    colorForeground: "hsl(0 0% 98%)",
    colorMutedForeground: "hsl(0 0% 55%)",
    colorDanger: "hsl(0 72% 51%)",
    colorBackground: "hsl(0 0% 8%)",
    colorInput: "hsl(0 0% 12%)",
    colorInputForeground: "hsl(0 0% 98%)",
    colorNeutral: "hsl(0 0% 20%)",
    fontFamily: "inherit",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[hsl(0_0%_8%)] rounded-2xl w-[440px] max-w-full overflow-hidden border border-white/10",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-white font-bold",
    headerSubtitle: "text-white/60",
    socialButtonsBlockButtonText: "text-white/80",
    formFieldLabel: "text-white/70 text-sm",
    footerActionLink: "text-[hsl(82_100%_55%)] hover:text-[hsl(82_100%_65%)]",
    footerActionText: "text-white/50",
    dividerText: "text-white/40",
    identityPreviewEditButton: "text-[hsl(82_100%_55%)]",
    formFieldSuccessText: "text-green-400",
    alertText: "text-white/80",
    logoBox: "mb-2",
    logoImage: "h-8 w-auto",
    socialButtonsBlockButton: "border border-white/10 bg-white/5 hover:bg-white/10 text-white",
    formButtonPrimary: "bg-[hsl(82_100%_55%)] text-black font-bold hover:bg-[hsl(82_100%_50%)]",
    formFieldInput: "bg-[hsl(0_0%_12%)] border-white/10 text-white",
    footerAction: "bg-transparent",
    dividerLine: "bg-white/10",
    alert: "bg-red-500/10 border border-red-500/20",
    otpCodeFieldInput: "border-white/20 bg-[hsl(0_0%_12%)] text-white",
    formFieldRow: "gap-2",
    main: "gap-4",
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
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
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
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
      localization={{
        signIn: {
          start: {
            title: "Welcome back to SPARK",
            subtitle: "Sign in to your AI business OS",
          },
        },
        signUp: {
          start: {
            title: "Start building with SPARK",
            subtitle: "Create your account — free forever",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
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
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
