import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
import { formatAddress } from "../helpers/address";

const ConfirmationPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user.id) {
        redirect("/");
    }

    const cart = await db.query.cartTable.findFirst({
        where: (cart, { eq }) => eq(cart.userId, session.user.id),
        orderBy: (cart) => cart.id,
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

    if (!cart || cart?.items.length === 0) {
        redirect("/");
    }

    if (!cart.shippingAddress) {
        redirect("/cart/identification");
    }

    const cartTotalInCents = cart.items.reduce(
        (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
        0
    );
    return (
        <>
            <Header />
            <div className="space-y-6 px-5">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <p>Confirme local de entrega</p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Card>
                            <CardContent>
                                <p className="text-sm font-semibold">
                                    {formatAddress(cart.shippingAddress!)}
                                </p>
                            </CardContent>
                        </Card>
                        <Button className="rounded-full w-full" size="lg">
                            Finalizar compra
                        </Button>
                    </CardContent>
                </Card>
                <CartSummary
                    subtotalInCents={cartTotalInCents}
                    totalInCents={cartTotalInCents}
                    products={cart.items.map((item) => ({
                        id: item.productVariant.id,
                        productName: item.productVariant.product.name,
                        variantName: item.productVariant.name,
                        quantity: item.quantity,
                        priceInCents: item.productVariant.priceInCents,
                        imageUrl: item.productVariant.imageUrl,
                    }))}
                />
            </div>
            <div className="mt-12">
                <Footer />
            </div>
        </>
    );
};

export default ConfirmationPage;
