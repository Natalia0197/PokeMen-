import Image from 'next/image';
import Link from "next/link";

const ids = [1, 4, 7, 25, 133, 136, 152, 176];

type PokemonApiResponse = {
    name: string;
    sprites: {
        other: {
            "official-artwork": {
                front_default: string;
            };
        };
    };
};

async function getPokemonData(id: number): Promise<{ name: string; image: string } | null> {
    try {
        const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`,
            { cache: "no-store" }
        );

        if (!res.ok) return null;

        const data: PokemonApiResponse = await res.json();
        
        return {
            name: data.name,
            image: data.sprites.other["official-artwork"].front_default
        };
    } catch (error) {
        console.error(`Error fetching Pokemon ${id}:`, error);
        return null;
    }
}

export default async function PokesPage() {
    const pokemonData = await Promise.all(
        ids.map(id => getPokemonData(id))
    );

    const pokemons = pokemonData
        .map((data, index) => ({
            id: ids[index],
            ...data
        }))
        .filter((pokemon): pokemon is { id: number; name: string; image: string } => 
            pokemon.name !== undefined
        );

    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 bg-slate-50 dark:bg-slate-900">
            {pokemons.map(({ id, name, image }) => (
                <Link
                    key={id}
                    href={`/pokes/${id}`}
                    className="group"
                >
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 duration-200 overflow-hidden">
                        <div className="relative h-64 w-full bg-linear-to-b from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                            <Image
                                src={image}
                                alt={name}
                                fill
                                className="p-6 object-contain drop-shadow-lg"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <div className="p-4 text-center">
                            <h3 className="text-lg font-semibold capitalize text-slate-800 dark:text-slate-100">
                                {name}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                #{id.toString().padStart(3, '0')}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}