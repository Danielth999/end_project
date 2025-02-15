// components/SignInComponent.tsx

"use client";
import { SignInButton } from '@clerk/nextjs'
import { UserRound } from 'lucide-react';
const SignInComponent = () => {
  return (
    <>
      <div className=" flex-row justify-end gap-4 ">
        <SignInButton mode="modal" className='pointer-events-auto'>
          <UserRound  />
        </SignInButton>
      </div>
    </>
  );
};

export default SignInComponent;
