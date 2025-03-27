import express from "express";
import { PrismaClient } from "@prisma/client";
import { handleWebhook } from "@food-recipe-app/payments";

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature || Array.isArray(signature)) {
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
            // Create or update subscription
            await prisma.subscription.upsert({
              where: { userId: result.userId },
              create: {
                userId: result.userId,
                status: "active",
                planId: result.planId!,
                stripeCustomerId: result.userId,
              },
              update: {
                status: "active",
                planId: result.planId!,
                stripeCustomerId: result.userId,
              },
            });
            break;
          }
          case "customer.subscription.updated": {
            // Update subscription status
            await prisma.subscription.update({
              where: { userId: result.userId },
              data: {
                status: result.status,
              },
            });
            break;
          }
          case "customer.subscription.deleted": {
            // Update subscription status to cancelled
            await prisma.subscription.update({
              where: { userId: result.userId },
              data: {
                status: "cancelled",
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
