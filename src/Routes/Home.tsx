import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, getTopMovies, IGetMoviesResult } from "../api";
import { makeImage } from "../utils";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { LeftArrow, RightArrow } from "./TV";
import TypeIt from "typeit-react";
import Header from "../Components/Header";

const Wrapper = styled.div``;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 25px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const NowPlayingSlider = styled.div`
  position: relative;
  top: -150px;
`;

const UcmMovSlider = styled.div`
  position: relative;
  top: 90px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 200px;
  color: red;
  font-size: 30px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  h4 {
    text-align: center;
    font-size: 14px;
    color: white;
  }
`;

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 50;
`;

const Bigmovie = styled(motion.div)`
  position: absolute;
  width: 60vh;
  height: 70vh;
  background-color: ${(props) => props.theme.black.lighter};
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  z-index: 51;
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
  text-align: center;
  font-weight: 700;
  margin-top: 10px;
`;

export const ModalImage = styled.div`
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center center;
`;

export const ModalDesc = styled.p`
  text-align: center;
  font-weight: 400;
  margin-top: 10px;
  padding: 0px 10px;
`;

const offSet = 6;

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.2,
      type: "tween",
    },
  },
};

const boxVariants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      type: "tween",
      delay: 0.2,
    },
  },
};
export const MovieModalInfo = styled.div`
  text-align: center;
  font-weight: 600;
  margin-bottom: 5px;
`;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const { data: data_top, isLoading: topMovLoad } = useQuery<IGetMoviesResult>(
    ["movies", "topMovies"],
    getTopMovies
  );

  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const [index, setIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [direction, setDirection] = useState(false);

  const clickedNowMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + "" === bigMovieMatch?.params.movieId
    );
  const clickedTopMovie =
    bigMovieMatch?.params.movieId &&
    data_top?.results.find(
      (movie) => movie.id + "" === bigMovieMatch?.params.movieId
    );

  const increaseIndex = () => {
    const maxIndex = 3;
    if (data && data_top) {
      if (leaving) return;
      setDirection(true);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setLeaving((cur) => !cur);
    }
  };

  const decreaseIndex = () => {
    const minIndex = 0;
    if (leaving) return;
    setDirection(false);
    setIndex((cur) => (minIndex === cur ? 3 : cur - 1));
    setLeaving((cur) => !cur);
  };

  const increaseUcmIndex = () => {
    const maxIndex = 3;
    if (data && data_top) {
      if (leaving) return;
      setDirection(true);
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setLeaving((cur) => !cur);
    }
  };

  const decreaseUcmIndex = () => {
    const minIndex = 0;
    if (leaving) return;
    setDirection(false);
    setTopIndex((cur) => (minIndex === cur ? 3 : cur - 1));
    setLeaving((cur) => !cur);
  };

  const onBoxClicked = (movieID: number) => {
    history.push(`/movies/${movieID}`);
  };

  const onOverlayClicked = () => {
    history.push("/");
  };

  return (
    <Wrapper>
      <Header />
      {isLoading && topMovLoad ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImage(data?.results[0].backdrop_path || "")}>
            <TypeIt>
              <Title>{data?.results[0].title}</Title>
            </TypeIt>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>

          <NowPlayingSlider>
            <h2
              style={{
                fontSize: "24px",
                paddingLeft: "15px",
                fontWeight: "700",
                marginBottom: "15px",
              }}
            >
              NowPlaying
            </h2>
            <AnimatePresence
              initial={false}
              onExitComplete={() => setLeaving((cur) => !cur)}
            >
              <Row
                key={index}
                initial={{
                  x: direction ? window.outerWidth : -window.outerWidth,
                }}
                animate={{ x: 0 }}
                exit={{
                  x: direction ? -window.outerWidth : window.outerWidth,
                }}
                transition={{ type: "tween", duration: 1 }}
              >
                <LeftArrow
                  whileHover={{ scale: 1.4 }}
                  onClick={decreaseIndex}
                >{`<`}</LeftArrow>
                <RightArrow
                  whileHover={{ scale: 1.4 }}
                  onClick={increaseIndex}
                >{`>`}</RightArrow>
                {data?.results
                  .slice(1)
                  .slice(offSet * index, offSet * index + offSet)
                  .map((movie) => (
                    <Box
                      style={{ cursor: "pointer" }}
                      layoutId={movie.id + ""}
                      transition={{ type: "tween" }}
                      variants={boxVariants}
                      initial="initial"
                      whileHover="hover"
                      onClick={() => onBoxClicked(movie.id)}
                      key={movie.id}
                      bgphoto={makeImage(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </NowPlayingSlider>

          <UcmMovSlider>
            <AnimatePresence
              initial={false}
              onExitComplete={() => setLeaving((cur) => !cur)}
            >
              <h2
                style={{
                  fontSize: "24px",
                  paddingLeft: "15px",
                  fontWeight: "700",
                  marginBottom: "15px",
                }}
              >
                Top Rated Movies
              </h2>
              <Row
                key={topIndex}
                initial={{
                  x: direction ? window.outerWidth : -window.outerWidth,
                }}
                animate={{ x: 0 }}
                exit={{
                  x: direction ? -window.outerWidth : window.outerWidth,
                }}
                transition={{ type: "tween", duration: 1 }}
              >
                <LeftArrow
                  whileHover={{ scale: 1.4 }}
                  onClick={decreaseUcmIndex}
                >{`<`}</LeftArrow>
                <RightArrow
                  whileHover={{ scale: 1.4 }}
                  onClick={increaseUcmIndex}
                >{`>`}</RightArrow>
                {data_top?.results
                  .slice(topIndex * offSet, topIndex * offSet + offSet)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: "tween" }}
                      variants={boxVariants}
                      initial="initial"
                      whileHover="hover"
                      bgphoto={makeImage(movie.backdrop_path, "w500")}
                      key={movie.id}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </UcmMovSlider>

          {/* 모달 등장 부분 */}
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <Bigmovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedNowMovie && (
                    <>
                      <ModalImage
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImage(
                            clickedNowMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      ></ModalImage>
                      <ModalTitle>{clickedNowMovie.title}</ModalTitle>
                      <MovieModalInfo>{`Ratings : ⭐ ${clickedNowMovie.vote_average}`}</MovieModalInfo>
                      <h3 style={{ textAlign: "center" }}>
                        Released Date : {clickedNowMovie.release_date}
                      </h3>
                      <ModalDesc>{clickedNowMovie.overview}</ModalDesc>
                    </>
                  )}
                  {clickedTopMovie && (
                    <>
                      <ModalImage
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImage(
                            clickedTopMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      ></ModalImage>
                      <ModalTitle>{clickedTopMovie.title}</ModalTitle>
                      <MovieModalInfo>{`Ratings : ⭐ ${clickedTopMovie.vote_average}`}</MovieModalInfo>
                      <h3 style={{ textAlign: "center" }}>
                        Released Date : {clickedTopMovie.release_date}
                      </h3>
                      <ModalDesc>{clickedTopMovie.overview}</ModalDesc>
                    </>
                  )}
                </Bigmovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
