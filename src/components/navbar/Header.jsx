import React from 'react'

const Header = () => {
    const filterOptions = ["unread", "read", "favorites"];
  return (
    <div>
       <div className="flex gap-4 mb-4 items-center justify-start">
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
    </div>
  )
}

export default Header
