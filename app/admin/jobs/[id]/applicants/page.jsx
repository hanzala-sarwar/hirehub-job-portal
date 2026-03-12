"use client"

import React, { useEffect } from 'react'
import Navbar from '@/components/shared/Navbar';
import ApplicantsTable from '@/components/admin/ApplicantsTable';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {

    const params = useParams()
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`/api/application/applicants/${params.id}`, { withCredentials: true });
                console.log(res);

                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, []);
    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto'>
                <h1 className='font-bold text-xl my-5'>Applicants {applicants?.applications?.length}</h1>
                <ApplicantsTable />
            </div>
        </div>
    )
}

export default Applicants