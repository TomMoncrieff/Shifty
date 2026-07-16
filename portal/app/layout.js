import './globals.css';

export const metadata = {
  title: 'Shifty Partner Portal',
  description: 'Update your Shifty member deals.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
