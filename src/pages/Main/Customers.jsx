import { useState } from "react";

export default function Customers({ customers, onAddCustomer, isEmpty }) {
    const [customerForm, setCustomerForm] = useState({
        name: "",
        email: "",
        city: "",
        totalOrder: "",
        tier: "Bronze",
    });

    function getTierClass(tier) {
        if (tier === "Platinum") return "customer-tier platinum";
        if (tier === "Gold") return "customer-tier gold";
        if (tier === "Silver") return "customer-tier silver";
        return "customer-tier bronze";
    }

    function handleSubmitCustomer(event) {
        event.preventDefault();

        if (!customerForm.name.trim() || !customerForm.email.trim() || !customerForm.city.trim()) {
            return;
        }

        onAddCustomer(customerForm);
        setCustomerForm({
            name: "",
            email: "",
            city: "",
            totalOrder: "",
            tier: "Bronze",
        });
    }

    return (
        <div id="dashboard-container">
            <div className="panel-card">
                <div className="panel-title">Customers</div>
                <form className="quick-add-form" onSubmit={handleSubmitCustomer} noValidate>
                    <input
                        type="text"
                        placeholder="Customer name"
                        aria-label="Customer name"
                        value={customerForm.name}
                        onChange={(event) =>
                            setCustomerForm((current) => ({ ...current, name: event.target.value }))
                        }
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        aria-label="Email"
                        value={customerForm.email}
                        onChange={(event) =>
                            setCustomerForm((current) => ({ ...current, email: event.target.value }))
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="City"
                        aria-label="City"
                        value={customerForm.city}
                        onChange={(event) =>
                            setCustomerForm((current) => ({ ...current, city: event.target.value }))
                        }
                        required
                    />
                    <input
                        type="number"
                        min="0"
                        placeholder="Total order"
                        aria-label="Total orders"
                        value={customerForm.totalOrder}
                        onChange={(event) =>
                            setCustomerForm((current) => ({ ...current, totalOrder: event.target.value }))
                        }
                    />
                    <select
                        aria-label="Customer tier"
                        value={customerForm.tier}
                        onChange={(event) =>
                            setCustomerForm((current) => ({ ...current, tier: event.target.value }))
                        }
                    >
                        <option value="Bronze">Bronze</option>
                        <option value="Silver">Silver</option>
                        <option value="Gold">Gold</option>
                        <option value="Platinum">Platinum</option>
                    </select>
                    <button type="submit">Add Customer</button>
                </form>
                {isEmpty ? (
                    <div id="dashboard-empty-state">
                        No customers found
                    </div>
                ) : (
                    <div className="customers-grid">
                        {customers.map((customer) => (
                            <article key={customer.id} className="customer-card">
                                <div className="customer-head">
                                    <div>
                                        <p className="customer-name">{customer.name}</p>
                                        <p className="customer-email">{customer.email}</p>
                                    </div>
                                    <span className={getTierClass(customer.tier)}>{customer.tier}</span>
                                </div>
                                <div className="customer-meta">
                                    <span>{customer.id}</span>
                                    <span>{customer.city}</span>
                                    <span>{customer.totalOrder} Orders</span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
