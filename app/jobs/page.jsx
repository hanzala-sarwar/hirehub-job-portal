"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import FilterCard from "@/components/FilterCard";
import Job from "@/components/Job";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Jobs = () => {
    const router = useRouter();

    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);

    const [filterJobs, setFilterJobs] = useState(allJobs);

    // 🔹 Redirect recruiter
    useEffect(() => {
        if (user?.role === "recruiter") {
            router.push("/admin/companies");
        }
    }, [user, router]);

    // 🔹 Search & filter jobs
    useEffect(() => {
        if (searchedQuery) {
            const filtered = allJobs.filter(job =>
                job?.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job?.description?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job?.location?.toLowerCase().includes(searchedQuery.toLowerCase())
            );
            setFilterJobs(filtered);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div>
            <Navbar />

            <div className="max-w-7xl mx-auto mt-5">
                <div className="flex gap-5">
                    
                    {/* Sidebar Filter */}
                    <div className="w-[20%]">
                        <FilterCard />
                    </div>

                    {/* Job List */}
                    {filterJobs.length === 0 ? (
                        <span>Job not found</span>
                    ) : (
                        <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
                            <div className="grid grid-cols-3 gap-4">
                                {filterJobs.map(job => (
                                    <motion.div
                                        key={job?._id}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Jobs;
