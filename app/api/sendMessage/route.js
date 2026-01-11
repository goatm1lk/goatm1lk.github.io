const sendMessage = async (req,res) => {
    // if (req.method !== 'POST') {
    //     return res.status(405).json({ error: 'Method not allowed' });
    // }
    //console.log("API KEY in route: ", process.env.MAIL_CHIMP_API_KEY);
    console.log("Request body: ", req.body , "\n Request Method: ", req.method);
    const { name, email, message } = req.body;
    console.log("Received message from ", name, email, message);
    return res.status(200).json({ status: 'Message sent successfully' });
}