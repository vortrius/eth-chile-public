import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/login/actions'
import { Valiants } from '@/components/valiants'
import { contractQuery } from '@/app/actions'
import Image from 'next/image'
import Navbar from '@/components/navbar'

export default async function Home() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  const { data: wallet } = await supabase.from('user_wallet').select('*').eq('user_id', data.user?.id).single()

  const response = await contractQuery({
    abiFunctionSignature: 'getValiantsOf(address)',
    abiParameters: [wallet.wallet_address],
  })

  return (
    <main className='min-h-screen bg-bg-school bg-no-repeat bg-cover w-full '>
      <div className='darken-overlay' />
      <section className='relative z-10 font-sans'>
        <Navbar data={data} wallet={wallet} logout={logout} />
        <Valiants
          walletAddress={wallet.wallet_address}
          walletId={wallet.wallet_id}
          initialValiants={response.data?.outputValues?.[0]}
        />
      </section>
    </main>
  )
}
