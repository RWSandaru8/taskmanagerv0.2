'use client'
import React, { useEffect, useState } from 'react'

function Header() {
    

    const getdayname = (date: Date):String =>{
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return daysOfWeek[date.getDay()];
    }

    const [dayname, setDayname] = useState<String>("");

    useEffect(() => {
      const date = new Date();
      setDayname(getdayname(date));
    }, [])

    return (
      <div className='w-full bg-gra bg-gray-800 p-10'>
        <div className='flex justify-between items-center'>
          <h1 className='font-thin'>TASK Manager</h1>
          <h1 className='text-right'>{dayname}</h1>
        </div>    
      </div>
  );
}

export default Header;