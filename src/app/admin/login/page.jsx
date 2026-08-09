import LoginForm from "./_components/LoginForm";
import styles from "./login.module.scss";

export const metadata = {
  title: "Admin Login | Awai Studio",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }) {
  const query = await searchParams;

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <p className={styles.kicker}>Awai Studio</p>
        <h1>Admin Login</h1>
        <p className={styles.description}>
          予約と記事を管理する、許可された運営者専用の画面です。
        </p>
        <LoginForm unauthorized={query?.error === "unauthorized"} />
      </div>
    </div>
  );
}
