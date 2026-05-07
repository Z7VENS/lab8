const PLACEHOLDER_IMAGE = "https://placehold.co/210x295";

export const getShowData = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}`;
  const data = await fetch(URL).then(res => res.json());

  return {
    name: data.name,
    // CORRECCIÓN: Accedemos al promedio directamente aquí
    rating: data.rating?.average ?? "N/A", 
    image: data.image?.medium ?? PLACEHOLDER_IMAGE
  }
}

export const getEpisodeList = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}/episodes`;
  const episodes = await fetch(URL).then(res => res.json());

  const episodeList = episodes.map(episode => ({
    number: episode.number,
    season: episode.season,
    rating: episode.rating.average
  }));

  const episodesBySeason = Object.groupBy(episodeList, (episode) => episode.season);
  return episodesBySeason;
}

// Nueva para el buscador
export const searchShows = async (query) => {
  const URL = `https://api.tvmaze.com/search/shows?q=${query}`;
  return await fetch(URL).then(res => res.json());
}