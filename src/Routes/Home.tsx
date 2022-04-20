import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovies,
  getPopularMovies,
  getUpcomingMovies,
  IGetMoviesResult,
} from "../api";
import { makeImage } from "../utils";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { LeftArrow, RightArrow } from "./TV";
import TypeIt from "typeit-react";

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

const PopMovSlider = styled.div`
  position: relative;
  top: 100px;
`;

const UcmMovSlider = styled.div`
  position: relative;
  top: 350px;
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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
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
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  text-align: center;
  font-weight: 700;
  margin-top: 10px;
`;

const ModalImage = styled.div`
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center center;
`;

const ModalDesc = styled.p`
  text-align: center;
  font-weight: 400;
  margin-top: 10px;
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

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const { data: data_pop, isLoading: isLoading_pop } =
    useQuery<IGetMoviesResult>(["movies", "popularMovies"], getPopularMovies);

  const { data: data_ucm, isLoading: ucmMovLoad } = useQuery<IGetMoviesResult>(
    ["movies", "upcomingMovies"],
    getUpcomingMovies
  );

  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const [index, setIndex] = useState(0);
  const [popIndex, setPopIndex] = useState(0);
  const [ucmIndex, setUcmIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [direction, setDirection] = useState(false);

  const clickedNowMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + "" === bigMovieMatch?.params.movieId
    );

  const increaseIndex = () => {
    const maxIndex = 3;
    if (data && data_pop) {
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

  const increasePoPIndex = () => {
    const maxIndex = 3;
    if (data && data_pop) {
      if (leaving) return;
      setDirection(true);
      setPopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setLeaving((cur) => !cur);
    }
  };

  const decreasePoPIndex = () => {
    const minIndex = 0;
    if (leaving) return;
    setDirection(false);
    setPopIndex((cur) => (minIndex === cur ? 3 : cur - 1));
    setLeaving((cur) => !cur);
  };
  const increaseUcmIndex = () => {
    const maxIndex = 3;
    if (data && data_pop) {
      if (leaving) return;
      setDirection(true);
      setUcmIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setLeaving((cur) => !cur);
    }
  };

  const decreaseUcmIndex = () => {
    const minIndex = 0;
    if (leaving) return;
    setDirection(false);
    setUcmIndex((cur) => (minIndex === cur ? 3 : cur - 1));
    setLeaving((cur) => !cur);
  };

  const onBoxClicked = (movieID: number) => {
    history.push(`/movies/${movieID}`);
  };

  const onOverlayClicked = () => {
    history.goBack();
  };

  return (
    <Wrapper>
      {isLoading && isLoading_pop && ucmMovLoad ? (
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
              Now_Playing
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

          <PopMovSlider>
            <h2
              style={{
                fontSize: "24px",
                paddingLeft: "15px",
                fontWeight: "700",
                marginBottom: "15px",
              }}
            >
              Popular Movies
            </h2>
            <AnimatePresence
              initial={false}
              onExitComplete={() => setLeaving((cur) => !cur)}
            >
              <Row
                key={popIndex}
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
                  onClick={decreasePoPIndex}
                >{`<`}</LeftArrow>
                <RightArrow
                  whileHover={{ scale: 1.4 }}
                  onClick={increasePoPIndex}
                >{`>`}</RightArrow>
                {data_pop?.results
                  .slice(offSet * popIndex, offSet * popIndex + offSet)
                  .map((movie) => (
                    <Box
                      transition={{ type: "tween" }}
                      variants={boxVariants}
                      initial="initial"
                      whileHover="hover"
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
          </PopMovSlider>

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
                Upcoming Movies
              </h2>
              <Row
                key={ucmIndex}
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
                {data_ucm?.results
                  .slice(ucmIndex * offSet, ucmIndex * offSet + offSet)
                  .map((movie) => (
                    <Box
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
                      <h3 style={{ textAlign: "center" }}>
                        Release Date : {clickedNowMovie.release_date}
                      </h3>
                      <ModalDesc>{clickedNowMovie.overview}</ModalDesc>
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