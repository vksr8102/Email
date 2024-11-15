
export const SkeletonEmailDetail = () => {
    return (
      <div className="my-4 flex-[2] bg-white rounded-md border p-4 animate-pulse">
        <div className="flex justify-between items-center my-2">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-gray-300"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
          <div className="h-8 w-24 bg-red-300 rounded-md"></div>
        </div>
        <div className="space-y-4 mt-4 h-screen">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  };
  