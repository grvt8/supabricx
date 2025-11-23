import { PiStarFour } from "react-icons/pi";
import { IoMdCheckmark } from "react-icons/io";

type PricingCardProps = {
  title: string;
  subtitle: string;
  price: string | number;
  priceSubtext?: string;
  features: string[];
  buttonText: string;
  buttonColor: string;
  buttonTextColor: string;
  isPopular?: boolean;
};

export default function PricingCard({
  title,
  subtitle,
  price,
  priceSubtext,
  features,
  buttonText,
  buttonColor,
  buttonTextColor,
  isPopular = false,
}: PricingCardProps) {
  return (
    <div className="relative flex w-full max-w-md flex-col items-center justify-between rounded-3xl border border-[#242424] bg-[#161616] p-8 text-white">
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute right-5 top-3 flex items-center gap-1 rounded-full border border-emerald-950 bg-lime-400 px-3 py-1 text-sm text-emerald-950 font-semibold">
          <PiStarFour />
          Popular
        </div>
      )}

      <div className="flex w-full flex-col items-center gap-3">
        <h2 className="text-4xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-[#9B9CA1]">{subtitle}</p>

        <div className="text-[40px] font-bold text-white">
          {price}
          {priceSubtext && (
            <span className="ml-2 text-base text-[#E0E0E0]">{priceSubtext}</span>
          )}
        </div>

        <ul className="flex w-full flex-col gap-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-base text-white">
              <IoMdCheckmark className="text-lg text-white" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <button
        style={{ backgroundColor: buttonColor, color: buttonTextColor }}
        className="mt-6 w-[300px] rounded-full px-6 py-3 text-base font-medium transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      >
        {buttonText}
      </button>
    </div>
  );
}
