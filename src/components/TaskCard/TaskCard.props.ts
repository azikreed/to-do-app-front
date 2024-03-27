import { HTMLAttributes, ReactNode } from 'react';

export interface TaskCardProps extends HTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    className?: string;
    id: string;
    onDelete: (id: string) => void;
    onUpdate: (id: string) => void;
    type: 'done' | 'get';
}