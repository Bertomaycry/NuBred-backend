import Chat from "../models/chat-history.model";




export const saveChatHistory = async (req, res) => {
    const { message } = req.body;

    if (message) {
        return res.status(400).json({
            success: false,
            message: "Message is Required",
        });
    }
    try {
        const chat = await Chat.create({ message });
        res.status(201).json({
            success: true,
            message: "History saved successfully",
            data: chat,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


export const getAllChat = async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Not Authorized",
        });
    }
    try {
        const chat = await Chat.findById({ userId });
        res.status(201).json({
            success: true,
            message: "History Fetched successfully",
            data: chat,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};