import Card from "@/components/atoms/Card";
import { motion } from "framer-motion";

const Loading = ({ count = 6 }) => {
  return (
    <div className="space-y-6">
      {/* Search Bar Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-full max-w-md animate-pulse" />
        <div className="h-10 bg-gradient-to-r from-primary-200 to-primary-300 rounded-lg w-32 animate-pulse ml-4" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-6 border-l-4 border-l-slate-300">
              <div className="flex items-start space-x-4">
                {/* Avatar Skeleton */}
                <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full animate-pulse" />
                
                {/* Content Skeleton */}
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded animate-pulse w-1/2" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded animate-pulse w-full" />
                    <div className="h-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded animate-pulse w-2/3" />
                  </div>
                </div>
                
                {/* Actions Skeleton */}
                <div className="flex flex-col space-y-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse" />
                  <div className="w-8 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;