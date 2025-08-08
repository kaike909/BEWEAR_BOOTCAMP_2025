"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { getCart } from "@/actions/get-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { shippingAddressTable } from "@/db/schema";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";
import { useUpdateCartShippingAddress } from "@/hooks/mutations/use-update-cart-shipping-address";
import { useShippingAddresses } from "@/hooks/queries/use-shipping-addresses";

const addressFormSchema = z.object({
    email: z.email("E-mail inválido"),
    fullName: z.string().min(1, "Nome completo é obrigatório"),
    cpf: z
        .string()
        .min(11, "CPF deve ter 11 dígitos")
        .max(11, "CPF deve ter 11 dígitos"),
    phone: z.string().min(10, "Celular deve ter pelo menos 10 dígitos"),
    zipCode: z.string().min(8, "CEP deve ter 8 dígitos"),
    address: z.string().min(1, "Endereço é obrigatório"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(1, "Estado é obrigatório"),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

const formatCep = (cep: string) => {
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
};

interface AddressessProps {
    shippingAddresses: (typeof shippingAddressTable.$inferSelect)[];
    defaultShippingAddressId: string | null;
}

const Addresses = ({
    shippingAddresses,
    defaultShippingAddressId,
}: AddressessProps) => {
    const [selectedAddress, setSelectedAddress] = useState<string | null>(
        defaultShippingAddressId
    );
    const createShippingAddressMutation = useCreateShippingAddress();
    const updateCartShippingAddressMutation = useUpdateCartShippingAddress();
    const { data: addresses = [], isLoading: isLoadingAddresses } =
        useShippingAddresses({ initialData: shippingAddresses });

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            email: "",
            fullName: "",
            cpf: "",
            phone: "",
            zipCode: "",
            address: "",
            number: "",
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
        },
    });

    const onSubmit = async (values: AddressFormValues) => {
        try {
            const newAddress =
                await createShippingAddressMutation.mutateAsync(values);
            await updateCartShippingAddressMutation.mutateAsync({
                shippingAddressId: newAddress.id,
            });
            form.reset();
            setSelectedAddress(null);
        } catch (error) {
            toast.error("Erro ao salvar endereço. Tente novamente.");
            console.error("Error creating shipping address:", error);
        }
    };

    const handleSelectExistingAddress = async (addressId: string) => {
        try {
            await updateCartShippingAddressMutation.mutateAsync({
                shippingAddressId: addressId,
            });
        } catch (error) {
            toast.error("Erro ao selecionar endereço. Tente novamente.");
            console.error("Error selecting shipping address:", error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Identificação</CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={selectedAddress || ""}
                    onValueChange={setSelectedAddress}
                >
                    {isLoadingAddresses ? (
                        <Card>
                            <CardContent className="py-6">
                                <div className="text-center text-muted-foreground">
                                    Carregando endereços...
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {addresses.map((address) => (
                                <Card key={address.id}>
                                    <CardContent className="py-4">
                                        <div className="flex items-start gap-3">
                                            <RadioGroupItem
                                                value={address.id}
                                                id={address.id}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <Label
                                                    htmlFor={address.id}
                                                    className="cursor-pointer text-foreground"
                                                >
                                                    <span className="font-medium">
                                                        {address.recipientName}{" "}
                                                        - {address.street},{" "}
                                                        {address.number}
                                                        {address.complement &&
                                                            `, ${address.complement}`}{" "}
                                                        - {address.neighborhood}
                                                        , {address.city} -{" "}
                                                        {address.state} - CEP:{" "}
                                                        {formatCep(
                                                            address.zipcode
                                                        )}
                                                    </span>
                                                </Label>
                                            </div>
                                        </div>
                                        {selectedAddress === address.id && (
                                            <div className="mt-3 flex justify-end">
                                                <Button
                                                    onClick={() =>
                                                        handleSelectExistingAddress(
                                                            address.id
                                                        )
                                                    }
                                                    disabled={
                                                        updateCartShippingAddressMutation.isPending
                                                    }
                                                >
                                                    {updateCartShippingAddressMutation.isPending
                                                        ? "Processando..."
                                                        : "Ir para pagamento"}
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                            <Card>
                                <CardContent className="py-4">
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem
                                            value="add_new"
                                            id="add_new"
                                        />
                                        <Label htmlFor="add_new">
                                            Adicionar novo endereço
                                        </Label>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </RadioGroup>
                {selectedAddress === "add_new" && (
                    <Card className="mt-3">
                        <CardHeader>
                            <CardTitle>Novo Endereço</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Digite seu email"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nome Completo
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Digite seu nome completo"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="cpf"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>CPF</FormLabel>
                                                    <FormControl>
                                                        <PatternFormat
                                                            customInput={Input}
                                                            format="###.###.###-##"
                                                            placeholder="000.000.000-00"
                                                            value={field.value}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                field.onChange(
                                                                    values.value
                                                                );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Celular
                                                    </FormLabel>
                                                    <FormControl>
                                                        <PatternFormat
                                                            customInput={Input}
                                                            format="(##) #####-####"
                                                            placeholder="(11) 99999-9999"
                                                            value={field.value}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                field.onChange(
                                                                    values.value
                                                                );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="zipCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>CEP</FormLabel>
                                                    <FormControl>
                                                        <PatternFormat
                                                            customInput={Input}
                                                            format="#####-###"
                                                            placeholder="00000-000"
                                                            value={field.value}
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                field.onChange(
                                                                    values.value
                                                                );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Endereço</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Digite seu endereço"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="number"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Número
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Digite o número"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="complement"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Complemento
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Apartamento, bloco, etc. (opcional)"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="neighborhood"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Bairro
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Digite o bairro"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Cidade
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Digite a cidade"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="state"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Estado
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Digite o estado"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button
                                            type="submit"
                                            disabled={
                                                createShippingAddressMutation.isPending ||
                                                updateCartShippingAddressMutation.isPending
                                            }
                                        >
                                            {createShippingAddressMutation.isPending ||
                                            updateCartShippingAddressMutation.isPending
                                                ? "Processando..."
                                                : "Salvar Endereço"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
};

export default Addresses;
