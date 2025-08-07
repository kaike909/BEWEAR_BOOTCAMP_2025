import { ShoppingBagIcon, ShoppingBasketIcon } from "lucide-react";

import { formatCents } from "@/helpers/money";
import { useCart } from "@/hooks/queries/use-cart";

import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet";
import CartItem from "./cart-item";

const Cart = () => {
    const { data: cart } = useCart();
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <ShoppingBasketIcon />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        <div className="flex items-start gap-4">
                            <ShoppingBagIcon width={20} height={20} />
                            Sacola
                        </div>
                    </SheetTitle>
                </SheetHeader>
                <div className="flex h-full flex-col px-5 pb-5">
                    <div className="flex h-full max-h-full flex-col overflow-hidden">
                        <ScrollArea className="h-full">
                            <div className="flex h-full flex-col gap-8">
                                {cart?.items.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        id={item.id}
                                        productName={
                                            item.productVariant.product.name
                                        }
                                        productVariantId={
                                            item.productVariant.id
                                        }
                                        productVariantName={
                                            item.productVariant.name
                                        }
                                        productVariantImageUrl={
                                            item.productVariant.imageUrl
                                        }
                                        quantity={item.quantity}
                                        productVariantPriceInCents={
                                            item.productVariant.priceInCents
                                        }
                                    />
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    {cart?.items && cart?.items.length > 0 && (
                        <div className="flex flex-col gap-4">
                            <Separator />

                            <div className="flex items-center justify-between text-xs font-medium">
                                <p>Subtotal</p>
                                <p>
                                    {formatCents(cart?.totalPriceInCents ?? 0)}
                                </p>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between text-xs font-medium">
                                <p>Entrega</p>
                                <p>GRÁTIS</p>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between text-xs font-medium">
                                <p>Total</p>
                                <p>
                                    {formatCents(cart?.totalPriceInCents ?? 0)}
                                </p>
                            </div>

                            <Button className="mt-5 rounded-full">
                                Finalizar compra
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default Cart;
