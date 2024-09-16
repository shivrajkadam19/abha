const express = require('express');
const axios = require('axios');

const app = express();
const port = 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());

app.post('/request-otp', async (req, res) => {
    const apiUrl = "https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp";

    // Get the requestBody from the client request (e.g., Postman)
    const requestBody = req.body; // Request body will be passed from Postman or any client

    // Extract the Authorization Bearer token from the headers provided by Postman
    const authHeader = req.headers['authorization']; // This will get the 'Authorization' header from the request
    if (!authHeader) {
        return res.status(401).json({
            code: "90001",
            message: "Invalid credentials",
            description: "Authorization header missing or invalid. Ensure that you have provided the correct security credentials."
        });
    }

    const currentTimestamp = new Date().toISOString();

    try {
        const response = await axios.post(apiUrl, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'TIMESTAMP': currentTimestamp,
                'REQUEST-ID': 'a0fd5926-e663-4799-98ac-8a93583bc638',
                'Authorization': authHeader, // Use the Bearer token from Postman request
            }
        });

        // Send back the response data to the client (Postman)
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errResponse = error.response.data;
            res.status(error.response.status).json({
                code: errResponse.code || "unknown_error",
                message: errResponse.message || "An unknown error occurred",
                description: errResponse.description || "No additional information available."
            });
        } else if (error.request) {
            // The request was made but no response was received
            res.status(503).json({
                code: "503",
                message: "Service Unavailable",
                description: "The request was made but no response was received, the server might be down."
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            res.status(500).json({
                code: "500",
                message: "Internal Server Error",
                description: "An error occurred in making the request."
            });
        }
    }
});

app.get('',(req,res)=>{
    res.send("Hello")
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
