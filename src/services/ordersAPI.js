import { supabase } from "./supabaseClient";

export const ordersAPI = {
    // Fetch all orders (admin sees all, member sees own via RLS)
    async fetchOrders() {
        const { data, error } = await supabase
            .from("orders")
            .select(`
                *,
                profiles:member_id (full_name, email),
                order_items (
                    id, product_id, quantity, price_at_time, subtotal,
                    products:product_id (title, code)
                )
            `)
            .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
    },

    // Get a single order by ID with items
    async fetchOrderById(id) {
        const { data, error } = await supabase
            .from("orders")
            .select(`
                *,
                profiles:member_id (full_name, email),
                order_items (
                    id, product_id, quantity, price_at_time, subtotal,
                    products:product_id (title, code)
                )
            `)
            .eq("id", id)
            .single();
        if (error) throw error;
        return data;
    },

    // Member: Create an order with items
    async createOrder(memberId, items, discountPercentage = 0) {
        // Calculate totals
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discountAmount = Math.floor(totalAmount * discountPercentage / 100);
        const finalAmount = totalAmount - discountAmount;

        // Insert order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                member_id: memberId,
                status: "Pending",
                total_amount: totalAmount,
                discount_percentage: discountPercentage,
                discount_amount: discountAmount,
                final_amount: finalAmount,
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // Insert order items
        const orderItems = items.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_time: item.price,
            subtotal: item.price * item.quantity,
        }));

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return order;
    },

    // Admin: Update order status
    async updateOrderStatus(id, status) {
        const { data, error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Member: Get own order history
    async fetchMemberOrders(memberId) {
        const { data, error } = await supabase
            .from("orders")
            .select(`
                *,
                order_items (
                    id, product_id, quantity, price_at_time, subtotal,
                    products:product_id (title, code)
                )
            `)
            .eq("member_id", memberId)
            .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
    },
};
