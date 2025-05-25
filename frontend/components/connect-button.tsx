"use client";

import { UserPill } from '@privy-io/react-auth/ui';

export function ConnectButton() {
    return (
        <div className='flex justify-end'>
            <UserPill />
        </div>
    );
}