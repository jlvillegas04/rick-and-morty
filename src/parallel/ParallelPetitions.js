import fetch from "node-fetch";

async function getEpisodeData(episodeId) {
  const response = await fetch(
    `https://rickandmortyapi.com/api/episode/${episodeId}`
  );
  return response.json();
}

async function getCharacterData(characterUrl) {
  const response = await fetch(characterUrl);
  return response.json();
}

async function fetchEpisodeAndCharacterData() {
  try {
    const episodesResponse = await fetch(
      "https://rickandmortyapi.com/api/episode"
    );
    const episodesData = await episodesResponse.json();
    const episodes = episodesData.results.slice(0, 20);

    const episodePromises = episodes.map(async (episode) => {
      const episodeData = await getEpisodeData(episode.id);
      const characterPromises = episodeData.characters
        .slice(0, 10)
        .map(async (characterUrl) => {
          const characterData = await getCharacterData(characterUrl);
          return {
            name: characterData.name,
            species: characterData.species,
          };
        });

      const characters = await Promise.all(characterPromises);

      return {
        name: episodeData.name,
        episode: episodeData.episode,
        airDate: episodeData.air_date,
        characters: characters,
      };
    });
    const episodeResults = await Promise.all(episodePromises);

    episodeResults.forEach((episode) => {
      console.log(`${episode.name} - ${episode.episode}`);
      console.log(`Fecha al aire: ${episode.airDate}`);
      console.log("Personajes:");
      episode.characters.forEach((character) => {
        console.log(`- ${character.name} - ${character.species}`);
      });
      console.log("\n");
    });
  } catch (error) {
    console.error("Error al obtener los datos:", error.message);
  }
}

fetchEpisodeAndCharacterData();

export default {
  getEpisodeData,
  getCharacterData,
};
