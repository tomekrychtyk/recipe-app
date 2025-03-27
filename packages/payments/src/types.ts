import { z } from "zod";

export const BillingPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  priceId: z.string(),
  features: z.array(z.string()),
  interval: z.enum(["month", "year"]),
});

export type BillingPlan = z.infer<typeof BillingPlanSchema>;

export const BillingPlans: BillingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceId: "",
    features: ["Up to 10 recipes", "Basic meal planning", "Standard support"],
    interval: "month",
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    priceId: "price_pro_monthly", // You'll need to replace this with your actual Stripe price ID
    features: [
      "Unlimited recipes",
      "Advanced meal planning",
      "Priority support",
      "Custom categories",
      "Export recipes",
    ],
    interval: "month",
  },
  {
    id: "pro_yearly",
    name: "Pro (Yearly)",
    price: 99.99,
    priceId: "price_pro_yearly", // You'll need to replace this with your actual Stripe price ID
    features: [
      "Unlimited recipes",
      "Advanced meal planning",
      "Priority support",
      "Custom categories",
      "Export recipes",
      "2 months free",
    ],
    interval: "year",
  },
];

export const CheckoutSessionSchema = z.object({
  url: z.string().url(),
  sessionId: z.string(),
});

export type CheckoutSession = z.infer<typeof CheckoutSessionSchema>;
