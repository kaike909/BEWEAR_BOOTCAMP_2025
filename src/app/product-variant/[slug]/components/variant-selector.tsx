import Image from "next/image";
import Link from "next/link";

import { productVariantTable } from "@/db/schema";

interface VariantSelectorProps {
    selectedVariant: string;
    variants: (typeof productVariantTable.$inferSelect)[];
}

const VariantSelector = ({
    variants,
    selectedVariant,
}: VariantSelectorProps) => {
    return (
        <div className="flex items-center gap-4">
            {variants.map((variant) => (
                <Link
                    href={`/product-variant/${variant.slug}`}
                    key={variant.id}
                    className={
                        selectedVariant == variant.slug
                            ? "border-primary border-2 rounded-xl"
                            : ""
                    }
                >
                    <Image
                        src={variant.imageUrl}
                        alt={variant.name}
                        width={68}
                        height={68}
                        className="rounded-xl"
                    />
                </Link>
            ))}
        </div>
    );
};

export default VariantSelector;
