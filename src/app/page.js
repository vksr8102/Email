"use client";
import { formatDateTime } from "@/common/common";
import { fetchEmails } from "@/mocks/email";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

export default function Home() {
  const filterOptions = ["unread", "read", "favorites"];
  const [page, setPage] = useState(1);


  const [activeState, setActiveState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeState") || "unread";
    }
  });

  
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeState", activeState);
    }
  }, [activeState]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["emails", page],
    queryFn: fetchEmails,
    keepPreviousData: true,
  });

  const [emailStates, setEmailStates] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("emailStates") || "{}");
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("emailStates", JSON.stringify(emailStates));
    }
    return "unread"
  }, [emailStates]);

  const toggleEmailState = (id, key) => {
    setEmailStates((prevState) => {
      const newState = { ...prevState, [id]: { ...prevState[id], [key]: !prevState[id]?.[key] } };
      return newState;
    });
  };

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!activeState) return data.list;

    return data.list.filter((email) => {
      const emailState = emailStates[email.id] || {};
      if (activeState === "favorites" && emailState.favorite) return true;
      if (activeState === "read" && emailState.read) return true;
      if (activeState === "unread" && !emailState.read) return true;
      return false;
    });
  }, [data, activeState, emailStates]);

  const totalPages = data ? Math.ceil(data.total / 10) : 1;
  const handlePageClick = (pageNumber) => setPage(pageNumber);

  return (
    <div className="md:p-10 p-4">
       <div className="flex md:px-10 p-4 gap-4 mb-4 items-center border-b md:text-base text-xs sticky top-0 bg-white py-4 z-50 justify-start">
        <span>Filter By :</span>
        {filterOptions.map((option) => (
          <span
            key={option}
            className={`${activeState === option ? "border bg-slate-100 rounded-full" : ""} px-2 cursor-pointer`}
            onClick={() => setActiveState(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </span>
        ))}
      </div>
      <div>
      <ul>
  {isLoading ? (
    // Show loading placeholders
    Array.from({ length: 5 }).map((_, index) => (
      <li
        key={index}
        className="flex gap-4 p-2 bg-white rounded-md border w-full my-4 animate-pulse"
      >
        <div className="h-10 w-10 rounded-full bg-gray-300"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
        </div>
      </li>
    ))
  ) : filteredData?.length > 0 ? (
    // Show email data if loading is complete
    filteredData.map((email) => (
      <li key={email.id} className="relative">
        <Link
          href={`/${email.id}`}
          className="flex gap-4 justify-between items-baseline p-2 hover:bg-[#F2F2F2] bg-white rounded-md border hover:border-red-500 w-full my-4"
        >
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-[#E54065] flex justify-center items-center text-white">
              <span>{email.from.email.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p>
                From: <span className="font-semibold">{email.from.name} &lt;{email.from.email}&gt;</span>
              </p>
              <p>
                Subject: <span className="font-semibold">{email.subject}</span>
              </p>
              <p>{email.short_description}</p>
              <div className="flex gap-4 items-center">
                <p className="py-2">{formatDateTime(email.date)}</p>
                {emailStates[email.id]?.favorite && <span className="text-red-600">Favorite</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle Favorite"
              className="text-red-500 text-2xl"
              onClick={(e) => {
                e.stopPropagation();
                toggleEmailState(email.id, "favorite");
              }}
            >
              {emailStates[email.id]?.favorite ? "★" : "☆"}
            </button>
            <button
              aria-label="Mark as Read"
              onClick={(e) => {
                e.stopPropagation();
                toggleEmailState(email.id, "read");
              }}
            >
              {emailStates[email.id]?.read ? (
                <span className="text-red-500">✓ Read</span>
              ) : (
                "Mark as Read"
              )}
            </button>
          </div>
        </Link>
      </li>
    ))
  ) : (
    // Show a message when there are no emails
    <li className="max-h-screen flex justify-center items-center">
      <p>No emails found</p>
    </li>
  )}
</ul>

      </div>
      {filteredData?.length >0 &&<div className="flex justify-center mt-4">
        <nav className="flex items-center space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(index + 1)}
              className={`px-4 py-2 border rounded ${
                page === index + 1 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
              disabled={isLoading}
            >
              {index + 1}
            </button>
          ))}
        </nav>
      </div>}
    </div>
  );
}
