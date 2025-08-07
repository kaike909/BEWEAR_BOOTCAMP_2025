import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import { decreaseProductFromCart } from "@/actions/decrease-cart-product-quantity";
import { removeProductFromCart } from "@/actions/remove-cart-product";
import { formatCents } from "@/helpers/money";

import { Button } from "../ui/button";

interface CartItemProps {
    id: string;
    productName: string;
    productVariantId: string;
    productVariantName: string;
    productVariantImageUrl: string;
    productVariantPriceInCents: number;
    quantity: number;
}

const CardItem = ({
    id,
    productName,
    productVariantId,
    productVariantName,
    productVariantImageUrl,
    productVariantPriceInCents,
    quantity,
}: CartItemProps) => {
    const queryClient = useQueryClient();
    const removeProductFromCartMutation = useMutation({
        mutationKey: ["remove-cart-product"],
        mutationFn: () => removeProductFromCart({ cartItemId: id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });

    const decreaseProductFromCartMutation = useMutation({
        mutationKey: ["decrease-cart-product-quantity"],
        mutationFn: () => decreaseProductFromCart({ cartItemId: id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });

    const increaseProductFromCartMutation = useMutation({
        mutationKey: ["add-cart-product"],
        mutationFn: () => addProductToCart({ productVariantId, quantity: 1 }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });

    const handleDeleteClick = () => {
        removeProductFromCartMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success("Produto removido do carrinho.");
            },
            onError: () => {
                toast.error("Erro ao remover produto do carrinho.");
            },
        });
    };

    const handleDecreaseClick = () => {
        decreaseProductFromCartMutation.mutate(undefined, {
            onSuccess: () => {
                if (quantity > 1) {
                    toast.success("Quantidade do produto diminuida.");
                }
            },
            onError: () => {
                toast.error("Erro ao diminuir produto do carrinho.");
            },
        });
    };

    const handleIncreaseClick = () => {
        increaseProductFromCartMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success("Quantidade do produto aumentada.");
            },
            onError: () => {
                toast.error("Erro ao aumentar produto do carrinho.");
            },
        });
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Image
                    src={productVariantImageUrl}
                    alt={productVariantName}
                    width={78}
                    height={78}
                    className="rounded-lg"
                />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">{productName}</p>
                <p className="text-muted-foreground text-xs font-medium">
                    {productVariantName}
                </p>
                <div className="flex p-2 items-center w-[100px] border justify-between rounded-md">
                    <Button
                        className="w-4 h-4"
                        variant="ghost"
                        onClick={handleDecreaseClick}
                    >
                        <MinusIcon size={12} />
                    </Button>
                    <p className="text-xs font-medium">{quantity}</p>
                    <Button
                        className="w-4 h-4"
                        variant="ghost"
                        onClick={handleIncreaseClick}
                    >
                        <PlusIcon size={12} />
                    </Button>
                </div>
            </div>
            <div className="flex flex-col justify-center items-end gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-2xl"
                    onClick={handleDeleteClick}
                >
                    <TrashIcon className="text-red-600" />
                </Button>
                <p className="text-sm font-bold">
                    {formatCents(productVariantPriceInCents)}
                </p>
            </div>
        </div>
    );
};

export default CardItem;
