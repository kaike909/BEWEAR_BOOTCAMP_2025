import Image from "next/image";
import Link from "next/link";

import { brandTable } from "@/db/schema";

import { Button } from "../ui/button";

interface ProductItemProp {
    brand: typeof brandTable.$inferSelect;
}
const BrandItem = ({ brand }: ProductItemProp) => {
    return (
        <div className="flex flex-col items-center gap-4">
            <Button
                asChild
                variant="outline"
                className="w-[80px] h-[80px] rounded-[1.5rem]"
            >
                <Link href="/" className="flex flex-col">
                    <Image
                        src={brand.imageUrl}
                        alt={brand.name}
                        width={32}
                        height={32}
                    />
                </Link>
            </Button>
            <div className="flex max-w-[200px] flex-col gap-1">
                <p className="truncate text-sm font-medium">{brand.name}</p>
            </div>
        </div>
    );
};

export default BrandItem;
