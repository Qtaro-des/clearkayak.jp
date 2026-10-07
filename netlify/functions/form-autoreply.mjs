import nodemailer from "nodemailer";

export default {
  async formSubmitted(event) {
    const data = event.data ?? {};

    // 今回のcontactフォーム以外では動かさない
    if (data["form-name"] && data["form-name"] !== "contact") {
      return;
    }

    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const company = String(data.company || "").trim();
    const message = String(data.message || "").trim();

    // 返信先メールアドレスがない場合は何もしない
    if (!email) {
      console.log("Auto reply skipped: email is empty.");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const recipientName = name || "お客様";

    await transporter.sendMail({
      from: `"CLEAR KAYAK LAB" <${process.env.SMTP_USER}>`,
      to: email,
      replyTo: process.env.SMTP_USER,
      subject: "【CLEAR KAYAK LAB】お問い合わせありがとうございます",
      text: `${recipientName} 様

この度はCLEAR KAYAK LABへお問い合わせいただき、ありがとうございます。

以下の内容でお問い合わせを受け付けました。

施設名・会社名：
${company || "未入力"}

ご担当者名：
${name || "未入力"}

メールアドレス：
${email}

ご相談内容：
${message || "未入力"}

内容を確認のうえ、担当者よりご連絡いたします。
今しばらくお待ちください。

※このメールはお問い合わせ受付時に自動送信されています。
このメールにお心当たりがない場合は、お手数ですが破棄してください。

CLEAR KAYAK LAB
info@clearkayak.jp
`,
    });

    console.log(`Auto reply sent to: ${email}`);
  },
};