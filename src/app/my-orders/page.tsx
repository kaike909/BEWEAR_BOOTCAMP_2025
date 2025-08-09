import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Header } from "@/components/common/header";
import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import Orders from "./components/orders";

const MyOrdersPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user.id) {
        redirect("/login");
    }
    const orders = await db.query.orderTable.findMany({
        where: eq(orderTable.userId, session.user.id),
        with: {
            shippingAddress: true,
            items: {
                with: {
                    productVariant: {
                        with: {
                            product: true,
                        },
                    },
                },
            },
        },
    });

    return (
        <>
            <Header />
            <div className="px-5 space-y-6">
                <p className="font-semibold text-2xl">Meus pedidos</p>
                <div className="space-y-4">
                    <Orders
                        orders={orders.map((order) => ({
                            id: order.id,
                            totalPriceInCents: order.totalPriceInCents,
                            status: order.status,
                            createdAt: order.createdAt,
                            items: order.items.map((item) => ({
                                id: item.id,
                                imageUrl: item.productVariant.imageUrl,
                                productName: item.productVariant.product.name,
                                productVariantName: item.productVariant.name,
                                priceInCents: item.productVariant.priceInCents,
                                quantity: item.quantity,
                            })),
                        }))}
                    />
                </div>
            </div>
        </>
    );
};

export default MyOrdersPage;
