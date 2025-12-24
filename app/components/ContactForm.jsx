import { useState, useEffect } from "react";
export default function ContactForm() {

    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [contactFormFlags, setContactFormFlags] = useState({
        name: true,
        email: true,
        message: true
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
        setContactFormField(name, value);
    }
    const setContactFormField = (fieldName, value) => {
        if (validateInput(fieldName, value)) {
            console.log("This is a valid input");
            setContactForm({
                ...contactForm,
                [fieldName]: value
            });
        }
        else {
            console.error("Invalid input for " + fieldName);
            setContactFormFlags({
                ...contactFormFlags,
                [fieldName]: false
            });
        }

    }
    const sendMessage = async () => {
        try {
            console.log("Sending message", contactForm);
        }
        catch {
            console.error("Failed to send message");
        }
    }
    const clearForm = () => {
        setContactForm({
            name: "",
            email: "",
            message: ""
        })
    }
    const validateInput = (name, value) => {
        switch (name) {
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            case "name":
                return value.trim().length > 0;
            case "message":
                return value.trim().length > 0;
            default:
                return true;
        }
    }
    return (
        <>
            <div className={styles.container}>
                <h1 className={styles.title} >Contact Form</h1>
                <input onChange={handleChange} name="name" className={styles.body} placeholder="Name" value={contactForm.name}></input>
                <input onChange={handleChange} name="email" className={styles.body} placeholder="Email" value={contactForm.email}></input>
                <textarea onChange={handleChange} name="message" className={styles.body} placeholder="Message" value={contactForm.message}></textarea>
                <button className={styles.button} onClick={sendMessage} >Submit</button>
                <button className={styles.button} onClick={clearForm} >Clear</button>
            </div>

        </>
    )
}
const styles = {
    container: "flex flex-col border-4 border-gray-500 rounded-xl gap-5 h-full w-full p-5",
    title: "w-full gap-2 p-2 mb-8 justify-items-centerm  grid border-2 border-gray-500 bg-gray-700 bg-opacity-50 text-4xl top-6 relative press-start-2p-regular",
    body: "text-black",
    button: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"


}