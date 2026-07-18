"use client";
import { motion } from "motion/react";
import React from "react";

const ProjectDetails = ({
  title,
  description,
  subDescription = [],
  image,
  tags = [],
  href,
  closeModal,
}) => {
  return (
    /* 1. BACKDROP: Ditambahkan onClick untuk menutup modal */
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-hidden backdrop-blur-sm bg-black/40"
      onClick={closeModal} 
    >
      {/* 2. CARD UTAMA: Ditambahkan stopPropagation agar klik di dalam tidak ikut menutup */}
      <motion.div
        className="relative max-w-2xl border shadow-sm rounded-2xl bg-gradient-to-l from-midnight to-navy border-white/10 mx-4 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Tombol Close Silang */}
        <button
          onClick={closeModal}
          className="absolute p-2 rounded-xl top-5 right-5 bg-midnight/80 hover:bg-gray-800 transition-colors z-10"
        >
          <img src="assets/close.svg" className="w-5 h-5" alt="close" />
        </button>

        {/* Gambar Proyek */}
        <img src={image} alt={title} className="w-full h-64 object-cover rounded-t-2xl" />

        {/* Konten Teks */}
        <div className="p-6">
          <h5 className="mb-2 text-2xl font-bold text-white">{title}</h5>
          <p className="mb-3 font-normal text-neutral-400 text-sm md:text-base">{description}</p>
          
          {/* Perbaikan: Menambahkan key pada map subDescription */}
          {subDescription.map((subDesc, index) => (
            <p key={index} className="mb-3 font-normal text-neutral-400 text-sm">
              {subDesc}
            </p>
          ))}

          <div className="flex items-center justify-between mt-6">
            {/* Tech Stack Tags */}
            <div className="flex gap-3">
              {tags.map((tag) => (
                <img
                  key={tag.id}
                  src={tag.path}
                  alt={tag.name}
                  className="rounded-lg size-10 hover-animation"
                />
              ))}
            </div>

            {/* Link Project */}
            {/* Perbaikan: Properti href dipindah dari tag <img> ke tag <a> yang benar */}
            <a 
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium cursor-pointer text-purple-400 hover:text-purple-300 transition-colors"
            >
              View Project{" "}
              <img src="assets/arrow-up.svg" className="size-4 invert" alt="arrow" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetails;