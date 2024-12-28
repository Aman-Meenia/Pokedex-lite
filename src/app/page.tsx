"use client";
import React, { useEffect, useState } from "react";
import PokemonCard from "@/components/PokemonCard";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import PokemonDetail from "@/components/PokemonDetail";

const limit = 12;
const total = 1000;

const totalPages = Math.ceil(total / limit);

export type pokeDetailType = {
  name: string;
  height: number;
  id: number;
  weight: number;
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      };
    };
  };
};

export type pokeListType = {
  name: string;
  url: string;
};

export type pokeFavoritesType = {
  name: string;
}[];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pokemonList, setPokemonList] = useState<pokeListType[]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<pokeDetailType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [favorites, setFavorites] = useState<pokeFavoritesType>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<null | pokeDetailType>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Pokemon list
  const fetchPokemonList = async (offset = 0) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
      );
      if (response.ok) {
        const data = await response.json();
        setPokemonList(data.results);
      } else {
        setError(true);
      }
    } catch (err: unknown) {
      setError(true);

      if (err instanceof Error) {
        console.log("Error while fetching data:", err.message);
      } else {
        console.log("An unknown error occurred");
      }
    }
  };

  // Fetch Pokemon details
  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (!pokemonList.length) return;

      try {
        const details = await Promise.all(
          pokemonList.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            const data: pokeDetailType = await response.json();

            const {
              name,
              height,
              id,
              weight,
              stats,
              sprites: {
                other: {
                  dream_world: { front_default },
                },
              },
            } = data;

            return {
              name,
              height,
              id,
              weight,
              stats,
              sprites: {
                other: {
                  dream_world: {
                    front_default,
                  },
                },
              },
            };
          }),
        );

        // console.log("<------------- Details -------------->");
        // console.log(details);
        setPokemonDetails(details);
        setIsLoading(false);
      } catch (err: unknown) {
        setError(true);
        if (err instanceof Error) {
          console.log("Error while fetching data:", err.message);
        } else {
          console.log("An unknown error occurred");
        }
      }
    };

    fetchPokemonDetails();
  }, [pokemonList]);

  const filteredPokemon = pokemonDetails.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleFavorite = (pokemonName: string) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav.name === pokemonName);
      const newFavorites = isFavorite
        ? prevFavorites.filter((fav) => fav.name !== pokemonName)
        : [...prevFavorites, { name: pokemonName }];

      localStorage.setItem("pokemonFavorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const nextButton = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchPokemonList((nextPage - 1) * limit);
  };

  const preButton = () => {
    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    fetchPokemonList((prevPage - 1) * limit);
  };

  useEffect(() => {
    fetchPokemonList();
  }, []);

  // Initialize favorites in client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFavorites = localStorage.getItem("pokemonFavorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, []);
  // Erroe Message
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          Error loading Pokémon
        </h2>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Pokedex Lite</h1>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
                <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPokemon.map((pokemon) => (
                <PokemonCard
                  key={pokemon.name}
                  name={pokemon.name}
                  imageUrl={pokemon.sprites.other.dream_world.front_default}
                  isFavorite={favorites.some(
                    (fav) => fav.name === pokemon.name,
                  )}
                  onFavoriteClick={() => {
                    toggleFavorite(pokemon.name);
                  }}
                  onClick={() => setSelectedPokemon(pokemon)}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <Button
                className="bg-gray-700 hover:bg-pokemon-red/90"
                disabled={currentPage === 1}
                onClick={preButton}
              >
                Prev
              </Button>
              <div>
                <p className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
              <Button
                className="bg-gray-700 hover:bg-pokemon-red/90"
                disabled={currentPage === totalPages}
                onClick={nextButton}
              >
                Next
              </Button>
            </div>
          </>
        )}
        {selectedPokemon && (
          <PokemonDetail
            pokemon={selectedPokemon}
            isOpen={!!selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
