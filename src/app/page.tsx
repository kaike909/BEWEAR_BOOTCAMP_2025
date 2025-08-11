import { desc } from "drizzle-orm";
import Image from "next/image";

import BrandList from "@/components/common/brand-list";
import CategorySelector from "@/components/common/category-selectory";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable } from "@/db/schema";
import HeroBanner from "@/components/common/hero-banner";

const Home = async () => {
    const brands = await db.query.brandTable.findMany({});
    const products = await db.query.productTable.findMany({
        with: {
            variants: true,
        },
    });
    const newlyCreatedProducts = await db.query.productTable.findMany({
        orderBy: [desc(productTable.createdAt)],
        with: {
            variants: true,
        },
    });
    const categories = await db.query.categoryTable.findMany({});

    return (
        <>
            <Header />
            <div className="space-y-6">
                <div className="px-5">
                    {/* <Image
                        src="/banner_01.png"
                        alt="Leve uma vida com estilo"
                        height={0}
                        width={0}
                        sizes="100vw"
                        className="h-auto w-full"
                    /> */}
                    <HeroBanner
                        mobileSrc="/banner_01.png"
                        desktopSrc="/banner_01_Desktop.png"
                        alt="Leve uma vida com estilo"
                    />
                </div>

                <BrandList brands={brands} title="Marcas parceiras" />

                <ProductList products={products} title="Mais vendidos" />

                <div className="px-5">
                    <CategorySelector categories={categories} />
                </div>

                <div className="px-5">
                    {/* <Image
                        src="/banner_02.png"
                        alt="Seja autêntico"
                        height={0}
                        width={0}
                        sizes="100vw"
                        className="h-auto w-full"
                    /> */}
                    <HeroBanner
                        mobileSrc="/banner_02.png"
                        desktopSrc="/banner_02_Desktop.png"
                        alt="Seja autêntico"
                    />
                </div>

                <ProductList
                    products={newlyCreatedProducts}
                    title="Mais vendidos"
                />

                <Footer />
            </div>
        </>
    );
};

export default Home;
