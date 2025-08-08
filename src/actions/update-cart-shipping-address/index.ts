"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
    UpdateCartShippingAddressSchema,
    updateCartShippingAddressSchema,
} from "./schema";

export const updateCartShippingAddress = async (
    data: UpdateCartShippingAddressSchema
) => {
    updateCartShippingAddressSchema.parse(data);
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const shippingAddress = await db.query.shippingAddressTable.findFirst({
        where: (shippingAddress, { eq }) =>
            eq(shippingAddress.id, data.shippingAddressId) &&
            eq(shippingAddress.userId, session.user.id),
    });

    if (!shippingAddress) {
        throw new Error(
            "Shipping address not found or does not belong to user."
        );
    }

    const cart = await db.query.cartTable.findFirst({
        where: (cart, { eq }) => eq(cart.userId, session.user.id),
    });

    if (!cart) {
        throw new Error("Cart not found.");
    }

    await db
        .update(cartTable)
        .set({
            shipingAddressId: data.shippingAddressId,
        })
        .where(eq(cartTable.id, cart.id));
};
