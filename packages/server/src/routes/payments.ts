import express from "express";
import { handleWebhook } from "@food-recipe-app/payments";
import { prisma } from "../db";

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res.status(400).json({ error: "No signature" });
    }

    try {
      const result = await handleWebhook(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      // Handle the webhook result
      if (result.success && result.userId) {
        switch (result.event) {
          case "checkout.session.completed": {
            // Update user's subscription status
            await prisma.user.update({
              where: { id: result.userId },
              data: {
                subscriptionStatus: "active",
                subscriptionPlanId: result.planId,
                stripeCustomerId: result.userId,
              },
            });
            break;
          }
          case "customer.subscription.updated": {
            // Update subscription status
            await prisma.user.update({
              where: { id: result.userId },
              data: {
                subscriptionStatus: result.status,
              },
            });
            break;
          }
          case "customer.subscription.deleted": {
            // Update subscription status to cancelled
            await prisma.user.update({
              where: { id: result.userId },
              data: {
                subscriptionStatus: "cancelled",
              },
            });
            break;
          }
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({ error: "Webhook error" });
    }
  }
);

export default router;
