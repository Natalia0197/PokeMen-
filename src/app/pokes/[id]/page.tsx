import Image from 'next/image';
import Link from 'next/link';

interface PokemonPageProps {
  params: {
    id: string;
  };
}

type PokemonApiResponse = {
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  types: Array<{
    type: {
      name: string;
    };
  }>;
};

export default async function PokemonPage(props: PokemonPageProps) {
  const { id } = await props.params;
  
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${id}`,
    { cache: "no-store" }
  );
  
  const pokemon: PokemonApiResponse = await res.json();

  if (!res.ok || !pokemon) {
    return <div>Error en API</div>;
  }

  const imageUrl = pokemon.sprites.other["official-artwork"].front_default;
  const types = pokemon.types.map(t => t.type.name).join(", ");
  const abilities = pokemon.abilities.map(a => a.ability.name).join(", ");

  return (
    <div className="flex justify-center items-center min-h-screen bg-amber-500/10">
      <div className="max-w-md mx-auto">
        <div className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96">
          <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl h-96">
            <Image
              src={imageUrl}
              alt={pokemon.name}
              fill
              className="object-contain w-full h-full"
              sizes="384px"
              priority
            />
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="block font-sans text-3xl antialiased font-bold leading-relaxed text-blue-gray-900 capitalize">
                {pokemon.name}
              </p>
              <p className="block font-sans text-base antialiased font-bold leading-relaxed text-blue-gray-900">
                #{id.padStart(3, '0')}
              </p>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Tipo:</span>
                <span className="capitalize text-gray-600">{types}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Habilidades:</span>
                <span className="capitalize text-gray-600">{abilities}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}