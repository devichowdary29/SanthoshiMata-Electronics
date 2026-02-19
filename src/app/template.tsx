'use client';

import { motion } from 'framer-motion';
import ClickSpark from '@/components/ui/ClickSpark';

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <ClickSpark
            sparkColor='#fff'
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            >
                {children}
            </motion.div>
        </ClickSpark>
    );
}
