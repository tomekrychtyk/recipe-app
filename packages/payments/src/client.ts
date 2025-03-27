import Stripe from "stripe";
import { BillingPlan, CheckoutSession } from "./types";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export async function createCheckoutSession(
  userId: string,
  plan: BillingPlan,
  successUrl: string,
  cancelUrl: string
): Promise<CheckoutSession> {
  if (plan.price === 0) {
    throw new Error("Cannot create checkout session for free plan");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    metadata: {
      planId: plan.id,
      interval: plan.interval,
    },
  });

  return {
    url: session.url!,
    sessionId: session.id,
  };
}

export async function handleWebhook(
  payload: string,
  signature: string,
  webhookSecret: string
) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const planId = session.metadata?.planId;
        const interval = session.metadata?.interval;

        // Here you would typically:
        // 1. Update the user's subscription status in your database
        // 2. Grant access to premium features
        // 3. Send a welcome email
        // 4. etc.

        return {
          success: true,
          userId,
          planId,
          interval,
        };
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        // Here you would typically:
        // 1. Update the user's subscription status in your database
        // 2. Revoke or update access to premium features
        // 3. Send a notification email
        // 4. etc.

        return {
          success: true,
          userId,
          status: subscription.status,
        };
      }

      default:
        return {
          success: true,
          event: event.type,
        };
    }
  } catch (error) {
    console.error("Webhook error:", error);
    throw error;
  }
}
