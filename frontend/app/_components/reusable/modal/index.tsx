"use client";

import { cn } from "@/app/_libs/utils";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  opened: boolean;
  onClose: () => void;
  className?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ opened, onClose, className = "", children, ...props }, ref) => {
    const closeOnEscape = React.useCallback(
      (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      },
      [onClose],
    );

    React.useEffect(() => {
      if (opened) {
        document.body.classList.add("no-scroll");
        document.addEventListener("keydown", closeOnEscape);
      } else {
        document.body.classList.remove("no-scroll");
        document.removeEventListener("keydown", closeOnEscape);
      }

      return () => {
        document.body.classList.remove("no-scroll");
        document.removeEventListener("keydown", closeOnEscape);
      };
    }, [opened, closeOnEscape]);

    return (
      <AnimatePresence>
        {opened && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
          >
            <motion.div
              ref={ref}
              className={cn(
                "bg-white p-6 rounded-xl shadow-xl overflow-y-auto max-h-[90vh] hide-scrollbar",
                className,
              )}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              {...(props as React.ComponentProps<typeof motion.div>)}
            >
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  },
);

Modal.displayName = "Modal";

export default Modal;
