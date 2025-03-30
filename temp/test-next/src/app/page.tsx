import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Firebase Integration Test
            </h1>
            <p className="mt-5 text-xl text-gray-500">
              Testing Firebase integration with Next.js
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Testing Environment</h2>
              <p className="text-gray-600">
                Firebase API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Configured' : 'Not configured'}
              </p>
              <p className="text-gray-600">
                API URL: {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}
              </p>
            </div>
            
            <div className="flex justify-center">
              <a 
                href="/api/hello"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                Test API Route
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Test Application
          </p>
        </div>
      </footer>
    </div>
  );
}
