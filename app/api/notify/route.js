import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

/**
 * POST /api/notify
 * Sends order-placement notifications to the store manager via:
 *   1. Email (SMTP – nodemailer)
 *   2. WhatsApp (returns a click-to-send URL the client can open,
 *      or calls a WhatsApp Business API webhook if configured)
 *
 * Body: { order, settings }
 */
export async function POST(request) {
  try {
    const { order, settings } = await request.json();
    if (!order || !settings) {
      return NextResponse.json({ error: "Missing order or settings" }, { status: 400 });
    }

    const results = { email: null, whatsapp: null };

    // ── 1. Email notification ────────────────────────────────────────
    const notificationEmail = settings.notificationEmail || settings.storeEmail;
    const hasSmtp =
      settings.smtpHost && settings.smtpUser && settings.smtpPass;

    if (notificationEmail && hasSmtp) {
      try {
        const transporter = nodemailer.createTransport({
          host: settings.smtpHost,
          port: Number(settings.smtpPort) || 587,
          secure: settings.smtpEncryption === "ssl",
          auth: {
            user: settings.smtpUser,
            pass: settings.smtpPass,
          },
          // Allow self-signed certs in dev
          tls: { rejectUnauthorized: false },
        });

        const itemRows = (order.items || [])
          .map(
            (item) =>
              `• ${item.name} (${item.size}/${item.color}) × ${item.quantity} — ${settings.currency || "N$"}${Number(item.price * item.quantity).toFixed(2)}`
          )
          .join("\n");

        const subject = `🛒 New Order ${order.orderNumber} from ${order.customer}`;

        const text = [
          `New order placed on ${settings.storeName || "House of Sirka"}`,
          ``,
          `Order #:        ${order.orderNumber}`,
          `Customer:       ${order.customer}`,
          `Email:          ${order.email}`,
          `Phone:          ${order.phone || "—"}`,
          `WhatsApp:       ${order.whatsapp || "—"}`,
          `Delivery:       ${order.delivery}`,
          `Address:        ${order.address || "—"}`,
          `City:           ${order.city || "—"}`,
          `Payment:        ${order.payment}`,
          `Payment status: ${order.paymentStatus}`,
          ``,
          `Items:`,
          itemRows,
          ``,
          `Order total:    ${settings.currency || "N$"}${Number(order.total).toFixed(2)}`,
          ``,
          order.followUpRequired
            ? `⚠️  Follow-up required — payment is not yet confirmed.`
            : `✅  Payment confirmed.`,
          ``,
          `Placed at: ${new Date(order.createdAt).toLocaleString("en-NA", { dateStyle: "full", timeStyle: "short" })}`,
        ].join("\n");

        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#6B1730;color:#fff;padding:18px 24px;border-radius:8px 8px 0 0">
              <h2 style="margin:0">🛒 New Order ${order.orderNumber}</h2>
              <p style="margin:4px 0 0;opacity:.85">${settings.storeName || "House of Sirka"}</p>
            </div>
            <div style="border:1px solid #e5ddd0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:6px 0;color:#888;width:130px">Customer</td><td style="padding:6px 0"><strong>${order.customer}</strong></td></tr>
                <tr><td style="padding:6px 0;color:#888">Email</td><td style="padding:6px 0"><a href="mailto:${order.email}">${order.email}</a></td></tr>
                <tr><td style="padding:6px 0;color:#888">Phone</td><td style="padding:6px 0">${order.phone || "—"}</td></tr>
                <tr><td style="padding:6px 0;color:#888">WhatsApp</td><td style="padding:6px 0">${order.whatsapp || "—"}</td></tr>
                <tr><td style="padding:6px 0;color:#888">Delivery</td><td style="padding:6px 0">${order.delivery}</td></tr>
                <tr><td style="padding:6px 0;color:#888">Address</td><td style="padding:6px 0">${order.address || "—"}, ${order.city || ""}</td></tr>
                <tr><td style="padding:6px 0;color:#888">Payment</td><td style="padding:6px 0">${order.payment}</td></tr>
                <tr><td style="padding:6px 0;color:#888">Status</td><td style="padding:6px 0"><strong style="color:${order.paymentStatus === "Paid" ? "#0E6760" : "#6B1730"}">${order.paymentStatus}</strong></td></tr>
              </table>
              <hr style="border:none;border-top:1px solid #e5ddd0;margin:16px 0"/>
              <h3 style="margin:0 0 8px;color:#6B1730">Items</h3>
              <table style="width:100%;border-collapse:collapse;font-size:13px">
                ${(order.items || [])
                  .map(
                    (item) =>
                      `<tr>
                        <td style="padding:4px 0">${item.name} <span style="color:#888">(${item.size}/${item.color})</span></td>
                        <td style="padding:4px 0;text-align:center">×${item.quantity}</td>
                        <td style="padding:4px 0;text-align:right;font-weight:bold">${settings.currency || "N$"}${Number(item.price * item.quantity).toFixed(2)}</td>
                      </tr>`
                  )
                  .join("")}
                <tr style="border-top:2px solid #6B1730">
                  <td colspan="2" style="padding:10px 0;font-weight:bold;font-size:15px">Total</td>
                  <td style="padding:10px 0;text-align:right;font-weight:bold;font-size:15px;color:#6B1730">${settings.currency || "N$"}${Number(order.total).toFixed(2)}</td>
                </tr>
              </table>
              ${
                order.followUpRequired
                  ? `<div style="margin-top:16px;padding:12px;background:#FFF3CD;border-radius:6px;font-size:13px;color:#856404">⚠️ Follow-up required — payment is not yet confirmed.</div>`
                  : `<div style="margin-top:16px;padding:12px;background:#D4EDDA;border-radius:6px;font-size:13px;color:#155724">✅ Payment confirmed — order is ready to process.</div>`
              }
              <p style="margin-top:16px;font-size:12px;color:#999">
                Placed at ${new Date(order.createdAt).toLocaleString("en-NA", { dateStyle: "full", timeStyle: "short" })}
              </p>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"${settings.emailFromName || settings.storeName || "House of Sirka"}" <${settings.emailFromAddress || settings.smtpUser}>`,
          to: notificationEmail,
          subject,
          text,
          html,
        });

        results.email = { sent: true, to: notificationEmail };
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        results.email = { sent: false, error: emailError.message };
      }
    } else {
      results.email = { sent: false, error: "SMTP not configured" };
    }

    // ── 2. WhatsApp notification ─────────────────────────────────────
    const whatsappNumber = (settings.whatsappNumber || "").replace(/[^0-9]/g, "");
    if (whatsappNumber) {
      const currency = settings.currency || "N$";
      const itemList = (order.items || [])
        .map((item) => `  • ${item.name} (${item.size}/${item.color}) ×${item.quantity}`)
        .join("\n");

      const whatsappText = [
        `🛒 *New Order ${order.orderNumber}*`,
        ``,
        `*Customer:* ${order.customer}`,
        `*Email:* ${order.email}`,
        `*Phone:* ${order.phone || "—"}`,
        `*Delivery:* ${order.delivery}`,
        `*Address:* ${order.address || "—"}, ${order.city || ""}`,
        ``,
        `*Items:*`,
        itemList,
        ``,
        `*Total:* ${currency}${Number(order.total).toFixed(2)}`,
        `*Payment:* ${order.payment}`,
        `*Status:* ${order.paymentStatus}`,
        ``,
        order.followUpRequired
          ? `⚠️ _Follow-up required — payment not yet confirmed._`
          : `✅ _Payment confirmed._`,
      ].join("\n");

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

      // If a WhatsApp Business API webhook is configured, call it
      if (settings.whatsappApiUrl && settings.whatsappApiToken) {
        try {
          const waResponse = await fetch(settings.whatsappApiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${settings.whatsappApiToken}`,
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: whatsappNumber,
              type: "text",
              text: { body: whatsappText },
            }),
          });
          const waData = await waResponse.json();
          results.whatsapp = { sent: true, api: true, response: waData };
        } catch (waError) {
          console.error("WhatsApp API failed:", waError);
          results.whatsapp = { sent: false, api: true, error: waError.message, fallbackUrl: whatsappUrl };
        }
      } else {
        // No API configured — return the click-to-send URL for client to open
        results.whatsapp = { sent: false, api: false, url: whatsappUrl, message: whatsappText };
      }
    } else {
      results.whatsapp = { sent: false, error: "WhatsApp number not configured" };
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
