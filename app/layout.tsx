// app/layout.tsx
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Link from "next/link";
import ConvexClerkProvider from '../Providers/ConvexClerkProviders';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 

{ 
return (
  <ConvexClerkProvider>
    <Protect>
      <html lang="en">
        <body className={inter.className}>
          <header className="bg-white shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
              <Link href="/" className="font-bold text-xl">
                Slick Solutions
              </Link>
              <div className="flex items-center space-x-4">
                <OrganizationSwitcher />
                <UserButton />
              </div>
            </nav>
          </header>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </body>
      </html>
    </Protect>
  </ConvexClerkProvider>
);
};

function Protect({ children }: { children: React.ReactNode }) {
  return ()

} 
