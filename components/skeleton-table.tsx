import { Skeleton } from "@/components/ui/skeleton";
const SkeletonTable = () => {
  return (
    <div className="pl-6 w-full h-full items-center flex-col space-y-5">
      <div className="ml-2 pt-6 flex items-center space-x-4">
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-4 w-[50px]" />
      </div>
      <div className="pl-10 pt-20 flex-col w-full items-center space-y-4">
        <div className="flex  w-full items-center  justify-between">
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[50px]" />
          </div>
          <Skeleton className="h-[50px] w-[100px] mr-[10%]" />
        </div>
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <Skeleton className="h-[50px] w-[400px] pt-5 ml-10" />
      <div className="flex item-center pt-5 ml-10 space-x-5">
        <Skeleton className="h-10 w-[50px] " />
        <Skeleton className="h-[40px] w-[70%]" />
        <Skeleton className="h-10 w-[50px] " />
      </div>
      <div className="flex item-center pt-5 ml-10 space-x-5">
        <Skeleton className="h-10 w-[50px] " />
        <Skeleton className="h-[40px] w-[70%]" />
        <Skeleton className="h-10 w-[50px] " />
      </div>
      <div className="flex item-center pt-5 ml-10 space-x-5">
        <Skeleton className="h-10 w-[50px] " />
        <Skeleton className="h-[40px] w-[70%]" />
        <Skeleton className="h-10 w-[50px] " />
      </div>
    </div>
  );
};

export default SkeletonTable;
