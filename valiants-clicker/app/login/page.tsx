'use client'
import { useEffect, useState } from 'react'
import { login } from './actions'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Mail from '@/components/icon/Mail'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isSubmitClicked, setIsSubmitClicked] = useState(false)
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [error, setError] = useState('')
  const [isIOS, setIsIOS] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    return regex.test(email)
  }

  useEffect(() => {
    setIsValidEmail(validateEmail(email))
  }, [email])

  const validateForm = () => {
    const errors: string[] = []

    if (!validateEmail(email)) {
      errors.push('Introduce una dirección de correo electrónico válida.')
    }

    if (errors.length > 0) {
      setError(errors[0])
      return false
    }
    setError('')

    return true
  }

  async function Login(formData: FormData) {
    setLoading(true)
    try {
      const response = await login(formData)

      console.log(response)
      if (response.ok === true) {
        setSuccess(true)
      }
      if (response.ok === false && response.error === 'over_email_send_rate_limit') {
        setError('Por razones de seguridad, solo puedes solicitar esto una vez cada 60 segundos.')
      }
    } catch (error) {
      setError('Algo salió mal, por favor contacta al soporte.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitClicked(true)

    if (validateForm()) {
      const formData = new FormData(e.target as HTMLFormElement)
      await Login(formData)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsIOS(
        ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
          navigator.platform
        ) ||
          (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
      )
    }
  }, [])

  return (
    <section className='relative min-h-screen w-full bg-cover bg-center bg-no-repeat  font-sans text-custom-blue bg-bg-school grid place-content-center'>
      <div className='darken-overlay' />
      <motion.form
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        onSubmit={handleSubmit}
        className=' w-[22rem] z-10 shadow-lg max-w-sm sm:max-w-md sm:w-[31.25rem] lg:max-w-lg lg:w-[35rem]  flex flex-col border-custom-blue border-l-2 border-b-2 border-r-2  border-t-2 rounded-l-lg rounded-b-lg rounded-t-lg rounded-r-lg '
      >
        <div className='box_header h-6 ' />
        <div className='px-6 py-4 rounded-b-md rounded-t-none bg-gray-50 '>
          {isIOS ? (
            <Image src='/images/logo.png' alt='Logo' className='max-w-sm w-full mx-auto' width={400} height={500} />
          ) : (
            <motion.video className='max-w-sm w-full mt-2 mx-auto' autoPlay loop muted preload='none'>
              <source src='/images/logo-valiants.webm' type='video/webm' />
            </motion.video>
          )}
          {success ? (
            <section className='py-6 flex flex-col gap-2'>
              <p className='text-center font-semibold text-base'>
                Hemos enviado un enlace a tu correo electrónico {email}. Por favor, revisa tu bandeja de entrada.
              </p>
              <p className='text-sm text-center mt-4 '>
                Si no ves el correo en tu bandeja de entrada, por favor verifica tu carpeta de spam o correo no deseado.
              </p>
            </section>
          ) : (
            <section>
              <div className='mt-6 w-full max-w-sm mx-auto relative'>
                <motion.input
                  type='text'
                  name='email'
                  placeholder='Ingresa tu correo electrónico'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  initial={{ width: '0%', paddingLeft: '20px', paddingRight: '20px' }}
                  animate={{ width: '100%', paddingLeft: '40px', paddingRight: '40px' }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className={`border-2 placeholder:text-[#7E82A9] rounded-md bg-[#E1E4FF] py-2 px-12 w-full focus:outline-none ${
                    isSubmitClicked && email === ''
                      ? 'border-[#A4137A] text-[#A4137A] focus:border-[#A4137A] bg-[#FFEEF9] placeholder:text-[#A4137A]'
                      : email === ''
                        ? 'border-custom-blue focus:border-custom-blue placeholder:text-[#7E82A9]'
                        : isValidEmail
                          ? 'border-[#3C50E1] text-[#3C50E1] focus:border-[#3C50E1] placeholder:text-[#3C50E1]'
                          : 'border-[#A4137A] text-[#A4137A] focus:border-[#A4137A] bg-[#FFEEF9] placeholder:text-[#A4137A]'
                  }`}
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='p-1 mt-1 text-center text-sm text-[#A4137A]'
                  >
                    {error}
                  </motion.p>
                )}
                <Mail
                  fill={
                    isSubmitClicked && email === ''
                      ? '#A4137A'
                      : email === ''
                        ? '#0D082C'
                        : isValidEmail
                          ? '#3C50E1'
                          : '#A4137A'
                  }
                  width={32}
                  height={32}
                  className='absolute top-[.3125rem] left-1 transform'
                />
              </div>
              <button
                disabled={loading}
                className='my-3 mt-6 mx-auto sm:mb-6 flex justify-center items-center hover:contrast-125 hover:scale-105 transition-all relative'
                type='submit'
              >
                <Image src='/images/base-botton.png' alt='submit' className='mx-auto' width={140} height={50} />
                <p className='absolute font-inter text-md text-custom-blue italic font-extrabold'>
                  {loading ? 'CARGANDO' : 'INGRESAR'}
                </p>
              </button>
            </section>
          )}
        </div>
      </motion.form>
    </section>
  )
}
