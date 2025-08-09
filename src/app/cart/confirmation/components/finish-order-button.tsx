"use client";

import { CheckIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";

const FinishOrderButton = () => {
    const [successDialogIsOpen, setSuccessDialogIsOpen] = useState(true);
    const finishOrderMutation = useFinishOrder();
    return (
        <>
            <Button
                className="rounded-full w-full"
                size="lg"
                onClick={() => finishOrderMutation.mutate()}
                disabled={finishOrderMutation.isPending}
            >
                {finishOrderMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Finalizar compra
            </Button>
            <Dialog
                open={successDialogIsOpen}
                onOpenChange={setSuccessDialogIsOpen}
            >
                <DialogContent className="text-center">
                    <Image
                        src="/order_success.svg"
                        alt="Order Success"
                        width={251}
                        height={234}
                        className="mx-auto"
                    />
                    <DialogTitle className="flex flex-row items-center justify-center gap-3 mt-4">
                        <span className="text-2xl font-semibold ">
                            Pedido confirmado!
                        </span>
                        <span className="font-semibold ">
                            <CheckIcon color="green" size={35} />
                        </span>
                    </DialogTitle>
                    <DialogDescription className="font-medium">
                        Seu pedido foi efetuado com sucesso. Você pode
                        acompanhar o status na seção de “Meus Pedidos”.
                    </DialogDescription>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="rounded-full text-lg"
                            size="lg"
                        >
                            Página inicial
                        </Button>
                        <Button className="rounded-full text-lg" size="lg">
                            Ver meus pedidos
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FinishOrderButton;
