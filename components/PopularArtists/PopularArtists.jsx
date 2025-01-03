'use client';

import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const popularArtists = [
  { id: 1, name: "Aria Nyx", username: "@arianyx", image: "https://plus.unsplash.com/premium_vector-1732657880922-96a2b4e87aa0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxpbGx1c3RyYXRpb25zLWZlZWR8MzR8fHxlbnwwfHx8fHw%3D", followers: "245K" },
  { id: 2, name: "Zephyr Blaze", username: "@zephyrblaze", image: "https://plus.unsplash.com/premium_vector-1732657880922-96a2b4e87aa0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxpbGx1c3RyYXRpb25zLWZlZWR8MzR8fHxlbnwwfHx8fHw%3D", followers: "189K" },
  { id: 3, name: "Luna Frost", username: "@lunafrost", image: "https://plus.unsplash.com/premium_vector-1732657880922-96a2b4e87aa0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxpbGx1c3RyYXRpb25zLWZlZWR8MzR8fHxlbnwwfHx8fHw%3D", followers: "312K" },
  { id: 4, name: "Nova Storm", username: "@novastorm", image: "https://plus.unsplash.com/premium_vector-1732657880922-96a2b4e87aa0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxpbGx1c3RyYXRpb25zLWZlZWR8MzR8fHxlbnwwfHx8fHw%3D", followers: "276K" },
  { id: 5, name: "Orion Flux", username: "@orionflux", image: "https://plus.unsplash.com/premium_vector-1732657880922-96a2b4e87aa0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxpbGx1c3RyYXRpb25zLWZlZWR8MzR8fHxlbnwwfHx8fHw%3D", followers: "203K" },
  { id: 6, name: "Celeste Echo", username: "@celesteecho", image: "https://plus.unsplash.com/premium_vector-1732657880922-96a2b4e87aa0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxpbGx1c3RyYXRpb25zLWZlZWR8MzR8fHxlbnwwfHx8fHw%3D", followers: "298K" },
];

export default function PopularArtists() {
  return (
    <section className="relative py-24 overflow-hidden ">
      <div className="absolute inset-0" />
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          ศิลปินยอดนิยม
        </h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {popularArtists.map((artist) => (
            <SwiperSlide key={artist.id}>
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden shadow-2xl border border-gray-800 p-6">
                <div className="flex flex-col items-center">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    width={120}
                    height={120}
                    className="rounded-full object-cover mb-4 border-4 border-[#2dac5c]"
                  />
                  <h3 className="text-xl font-semibold text-white mb-1">{artist.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{artist.username}</p>
                  <button
                    className="mt-4 bg-[#2dac5c] text-white py-2 px-6 rounded-full font-semibold text-sm uppercase tracking-wide"
                  >
                    เข้าชมโปรไฟล์
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
