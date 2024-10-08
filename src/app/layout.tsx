import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Header from "~/components/Header";
import { store } from "../store/store";
import { Provider } from "react-redux";
export const metadata: Metadata = {
  title: "Stocks",
  description: "Stock tracking app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Provider store={store}>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
          <Header />
          {children}
        </body>
      </html>
    </Provider>
  );
}
