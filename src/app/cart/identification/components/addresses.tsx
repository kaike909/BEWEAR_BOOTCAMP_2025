"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

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
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";

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

const Addresses = () => {
    const [selectedAddress, setSelectedAddress] = useState<string | null>();
    const createShippingAddressMutation = useCreateShippingAddress();

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
            await createShippingAddressMutation.mutateAsync(values);
            toast.success("Endereço adicionado com sucesso!");
            form.reset();
            setSelectedAddress(null);
        } catch (error) {
            toast.error("Erro ao salvar endereço. Tente novamente.");
            console.error("Error creating shipping address:", error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Identificação</CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={selectedAddress}
                    onValueChange={setSelectedAddress}
                >
                    <Card>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="add_new" id="add_new" />
                                <Label htmlFor="add_new">
                                    Adicionar novo Endereço
                                </Label>
                            </div>
                        </CardContent>
                    </Card>
                </RadioGroup>
                {selectedAddress === "add_new" && (
                    <Card className="mt-4">
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
                                                createShippingAddressMutation.isPending
                                            }
                                        >
                                            {createShippingAddressMutation.isPending
                                                ? "Salvando..."
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
