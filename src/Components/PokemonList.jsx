import React, { useState, useEffect } from "react";
import pokemonData from "../data/pokemonData.json";
import { Link } from "react-router-dom";

const imageImports = import.meta.glob("../assets/images/*.png");

const typeColors = {
  Fire: "#F08030",
  Water: "#6890F0",
  Grass: "#78C850",
  Electric: "#F8D030",
  Ice: "#98D8D8",
  Fighting: "#C03028",
  Poison: "#A040A0",
  Ground: "#E0C068",
  Flying: "#A890F0",
  Psychic: "#F85888",
  Bug: "#A8B820",
  Rock: "#B8A038",
  Ghost: "#705898",
  Dragon: "#7038F8",
  Dark: "#705848",
  Steel: "#B8B8D0",
  Fairy: "#EE99AC",
  Normal: "#A8A878",
};

const genRanges = {
  1: { min: 1, max: 151 },
  2: { min: 152, max: 251 },
  3: { min: 252, max: 386 },
  4: { min: 387, max: 493 },
  5: { min: 494, max: 649 },
  6: { min: 650, max: 721 },
  7: { min: 722, max: 809 },
};

export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState(pokemonData);
  const [filteredPokemonList, setFilteredPokemonList] = useState(pokemonData);
  const [imagePaths, setImagePaths] = useState({});
  const [selectedGen, setSelectedGen] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      const images = await Promise.all(
        Object.keys(imageImports).map(async (path) => {
          const module = await imageImports[path]();
          const id = path.split("/").pop().replace(".png", "");
          return { id, url: module.default };
        })
      );

      const imageMap = images.reduce((acc, { id, url }) => {
        acc[id] = url;
        return acc;
      }, {});
      setImagePaths(imageMap);
    };

    loadImages();
  }, []);

  const filterByGeneration = (gen) => {
    const { min, max } = genRanges[gen];
    const filteredList = pokemonList.filter(
      (pokemon) => pokemon.id >= min && pokemon.id <= max
    );
    setFilteredPokemonList(filteredList);
    setSelectedGen(gen);
  };

  const deletePokemon = (id) => {
    setFilteredPokemonList(
      filteredPokemonList.filter((pokemon) => pokemon.id !== id)
    );
  };

  return (
    <div>
      <Link to={`/item/stats`}>
        <h1 className="pokemonStats">Pokémon Stats</h1>
      </Link>
      <h2 className="pokemonlist">Pokémon List</h2>
      <div className="gen-buttons">
        {[1, 2, 3, 4, 5, 6, 7].map((gen) => (
          <button
            key={gen}
            onClick={() => filterByGeneration(gen)}
            className={selectedGen === gen ? "active" : ""}
          >
            GEN {gen}
          </button>
        ))}
      </div>
      <div className="pokemon-container">
        {filteredPokemonList.map((pokemon) => {
          const formattedId = String(pokemon.id).padStart(3, "0");
          const imagePath =
            imagePaths[formattedId] || "/path/to/default/image.png";

          return (
            <div key={pokemon.id} className="pokemon-card">
              <img
                src={imagePath}
                alt={pokemon.name.english}
                className="pokemon-image"
              />
              <p>Id: {formattedId}</p>
              <h2>{pokemon.name.english}</h2>
              <p>
                Type:{" "}
                {pokemon.type.map((type) => (
                  <span key={type} style={{ color: typeColors[type] }}>
                    {" "}
                    {type}
                  </span>
                ))}
              </p>
              <button onClick={() => deletePokemon(pokemon.id)}>Delete</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
