import Image from "next/image";
import Addtask from "./addtask";
import task from "./task";
import Header from "./header";
import TaskManager from "./task";


export default function Home() {
  return (
    <>
      <Header/>
      <TaskManager/>
    </>
  );
}
