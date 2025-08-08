export const formatAddress = (address: {
    recipientName: string;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
}) => {
    const formatCep = (cep: string) => {
        return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
    };
    return `${address.recipientName} - ${address.street}, ${address.number} ${address.complement && `, ${address.complement}`} - ${address.neighborhood}, ${address.city} - ${address.state} - CEP: ${formatCep(address.zipcode)}`;
};
