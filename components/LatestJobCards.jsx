"use client"

import { Badge } from "./ui/badge"
import { useRouter } from "next/navigation"

const LatestJobCards = ({ job }) => {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/description/${job._id}`)}
      className="p-5 rounded-md border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <div>
        <h1 className="font-medium text-lg">
          {job?.company?.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Pakistan
        </p>
      </div>

      <div>
        <h1 className="font-bold text-lg my-2">
          {job?.title}
        </h1>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {job?.description}
        </p>
      </div>

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
    </div>
  )
}

export default LatestJobCards
