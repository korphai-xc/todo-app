import React from "react";
import Lists from "@/components/Lists";
import AddLists from "@/components/AddLists";
import User from "@/components/User";

export default async function page() {
  return (
    <section className="app flex justify-center">
      <div className=" min-h-screen w-full lg:w-[768px] p-2 bg-white text-black">
        <section className="flex flex-col justify-center md:mt-8 w-full md:w-[414px] mx-auto">
          <h1 className="text-4xl text-bold font-medium text-center">
            TODO LISTS
          </h1>
          <div className="flex justify-between">
            <User />
          </div>
        </section>
        <section className="flex justify-center">
          <Lists />
        </section>
        <section className="flex justify-center">
          <AddLists />
        </section>
      </div>
    </section>
  );
}
