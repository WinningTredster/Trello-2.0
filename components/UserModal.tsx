import { useUserStore } from '@/store/UserStore';
import { useRouter } from 'next/navigation';
import React from 'react';
import {toast} from "react-toastify";

type Props = {
    email:string,
}
function UserModal({email}: Props) {
  const router = useRouter();
    const logout = useUserStore(state => state.logout);
    const handleClick = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        logout().then(() => router.push("/login")).catch((err) => toast.error(err.toString()));
    }
  return (
    <div className='flex flex-col p-2 position: absolute bg-white bg-opacity-20 backdrop-blur-2xl h-auto w-auto -right-4 top-20 gap-2'>
    <h1>{email}</h1>
      <button onClick={handleClick} className=' bg-blue-500 w-16 text-sm p-1 m-auto rounded-md'>Log Out</button>
    </div>
  )
}

export default UserModal
