"use client"

import React, { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'

const CompanyCreate = () => {

    const router = useRouter()
    const [companyName, setCompanyName] = useState();

    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        try {

            // 🔴 user not logged in
            if (!user) {
                toast.error("Please login first to create a company");
                // router.push("/login"); // optional
                return;
            }

            // 🔴 validation
            if (!companyName) {
                toast.error("Company name is required");
                return;
            }

            const res = await axios.post("/api/company/register", { companyName }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log(res);

            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                // console.log(companyId);                
                router.push(`/admin/companies/${companyId}`);
            }

        } catch (error) {
            console.log(error);
            const message =
                error?.response?.data?.message || "Request failed";

            toast.error(message);

        }
    }
    
    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Your Company Name</h1>
                    <p className='text-gray-500'>
                        What would you like to give your company name? you can change this later.
                    </p>
                </div>

                <Label>Company Name</Label>
                <Input
                    type="text"
                    className="my-2"
                    placeholder="JobHunt, Microsoft etc."
                    onChange={(e) => setCompanyName(e.target.value)}

                />
                <div className='flex items-center gap-2 my-10'>
                    <Button variant="outline"
                        onClick={() => router.push("/admin/companies")}>
                        Cancel
                    </Button>
                    <Button onClick={registerNewCompany}>Continue</Button>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate