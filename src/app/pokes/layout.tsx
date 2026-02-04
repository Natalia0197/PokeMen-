import Link from "next/link";

const ids = [1, 4, 7, 25, 133];

type PokemonApiResponse = {
  name: string;
};

// 👇 Función para obtener solo el nombre del Pokémon
async function getPokemonName(id: number): Promise<string | null> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const data: PokemonApiResponse = await res.json();
  return data.name;
}

export default async function PokesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 👇 Obtener nombres de los pokémon
  const pokemons = await Promise.all(
    ids.map(async (id) => ({
      id,
      name: await getPokemonName(id),
    }))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full flex items-center justify-center bg-gray-800/75 p-4 gap-4 mb-1 sm:px-4 lg:px-8">
        <div className="flex flex-1 items-center sm:flex-col lg:flex-row lg:justify-center gap-2 sm:items-stretch sm:justify-start">
          {pokemons.map(({ id, name }) => (
            <Link
              key={id}
              href={`/pokes/${id}`}
              className="bg-gray-800 border-2 border-gray-400/50 text-white px-3 py-2 rounded-md text-md font-medium hover:bg-gray-900/50 hover:border-2 hover:border-gray-100 capitalize"
            >
              {name || `#${id}`}
            </Link>
          ))}
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-800 border-t">
        <div className="w-full mx-auto px-6 py-3 text-md text-gray-200 text-center">
          {new Date().getFullYear()} Catálogo Pokémon -{" "}
          <Link href="https://pokeapi.co/" className="hover:underline">
            Poke API
          </Link>
        </div>
      </footer>
    </div>
  );
}