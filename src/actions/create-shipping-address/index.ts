"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
    CreateShippingAddressSchema,
    createShippingAddressSchema,
} from "./schema";

export const createShippingAddress = async (
    data: CreateShippingAddressSchema
) => {
    createShippingAddressSchema.parse(data);

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const [shippingAddress] = await db
        .insert(shippingAddressTable)
        .values({
            userId: session.user.id,
            recipientName: data.fullName,
            street: data.address,
            number: data.number,
            complement: data.complement || null,
            neighborhood: data.neighborhood,
            zipcode: data.zipCode,
            city: data.city,
            state: data.state,
            country: "Brasil",
            email: data.email,
            phone: data.phone,
            cpfOrCnpj: data.cpf,
        })
        .returning();

    return shippingAddress;
};
