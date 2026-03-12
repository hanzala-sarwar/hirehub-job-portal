"use client"

import React, { useEffect, useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import CompaniesTable from '@/components/admin/CompaniesTable'
import { useSelector } from 'react-redux'

import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");

    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);


    useEffect(() => {
        if (!user || user?.role === 'student') {
            router.push("/");
        }

        dispatch(setSearchCompanyByText(input));

    }, [input]);

  
    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <Input
                        className="w-fit"
                        placeholder="Filter by name"
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button onClick={() => router.push("/admin/companies/create")}>
                        New Company
                    </Button>
                </div>
                <CompaniesTable />
            </div>
        </div>
    )
}

export default Companies