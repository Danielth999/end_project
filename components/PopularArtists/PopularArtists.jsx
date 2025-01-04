"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
export default function PopularArtists({ users }) {
  return (
    <section className="relative py-24 overflow-hidden">
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
          {users.map((user) => (
            <SwiperSlide key={user.id}>
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden shadow-2xl border border-gray-800 p-6">
                <div className="flex flex-col items-center">
                  <Image
                    src={user.imageUrl || "/default-profile.png"}
                    alt={user.firstName || "Unknown Artist"}
                    width={120}
                    height={120}
                    className="rounded-full object-cover mb-4 border-4 border-[#2dac5c]"
                  />
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {user.firstName || "Unknown Artist"}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    @{user.firstName || "unknown"}
                  </p>

                  <Link
                    href={`/profile/${user.id}`}
                    className="mt-4 bg-[#2dac5c] text-white py-2 px-6 rounded-full font-semibold text-sm uppercase tracking-wide"
                  >
                    เข้าชมโปรไฟล์
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
