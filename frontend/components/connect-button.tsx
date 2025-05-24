"use client";

import { UserPill } from '@privy-io/react-auth/ui';

export function ConnectButton({
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    return (
        <div className='w-40 flex justify-end'>
            <UserPill />
        </div>
    );
}