"use client"

import React from "react"
import { Button } from "./ui/button"
import { Bookmark } from "lucide-react"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { useRouter } from "next/navigation"

const Job = ({ job }) => {
  const router = useRouter()

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime)
    const currentTime = new Date()
    const timeDifference = currentTime - createdAt
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="p-5 rounded-md border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>

        <Button variant="outline" size="icon" className="rounded-full">
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>

      {/* Company */}
      <div className="flex items-center gap-3 my-3">
        <Button variant="outline" size="icon" className="h-14 w-14">
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>

        <div>
          <h1 className="font-medium text-lg">
            {job?.company?.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Pakistan
          </p>
        </div>
      </div>

      {/* Job info */}
      <div>
        <h1 className="font-bold text-lg my-2">
          {job?.title}
        </h1>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {job?.description}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge variant="secondary">
          {job?.position} Positions
        </Badge>

        <Badge variant="outline">
          {job?.jobType}
        </Badge>

        <Badge className="bg-primary text-primary-foreground">
          {job?.salary} LPA
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-5">
        <Button
          variant="outline"
          onClick={() => router.push(`/description/${job?._id}`)}
        >
          Details
        </Button>

        <Button variant="default">
          Save For Later
        </Button>
      </div>
    </div>
  )
}

export default Job
