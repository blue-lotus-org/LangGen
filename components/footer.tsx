export function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">LangGen {new Date().getFullYear()} Agent Generator. FOSS, Free open-source software.</p>
          </div>
          <div className="flex items-center">
            <p className="text-gray-400 text-sm">
              Created by{" "}
              <a
                href="https://lotuschain.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                BlueLotus
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

