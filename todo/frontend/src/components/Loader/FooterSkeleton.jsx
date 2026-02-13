const FooterSkeleton = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-950 animate-pulse dark:animate-none">
      <div className="h-12 bg-white dark:bg-gray-900 border-t flex items-center justify-around">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-20 dark:animate-pulse"
            />
          ))}
      </div>
    </div>
  );
};

export default FooterSkeleton;
