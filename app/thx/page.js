import Link from 'next/link';
import styles from "../page.module.css";
import Image from "next/image";

export const metadata = {
  title: '送信完了 | clearkayak.jp',
  description: 'お問い合わせありがとうございます。送信が完了しました。',
};

export default function Home() {
  return (
    <>

      <div className={styles.page}>
        <main className={styles.main}>
          <section className={styles.thx}>
            <div className={styles.message}>
              <h1>お問い合せいただき<br className={styles.sp_only} />ありがとうございました。</h1>
              <p>
                内容を確認後、担当者よりご連絡いたしますので<br className={styles.sp_only} />お待ちください。<br />
                また、ご不明な点やご不安点などありましたら、<br className={styles.sp_only} />お気軽に下記までご連絡ください。<br />
              </p>
              <p>E-mail：<Link href="mailto:info&#64;clearkayak.jp">info@clearkayak.jp</Link></p>

              <Link className={styles.bk_btn} href="/">TOPへ戻る</Link>
            </div>
          </section>
        </main>
      </div>

    </>
  )
}