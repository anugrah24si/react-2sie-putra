import { supabase } from "./supabaseClient";

export const productsAPI = {
    // Get all active products
    async fetchProducts() {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .is("deleted_at", null)
            .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
    },

    // Get single product by ID
    async fetchProductById(id) {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .is("deleted_at", null)
            .single();
        if (error) throw error;
        return data;
    },

    // Admin: Create a product
    async createProduct(productData, userId) {
        const { data, error } = await supabase
            .from("products")
            .insert({ ...productData, created_by: userId })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Admin: Update a product
    async updateProduct(id, updates) {
        const { data, error } = await supabase
            .from("products")
            .update(updates)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Admin: Soft delete a product
    async deleteProduct(id) {
        const { data, error } = await supabase
            .from("products")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
};
