import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { circle } from '@/lib/circle'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const supabase = createClient()

    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      redirectTo.searchParams.delete('next')

      const { data: wallet } = await supabase.from('user_wallet').select('*').eq('user_id', data.user?.id).single()

      console.log('wallet', wallet)

      if (wallet) {
        return NextResponse.redirect(redirectTo)
      }

      // Create circle wallet if dont have one
      const network = 'ETH-SEPOLIA'

      const response = await circle.createWallets({
        accountType: 'SCA',
        blockchains: [network],
        count: 1,
        walletSetId: process.env.WALLET_SET_ID as string,
        metadata: [{ refId: data.user?.id }],
      })

      const circleWallet = response?.data?.wallets[0]

      if (circleWallet) {
        await supabase.from('user_wallet').insert({
          user_id: data.user?.id,
          wallet_address: circleWallet.address,
          wallet_id: circleWallet.id,
        })
      }
      return NextResponse.redirect(redirectTo)
    }

    console.log(error)
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/error'
  return NextResponse.redirect(redirectTo)
}
