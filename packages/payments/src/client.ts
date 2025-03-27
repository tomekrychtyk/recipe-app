import Stripe from "stripe";
import { BillingPlan, CheckoutSession, WebhookResult } from "./types";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
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
): Promise<WebhookResult> {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        return {
          success: true,
          event: "checkout.session.completed",
          userId: session.client_reference_id || undefined,
          planId: session.metadata?.planId || undefined,
        };
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        return {
          success: true,
          event: "customer.subscription.updated",
          userId: subscription.metadata?.userId || undefined,
          status: subscription.status,
        };
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        return {
          success: true,
          event: "customer.subscription.deleted",
          userId: subscription.metadata?.userId || undefined,
          status: subscription.status,
        };
      }
      default:
        return { success: true };
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return { success: false };
  }
}
