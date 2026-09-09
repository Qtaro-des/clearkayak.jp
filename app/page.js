import Image from "next/image";
import styles from "./page.module.css";

import React, { useState, useRef } from 'react';

export default function Home() {

  const formRef = useRef(null);

  // お問合せ項目を取得する
  const router = useRouter();

  const recaptchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);
  const [msg, setMsg] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [car_model, setCar_model] = useState('');
  const [year, setYear] = useState('');
  const [grade, setGrade] = useState('');
  const [contents, setContents] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onCaptchaChange = (token) => {
    setCaptchaToken(token || '');
    setMsg('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    if (!captchaToken) {
      setMsg('reCAPTCHA を完了してください。');
      return;
    }

    // 1) ブラウザのConstraint Validationを利用
    const form = formRef.current;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (!agreed) {
      alert("「上記の内容に同意します」にチェックしてください。");
      return;
    }

    setIsSubmitting(true);

    window.dispatchEvent(new Event('contact:start'));

    try {
      const payload = { name, email, tel, car_model, year, grade, contents, subject: "【オールドメルセデス.com】お問合せについて", recaptchaToken: captchaToken, };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        window.dispatchEvent(new Event('contact:reset'));
        throw new Error(data.error || '送信に失敗しました。');
      }
      try {
        if (recaptchaRef.current && typeof recaptchaRef.current.reset === 'function') {
          recaptchaRef.current.reset();
        } else {
          setCaptchaKey((k) => k + 1);
        }
      } catch (_) {
        setCaptchaKey((k) => k + 1);
      }
      setCaptchaToken('');
      router.push("/thx");
    } catch (err) {
      console.error(err);
      alert("送信に失敗しました。時間をおいて再度お試しください。");
      setIsSubmitting(false);
      window.dispatchEvent(new Event('contact:reset'));
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <div className={styles.intro}>
            <h1>To get started, edit the page.js file.</h1>
            <p>
              Looking for a starting point or more instructions? Head over to{" "}
              <a
                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Templates
              </a>{" "}
              or the{" "}
              <a
                href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learning
              </a>{" "}
              center.
            </p>
          </div>
          <div className={styles.ctas}>
            <a
              className={styles.primary}
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className={styles.logo}
                src="/vercel.svg"
                alt="Vercel logomark"
                width={16}
                height={16}
              />
              Deploy Now
            </a>
            <a
              className={styles.secondary}
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
          </div>
        </main>
      </div>
    </>
  );
}
