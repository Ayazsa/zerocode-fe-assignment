import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="text-center mt-10 text-red-600">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
