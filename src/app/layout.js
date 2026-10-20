import './globals.css';

export const metadata = {
  title: 'Hay Day Daku Cello – Toko Alat, Bahan & Koin Resmi',
  description: 'Daftar harga item resmi Hay Day Daku Cello: BEM, SEM, LEM, Alat Tambang, Makanan, Hewan, dan Koin.',
  icons: {
    icon: '/logo-daku-cello.jpeg'
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700;800&family=Lilita+One&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
