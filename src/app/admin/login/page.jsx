// @/app/admin/login/page.jsx

import LoginForm from "./_components/LoginForm";

export const metadata = {
  title: "Admin Login | Awai Studio",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage({ searchParams }) {
  const query = await searchParams;

  return (
    <main className="adminPage">
      <div className="adminCard">
        <h1>Admin Login</h1>

        <p className="adminDescription">Awai Studioの管理者専用画面です。</p>

        <LoginForm unauthorized={query?.error === "unauthorized"} />
      </div>
    </main>
  );
}
