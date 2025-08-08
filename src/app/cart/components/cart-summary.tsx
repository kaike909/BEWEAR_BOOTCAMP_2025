import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCents } from "@/helpers/money";

interface CartSummaryProps {
    subtotalInCents: number;
    totalInCents: number;
    products: Array<{
        id: string;
        productName: string;
        variantName: string;
        quantity: number;
        priceInCents: number;
        imageUrl: string;
    }>;
}

const CartSummary = ({
    subtotalInCents,
    totalInCents,
    products,
}: CartSummaryProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between">
                    <p className="text-sm">Subtotal</p>
                    <p className="text-sm text-muted-foreground font-medium">
                        {formatCents(subtotalInCents)}
                    </p>
                </div>
                <div className="flex justify-between">
                    <p className="text-sm">Transporte e Manuseio</p>
                    <p className="text-sm text-muted-foreground font-medium">
                        GRÁTIS
                    </p>
                </div>
                <div className="flex justify-between">
                    <p className="text-sm">Taxa Estimada</p>
                    <p className="text-sm text-muted-foreground font-medium">
                        -
                    </p>
                </div>
                <div className="flex justify-between">
                    <p className="text-sm">Total</p>
                    <p className="font-semibold">{formatCents(totalInCents)}</p>
                </div>
                <div className="py-3">
                    <Separator />
                </div>
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <Image
                                src={product.imageUrl}
                                alt={product.variantName}
                                width={78}
                                height={78}
                                className="rounded-lg"
                            />
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-semibold">
                                    {product.productName}
                                </p>
                                <p className="text-muted-foreground text-xs font-medium">
                                    {product.variantName}
                                </p>
                                <p className="text-xs font-medium">
                                    {product.quantity}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-end gap-2">
                            <p className="text-sm font-bold">
                                {formatCents(product.priceInCents)}
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default CartSummary;
