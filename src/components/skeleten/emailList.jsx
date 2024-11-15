
export const SkeletonEmailListItem = () => {
    return (
      <div className="md:flex hidden gap-4 w-[450px] p-2 bg-white rounded-md  border my-4 animate-pulse">
        <div className="h-10 w-10 rounded-full bg-gray-300"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
        </div>
      </div>
    );
  };
  