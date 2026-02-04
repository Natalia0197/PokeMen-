import Link from "next/link";

const ids = [1, 4, 7, 25, 133];

type PokemonApiResponse = {
  name: string;
};

// Obtener solo el nombre del Pokémon
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
  const pokemons = await Promise.all(
    ids.map(async (id) => ({
      id,
      name: await getPokemonName(id),
    }))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <nav className="w-64 bg-gray-800/75 p-4 border-r border-gray-700">4
          <div className="flex flex-col gap-2">
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
      </div>

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