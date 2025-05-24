"use client";

import { cn } from '@/lib/utils';
import { UserPill } from '@privy-io/react-auth/ui';

export function ConnectButton({
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    return (
        <div 
            {...props}
            className={cn('w-40 flex justify-end', props.className)}
        >
            <UserPill />
        </div>
    );
}