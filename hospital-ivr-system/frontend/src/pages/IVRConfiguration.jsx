
import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Loader from "../components/common/Loader";
import API from "../services/api";

const IVRConfiguration = () => {
    const [configuration, setConfiguration] = useState({
        hospitalName: "",
        welcomeMessage: "",
        supportedLanguages: ["English", "Hindi"],
        contacts: {},
        openingTime: "",
        closingTime: "",
        isActive: true
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchConfiguration = async () => {
            try {
                const { data } = await API.get("/ivr");

                const config = data.configuration || data.ivrConfiguration || data;

                setConfiguration((previous) => ({
                    ...previous,
                    ...config,
                    supportedLanguages: config.supportedLanguages || ["English", "Hindi"],
                    contacts: config.contacts || {}
                }));
            } catch (error) {
                setError("Failed to load IVR configuration.");
            } finally {
                setLoading(false);
            }
        };

        fetchConfiguration();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setConfiguration((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;

        setConfiguration((previous) => ({
            ...previous,
            contacts: {
                ...previous.contacts,
                [name]: value
            }
        }));
    };

    const handleLanguageChange = (e) => {
        const { value, checked } = e.target;

        setConfiguration((previous) => ({
            ...previous,
            supportedLanguages: checked
                ? [...previous.supportedLanguages, value]
                : previous.supportedLanguages.filter(
                    (language) => language !== value
                )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);

        try {
            await API.put("/ivr", configuration);
            setSuccess("IVR configuration updated successfully.");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update IVR configuration."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async () => {
        setError("");
        setSuccess("");

        const newStatus = !configuration.isActive;

        try {
            await API.patch("/ivr/status", {
                isActive: newStatus
            });

            setConfiguration((previous) => ({
                ...previous,
                isActive: newStatus
            }));

            setSuccess(
                `IVR ${newStatus ? "activated" : "deactivated"} successfully.`
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update IVR status."
            );
        }
    };

    if (loading) {
        return <Loader message="Loading IVR configuration..." />;
    }

    return (
        <div className="dashboard-layout">
            <Navbar />

            <div className="dashboard-body">
                <Sidebar />

                <main className="dashboard-content">
                    <h1>IVR Configuration</h1>

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    {success && (
                        <p className="success-message">{success}</p>
                    )}

                    <section className="data-form">
                        <h3>IVR Status</h3>

                        <p>
                            Current Status:{" "}
                            <strong>
                                {configuration.isActive ? "Active" : "Inactive"}
                            </strong>
                        </p>

                        <button
                            type="button"
                            onClick={handleStatusChange}
                        >
                            {configuration.isActive
                                ? "Deactivate IVR"
                                : "Activate IVR"}
                        </button>
                    </section>

                    <form
                        className="data-form"
                        onSubmit={handleSubmit}
                    >
                        <h3>Hospital Settings</h3>

                        <input
                            type="text"
                            name="hospitalName"
                            placeholder="Hospital Name"
                            value={configuration.hospitalName}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            name="welcomeMessage"
                            placeholder="Welcome Message"
                            value={configuration.welcomeMessage}
                            onChange={handleChange}
                            required
                        />

                        <h3>Supported Languages</h3>

                        <label>
                            <input
                                type="checkbox"
                                value="English"
                                checked={configuration.supportedLanguages.includes("English")}
                                onChange={handleLanguageChange}
                            />
                            English
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                value="Hindi"
                                checked={configuration.supportedLanguages.includes("Hindi")}
                                onChange={handleLanguageChange}
                            />
                            Hindi
                        </label>

                        <h3>Department Contact Numbers</h3>

                        <input
                            type="text"
                            name="reception"
                            placeholder="Reception Number"
                            value={configuration.contacts.reception || ""}
                            onChange={handleContactChange}
                        />

                        <input
                            type="text"
                            name="emergency"
                            placeholder="Emergency Number"
                            value={configuration.contacts.emergency || ""}
                            onChange={handleContactChange}
                        />

                        <input
                            type="text"
                            name="billing"
                            placeholder="Billing Number"
                            value={configuration.contacts.billing || ""}
                            onChange={handleContactChange}
                        />

                        <h3>Hospital Working Hours</h3>

                        <label>Opening Time</label>
                        <input
                            type="time"
                            name="openingTime"
                            value={configuration.openingTime}
                            onChange={handleChange}
                        />

                        <label>Closing Time</label>
                        <input
                            type="time"
                            name="closingTime"
                            value={configuration.closingTime}
                            onChange={handleChange}
                        />

                        <button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save Configuration"}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default IVRConfiguration;

