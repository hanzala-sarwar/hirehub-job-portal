"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const JobDescription = () => {
    const { id: jobId } = useParams();
    const dispatch = useDispatch();
    const router = useRouter();

    const { singleJob } = useSelector((store) => store.job);
    const { user } = useSelector((store) => store.auth);

    const isInitiallyApplied =
        singleJob?.applications?.some(
            (application) => application.applicant === user?._id
        ) || false;

    const [isApplied, setIsApplied] = useState(isInitiallyApplied);

    // Apply Job
    const applyJobHandler = async () => {
        try {
            if (!user) {
                toast.error("Please login first to apply a job");
                router.push("/login");
                return;
            }

            const res = await axios.post(
                `/api/application/applyjob/${jobId}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setIsApplied(true);

                const updatedSingleJob = {
                    ...singleJob,
                    applications: [
                        ...singleJob.applications,
                        { applicant: user?._id },
                    ],
                };

                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

    // Fetch Single Job
    useEffect(() => {
        if (!jobId) return;

        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`/api/job/getjobbyid/${jobId}`, {
                    withCredentials: true,
                });

                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(
                        res.data.job.applications.some(
                            (application) => application.applicant === user?._id
                        )
                    );
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <div className="max-w-7xl mx-auto my-10 bg-card border border-border rounded-lg p-6 text-card-foreground shadow-sm">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-bold text-2xl">{singleJob?.title}</h1>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant="secondary">
                            {singleJob?.position} Positions
                        </Badge>
                        <Badge variant="outline">
                            {singleJob?.jobType}
                        </Badge>
                        <Badge className="bg-primary text-primary-foreground">
                            {singleJob?.salary} LPA
                        </Badge>
                    </div>
                </div>

                <Button
                    onClick={!isApplied ? applyJobHandler : undefined}
                    disabled={isApplied}
                    variant={isApplied ? "destructive" : "default"}
                >
                    {isApplied ? "Already Applied" : "Apply Now"}
                </Button>
            </div>

            {/* Divider */}
            <h2 className="border-b border-border font-medium py-4 mt-6">
                Job Description
            </h2>

            {/* Job Details */}
            <div className="mt-4 space-y-3">
                <Detail label="Role" value={singleJob?.title} />
                <Detail label="Location" value={singleJob?.location} />
                <Detail label="Description" value={singleJob?.description} />
                <Detail label="Experience" value={`${singleJob?.experienceLevel} yrs`} />
                <Detail label="Salary" value={`${singleJob?.salary} LPA`} />
                <Detail label="Total Applicants" value={singleJob?.applications?.length} />
                <Detail label="Posted Date" value={singleJob?.createdAt?.split("T")[0]} />
            </div>
        </div>
    );
};

// Reusable detail row
const Detail = ({ label, value }) => (
    <div className="flex gap-2">
        <h3 className="font-bold">{label}:</h3>
        <span className="font-normal text-muted-foreground">{value}</span>
    </div>
);

export default JobDescription;
