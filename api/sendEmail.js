export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { subject, htmlContent, to, replyTo, cc } = req.body;

        // Use process.env for Vercel Serverless Functions instead of import.meta.env
        const brevoApiKey = process.env.VITE_BREVO_API_KEY;
        const adminEmail = process.env.VITE_ADMIN_EMAIL;

        if (!brevoApiKey || !adminEmail) {
            return res.status(500).json({ error: 'Server configuration missing. Please check Vercel Environment Variables.' });
        }

        const payload = {
            sender: { email: adminEmail, name: "Rangitva Storefront" },
            to: to || [{ email: adminEmail, name: "Admin" }],
            subject: subject,
            htmlContent: htmlContent
        };

        if (replyTo) {
            payload.replyTo = replyTo;
        }

        // Brevo throws an error if an email is in both 'to' and 'cc'.
        // We must filter out any CCs that exactly match the primary To address.
        if (cc && Array.isArray(cc) && cc.length > 0) {
            const primaryEmails = payload.to.map(t => t.email.toLowerCase());
            const filteredCc = cc.filter(c => !primaryEmails.includes(c.email.toLowerCase()));

            if (filteredCc.length > 0) {
                payload.cc = filteredCc;
            }
        }

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': brevoApiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: 'Brevo API error', details: errorData });
        }

        const data = await response.json();
        return res.status(200).json({ success: true, messageId: data.messageId });

    } catch (error) {
        console.error("Vercel Email Function Error:", error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
