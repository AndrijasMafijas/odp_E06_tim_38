import { useDarkMode } from "../../helpers/useDarkMode";

export default function ThemeToggle() {
  const [dark, setDark] = useDarkMode(true);
  return (
    <button
      onClick={() => setDark((d: boolean) => !d)}
      className={`flex items-center px-2 py-1 rounded-md border transition-all duration-200 shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400
        ${dark ? "bg-gray-800 text-yellow-300 border-gray-700 hover:bg-gray-700" : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}`}
      title={dark ? "Prebaci na svetlu temu" : "Prebaci na tamnu temu"}
      style={{width: '70px', height: '32px', minWidth: 'unset'}}
    >
      {dark ? (
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
          </svg>
          Dark
        </span>
      ) : (
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.95 7.05l-.71-.71M7.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Light
        </span>
      )}
    </button>
  );
}
