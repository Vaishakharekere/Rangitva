async function testEmail() {
    try {
        console.log("Testing live Vercel endpoint: https://rangitva.vercel.app/api/sendEmail");
        const response = await fetch('https://rangitva.vercel.app/api/sendEmail', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                to: [{ email: "vaishakharekere@gmail.com", name: "Vaishakh Admin" }],
                cc: [{ email: "testcustomer@example.com", name: "Test Customer" }],
                subject: "Rangitva API Live Delivery Test",
                htmlContent: "<h2>Hello Vaishakh!</h2><p>If you are reading this, your Vercel and Brevo integration is working perfectly.</p>"
            })
        });

        const data = await response.text();
        console.log(`Status: ${response.status}`);
        console.log(`Response Body:`, data);
    } catch (err) {
        console.error("Test failed to run:", err);
    }
}

testEmail();
