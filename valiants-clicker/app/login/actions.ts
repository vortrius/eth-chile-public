'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
  }

  const response = await supabase.auth.signInWithOtp({ email: data.email })

  if (response.error) {
    return {
      ok: false,
      error: response.error.code,
    }
  } else {
    return {
      ok: true,
    }
  }
}

export const logout = async () => {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}
