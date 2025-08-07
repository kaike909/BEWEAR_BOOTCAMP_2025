import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCents } from "@/helpers/money";

import ProductActions from "./components/product-actions";
import VariantSelector from "./components/variant-selector";

interface ProductVariantPageProps {
    params: Promise<{ slug: string }>;
}
// Fazer um query param com os slugs
// Por exemplo: /product/mochila?variant=mochila-preta
const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
    const { slug } = await params;
    const productVariant = await db.query.productVariantTable.findFirst({
        where: eq(productVariantTable.slug, slug),
        with: {
            product: {
                with: {
                    variants: true,
                },
            },
        },
    });
    if (!productVariant) {
        return notFound();
    }
    const likelyProducts = await db.query.productTable.findMany({
        where: eq(productTable.categoryId, productVariant.product.categoryId),
        with: {
            variants: true,
        },
    });
    return (
        <>
            <Header />
            <div className="flex flex-col space-y-6">
                {/* Imagem */}
                <Image
                    src={productVariant.imageUrl}
                    alt={productVariant.name}
                    sizes="100vw"
                    width={0}
                    height={0}
                    className="h-auto w-full object-cover"
                />
                {/* Variants */}
                <div className="px-5">
                    <VariantSelector
                        selectedVariant={productVariant.slug}
                        variants={productVariant.product.variants}
                    />
                </div>
                {/* Nome do produto e preco */}
                <div className="px-5">
                    <h2 className="text-xl font-semibold">
                        {productVariant.product.name}
                    </h2>
                    <h3 className="text-sm text-muted-foreground">
                        {productVariant.name}
                    </h3>
                    <h3 className="text-lg font-semibold">
                        {formatCents(productVariant.priceInCents)}
                    </h3>
                </div>
                {/* Botões de ação */}
                <ProductActions productVariantId={productVariant.id} />
                {/* Descrição */}
                <div className="px-5">
                    <p className="text-sm">
                        {productVariant.product.description}
                    </p>
                </div>
                {/* "Você também pode gostar" */}
                <ProductList
                    title="Você também pode gostar"
                    products={likelyProducts}
                />
                {/* Footer */}
                <Footer />
            </div>
        </>
    );
};

export default ProductVariantPage;
