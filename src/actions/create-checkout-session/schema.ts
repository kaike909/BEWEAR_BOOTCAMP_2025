import z from "zod";

export const createCheckoutSessionSchema = z.object({
    orderId: z.uuid(),
});

export type CreateCheckoutSession = z.infer<typeof createCheckoutSessionSchema>;
