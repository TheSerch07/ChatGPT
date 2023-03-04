const express = require("express");
const twilio = require("twilio");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const { Say } = require("twilio/lib/twiml/VoiceResponse");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const configuration = new Configuration({
    apiKey: process.env.API_KEY_OPENAI,
});

const openai = new OpenAIApi(configuration);

app.post("/find-complexity", async (req, res) => {
    try {
        const { content } = req.body
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: content}],
        });
        return res.status(200).json(completion.data.choices[0].message)
    } catch(err) {
        console.log(err)
    }
});

app.post("/sendWhatsApp", async (req, res) => {
    const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    )
})


app.listen(port, () => console.log(`Server listening on port ${port}`))