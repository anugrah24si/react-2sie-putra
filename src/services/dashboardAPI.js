import { supabase } from "./supabaseClient";

export const dashboardAPI = {
    // Admin dashboard stats
    async fetchAdminDashboard() {
        // Total customers (members)
        const { count: totalCustomers } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "member")
            .is("deleted_at", null);

        // Total products
        const { count: totalProducts } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .is("deleted_at", null);

        // Total orders
        const { count: totalOrders } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true });

        // Total revenue (sum of final_amount where status = Completed)
        const { data: revenueData } = await supabase
            .from("orders")
            .select("final_amount")
            .eq("status", "Completed");

        const totalRevenue = (revenueData || []).reduce(
            (sum, order) => sum + Number(order.final_amount), 0
        );

        // Members per tier
        const { data: tierData } = await supabase
            .from("profiles")
            .select("tier")
            .eq("role", "member")
            .is("deleted_at", null);

        const membersPerTier = { Bronze: 0, Silver: 0, Gold: 0, Platinum: 0 };
        (tierData || []).forEach((p) => {
            if (membersPerTier[p.tier] !== undefined) {
                membersPerTier[p.tier]++;
            }
        });

        // Recent orders (last 5)
        const { data: recentOrders } = await supabase
            .from("orders")
            .select(`
                *,
                profiles:member_id (full_name, email)
            `)
            .order("created_at", { ascending: false })
            .limit(5);

        return {
            totalCustomers: totalCustomers || 0,
            totalProducts: totalProducts || 0,
            totalOrders: totalOrders || 0,
            totalRevenue,
            membersPerTier,
            recentOrders: recentOrders || [],
        };
    },

    // Member dashboard stats
    async fetchMemberDashboard(memberId) {
        // Get profile
        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", memberId)
            .single();

        // Get total orders count
        const { count: totalOrders } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .eq("member_id", memberId);

        // Get recent orders (last 5)
        const { data: recentOrders } = await supabase
            .from("orders")
            .select(`
                *,
                order_items (
                    id, quantity, price_at_time, subtotal,
                    products:product_id (title)
                )
            `)
            .eq("member_id", memberId)
            .order("created_at", { ascending: false })
            .limit(5);

        // Get tier config for discount info
        const { data: tierConfig } = await supabase
            .from("tier_config")
            .select("*")
            .order("min_points", { ascending: true });

        return {
            profile,
            totalOrders: totalOrders || 0,
            recentOrders: recentOrders || [],
            tierConfig: tierConfig || [],
        };
    },
};
