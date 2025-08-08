import { z } from "zod";

export const createShippingAddressSchema = z.object({
    email: z.string().email("E-mail inválido"),
    fullName: z.string().min(1, "Nome completo é obrigatório"),
    cpf: z.string().min(11, "CPF deve ter 11 dígitos"),
    phone: z.string().min(10, "Celular deve ter pelo menos 10 dígitos"),
    zipCode: z.string().min(8, "CEP deve ter 8 dígitos"),
    address: z.string().min(1, "Endereço é obrigatório"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(1, "Estado é obrigatório"),
});

export type CreateShippingAddressSchema = z.infer<
    typeof createShippingAddressSchema
>;
