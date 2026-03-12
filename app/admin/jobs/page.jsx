"use client"

import React, { useEffect, useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import AdminJobsTable from '@/components/admin/AdminJobsTable'

import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const router = useRouter();
  const { user } = useSelector(store => store.auth);

  useEffect(() => {
    if (user?.role === 'student') {
      router.push("/");
    }
  }, []);



  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);
  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10'>
        <div className='flex items-center justify-between my-5'>
          <Input
            className="w-fit"
            placeholder="Filter by name, role"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => router.push("/admin/jobs/create")}>New Jobs</Button>
        </div>
        <AdminJobsTable />
      </div>
    </div>
  )
}

export default AdminJobs