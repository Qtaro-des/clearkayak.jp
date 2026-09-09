export const runtime = "nodejs";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    // JSON を取得
    const payload = await req.json();
    const { recaptchaToken } = payload;

    if (!recaptchaToken) {
      return Response.json(
        { success: false, error: "reCAPTCHA token missing" },
        { status: 400 }
      );
    }

    // --- reCAPTCHA v2 サーバー側検証 ---
    const params = new URLSearchParams();
    params.append("secret", process.env.RECAPTCHA_SECRET_KEY);
    params.append("response", recaptchaToken);

    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );

    const verifyJson = await verifyRes.json();

    if (!verifyJson.success) {
      return Response.json(
        {
          success: false,
          error: "reCAPTCHA failed",
          detail: verifyJson,
        },
        { status: 400 }
      );
    }

    // --- お問い合わせデータ ---
    const {
      name,
      email,
      tel,
      car_model,
      year,
      grade,
      contents,
      subject = "【オールドメルセデス.com】ホームページよりお問合せがありました",
    } = payload;

    // nodemailer 設定（Gmail アプリパスワード）
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const toAdmin = process.env.EMAIL_USER;

    // 管理者宛メール
    await transporter.sendMail({
      from: `"オールドメルセデス.com" <${process.env.EMAIL_REPLY_USER}>`,
      to: toAdmin,
      replyTo: email,
      subject,
      text:
        `※このメールはシステムからの自動通知です。\n` +
        `${name}様からお問い合わせが届きました。\n\n` +
        `==============================\n` +
        `お名前    ： ${name}\n` +
        `メール    ： ${email}\n` +
        `TEL      ： ${tel}\n` +
        `車種      ： ${car_model}\n` +
        `年式      ： ${year}\n` +
        `グレード   ： ${grade}\n` +
        `ご質問内容 ： ${contents}\n` +
        `==============================\n` +
        `オールドメルセデス.com\n` +
        `MAIL: info@old-mercedes.com\n` +
        `TEL: 0120-35-9601\n` +
        `https://old-mercedes.com\n` +
        `==============================`,
    });

    // 自動返信（ユーザー宛）
    if (email) {
      await transporter.sendMail({
        from: `"オールドメルセデス.com" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `【オールドメルセデス.com】${name}様 お問合せありがとうございました`,
        text:
          `※このメールはシステムからの自動通知です。\n` +
          `${name}様、この度はお問い合わせありがとうございます。\n` +
          `下記の内容で承りました。\n\n` +
          `==============================\n` +
          `お名前   ： ${name}\n` +
          `メール   ： ${email}\n` +
          `TEL     ： ${tel}\n` +
          `車種     ： ${car_model}\n` +
          `年式     ： ${year}\n` +
          `グレード  ： ${grade}\n` +
          `ご質問内容： ${contents}\n` +
          `==============================\n` +
          `オールドメルセデス.com\n` +
          `MAIL: info@old-mercedes.com\n` +
          `TEL: 0120-35-9601\n` +
          `https://old-mercedes.com\n` +
          `==============================`,
      });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("contact API error:", err);
    return Response.json(
      { success: false, error: "send_failed" },
      { status: 500 }
    );
  }
}
