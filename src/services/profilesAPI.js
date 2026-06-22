import { supabase } from "./supabaseClient";

export const profilesAPI = {
    // Get single profile by ID
    async fetchProfile(id) {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", id)
            .single();
        if (error) throw error;
        return data;
    },

    // Admin: Get all profiles (members/customers)
    async fetchAllProfiles() {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .is("deleted_at", null)
            .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
    },

    // Admin: Get only member profiles
    async fetchMembers() {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "member")
            .is("deleted_at", null)
            .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
    },

    // Update profile fields
    async updateProfile(id, updates) {
        const { data, error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Soft delete profile
    async deleteProfile(id) {
        const { data, error } = await supabase
            .from("profiles")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
};
