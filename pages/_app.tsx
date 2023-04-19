import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Layout from '../components/Layout';
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "../context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }: AppProps<{}>) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default App;
