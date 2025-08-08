import { useMutation } from "@tanstack/react-query";

import { createShippingAddress } from "@/actions/create-shipping-address";
import { CreateShippingAddressSchema } from "@/actions/create-shipping-address/schema";

export const useCreateShippingAddress = () => {
    return useMutation({
        mutationFn: async (data: CreateShippingAddressSchema) => {
            return await createShippingAddress(data);
        },
    });
};

export const createShippingAddressMutationKey = () => ["createShippingAddress"];
