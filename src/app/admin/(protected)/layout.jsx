import Link from "next/link";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { logoutAdmin } from "../actions";
import styles from "./Admin.module.scss";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const { admin } = await requireAdmin();

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div>
          <p className={styles.brand}>Awai Studio</p>
          <p className={styles.role}>{admin.role}</p>
        </div>
        <nav aria-label="管理画面">
          <Link href="/admin">予約管理</Link>
          <Link href="/admin/articles">Awai Notes</Link>
        </nav>
        <form action={logoutAdmin}>
          <button type="submit">ログアウト</button>
        </form>
      </aside>
      <div className={styles.adminContent}>{children}</div>
    </div>
  );
}
