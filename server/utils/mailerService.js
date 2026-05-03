const jwt = require("jsonwebtoken");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Mirror of frontend typeLabels
const typeLabels = {
  passport: "Pasaporte",
  id: "DNI",
  driver_license: "Carnet de conducir",
  health: "Tarjeta sanitaria",
  credit_card: "Tarjeta bancaria",
  custom: "Otro",
};

async function sendReminderEmail(
  email,
  displayName,
  userId,
  docName,
  docType,
  expiryDate,
  daysLeft,
) {
  const recipientName = displayName ?? email.split("@")[0];
  const docLabel = typeLabels[docType] ?? docType;
  const docTitle = docName ? `"${docName}"` : docLabel;
  const formattedDate = new Date(expiryDate).toLocaleDateString("es-ES");
  const unsubscribeToken = jwt.sign(
    { user_id: userId, purpose: "unsubscribe" },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "90d" },
  );
  console.log("BACKEND_URL:", process.env.BACKEND_URL);

  const unsubscribeUrl = `${process.env.BACKEND_URL}/auth/unsubscribe?token=${unsubscribeToken}`;

  const msg = {
    to: email,
    from: process.env.RESEND_FROM,
    subject: `DOCREMINDER · TU DOCUMENTO CADUCA EN ${daysLeft} DÍAS`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 24px;">
        <h2 style="color: #1c1c1e;">Hola, ${recipientName} 👋</h2>
       <p>Te recordamos que tu documento <strong>${docTitle}</strong> caduca el <strong>${formattedDate}</strong>.</p>

        <div style="
          background: #fff3cd;
          border-left: 4px solid #FF9500;
          padding: 12px 16px;
          border-radius: 4px;
          margin: 20px 0;
        ">
          <strong> Quedan ${daysLeft} días</strong>
        </div>

        <p style="color: #555;">Renuévalo a tiempo para evitar problemas.</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />

        <p style="font-size: 12px; color: #aaa; text-align: center;">
          DocReminder · 
          <a href="${unsubscribeUrl}" style="color: #aaa;">Cancelar suscripción</a>
        </p>
      </div>
    `,
  };

  await resend.emails.send(msg);
}

module.exports = sendReminderEmail;
