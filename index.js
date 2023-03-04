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
    const { body } = req.body
    const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    )

    const message = {
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.WHATSAPP_PHONE_NUMBER,
        body: body
    }

    try {
        const response = await client.messages.create(message)
        return res.status(200).json(response)
    } catch(err) {
        console.log(err)
    }
})


app.post("/whatsapp", async (req, res) => {
    const message = req.body.Body;
    const sender = req.body.From;
    const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    )
    client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.WHATSAPP_PHONE_NUMBER
    }).then(message => console.log(message.sid, "El Sid??"))
    // console.log(req.body, "")
    console.log(`Mensaje recibido de ${sender}: ${message}`);
  //Aquí se agregar lógica para procesar el mensaje recibido
    return res.send('Mensaje recibido');
})

app.listen(port, () => console.log(`Server listening on port ${port}`))