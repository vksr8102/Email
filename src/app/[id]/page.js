"use client";
import { fetchAllEmails, getEmailById } from '@/mocks/email';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDateTime } from '@/common/common';
import { SkeletonEmailDetail } from '@/components/skeleten/emailDeatils';
import { SkeletonEmailListItem } from '@/components/skeleten/emailList';
import { IoMdMenu } from "react-icons/io";

const EmailPage = () => {
  const pathName = usePathname();
  const id = pathName.split('/').filter(Boolean).pop();
  const filterOptions = ["unread", "read", "favorites"];
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeState, setActiveState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeState") || "unread";
    }
    return "unread";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeState", activeState);
    }
  }, [activeState]);

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
  }, [emailStates]);

  const { data: emailData, isLoading, isError, error } = useQuery({
    queryKey: ['email', id],
    queryFn: getEmailById,
    keepPreviousData: true,
    enabled: !!id,
  });

  const { data: list, isLoading: isListLoading } = useQuery({
    queryFn: fetchAllEmails,
    keepPreviousData: true,
  });

  const email = list?.list?.find((item) => item.id === id);

  const toggleEmailState = (id, key) => {
    setEmailStates((prevState) => {
      const newState = { ...prevState, [id]: { ...prevState[id], [key]: !prevState[id]?.[key] } };
      return newState;
    });
  };

  const filteredEmails = list?.list?.filter((email) => {
    const emailState = emailStates[email.id] || {};
    if (activeState === "favorites" && emailState.favorite) return true;
    if (activeState === "read" && emailState.read) return true;
    if (activeState === "unread" && !emailState.read) return true;
    return activeState ? false : true;
  });

  if (isLoading || isListLoading) return (
    <div className="md:p-10 p-4 flex gap-4 h-screen">
      <div>
        
        {Array.from({ length: 5 }).map((_, index) => (<SkeletonEmailListItem key={index} />))}
      </div>
      <SkeletonEmailDetail />
    </div>
  );

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className=''>
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
        <div className='text-xl font-semibold md:hidden block'>
          <IoMdMenu onClick={() => setMenuOpen(true)} />
        </div>
      </div>

      <div className="flex gap-4 h-screen md:px-10 p-2">
        {/* Email List - Drawer for mobile */}
        <div className={`fixed inset-y-0 left-0 w-[100%] bg-white z-50 transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:hidden`}>
          <div className="flex justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Emails</h2>
            <button onClick={() => setMenuOpen(false)} className="text-red-600">X</button>
          </div>
          <div className="email-list flex flex-col h-full overflow-y-auto p-4">
            {filteredEmails?.map((email) => (
              <Link
                href={`/${email.id}`}
                key={email.id}
                className={`flex gap-4 p-2 ${email.id === id ? "bg-[#F2F2F2]" : "bg-white"} rounded-md border hover:border-red-500 my-4`}
                onClick={() => setMenuOpen(false)} // Close drawer on selection
              >
                <div className="h-10 w-10 rounded-full bg-[#E54065] flex justify-center items-center text-white">
                  <span>{email.from.email.charAt(0).toUpperCase()}</span>
                </div>
                <div className="w-full">
                  <p>
                    From:{" "}
                    <span className="font-semibold">
                      {email.from.name} &lt;{email.from.email}&gt;
                    </span>
                  </p>
                  <p>
                    Subject: <span className="font-semibold">{email.subject}</span>
                  </p>
                  <div className="flex gap-4 items-center">
                    <p className="py-2">{formatDateTime(email.date)}</p>
                    {emailStates[email?.id]?.favorite && <span className="text-red-600">favorite</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Email List - Sidebar for desktop */}
        <div className="email-list hidden md:flex flex-col w-full md:min-w-[450px] max-w-[450px] h-full overflow-y-auto border border-gray-300 rounded-lg p-4 bg-white">
          {filteredEmails?.map((email) => (
            <Link
              href={`/${email.id}`}
              key={email.id}
              className={`flex gap-4 p-2 ${email.id === id ? "bg-[#F2F2F2]" : "bg-white"} rounded-md border hover:border-red-500 my-4`}
            >
              <div className="h-10 w-10 rounded-full bg-[#E54065] flex justify-center items-center text-white">
                <span>{email.from.email.charAt(0).toUpperCase()}</span>
              </div>
              <div className="w-full">
                <p>
                  From:{" "}
                  <span className="font-semibold">
                    {email.from.name} &lt;{email.from.email}&gt;
                  </span>
                </p>
                <p>
                  Subject: <span className="font-semibold">{email.subject}</span>
                </p>
                <div className="flex gap-4 items-center">
                  <p className="py-2">{formatDateTime(email.date)}</p>
                  {emailStates[email?.id]?.favorite && <span className="text-red-600">favorite</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Email Details */}
        <div className="flex-grow overflow-y-auto bg-white rounded-md border p-4">
          {emailData && filteredEmails.some(e => e.id === id) ? (
            <div className="my-4">
              <div className="flex justify-between my-2">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#E54065] flex justify-center items-center text-white">
                    <span>{email.from.email.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="font-semibold">{email.subject}</span>
                    <p className="py-2">{formatDateTime(email.date)}</p>
                  </div>
                </div>
                <div>
                  <button
                    className="px-4 py-1 rounded-md bg-red-600 md:text-base text-xs text-white hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md focus:outline-none"
                    onClick={() => toggleEmailState(id, "read")}
                  >
                    {emailStates[id]?.read ? "Mark as Unread" : "Mark as Read"}
                  </button>
                </div>
              </div>
              <p dangerouslySetInnerHTML={{ __html: emailData.body }}></p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span>Select an email to read</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
