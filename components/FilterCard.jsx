"use client";

import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    array: [
      "Islamabad",
      "Lahore",
      "Faisalabad",
      "Multan",
      "Rawalpindi",
      "Gujrawala",
      "Sialkot",
      "Sahiwal",
    ],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);

  return (
    <div className="w-full bg-card p-4 rounded-md border border-border text-card-foreground">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="my-3 border-border" />

      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((data, index) => (
          <div key={index} className="mb-4">
            <h2 className="font-bold text-base">{data.filterType}</h2>
            <div className="mt-2 space-y-2">
              {data.array.map((item, idx) => {
                const itemId = `id${index}-${idx}`;
                return (
                  <div className="flex items-center space-x-2" key={itemId}>
                    <RadioGroupItem value={item} id={itemId} />
                    <Label htmlFor={itemId}>{item}</Label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
