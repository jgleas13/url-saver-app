import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            URL Sharing & AI Summarization
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Save and summarize web content directly from your iPhone. 
            Get AI-powered summaries and organize your links in one place.
          </p>
          
          <div className="space-y-6">
            <button 
              className="bg-white text-gray-800 border border-gray-300 rounded-md py-3 px-6 flex items-center justify-center gap-2 w-full max-w-xs mx-auto hover:bg-gray-50 transition-colors duration-200"
            >
              <Image 
                src="/google.svg" 
                alt="Google logo" 
                width={20} 
                height={20}
                unoptimized
              />
              <span>Sign in with Google</span>
            </button>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              First time? Sign in to create your account.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2024 URL Sharing & AI Summarization App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
