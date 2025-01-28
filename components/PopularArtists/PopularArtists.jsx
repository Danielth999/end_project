"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import Link from "next/link"

export default function PopularArtists({ users }) {
  return (
    <section className="relative py-24 overflow-hidden">
      <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: white;
          opacity: 0.5;
          width: 0.75rem;
          height: 0.75rem;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background-color: #2dac5c;
          opacity: 1;
        }
      `}</style>
      <div className="absolute inset-0" />
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">ศิลปินยอดนิยม</h2>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{
            clickable: true,
          }}
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
          className="!pb-12" // Add bottom padding for pagination dots
        >
          {users.map((user) => (
            <SwiperSlide key={user.id}>
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden shadow-2xl border border-gray-800 p-6 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-[0_0_30px_rgba(45,172,92,0.3)] group">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Image
                      src={user.imageUrl || "/default-profile.png"}
                      alt={user.firstName || "Unknown Artist"}
                      width={120}
                      height={120}
                      className="rounded-full object-cover border-4 border-[#2dac5c] transition-all duration-300 ease-in-out group-hover:border-[#38ef7d]"
                    />
                    <div className="absolute inset-0 rounded-full bg-[#2dac5c] opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1 transition-all duration-300 ease-in-out group-hover:text-[#38ef7d]">
                    {user.firstName || "Unknown Artist"}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3 transition-all duration-300 ease-in-out group-hover:text-gray-300">
                    @{user.firstName || "unknown"}
                  </p>

                  <Link
                    href={`/profile/${user.id}`}
                    className="mt-4 bg-[#2dac5c] text-white py-2 px-6 rounded-full font-semibold text-sm uppercase tracking-wide transition-all duration-300 ease-in-out hover:bg-[#38ef7d] hover:shadow-lg hover:scale-105 transform"
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
  )
}

