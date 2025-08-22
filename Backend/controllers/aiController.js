const {generate} = require('../lib/ai');

const generateDescription = async (req, res) => {
    try {
        const { prompt, eventName } = req.body;
        if(!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        const realPrompt = `Generate a detailed desciption for the event "${eventName}" based on the desciption: ${prompt}. The desciption should be engaging, concise and less than 150 words.`;

        const description = await generate(realPrompt);

        return res.status(200).json({
            succes: true, 
            description 
        });
    }   catch (error)   {
        console.error("Error generating description:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to generate description. Please try again." 
        });
    }
}

module.exports = { generateDescription };