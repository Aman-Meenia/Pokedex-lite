import React from "react";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Image from "next/image";
type PokemonCardProps = {
  name: string;
  imageUrl: string;
  isFavorite: boolean;
  onFavoriteClick: () => void;
  onClick: () => void;
};
const PokemonCard = ({
  name,
  imageUrl,
  isFavorite,
  onFavoriteClick,
  onClick,
}: PokemonCardProps) => {
  return (
    <Card
      className="relative group cursor-pointer hover:shadow-lg transition-all duration-300 p-4"
      onClick={onClick}
    >
      <button
        className="absolute top-2 right-2 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteClick();
        }}
      >
        <Heart
          className={`w-6 h-6 transition-colors ${
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32 relative ">
          <Image
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain"
            height={100}
            width={100}
          />
        </div>
        <h3 className="text-lg font-semibold capitalize">{name}</h3>
      </div>
    </Card>
  );
};
export default PokemonCard;
