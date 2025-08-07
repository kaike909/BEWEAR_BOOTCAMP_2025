const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div className="bg-accent w-full gap-1 p-8">
            <p className="text-xs font-medium">
                © {currentYear} Copyright BEWEAR
            </p>
            <p className="text-muted-foreground text-xs font-medium">
                Todos os direitos reservados.
            </p>
        </div>
    );
};

export default Footer;
