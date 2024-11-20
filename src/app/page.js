
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
    let storedState;
    if(typeof window !== "undefined" && window.localStorage){

      storedState = localStorage.getItem("activeState");
    }
    
    try {
      const parsedState = JSON.parse(storedState);
      return parsedState !== null ? parsedState : "unread";
    } catch (error) {
      return storedState !== "null" ? storedState : "unread";
    }
  });
  const [emailStates, setEmailStates] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return JSON.parse(localStorage.getItem("emailStates") || "{}");
    }
    return {};
  });
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["emails", page],
    queryFn: fetchEmails,
    keepPreviousData: true,
  });


  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("emailStates", JSON.stringify(emailStates));
    }
  }, [emailStates]);
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("activeState", activeState);
    }
  }, [activeState]);

  const toggleEmailState = (id, key) => {
 
    setEmailStates((prevState) => {
      const emailState = prevState?.[id] || {}; 
      const newState = {
        ...prevState,
        [id]: { ...emailState, [key]: !emailState[key] },
      };
      return newState;
    });
  };
  


  const filteredData = useMemo(() => {
   
    if (!activeState) return data?.list;

    return data?.list?.filter((email) => {
      const emailState = emailStates && emailStates[email?.id] || {};
      if (activeState === "favorites" && emailState.favorite) return true;
      if (activeState === "read" && emailState.read) return true;
      if (activeState === "unread" && !emailState.read) return true;
      return false;
    });
  }, [data, activeState, emailStates]);
  console.log(filteredData)

  const totalPages = data ? Math.ceil(data.total / 10) : 1;
  const handlePageClick = (pageNumber) => setPage(pageNumber);

  return (
    <div className="">
      <div className="flex md:px-10 p-4 gap-4 mb-4 items-center border-b md:text-base text-xs sticky top-0 bg-white py-4 z-50 justify-start">
        <Link href="/">
      <img src="/email.png" alt="" className=" h-10 w-10  "  />
        </Link>
        <span>Filter By :</span>
        {filterOptions.map((option) => (
          <span
            key={option}
            className={`${activeState === option ? "border bg-slate-100 rounded-full" : ""} px-2 cursor-pointer`}
            onClick={() =>{
              setActiveState(option)
              setPage(1)

            } }
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </span>
        ))}
      </div>
      <div className=" md:px-10 px-4">
        <ul className="">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <li
                key={index}
                className="flex gap-4 p-2  bg-white rounded-md border w-full my-4 animate-pulse"
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
                        {emailStates && emailStates[email.id]?.favorite && <span className="text-red-600">Favorite</span>}
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  className="absolute right-4 top-4 text-2xl text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleEmailState(email.id, "favorite");
                  }}
                >
                  {emailStates && emailStates[email?.id]?.favorite ? "★" : "☆"}
                </button>
                <button
                  className="absolute right-12 top-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleEmailState(email.id, "read");
                  }}
                >
                  {emailStates && emailStates[email?.id]?.read ? <span className=" text-red-500">✓ Read</span> : "Mark as Read"}
                </button>
              </li>
            ))
          ) : (
            <li className="max-h-screen flex justify-center items-center">
              <p>No emails found</p>
            </li>
          )}
        </ul>
      </div>
      {filteredData?.length > 0 && (
        <div className="flex justify-center mt-4">
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
        </div>
      )}
    </div>
  );
}
