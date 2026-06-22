import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hvihmzqopsvspvtevhmh.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_8g6rb6wqFezhC5_79Pz6nw_HxSd7m2J"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
