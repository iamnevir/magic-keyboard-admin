import { LucideIcon } from "lucide-react";

const SaleCard = ({
  data,
}: {
  data: {
    icon: LucideIcon;
    value: string;
    label: string;
    review: string;
    color: string;
  };
}) => {
  return (
    <div className="flex flex-col items-start dark:bg-[#0A0A0A] rounded-lg p-4 gap-2">
      <data.icon className={`w-7 h-7`} color={data.color} />
      <span className=" text-lg font-semibold">{data.value}</span>
      <span className=" text-[13px]">{data.label}</span>
      <span className={`text-[${data.color}] text-xs`}>{data.review}</span>
    </div>
  );
};

export default SaleCard;
