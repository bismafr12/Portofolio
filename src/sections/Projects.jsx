"use client";
import { useState } from "react";
import Project from "../components/Project";
import { myProjects } from "../constants";
import { motion, useMotionValue, useSpring } from "motion/react";

const Projects = () => {
  // State untuk efek hover preview bawaan Anda
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 10, stiffness: 50 });
  const springY = useSpring(y, { damping: 10, stiffness: 50 });
  
  const handleMouseMove = (e) => {
    x.set(e.clientX + 20);
    y.set(e.clientY + 20);
  };

  const [preview, setPreview] = useState(null);

  // 🌟 BARU: State untuk menyimpan proyek yang diklik "Read More"
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative c-space section-spacing"
    >
      <h2 className="text-heading">My Selected Projects</h2>
      <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent mt-12 h-[1px] w-full" />
      
      {myProjects.map((project) => (
        <Project 
          key={project.id} 
          {...project} 
          setPreview={setPreview} 
          // 🌟 Kirim fungsi ini agar bisa dipicu oleh tombol "Read More" di dalam komponen Project
          onReadMore={() => setSelectedProject(project)} 
        />
      ))}

      {/* Efek Hover Preview Gambar bawaan Anda */}
      {preview && (
        <motion.img
          className="fixed top-0 left-0 z-50 object-cover h-56 rounded-lg shadow-lg pointer-events-none w-80"
          src={preview}
          style={{ x: springX, y: springY }}
        />
      )}

      {/* 🌟 BARU: CARD MODAL DETAIL & BACKDROP LAYER */}
      {selectedProject && (
        <>
          {/* Lapisan Hitam Transparan di belakang Card (Klik di sini untuk keluar) */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] cursor-default"
            onClick={() => setSelectedProject(null)} // 👈 Menutup card saat klik di sembarang tempat di luar
          />

          {/* Kotak Card Detail Proyek (Bisa di-drag & aman dari konflik klik-luar) */}
          <motion.div
            className="fixed z-[70] p-6 rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-200 w-[22rem] sm:w-[26rem] shadow-2xl flex flex-col gap-4 top-1/4 left-1/2 -ml-[11rem] sm:-ml-[13rem] cursor-grab"
            whileHover={{ scale: 1.01 }}
            drag
            dragElastic={0.2}
            onClick={(e) => e.stopPropagation()} // 🌟 Mencegah klik di dalam Card menutup dirinya sendiri
          >
            {/* Tombol X kecil di pojok kanan atas sebagai alternatif penutup */}
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white text-sm"
            >
              ✕
            </button>

            {/* Gambar di dalam Card Detail */}
            {selectedProject.spotlight && (
              <img
                src={selectedProject.spotlight}
                alt={selectedProject.title}
                className="w-full h-44 object-cover rounded-xl pointer-events-none"
              />
            )}

            {/* Informasi Proyek */}
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{selectedProject.title}</h3>
              <p className="text-xs text-purple-400 font-medium mb-3">{selectedProject.subDesc}</p>
              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                {selectedProject.desc || "Detail deskripsi lengkap proyek Anda akan tampil di sini..."}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </section>
  );
};

export default Projects;