import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface DroppableSlotProps {
    id: string; // The slot ID (e.g., "0-lunch-2")
    data?: any;
    children: React.ReactNode;
    className?: string;
    isOverClassName?: string;
}

export function DroppableSlot({ id, data, children, className, isOverClassName }: DroppableSlotProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
        data: data,
    });

    return (
        <div ref={setNodeRef} className={cn(className, isOver && isOverClassName)}>
            {children}
        </div>
    );
}
