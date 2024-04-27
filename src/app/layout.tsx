import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import RecoilContextProvider from "@/components/RecoilContextProvider";

const roboto = Roboto_Mono({ weight: ["600"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo App",
  description: "This is a todo app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <RecoilContextProvider>
        <html lang="en">
          <body className={roboto.className}>
            <AntdRegistry>{children}</AntdRegistry>
          </body>
        </html>
      </RecoilContextProvider>
    </ReactQueryClientProvider>
  );
}
