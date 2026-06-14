import { Request, Response } from "express";
import { stripe } from "../../lib/stripe";
import { logger } from "../../lib/logger";

export async function createCheckoutSessionHandler(
  req: Request,
  res: Response,
) {
  try {
    const { plan = "monthly" } = req.body;

    const priceId =
      plan === "yearly"
        ? process.env.STRIPE_YEARLY_PRICE_ID
        : process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!priceId) {
      logger.error("Missing Stripe price ID");

      return res.status(500).json({
        error: "Stripe price ID not configured",
      });
    }

    if (!process.env.APP_URL) {
      logger.error("Missing APP_URL");

      return res.status(500).json({
        error: "APP_URL not configured",
      });
    }

    logger.info({
      plan,
      priceId,
      appUrl: process.env.APP_URL,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      payment_method_types: ["card"],

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      billing_address_collection: "auto",

      allow_promotion_codes: true,

      success_url:
        `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.APP_URL}/pricing`,

      metadata: {
        plan,
        source: "spark",
      },
    });

    if (!session.url) {
      logger.error("Stripe session URL not generated");

      return res.status(500).json({
        error: "Checkout URL not generated",
      });
    }

    logger.info({
      checkoutSessionId: session.id,
      checkoutUrl: session.url,
      plan,
    });

    return res.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error("STRIPE ERROR:", error);

    logger.error({
      message: error?.message,
      type: error?.type,
      code: error?.code,
      raw: error,
    });

    return res.status(500).json({
      error: error?.message || "Unable to create checkout session",
      type: error?.type,
      code: error?.code,
    });
  }
}