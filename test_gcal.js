const fs = require('fs');
const envConfig = fs.readFileSync('.env', 'utf8').split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) process.env[key.trim()] = value.trim();
});
const { PrismaClient } = require('@prisma/client');
const { google } = require('googleapis');

const prisma = new PrismaClient();

async function testGCal() {
  try {
    const account = await prisma.account.findFirst({
      where: { provider: 'google' }
    });

    if (!account) {
      console.log("No account found");
      return;
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    
    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 1);
    const endTime = new Date(startTime.getTime() + 30 * 60000);
    
    const res = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: `🦷 Cita de Prueba desde Script`,
        description: "Test",
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
      }
    });

    console.log("Event created! ID:", res.data.id);
  } catch (err) {
    console.error("Google API Error:", err.message);
  }
}

testGCal();
