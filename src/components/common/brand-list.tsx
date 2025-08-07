"user client";

import { brandTable } from "@/db/schema";

import BrandItem from "./brand-item";

interface BrandListProps {
    title: string;
    brands: (typeof brandTable.$inferSelect)[];
}

const BrandList = async ({ title, brands }: BrandListProps) => {
    return (
        <div className="space-y-6">
            <h3 className="px-5 font-semibold">{title}</h3>
            <div className="flex w-full gap-6 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
                {brands.map((brand) => (
                    <BrandItem key={brand.id} brand={brand} />
                ))}
            </div>
        </div>
    );
};

export default BrandList;
