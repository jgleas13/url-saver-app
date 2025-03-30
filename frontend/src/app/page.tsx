import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Save and summarize your favorite URLs
            </h1>
            <p className="mt-5 text-xl text-gray-500">
              Share URLs directly from your iPhone and we&apos;ll organize them with AI-powered summaries for easy retrieval later.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">How it works</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">1</span>
                  </div>
                  <p className="ml-4 text-gray-600">Share any URL from your iPhone using our iOS Shortcut</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">2</span>
                  </div>
                  <p className="ml-4 text-gray-600">Our system uses Grok AI to automatically generate a concise summary</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">3</span>
                  </div>
                  <p className="ml-4 text-gray-600">View, filter, and organize your saved URLs on our clean dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Link 
                href="/auth/login"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                Sign in with Google to get started
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} URL Sharing &amp; Summarization App
          </p>
        </div>
      </footer>
    </div>
  );
}
