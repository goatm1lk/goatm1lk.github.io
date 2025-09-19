"use client";
import Image from "next/image";

const ProjectDisplay = ({ projectName, projectImageURL, onClick }) => {
  console.log(projectName, projectImageURL);
  return (
    <>
      <div
        className="relative w-[900px] h-[900px] bg-opacity-50 bg-gray-500"
        onClick={onClick}
      >
        {/* Image */}
        <span className="grid text-white bg-black bg-opacity-60 px-4 py-2 rounded font-lexend">
          <p className="mx-auto place-content-center ">{projectName}</p>
        </span>
        <div className="grid justify-items-center">
          <Image
            src={projectImageURL}
            alt="Loading... Insert Loading GIF here."
            height={800}
            width={800}
            className="absolute  w-[90%] h-[90%] object-fit "
          />
        </div>

        {/* Span overlay */}
      </div>

      {/* Project Name */}
    </>
  );
};

export default ProjectDisplay;
