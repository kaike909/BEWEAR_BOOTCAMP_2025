import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateCartShippingAddress } from "@/actions/update-cart-shipping-address";
import { getUseCartQueryKey } from "@/hooks/queries/use-cart";

export const updateCartShippingAddressMutationKey = () => [
    "update-cart-shipping-address",
];

export const useUpdateCartShippingAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: updateCartShippingAddressMutationKey(),
        mutationFn: updateCartShippingAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
            toast.success("Endereço de entrega atualizado com sucesso!");
        },
        onError: (error) => {
            toast.error(
                "Erro ao atualizar endereço de entrega. Tente novamente."
            );
            console.error("Error updating cart shipping address:", error);
        },
    });
};
