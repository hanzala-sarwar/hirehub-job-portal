"use client"

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { useRouter } from "next/navigation";
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { ModeToggle } from '../dark-mode'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const logoutHandler = async () => {
        try {
            const res = await axios.get("/api/user/logout", { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                router.push("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <div className='bg-background border-b'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
                <div>
                    <h1 className='text-2xl font-bold ml-9'>
                        Hire<span className='text-[#F83002]'>Hub</span>
                    </h1>
                </div>

                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link href="/admin/companies">Companies</Link></li>
                                    <li><Link href="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link href="/">Home</Link></li>
                                    <li><Link href="/jobs">Jobs</Link></li>
                                    <li><Link href="/browse">Browse</Link></li>
                                </>
                            )
                        }


                    </ul>

                    {/* Theme Toggle */}
                    {/* <div className='bg-black rounded-2xl'> */}
                        <ModeToggle />
                    {/* </div> */}

                    {
                        !user ? (
                            <div className='flex items-center gap-2 mr-9'>
                                <Link href="/login">
                                    <Button variant="outline">Login</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer mr-9">
                                        <AvatarImage
                                            src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                            alt={user?.fullname || "@shadcn"}
                                        />

                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent align="end" className=" w-80 mr-5 ">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage
                                                    src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                                    alt={user?.fullname || "@shadcn"}
                                                />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4>
                                                <p className='text-sm text-muted-foreground'>
                                                    {user?.profile?.bio}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            {
                                                user && user.role === 'student' && (
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                        <User2 />
                                                        <Button variant="link">
                                                            <Link href="/profile">View Profile</Link>
                                                        </Button>
                                                    </div>
                                                )
                                            }

                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button
                                                    onClick={logoutHandler} variant="link">Logout
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>
            </div>

        </div>
    )
}

export default Navbar