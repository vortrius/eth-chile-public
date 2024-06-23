'use client'

import { contractExecution, contractQuery, getTransaction } from '@/app/actions'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Valiant } from '@/components/valiant'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { shapeToFeed, shapeToIdle, shapeToName, shapeToPlay } from '@/utils/constants'
import { addTx, clearPendingTxs, getPendingTxs, removeTx } from '@/utils/localstorage'

interface ValiantsProps {
  walletId: string
  walletAddress: string
  initialValiants?: number[]
}

type ValiantData = {
  [key: number]: {
    shape: number
    lastMeal: number
    level: number
    lastPlay: number
  }
}

export const Valiants = (props: ValiantsProps) => {
  const { walletId, walletAddress, initialValiants = [] } = props
  const [valiants, setValiants] = useState(initialValiants)
  const [valiantData, setValiantData] = useState<ValiantData>({})
  const [selectedValiant, setSelectedValiant] = useState<number | null>(null)
  const [pendingTxs, setPendingTxs] = useState<{ [key: string]: string }>({})
  const [videoState, setVideoState] = useState<'idle' | 'play' | 'feed'>('idle')

  const pendingValiant = useMemo(() => {
    return !!pendingTxs['v']
  }, [pendingTxs])

  const pendingAction = useMemo(() => {
    return !!pendingTxs[`${selectedValiant}_f`] || !!pendingTxs[`${selectedValiant}_p`]
  }, [pendingTxs, selectedValiant])

  const onRefreshValiants = useCallback(async () => {
    const response = await contractQuery({
      abiFunctionSignature: 'getValiantsOf(address)',
      abiParameters: [walletAddress],
    })

    if (response.data?.outputValues) {
      const newValiants = response.data.outputValues[0]
      setValiants(newValiants)
      setSelectedValiant(newValiants[0])
    }
  }, [walletAddress])

  const onRefreshValiantData = useCallback(async () => {
    const response = await contractQuery({
      abiFunctionSignature: 'getValiant(uint256)',
      abiParameters: [selectedValiant],
    })
    if (response.data.outputValues) {
      setValiantData((prevData: any) => ({ ...prevData, [selectedValiant as number]: response.data.outputValues[0] }))
    }
  }, [selectedValiant])

  useEffect(() => {
    const pendingTxs = getPendingTxs()
    if (Object.keys(pendingTxs).length > 0) {
      setPendingTxs(pendingTxs)
    }
  }, [])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (Object.keys(pendingTxs).length > 0) {
      intervalId = setInterval(() => {
        for (const key in pendingTxs) {
          if (!['v', `${selectedValiant}_f`, `${selectedValiant}_p`].includes(key)) continue
          getTransaction(pendingTxs[key]).then((response) => {
            if (response?.transaction) {
              const state = response.transaction.state
              if (state === 'CONFIRMED' || state === 'DENIED' || state === 'FAILED' || state === 'CANCELLED') {
                setPendingTxs(removeTx(key))

                if (key === 'v') {
                  onRefreshValiants()
                } else {
                  onRefreshValiantData().then(() => {
                    setVideoState('idle')
                  })
                }
              }
            }
          })
        }
      }, 5000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [onRefreshValiantData, onRefreshValiants, pendingTxs, selectedValiant])

  const onObtainValiant = async () => {
    const response = await contractExecution({ abiFunctionSignature: 'mint()', walletId: walletId })
    if (response?.id) {
      setPendingTxs(addTx(response.id, 'v'))
    }
  }

  const onPlayValiant = async () => {
    const response = await contractExecution({
      abiFunctionSignature: 'play(uint256)',
      abiParameters: [selectedValiant],
      walletId: walletId,
    })
    if (response?.id) {
      setPendingTxs(addTx(response.id, `${selectedValiant}_p`))
    }
    setVideoState('play')
  }

  const onFeedValiant = async () => {
    const response = await contractExecution({
      abiFunctionSignature: 'feed(uint256)',
      abiParameters: [selectedValiant],
      walletId: walletId,
    })
    if (response?.id) {
      setPendingTxs(addTx(response.id, `${selectedValiant}_f`))
    }
    setVideoState('feed')
  }

  const selectValiant = (id: number) => {
    setSelectedValiant(id)
  }

  useEffect(() => {
    if (valiants.length > 0) {
      setSelectedValiant(valiants[0])
    }
  }, [valiants])

  useEffect(() => {
    if (selectedValiant !== null) {
      clearPendingTxs()
      setVideoState('idle')
    }
  }, [selectedValiant])

  return (
    <motion.section
      className={`flex ${valiants.length > 0 ? ' justify-start min-h-[75vh] ' : ' min-h-[80vh] justify-center'}  flex-col    items-center px-4 `}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className={`border-2 ${valiants.length > 0 ? 'max-w-4xl  ' : 'max-w-xl'}  bg-home-hero bg-no-repeat  bg-cover relative border-custom-blue h-auto rounded-lg text-custom-blue    lg:pb-10 w-full`}
      >
        <div className='box_header h-8 border-b-2 border-custom-blue  ' />
        <div className='p-4'>
          {valiants.length > 0 && (
            <div>
              <p className='px-2 sm:px-4 font-fugaz text-xl sm:text-3xl text-custom-blue'>TUS VALIANTS</p>
              <p className='px-2 sm:px-4  text-sm sm:text-lg '>Puedes mintear hasta 5 Valiants para armar tu equipo</p>
            </div>
          )}
          {valiants.length > 0 && (
            <div className='flex flex-col-reverse md:flex-row  md:px-4 items-center sm:items-start justify-between text-sm'>
              <div className='flex w-full max-w-[29rem] items-center  md:mt-0 justify-start '>
                {valiants.map((valiant, index) => (
                  <Valiant
                    key={valiant}
                    setValiantData={setValiantData}
                    selectedValiant={selectedValiant}
                    selectValiant={selectValiant}
                    id={valiant}
                  />
                ))}

                {pendingValiant && (
                  <motion.section
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className='border-2 rounded-xl cursor-pointer hover:scale-105 transition-all bg-yellow-400 border-custom-blue  m-2 flex justify-center items-center w-20 h-20  overflow-hidden'
                  >
                    <Image
                      className='transform scale-150 w-full animate-pulse translate-y-3 -translate-x-2'
                      src='/valiants/placeholders/egg.png'
                      width={160}
                      height={80}
                      alt={`egg`}
                    />
                  </motion.section>
                )}
                {valiants.length < 5 && !pendingValiant && (
                  <motion.button
                    onClick={onObtainValiant}
                    disabled={pendingValiant}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className='border-2 rounded-xl  font-fugaz text-5xl cursor-pointer hover:scale-105 transition-all bg-bg-add-valiant bg-no-repeat bg-cover border-custom-blue  m-2 flex justify-center items-center w-20 h-20  overflow-hidden'
                  >
                    <span className='mb-1'>+</span>
                  </motion.button>
                )}
              </div>
            </div>
          )}
          {valiants.length > 0 && (
            <div>
              <p className='font-fugaz  text-xl sm:text-3xl mx-2 sm:mx-6  mt-2'>DETALLES</p>
            </div>
          )}

          {valiants.length > 0 ? (
            <motion.section
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className='flex flex-col md:flex-row'
            >
              <div className='w-full h-[15rem] md:h-[18rem] flex mx-auto justify-center items-center pb-4 max-w-sm  lg:h-[20rem] relative border-2 border-custom-blue  bg-yellow-400 rounded-lg  sm:mx-6 mt-4  '>
                {selectedValiant !== null && valiantData[selectedValiant] && (
                  <>
                    <span className='absolute top-3 left-3 font-fugaz text-xl sm:text-3xl'>0x{selectedValiant}</span>
                    <motion.video
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      key={`${selectedValiant}-${videoState}`}
                      className=' max-w-[15rem] md:max-w-[18rem]  lg:max-w-[20rem]'
                      autoPlay
                      loop
                      muted
                    >
                      <source
                        src={
                          videoState === 'idle'
                            ? shapeToIdle[valiantData[selectedValiant].shape]
                            : videoState === 'play'
                              ? shapeToPlay[valiantData[selectedValiant].shape]
                              : shapeToFeed[valiantData[selectedValiant].shape]
                        }
                        type='video/webm'
                      />
                    </motion.video>
                  </>
                )}
              </div>
              {selectedValiant !== null && valiantData[selectedValiant] && (
                <div className='mt-4 gap-2 grid justify-center items-center px-4 sm:mx-8 grid-cols-1'>
                  <div className='font-fugaz text-lg md:text-2xl flex md:flex-col gap-2 md:gap-0'>
                    NOMBRE:
                    <p className='font-sans text-lg md:text-xl '>
                      {shapeToName[valiantData[selectedValiant].shape]} (Nivel {valiantData[selectedValiant].level} )
                    </p>
                  </div>
                  <div className='font-fugaz text-lg md:text-2xl'>
                    ULTIMA COMIDA:
                    <p className='font-sans text-lg md:text-xl'>
                      {' '}
                      {formatDistanceToNow(new Date(valiantData[selectedValiant].lastMeal * 1000), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                  <div className='font-fugaz text-lg md:text-2xl'>
                    ULTIMO JUEGO:
                    <p className='font-sans text-lg md:text-xl'>
                      {formatDistanceToNow(new Date(valiantData[selectedValiant].lastPlay * 1000), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>

                  <div className='flex md:flex-col md:gap-4 lg:flex-row justify-around md:justify-center items-center mx-auto  py-4 w-full'>
                    <button
                      onClick={onPlayValiant}
                      disabled={pendingAction}
                      className={`flex  justify-center items-center ${videoState === 'play' ? 'grayscale' : 'grayscale-0'}  drop-shadow-xl hover:contrast-125 hover:scale-105 transition-all relative`}
                    >
                      <Image
                        src='/images/base-botton.png'
                        alt='Jugar'
                        className='max-w-[8rem] sm:max-w-[9rem] lg:max-w-[10rem]'
                        width={200}
                        height={50}
                      />
                      <p className='absolute font-fugaz text-sm md:text-base text-custom-blue  font-semibold'>
                        {videoState === 'play' ? 'JUGANDO' : ' JUGAR ⚽'}
                      </p>
                    </button>
                    <button
                      onClick={onFeedValiant}
                      disabled={pendingAction}
                      className={`flex  justify-center items-center ${videoState === 'feed' ? 'grayscale' : 'grayscale-0'}  drop-shadow-xl hover:contrast-125 hover:scale-105 transition-all relative`}
                    >
                      <Image
                        src='/images/base-botton.png'
                        alt='Alimentar'
                        className='max-w-[8rem] sm:max-w-[9rem] lg:max-w-[10rem]'
                        width={200}
                        height={50}
                      />
                      <p className='absolute font-fugaz text-sm md:text-base text-custom-blue  font-semibold'>
                        {videoState === 'feed' ? 'ALIMENTANDO' : 'ALIMENTAR 🍎'}
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </motion.section>
          ) : (
            <div className='p-4 flex flex-col gap-4'>
              <Image
                src='/valiants/placeholders/egg.png'
                className={`mx-auto ${pendingValiant ? 'grayscale-0 animate-pulse' : 'grayscale'} `}
                alt='egg'
                width={160}
                height={160}
              />
              {!pendingValiant && (
                <div className='flex flex-col gap-4'>
                  <h1 className='text-2xl font-bold text-center'> Parece que aún no tienes ningún Valiant</h1>
                  <p className='text-base text-center'>
                    Los <span className='font-bold'>Valiants</span> son personajes únicos que puedes mintear y usar
                    durante el evento
                  </p>
                  <p className='text-center font-bold'>
                    Mintea tu primer <span className='font-bold'>Valiant</span> y unete a la diversión
                  </p>
                </div>
              )}
              {!pendingValiant && (
                <button
                  disabled={pendingValiant}
                  onClick={onObtainValiant}
                  className=' flex justify-center mt-4 items-center hover:contrast-125 hover:scale-105 transition-all relative'
                  type='button'
                >
                  <Image
                    src='/images/base-botton.png'
                    alt='obtener'
                    className='max-w-[8rem] sm:max-w-[9rem] lg:max-w-[10rem]'
                    width={200}
                    height={50}
                  />
                  <p className='absolute font-fugaz text-sm md:text-base text-custom-blue  font-semibold'>
                    {pendingValiant ? 'OBTENIENDO' : 'OBTENER'}
                  </p>
                </button>
              )}
              {pendingValiant && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='text-center font-semibold'
                >
                  Por favor espera...
                </motion.p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.section>
  )
}
