export async function sendBookingConfirmation(email, schoolName) {
    if (!process.env.BREVO_API_KEY)
        return;
    await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            sender: { email: process.env.BREVO_FROM_EMAIL ?? 'bookings@surfdesk.com.au', name: 'SurfDesk' },
            to: [{ email }],
            subject: `Booking confirmed with ${schoolName}`,
            htmlContent: `<p>Your surf lesson booking is confirmed with ${schoolName}.</p>`,
        }),
    });
}
