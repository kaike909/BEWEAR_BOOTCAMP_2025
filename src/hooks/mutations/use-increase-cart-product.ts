import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addProductToCart } from "@/actions/add-cart-product";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getIncreaseProductFromCartMutationKey = (cartItemId: string) =>
    ["add-cart-product", cartItemId] as const;

export const useIncreaseProductFromCart = (productVariantId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: getIncreaseProductFromCartMutationKey(productVariantId),
        mutationFn: () =>
            addProductToCart({
                productVariantId: productVariantId,
                quantity: 1,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
        },
    });
};
