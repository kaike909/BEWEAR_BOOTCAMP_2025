import { useMutation, useQueryClient } from "@tanstack/react-query";

import { decreaseProductFromCart } from "@/actions/decrease-cart-product-quantity";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getDecreaseProductFromCartMutationKey = (cartItemId: string) =>
    ["remove-cart-product", cartItemId] as const;

export const useDecreaseProductFromCart = (cartItemId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: getDecreaseProductFromCartMutationKey(cartItemId),
        mutationFn: () => decreaseProductFromCart({ cartItemId: cartItemId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
        },
    });
};
