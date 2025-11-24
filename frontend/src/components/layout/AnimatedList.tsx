import { motion, useInView } from "motion/react";
import React, { useRef } from "react";

type AnimatedItemProps = {
  children: React.ReactNode;
  delay?: number;
  index: number;
};

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  delay = 0,
  index,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });

  return (
    <motion.div
      ref={ref}
      data-index={index}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={
        inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }
      }
      transition={{ duration: 0.2, delay }}
      className="mb-2"
    >
      {children}
    </motion.div>
  );
};

export type AnimatedListProps = {
  items: React.ReactNode[];
  className?: string;
  displayScrollbar?: boolean;
};

const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  className = "",
  displayScrollbar = true,
}) => {
  const listRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={listRef}
        className={`max-h-[600px] overflow-y-auto p-2 ${
          displayScrollbar
            ? "[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-700/60 [&::-webkit-scrollbar-thumb]:rounded"
            : "scrollbar-hide"
        }`}
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            index={index}
            delay={index * 0.03}
          >
            {item}
          </AnimatedItem>
        ))}
      </div>
    </div>
  );
};

export default AnimatedList;
