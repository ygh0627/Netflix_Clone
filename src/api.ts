const API_KEY = "aec6f676a06e94deb53a582730de8857";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  title: string;
  release_date: string;
  vote_average: number;
}

export interface IGetMoviesResult {
  dates: {
    minimum: string;
    maximum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface ITvGet {
  backdrop_path: string;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
}

export interface IGetTvsResult {
  page: number;
  results: ITvGet[];
  total_pages: number;
  total_results: number;
}

interface ISearch {
  backdrop_path: string;
  id: number;
  original_title: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  media_type: string;
  name: string;
}

export interface IGetSearchResult {
  results: ISearch[];
  total_results: number;
}

// interface IVideo {
//   key: string;
// }

// export interface IMovieVedio {
//   id: number;
//   results: IVideo[];
// }

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularMovies() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTVs() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export const getSearch = async (keyword?: string) => {
  const response = await fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}&page=1&include_adult=false`
  );
  return await response.json();
};
