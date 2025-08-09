"use client";

import CartSummary from "@/app/cart/components/cart-summary";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { orderTable } from "@/db/schema";

interface OrderProps {
    orders: Array<{
        id: string;
        totalPriceInCents: number;
        status: (typeof orderTable.$inferSelect)["status"];
        createdAt: Date;
        items: Array<{
            id: string;
            imageUrl: string;
            productName: string;
            productVariantName: string;
            priceInCents: number;
            quantity: number;
        }>;
    }>;
}

const Orders = ({ orders }: OrderProps) => {
    return (
        <>
            {orders.map((order) => (
                <Card key={order.id} className="py-2">
                    <CardContent>
                        <Accordion
                            defaultValue={order.id}
                            className="w-full"
                            type="single"
                            collapsible
                        >
                            <AccordionItem value={order.id}>
                                <AccordionTrigger className="flex flex-row justify-between">
                                    <div>
                                        {`Pedido feito em: ${new Date(order.createdAt).toLocaleDateString("pt-BR")} às ${new Date(
                                            order.createdAt
                                        ).toLocaleTimeString("pt-BR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}`}
                                    </div>
                                    <div>
                                        {order.status === "paid" && (
                                            <Badge>Pago</Badge>
                                        )}
                                        {order.status === "pending" && (
                                            <Badge variant="outline">
                                                Aguardando
                                            </Badge>
                                        )}
                                        {order.status === "canceled" && (
                                            <Badge variant="destructive">
                                                Pagamento Pendente
                                            </Badge>
                                        )}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <CartSummary
                                        subtotalInCents={
                                            order.totalPriceInCents
                                        }
                                        totalInCents={order.totalPriceInCents}
                                        products={order.items.map((item) => ({
                                            id: item.id,
                                            imageUrl: item.imageUrl,
                                            productName: item.productName,
                                            variantName:
                                                item.productVariantName,
                                            priceInCents: item.priceInCents,
                                            quantity: item.quantity,
                                        }))}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            ))}
        </>
    );
};

export default Orders;
