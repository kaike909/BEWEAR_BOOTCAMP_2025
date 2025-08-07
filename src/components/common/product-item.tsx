import Image from "next/image";
import Link from "next/link";

import { productTable, productVariantTable } from "@/db/schema";
import { formatCents } from "@/helpers/money";
import { cn } from "@/lib/utils";

interface ProductItemProps {
    product: typeof productTable.$inferSelect & {
        variants: (typeof productVariantTable.$inferSelect)[];
    };
    textContainerClassName?: string;
}
const ProductItem = ({ product, textContainerClassName }: ProductItemProps) => {
    const firstVariant = product.variants[0];
    const imageFirstVariant = firstVariant.imageUrl;
    return (
        <Link
            href={`/product-variant/${firstVariant.slug}`}
            className="flex flex-col gap-4"
        >
            <Image
                src={imageFirstVariant}
                alt={firstVariant.name}
                sizes="100vw"
                width={0}
                height={0}
                className="h-auto w-full rounded-[1.5rem]"
            />
            <div
                className={cn(
                    "flex max-w-[200px] flex-col gap-1",
                    textContainerClassName
                )}
            >
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="truncate text-xs text-muted-foreground font-medium">
                    {product.description}
                </p>
                <p className="truncate text-sm font-semibold">
                    {formatCents(firstVariant.priceInCents)}
                </p>
            </div>
        </Link>
    );
};

export default ProductItem;
