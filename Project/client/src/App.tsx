import AppRouter from "./AppRouter";

function App() {
  return (
    <>
      <div className="bg-red-500 text-white p-8 m-4 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">TEST TAILWIND</h1>
        <p className="bg-blue-600 text-white p-4 rounded mb-4">
          Ako vidite crvenu pozadinu, beli tekst, padding, margin, rounded uglove i shadow - TAILWIND RADI!
        </p>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Test Button
        </button>
      </div>
      <AppRouter />
    </>
  );
}

export default App;