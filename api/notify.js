export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { gift } = req.body ?? {};

    if (!gift || typeof gift !== 'string' || gift.length > 200) {
        return res.status(400).json({ error: 'Invalid payload' });
    }

    const apiKey    = process.env.RESEND_API_KEY;
    const toEmail   = process.env.NOTIFY_EMAIL;

    if (!apiKey || !toEmail) {
        return res.status(500).json({ error: 'Server misconfigured' });
    }

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:48px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #1a1a1a;">
        <tr>
          <td style="background:#C41E3A;height:4px;"></td>
        </tr>
        <tr>
          <td style="padding:48px 48px 40px;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C41E3A;">
              Notification cadeau
            </p>
            <h1 style="margin:0 0 32px;font-size:28px;font-weight:300;color:#FFFFFF;letter-spacing:1px;">
              Un choix a été fait
            </h1>
            <p style="margin:0 0 12px;font-size:13px;color:rgba(255,255,255,0.5);letter-spacing:1px;text-transform:uppercase;">
              Cadeau choisi
            </p>
            <p style="margin:0 0 40px;font-size:26px;font-weight:400;color:#C41E3A;letter-spacing:2px;text-transform:uppercase;">
              ${gift.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </p>
            <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.35);line-height:1.8;">
              Ce message a été envoyé automatiquement depuis le site cadeau.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#C41E3A;height:2px;"></td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'Cadeau Anniversaire <onboarding@resend.dev>',
            to:   [toEmail],
            subject: `🎁 Cadeau choisi : ${gift}`,
            html
        })
    });

    if (!response.ok) {
        const err = await response.text();
        console.error('Resend error:', err);
        return res.status(502).json({ error: 'Email delivery failed' });
    }

    return res.status(200).json({ ok: true });
}
