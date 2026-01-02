import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface DraggableMealProps {
    id: string;
    data?: any;
    children: React.ReactNode;
    className?: string;
}

export function DraggableMeal({ id, data, children, className }: DraggableMealProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: data,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999, // Ensure it's above other elements while dragging
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={cn(className, isDragging && "opacity-50 cursor-grabbing")}>
            {children}
        </div>
    );
}
