import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createShippingAddress } from "@/actions/create-shipping-address";
import { CreateShippingAddressSchema } from "@/actions/create-shipping-address/schema";

import { getUseShippingAddressesQueryKey } from "../queries/use-shipping-addresses";

export const useCreateShippingAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateShippingAddressSchema) => {
            return await createShippingAddress(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getUseShippingAddressesQueryKey(),
            });
        },
    });
};

export const createShippingAddressMutationKey = () => ["createShippingAddress"];
