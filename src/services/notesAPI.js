import axios from 'axios'

// Project URL Supabase
const SUPABASE_URL = "https://hvihmzqopsvspvtevhmh.supabase.co"
const API_URL = `${SUPABASE_URL}/rest/v1/note`

// Anon/Public API Key dari Supabase Dashboard
// Cara mendapatkan: Project Settings > API > Project API keys > apikey
const API_KEY = "sb_publishable_8g6rb6wqFezhC5_79Pz6nw_HxSd7m2J"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

export const notesAPI = {
    async fetchNotes() {
        try {
            const response = await axios.get(API_URL, { headers })
            return response.data
        } catch (error) {
            console.error("Error fetching notes:", error.response?.data || error.message)
            throw error
        }
    },

    async createNote(data) {
        try {
            const response = await axios.post(API_URL, data, { headers })
            return response.data
        } catch (error) {
            console.error("Error creating note:", error.response?.data || error.message)
            throw error
        }
    },

    async deleteNote(id) {
        try {
            await axios.delete(`${API_URL}?id=eq.${id}`, { headers })
        } catch (error) {
            console.error("Error deleting note:", error.response?.data || error.message)
            throw error
        }
    }
}
