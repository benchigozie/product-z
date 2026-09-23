'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

type ContentTransitionProps = {
    children: ReactNode;
    transitionKey?: string;
};

export function ContentTransition({
    children,
    transitionKey,
}: ContentTransitionProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={transitionKey}
                initial={{
                    opacity: 0,
                    y: 10,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                exit={{
                    opacity: 0,
                    y: -6,
                }}
                transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}