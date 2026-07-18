"use client";
import { motion } from "motion/react";
import React from "react";

const Card = ({ style, text, image, containerRef }) => {
  // Posisi default agar muncul tepat di tengah layar saat dipanggil
  const defaultStyle = {
    top: "35%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    ...style
  };

  return image && !text ? (
    <motion.img
      className="absolute w-40 cursor-grab shadow-2xl rounded-xl"
      src={image}
      style={defaultStyle}
      whileHover={{ scale: 1.02 }}
      drag
      dragConstraints={containerRef}
      dragElastic={0.5}
    />
  ) : (
    <motion.div
      className="absolute p-6 text-base text-left rounded-2xl ring-1 ring-neutral-800 font-light bg-neutral-900 text-neutral-200 w-[20rem] cursor-grab shadow-2xl flex flex-col gap-3"
      style={defaultStyle}
      whileHover={{ scale: 1.02 }}
      drag
      dragConstraints={containerRef}
      dragElastic={0.5}
    >
      <p className="leading-relaxed">{text}</p>
    </motion.div>
  );
};

export default Card;