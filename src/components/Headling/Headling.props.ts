import { HTMLAttributes, ReactNode} from 'react';

export interface HeadlingProps extends HTMLAttributes<HTMLHeadingElement> {
    children: ReactNode;
    appearance?: 'big' | 'small';
}