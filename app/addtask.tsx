"use client"
import { describe } from 'node:test';
import React, { useState } from 'react'

function Addtask() {
    const datex = new Date();
    const year = String(datex.getFullYear());
    const mon = String(datex.getMonth() + 1).padStart(2, "0");
    const day = String(datex.getDate()).padStart(2, '0');
    const date = `${year}-${mon}-${day}`;

    const [Task, setTask] = useState({
        id: "",
        title: "",
        category: "Work",
        description: "",
        pushdate: date,
        duedate: date
    }
    );

    const handlechange = (e) => {
        const {name, value} = e.target;
        setTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    const handlesubmit =  async (e) =>{
        e.preventDefault();

        const taskId = {...Task, id:Date.now()};
        console.log(Task);
        console.log()

        try{
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type" : "application/json"},
                body: JSON.stringify(taskId),
            });

            if(response.ok){
                alert("Task saved");
                setTask(
                    { id: "", title: "", category: "Work", description: "", pushdate: date, duedate:date}
                );
            }
            else{
                alert("Task failed successfully:(")
            }
        }
        catch(error){
            console.error("error: ", error);
        }
    }

  return (
    <div className='flex items-center justify-center h-screen bg-cover bg-center bg-fixed'>
        <div className='ls-w-3/6 ls-h-1/6 md-w-4/5 md-h-2/5 bg-white/20 backdrop-blur-md rounded-lg shadow-lg py-15 px-5'>
            <form onSubmit={handlesubmit} className='text-white text-center'>
                <table className='w-full'>
                    <tr>
                        <td><label >Task :  </label></td>
                        <td>
                            <input required name='title' value={Task.title} onChange={handlechange} type="text" 
                            className='bg-transparent rounded-md border-white border-2 shadow-sm my-4 w-full mr-10'/><br />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}><textarea required name='description' value={Task.description} onChange={handlechange} placeholder='Description'
                        className='rounded-md border-white border-2 shadow-sm bg-transparent my-1.5 w-full min-h-40'/><br /></td>
                    </tr>
                    <tr>
                        <td><label >Category : </label>

                            <select name='category' onChange={handlechange} value={Task.category}  className='bg-transparent my-3'>
                                <option value="Work" className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900'>Work</option>
                                <option value="Personal" className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900'>Personal</option>
                            </select></td>
                        <td>
                        <label>Due date : </label>
                            <input name='duedate' onChange={handlechange} value={Task.duedate} type='date'
                            className='rounded-md border-white border-2 shadow-sm bg-transparent my-3'></input>
                        </td>
                    </tr>
                </table>
                <input type="submit" className='rounded-md border-white border-2 shadow-sm bg-white text-blue-950 my-3'/>
            </form>
        </div>
    </div>
  )
}

export default Addtask;