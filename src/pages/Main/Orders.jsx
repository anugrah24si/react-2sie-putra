import { useState } from "react";

export default function Orders({ orders, onAddOrder, isEmpty }) {
    const [orderForm, setOrderForm] = useState({
        customer: "",
        item: "",
        total: "",
        status: "Preparing",
    });

    function getOrderStatusClass(status) {
        if (status === "Delivered") return "order-status delivered";
        if (status === "On Delivery") return "order-status on-delivery";
        if (status === "Preparing") return "order-status preparing";
        return "order-status canceled";
    }

    function handleSubmitOrder(event) {
        event.preventDefault();

        if (!orderForm.customer.trim() || !orderForm.item.trim() || !orderForm.total.trim()) {
            return;
        }

        onAddOrder(orderForm);
        setOrderForm({
            customer: "",
            item: "",
            total: "",
            status: "Preparing",
        });
    }

    return (
        <div id="dashboard-container">
            <div className="panel-card">
                <div className="panel-title">Recent Orders</div>
                <form className="quick-add-form" onSubmit={handleSubmitOrder} noValidate>
                    <input
                        type="text"
                        placeholder="Customer name"
                        aria-label="Customer name"
                        value={orderForm.customer}
                        onChange={(event) =>
                            setOrderForm((current) => ({ ...current, customer: event.target.value }))
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="Menu item"
                        aria-label="Menu item"
                        value={orderForm.item}
                        onChange={(event) =>
                            setOrderForm((current) => ({ ...current, item: event.target.value }))
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="Total (contoh: 78000)"
                        aria-label="Total"
                        value={orderForm.total}
                        onChange={(event) =>
                            setOrderForm((current) => ({ ...current, total: event.target.value }))
                        }
                        required
                    />
                    <select
                        aria-label="Order status"
                        value={orderForm.status}
                        onChange={(event) =>
                            setOrderForm((current) => ({ ...current, status: event.target.value }))
                        }
                    >
                        <option value="Preparing">Preparing</option>
                        <option value="On Delivery">On Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Canceled">Canceled</option>
                    </select>
                    <button type="submit">Add Order</button>
                </form>
                {isEmpty ? (
                    <div id="dashboard-empty-state">
                        No orders found
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="panel-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Item</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.customer}</td>
                                        <td>{order.item}</td>
                                        <td>{order.total}</td>
                                        <td>
                                            <span className={getOrderStatusClass(order.status)}>{order.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
