'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Navbar({ logout, data, wallet }: { logout: () => void; data: any; wallet: any }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className='p-4  w-full'>
      <div className='flex justify-between items-center'>
        <div className='flex justify-center gap-1  items-center'>
          <Image src='/images/logo.png' alt='Logo' width={160} height={50} className='block sm:hidden' />

          <Image src='/images/logo-eth-chile.png' alt='Logo' width={20} height={50} className='block sm:hidden' />
        </div>
        <button className='sm:hidden' onClick={toggleMenu}>
          {isOpen ? (
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
            </svg>
          ) : (
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
            </svg>
          )}
        </button>
        <form className='hidden sm:flex flex-grow md:max-w-fit md:mx-auto rounded-xl text-custom-blue p-4 bg-home-hero border-2 border-custom-blue items-center justify-end gap-4 lg:gap-10 lg:p-6 xl:px-20'>
          <div>
            <p className='font-semibold font-sans text-sm sm:text-base md:text-lg'>
              <span className='font-fugaz'>HOLA,</span> {data.user.email}
            </p>
            <p className='font-semibold font-sans text-sm sm:text-base md:text-lg'>
              <span className='font-fugaz '>WALLET: </span> {wallet.wallet_address}
            </p>
          </div>
          <button
            formAction={logout}
            className='flex justify-center items-center hover:contrast-125 hover:scale-105 transition-all relative'
            type='submit'
          >
            <Image
              src='/images/base-botton.png'
              className='max-w-[8rem] md:max-w-[9rem] lg:max-w-[10rem]'
              alt='base-botton'
              width={180}
              height={50}
            />
            <p className='absolute font-fugaz text-[.75rem] md:text-sm lg:text-base text-custom-blue italic font-extrabold'>
              CERRAR SESIÓN
            </p>
          </button>
        </form>
      </div>

      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className='overflow-hidden sm:hidden'
      >
        <form className='flex flex-col mt-4 rounded-xl text-custom-blue p-4 bg-home-hero border-2 border-custom-blue items-center gap-4'>
          <div>
            <p className='font-semibold w-full text-center font-sans text-sm sm:text-base md:text-lg'>
              <span className='font-fugaz'>HOLA,</span> {data.user.email}
            </p>
            <p className='font-semibold w-full text-center font-sans text-sm sm:text-base md:text-lg'>
              <span className='font-fugaz mx-auto'>WALLET: </span> {wallet.wallet_address}
            </p>
          </div>
          <button
            formAction={logout}
            className='flex justify-center items-center hover:contrast-125 hover:scale-105 transition-all relative'
            type='submit'
          >
            <Image
              src='/images/base-botton.png'
              className='max-w-[8rem] md:max-w-[9rem] lg:max-w-[10rem]'
              alt='base-botton'
              width={180}
              height={50}
            />
            <p className='absolute font-fugaz text-[.75rem] md:text-sm lg:text-base text-custom-blue italic font-extrabold'>
              CERRAR SESIÓN
            </p>
          </button>
        </form>
      </motion.div>
    </nav>
  )
}
