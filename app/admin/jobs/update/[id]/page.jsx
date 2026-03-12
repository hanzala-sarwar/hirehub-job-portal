"use client";

import React, { useEffect, useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetJobById from '@/hooks/useGetJobById' // ✅ you need to create this hook
 

const JobUpdatePage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    useGetJobById(id); // Fetch single job 

    const { singleJob } = useSelector(store => store.job);
    const { companies } = useSelector(store => store.company);

    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });

    const [loading, setLoading] = useState(false);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find(c => c.name.toLowerCase() === value);
        setInput({ ...input, companyId: selectedCompany?._id || "" });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.put(`/api/job/updatejob/${id}`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                router.push("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (singleJob) {
            setInput({
                title: singleJob.title || "",
                description: singleJob.description || "",
                requirements: singleJob.requirements?.join(", ") || "",
                salary: singleJob.salary || "",
                location: singleJob.location || "",
                jobType: singleJob.jobType || "",
                experience: singleJob.experienceLevel || "",
                position: singleJob.position || 0,
                companyId: singleJob.company?._id || ""
            });
        }
    }, [singleJob]);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto my-10'>
                <form onSubmit={submitHandler} className='p-8 border border-gray-200 shadow-lg rounded-md'>
                    <div className='flex items-center gap-5 mb-5'>
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2 text-gray-500 font-semibold"
                            onClick={() => router.push("/admin/jobs")}
                        >
                            <ArrowLeft /> Back
                        </Button>
                        <h1 className='font-bold text-xl'>Update Job</h1>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Title</Label>
                            <Input type="text" name="title" value={input.title} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input type="text" name="description" value={input.description} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input type="text" name="requirements" value={input.requirements} onChange={changeEventHandler} placeholder="e.g., React, Node.js" />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input type="text" name="salary" value={input.salary} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input type="text" name="location" value={input.location} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input type="text" name="jobType" value={input.jobType} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Experience Level</Label>
                            <Input type="text" name="experience" value={input.experience} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Number of Positions</Label>
                            <Input type="number" name="position" value={input.position} onChange={changeEventHandler} />
                        </div>
                        {companies.length > 0 && (
                            <Select onValueChange={selectChangeHandler} defaultValue={singleJob?.company?.name?.toLowerCase()}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a Company" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {companies.map(company => (
                                            <SelectItem key={company._id} value={company.name.toLowerCase()}>{company.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {loading ?
                        <Button className="w-full my-4">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                        </Button>
                        :
                        <Button type="submit" className="w-full my-4">Update Job</Button>
                    }
                </form>
            </div>
        </div>
    );
};

export default JobUpdatePage;
