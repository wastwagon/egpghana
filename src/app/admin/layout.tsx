import AuthProvider from "@/components/AuthProvider";

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthProvider>{children}</AuthProvider>;
}
