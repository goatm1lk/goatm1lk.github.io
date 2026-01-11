import { NextResponse } from "next/server";
import Mailgun from "mailgun.js";
import FormData from "form-data";

export async function POST(request) {
    const { name, email, message } = await request.json();

    console.log("Received message from:", name, email, message);
    console.log("Using Mailgun API Key:", process.env.PROD_MAILGUN ? "Present" : "Missing");
    const mailgun = new Mailgun(FormData);

    const mg = mailgun.client({
        username: "api",
        key: process.env.PROD_MAILGUN,
    });
    try {
        const data = await mg.messages.create("mg.klabstesting.com", {
            from: "Mailgun <postmaster@mg.klabstesting.com>",
            to: ["Kyle Sharpless <sharpless.kale@gmail.com>"],
            subject: `New Message from ${name} | ${email}`,
            text: message,
        });

        console.log(data); // logs response data
    } catch (error) {
        console.log(error); //logs any error
        return NextResponse.json(
            { status: `Failed to send message: ${error.message}` },
            { status: 400 }
        );
    }
    return NextResponse.json(
        { status: "Message sent successfully" },
        { status: 200 }
    );
}
