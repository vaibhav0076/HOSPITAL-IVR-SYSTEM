
import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Loader from "../components/common/Loader";
import API from "../services/api";

const Billing = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        patient: "",
        appointment: "",
        amount: "",
        paymentMethod: "Cash"
    });

    const fetchBills = async () => {
        try {
            const { data } = await API.get("/billing");
            setBills(data.bills || []);
        } catch (error) {
            setError("Failed to load billing records.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await API.post("/billing", {
                ...formData,
                amount: Number(formData.amount),
                appointment: formData.appointment || null
            });

            setFormData({
                patient: "",
                appointment: "",
                amount: "",
                paymentMethod: "Cash"
            });

            await fetchBills();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create bill."
            );
        }
    };

    const handlePayment = async (id) => {
        const paidAmount = window.prompt("Enter payment amount:");

        if (paidAmount === null || paidAmount.trim() === "") {
            return;
        }

        const amount = Number(paidAmount);

        if (!Number.isFinite(amount) || amount <= 0) {
            setError("Please enter a valid payment amount.");
            return;
        }

        try {
            await API.patch(`/billing/${id}/payment`, {
                paidAmount: amount
            });

            await fetchBills();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update payment."
            );
        }
    };

    if (loading) {
        return <Loader message="Loading billing records..." />;
    }

    return (
        <div className="dashboard-layout">
            <Navbar />

            <div className="dashboard-body">
                <Sidebar />

                <main className="dashboard-content">
                    <h1>Hospital Billing</h1>

                    {error && <p className="error-message">{error}</p>}

                    <form className="data-form" onSubmit={handleSubmit}>
                        <h3>Create New Bill</h3>

                        <input
                            name="patient"
                            placeholder="Patient ID"
                            value={formData.patient}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="appointment"
                            placeholder="Appointment ID (optional)"
                            value={formData.appointment}
                            onChange={handleChange}
                        />

                        <input
                            type="number"
                            name="amount"
                            placeholder="Bill Amount"
                            value={formData.amount}
                            onChange={handleChange}
                            min="1"
                            required
                        />

                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                        >
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="UPI">UPI</option>
                            <option value="Online">Online</option>
                        </select>

                        <button type="submit">Create Bill</button>
                    </form>

                    <h3>Billing Records</h3>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Invoice Number</th>
                                    <th>Patient</th>
                                    <th>Amount</th>
                                    <th>Paid Amount</th>
                                    <th>Balance</th>
                                    <th>Payment Method</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {bills.map((bill) => (
                                    <tr key={bill._id}>
                                        <td>{bill.invoiceNumber}</td>
                                        <td>{bill.patient?.name || "N/A"}</td>
                                        <td>₹{bill.amount}</td>
                                        <td>₹{bill.paidAmount || 0}</td>
                                        <td>
                                            ₹{Math.max(
                                                0,
                                                bill.amount - (bill.paidAmount || 0)
                                            )}
                                        </td>
                                        <td>{bill.paymentMethod}</td>
                                        <td>{bill.status}</td>
                                        <td>
                                            {bill.status !== "Paid" && (
                                                <button
                                                    onClick={() =>
                                                        handlePayment(bill._id)
                                                    }
                                                >
                                                    Record Payment
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {bills.length === 0 && (
                                    <tr>
                                        <td colSpan="8">No billing records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Billing;
