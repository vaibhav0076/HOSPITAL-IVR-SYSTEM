
import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const menus = {
    English: {
        welcome: "Welcome to the Hospital IVR System. Please select an option.",
        options: [
            "Book Appointment",
            "Existing Appointment",
            "Talk to Department",
            "Emergency",
            "Billing",
            "Lab Reports",
            "Customer Care",
            "Repeat Menu",
            "End Call"
        ]
    },
    Hindi: {
        welcome: "Hospital IVR System mein aapka swagat hai. Kripya ek option chunein.",
        options: [
            "Appointment Book Karein",
            "Existing Appointment",
            "Department Se Baat Karein",
            "Emergency",
            "Billing",
            "Lab Reports",
            "Customer Care",
            "Menu Dobara Sunein",
            "Call End Karein"
        ]
    }
};

const IVRSimulator = () => {
    const [language, setLanguage] = useState("");
    const [message, setMessage] = useState(
        "Welcome! Please select your preferred language."
    );
    const [callStarted, setCallStarted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [history, setHistory] = useState([]);

    const startCall = (selectedLanguage) => {
        setLanguage(selectedLanguage);
        setCallStarted(true);
        setCallEnded(false);
        setHistory([]);

        const welcomeMessage = menus[selectedLanguage].welcome;
        setMessage(welcomeMessage);
        setHistory([welcomeMessage]);
    };

    const handleKeyPress = (key) => {
        if (!callStarted || callEnded) return;

        let response = "";

        if (key === "8") {
            response = menus[language].welcome;
        } else if (key === "9") {
            response = "Thank you for calling. Your call has ended.";
            setCallEnded(true);
        } else {
            const selectedOption = menus[language].options[Number(key) - 1];

            if (selectedOption) {
                response = `You selected ${selectedOption}. This option will be connected to its IVR workflow.`;
            } else {
                response = "Invalid selection. Please try again.";
            }
        }

        setMessage(response);
        setHistory((previous) => [...previous, `Key ${key}: ${response}`]);
    };

    const endCall = () => {
        setCallEnded(true);
        setMessage("Call ended.");
        setHistory((previous) => [...previous, "Call ended."]);
    };

    const resetCall = () => {
        setLanguage("");
        setCallStarted(false);
        setCallEnded(false);
        setMessage("Welcome! Please select your preferred language.");
        setHistory([]);
    };

    return (
        <div className="dashboard-layout">
            <Navbar />

            <div className="dashboard-body">
                <Sidebar />

                <main className="dashboard-content">
                    <h1>IVR Simulator</h1>

                    <div className="data-form">
                        <h3>Call Simulator</h3>

                        {!callStarted && (
                            <>
                                <p>Select your preferred language:</p>

                                <button onClick={() => startCall("English")}>
                                    English
                                </button>

                                <button onClick={() => startCall("Hindi")}>
                                    Hindi
                                </button>
                            </>
                        )}

                        {callStarted && (
                            <>
                                <p>
                                    <strong>Language:</strong> {language}
                                </p>

                                <div className="ivr-display">
                                    <h3>IVR Message</h3>
                                    <p>{message}</p>
                                </div>

                                <h3>Phone Keypad</h3>

                                <div className="ivr-keypad">
                                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => handleKeyPress(key)}
                                            disabled={callEnded}
                                        >
                                            {key}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={endCall}
                                    disabled={callEnded}
                                >
                                    End Call
                                </button>

                                <button onClick={resetCall}>
                                    New Call
                                </button>
                            </>
                        )}
                    </div>

                    <div className="data-form">
                        <h3>Call History</h3>

                        {history.length === 0 ? (
                            <p>No call activity yet.</p>
                        ) : (
                            <ul>
                                {history.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default IVRSimulator;
