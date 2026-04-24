import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xibzrepcvhimlvdldmhf.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_dAIifOfxn8p_3Y3mUi1MOg_xvIIGTYl'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function logUncoveredDemand(lat: number, lng: number, email?: string) {
  try {
    const { error } = await supabase
      .from('uncovered_demand')
      .insert([
        { latitude: lat, longitude: lng, email: email }
      ])
    if (error) throw error
  } catch (err) {
    console.error('Error logging demand:', err)
  }
}
