'use client'

import { useEffect, useState } from 'react'
import { contractQuery } from '@/app/actions'
import Image from 'next/image'
import { motion } from 'framer-motion'
import './animation/selected.css'

export const Valiant = (props: { id: any; setValiantData: any; selectValiant: any; selectedValiant: any }) => {
  const { id, setValiantData, selectValiant, selectedValiant } = props
  const [data, setData] = useState<DataType | null>(null)

  type DataType = {
    shape: keyof typeof shapeToImage
    lastMeal: number
    level: number
    lastPlay: number
  }

  useEffect(() => {
    const fecthData = async () => {
      const response = await contractQuery({ abiFunctionSignature: 'getValiant(uint256)', abiParameters: [id] })
      if (response.data.outputValues) {
        setData(response.data.outputValues[0])
        setValiantData((prevData: any) => ({ ...prevData, [id]: response.data.outputValues[0] }))
      }
    }

    fecthData()
  }, [id, setData, setValiantData])

  const shapeToImage = {
    0: '/valiants/placeholders/calcipher.png',
    1: '/valiants/placeholders/goshi.png',
    2: '/valiants/placeholders/nuki.png',
    3: '/valiants/placeholders/paturai.png',
  }

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => selectValiant(id)}
      className={`rounded-xl  cursor-pointer hover:scale-105 transition-all bg-yellow-400 border-custom-blue m-2 flex justify-center items-center w-20 h-20 md:w-20 md:h-20 overflow-hidden ${
        selectedValiant === id ? 'border-2 border-yellow-500 ' : 'border-2'
      }`}
    >
      {data && (
        <Image
          className='transform scale-150 w-full translate-y-3 -translate-x-2'
          src={shapeToImage[data.shape]}
          width={180}
          height={80}
          alt={`calchiper${data.shape}`}
        />
      )}
    </motion.section>
  )
}
