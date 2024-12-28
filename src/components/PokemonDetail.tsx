import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { pokeDetailType } from "@/app/page";
type PokemonDetailProps = {
  pokemon: pokeDetailType;
  isOpen: boolean;
  onClose: () => void;
};
const PokemonDetail = ({ pokemon, isOpen, onClose }: PokemonDetailProps) => {
  if (!pokemon) return null;

  console.log("Pokemon");
  console.log(pokemon);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[426px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold capitalize">
            {pokemon.name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <Image
            src={pokemon.sprites?.other?.dream_world?.front_default}
            alt={pokemon.name}
            className="w-48 h-48 object-contain"
            width={100}
            height={100}
          />
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="space-y-2">
              <h4 className="font-semibold">Height</h4>
              <p>{pokemon.height / 10}m</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Weight</h4>
              <p>{pokemon.weight / 10}kg</p>
            </div>
          </div>
          <div className="w-full">
            <h4 className="font-semibold mb-2">Stats</h4>
            <div className="space-y-2">
              {pokemon.stats?.map((stat) => (
                <div key={stat.stat.name} className="flex justify-between">
                  <span className="capitalize">{stat.stat.name}</span>
                  <span>{stat.base_stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default PokemonDetail;
