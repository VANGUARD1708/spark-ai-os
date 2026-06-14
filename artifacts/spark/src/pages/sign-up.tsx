import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown } from "lucide-react";
import { useState } from "react";

export default function SignUp() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (plan: "monthly" | "yearly" = "monthly") => {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/spark/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <Crown className="h-12 w-12 mx-auto text-yellow-400" />

          <h1 className="text-3xl font-bold">
            Upgrade to SPARK Pro
          </h1>

          <p className="text-muted-foreground">
            Unlock unlimited AI tools, analytics,
            storefronts, automation, and premium features.
          </p>

          <div className="space-y-3">
            <Button
              className="w-full h-12 font-bold"
              disabled={loading}
              onClick={() => handleCheckout("monthly")}
            >
              {loading ? "Redirecting..." : "Subscribe — $29/month"}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => handleCheckout("yearly")}
            >
              {loading ? "Redirecting..." : "Subscribe — $197/year"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Secure checkout • Cancel anytime • Powered by Stripe
          </p>
        </CardContent>
      </Card>
    </div>
  );
}