import Image from "next/image";

interface Props {
    mobileSrc: string;
    desktopSrc: string;
    alt: string;
}
const HeroBanner = ({ mobileSrc, desktopSrc, alt }: Props) => {
    return (
        <picture>
            <source media="(min-width: 1024px)" srcSet={desktopSrc} />
            <Image
                src={mobileSrc}
                alt={alt}
                height={0}
                width={0}
                sizes="100vw"
                className="w-full h-auto rounded-2xl"
            />
        </picture>
    );
};

export default HeroBanner;
