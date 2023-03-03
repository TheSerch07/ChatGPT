const express = require("express");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();

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
})


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`))