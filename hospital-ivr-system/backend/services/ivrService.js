
const IVRConfiguration = require("../models/IVRConfiguration");
const CallSession = require("../models/CallSession");

const {
    updateCallMenu,
    recordKeypadSelection,
    endCallSession
} = require("./callService");

// Default IVR menus
const DEFAULT_MENUS = {
    English: {
        welcome: "Welcome to the hospital. Press 1 for Hindi or 2 for English.",
        mainMenu: {
            "1": "Book Appointment",
            "2": "Existing Appointment",
            "3": "Talk to Department",
            "4": "Emergency",
            "5": "Billing",
            "6": "Lab Reports",
            "7": "Customer Care",
            "8": "Repeat Menu",
            "9": "End Call"
        },
        goodbye: "Thank you for calling. Have a nice day."
    },

    Hindi: {
        welcome: "Hospital mein aapka swagat hai. Hindi ke liye 1 aur English ke liye 2 dabayein.",
        mainMenu: {
            "1": "Appointment Book Karein",
            "2": "Existing Appointment",
            "3": "Department Se Baat Karein",
            "4": "Emergency",
            "5": "Billing",
            "6": "Lab Reports",
            "7": "Customer Care",
            "8": "Menu Dobara Sunein",
            "9": "Call Samapt Karein"
        },
        goodbye: "Hospital ko call karne ke liye dhanyavaad."
    }
};

// Get current IVR configuration
const getIVRSettings = async () => {
    const configuration = await IVRConfiguration.findOne();

    if (!configuration) {
        return {
            isActive: false,
            configuration: null,
            menus: DEFAULT_MENUS
        };
    }

    const englishMenu = { ...DEFAULT_MENUS.English.mainMenu };

    // Apply active menu options from database
    configuration.menuOptions.forEach((option) => {
        if (option.isActive) {
            englishMenu[option.key] = option.label;
        } else {
            delete englishMenu[option.key];
        }
    });

    return {
        isActive: configuration.isActive,
        configuration,
        menus: {
            English: {
                ...DEFAULT_MENUS.English,
                welcome:
                    configuration.welcomeMessage ||
                    DEFAULT_MENUS.English.welcome,
                mainMenu: englishMenu
            },
            Hindi: DEFAULT_MENUS.Hindi
        }
    };
};

// Get language selection menu
const getLanguageMenu = async () => {
    const settings = await getIVRSettings();

    if (!settings.isActive) {
        throw new Error("Hospital IVR system is currently unavailable");
    }

    const supportedLanguages =
        settings.configuration.supportedLanguages;

    const options = {};

    if (supportedLanguages.includes("Hindi")) {
        options["1"] = "Hindi";
    }

    if (supportedLanguages.includes("English")) {
        options["2"] = "English";
    }

    return {
        currentMenu: "LANGUAGE_SELECTION",
        message: settings.menus.English.welcome,
        options
    };
};

// Get main menu in selected language
const getMainMenu = async (language = "English") => {
    const settings = await getIVRSettings();

    if (!settings.isActive) {
        throw new Error("Hospital IVR system is currently unavailable");
    }

    const supportedLanguages =
        settings.configuration.supportedLanguages;

    const selectedLanguage =
        supportedLanguages.includes(language) &&
        DEFAULT_MENUS[language]
            ? language
            : "English";

    return {
        currentMenu: "MAIN_MENU",
        language: selectedLanguage,
        message: "Please select an option.",
        options: settings.menus[selectedLanguage].mainMenu
    };
};

// Process language selection
const processLanguageSelection = async (selection) => {
    const settings = await getIVRSettings();
    const input = String(selection);

    if (!settings.isActive) {
        throw new Error("Hospital IVR system is currently unavailable");
    }

    const supportedLanguages =
        settings.configuration.supportedLanguages;

    if (input === "1" && supportedLanguages.includes("Hindi")) {
        return {
            success: true,
            language: "Hindi",
            nextMenu: "MAIN_MENU",
            message: "Aapne Hindi chuni hai."
        };
    }

    if (input === "2" && supportedLanguages.includes("English")) {
        return {
            success: true,
            language: "English",
            nextMenu: "MAIN_MENU",
            message: "You have selected English."
        };
    }

    return {
        success: false,
        message: "Invalid selection. Please choose a supported language."
    };
};

// Process main menu selection
const processMainMenuSelection = async (
    selection,
    language = "English"
) => {
    const settings = await getIVRSettings();
    const input = String(selection);

    if (!settings.isActive) {
        throw new Error("Hospital IVR system is currently unavailable");
    }

    const selectedLanguage =
        settings.menus[language] ? language : "English";

    const menuOptions =
        settings.menus[selectedLanguage].mainMenu;

    if (!menuOptions[input]) {
        return {
            success: false,
            message: "Invalid selection. Please try again."
        };
    }

    if (input === "8") {
        return {
            success: true,
            action: "REPEAT_MENU",
            nextMenu: "MAIN_MENU",
            message: "Please select an option again.",
            options: menuOptions
        };
    }

    if (input === "9") {
        return {
            success: true,
            action: "END_CALL",
            message: settings.menus[selectedLanguage].goodbye
        };
    }

    const menuActions = {
        "1": "BOOK_APPOINTMENT",
        "2": "EXISTING_APPOINTMENT",
        "3": "TALK_TO_DEPARTMENT",
        "4": "EMERGENCY",
        "5": "BILLING",
        "6": "LAB_REPORTS",
        "7": "CUSTOMER_CARE"
    };

    return {
        success: true,
        action: menuActions[input],
        selectedOption: input,
        nextMenu: menuActions[input],
        message: menuOptions[input]
    };
};

// Process keypad selection for an active call session
const processIVRInput = async (sessionId, selection) => {
    if (!sessionId) {
        throw new Error("Call session ID is required");
    }

    const input = String(selection);

    if (!/^[1-9]$/.test(input)) {
        throw new Error("Invalid keypad input");
    }

    const settings = await getIVRSettings();

    if (!settings.isActive) {
        throw new Error("Hospital IVR system is currently unavailable");
    }

    const session = await CallSession.findById(sessionId);

    if (!session) {
        throw new Error("Call session not found");
    }

    if (session.sessionStatus !== "Active") {
        throw new Error("This call session is no longer active");
    }

    // Process language selection
    if (session.currentMenu === "LANGUAGE_SELECTION") {
        const result = await processLanguageSelection(input);

        if (!result.success) {
            return result;
        }

        await recordKeypadSelection(sessionId, input);

        session.language = result.language;
        await session.save();

        await updateCallMenu(sessionId, "MAIN_MENU");

        return result;
    }

    // Process main menu selection
    if (session.currentMenu === "MAIN_MENU") {
        const result = await processMainMenuSelection(
            input,
            session.language || "English"
        );

        if (!result.success) {
            return result;
        }

        await recordKeypadSelection(sessionId, input);

        if (result.action === "END_CALL") {
            await endCallSession(sessionId, "Completed");
        } else if (result.action === "REPEAT_MENU") {
            await updateCallMenu(sessionId, "MAIN_MENU");
        } else {
            await updateCallMenu(sessionId, result.nextMenu);
        }

        return result;
    }

    return {
        success: false,
        message: "This IVR menu flow is not implemented yet."
    };
};

// Change current menu of a call session
const navigateIVRMenu = async (sessionId, menuName) => {
    return await updateCallMenu(sessionId, menuName);
};

module.exports = {
    getIVRSettings,
    getLanguageMenu,
    getMainMenu,
    processLanguageSelection,
    processMainMenuSelection,
    processIVRInput,
    navigateIVRMenu
};
