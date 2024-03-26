import { HTMLAttributes, ReactNode } from 'react';

export interface TaskCardProps extends HTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}