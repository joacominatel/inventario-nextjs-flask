// _app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(()  => {
        const handleRouteChange = ( url ) => {
            if (url !== '/') {
                router.push('/');
            }
        };

        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [router]);

    return <Component {...pageProps} />
}

export default MyApp;