import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getTVs, IGetTvsResult } from "../api";
import { makeImage } from "../utils";
import TypeIt from "typeit-react";

const Wrapper = styled.div`
  width: 100%;
`;

const Loader = styled.div`
  font-size: 36px;
  height: 40vh;
  text-align: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  align-items: flex-start;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
`;

const Title = styled.h2`
  color: ${(props) => props.theme.white.darker};
  font-size: 68px;
  margin-bottom: 25px;
`;

const Overview = styled.p`
  color: ${(props) => props.theme.white.darker};
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -150px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  position: absolute;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  height: 200px;
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
  position: absolute;
  bottom: 0;
  color: ${(props) => props.theme.white.darker};
  background-color: ${(props) => props.theme.black.darker};
  width: 100%;
  text-align: center;
  opacity: 0;
  h4 {
    text-align: center;
    font-size: 14px;
    color: white;
  }
  padding: 10px;
`;

const TvModalWrapper = styled(motion.div)`
  width: 60vh;
  background-color: ${(props) => props.theme.black.darker};
  position: absolute;
  height: 70vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
`;

const Overlay = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
`;

const TvModalImg = styled.div<{ img: string }>`
  background-size: cover;
  background-position: center center;
  background-image: url(${(props) => props.img});
  width: 100%;
  height: 50%;
`;

const TvModalTitle = styled.h2`
  text-align: center;
  margin-top: 10px;
  color: ${(props) => props.theme.white.darker};
  font-size: 28px;
`;

const TvModalDesc = styled.p`
  text-align: center;
  font-weight: 400;
  margin-top: 10px;
`;

const boxVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      type: "tween",
      delay: 0.2,
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      type: "tween",
      delay: 0.2,
    },
  },
};

export const LeftArrow = styled(motion.span)`
  font-size: 70px;
  position: absolute;
  left: 0px;
  z-index: 3;
  padding: 60px 5px;
  cursor: pointer;
`;

export const RightArrow = styled(motion.span)`
  font-size: 70px;
  position: absolute;
  right: 0px;
  padding: 60px 5px;
  z-index: 3;
  cursor: pointer;
`;

function TV() {
  const { data, isLoading } = useQuery<IGetTvsResult>(["Tvs", "OnAir"], getTVs);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [direction, setDirection] = useState(false);
  const history = useHistory();
  const offSet = 6;
  const isTvClicked = useRouteMatch<{ tvId: string }>(`/tv/:tvId`);
  const { scrollY } = useViewportScroll();

  const increaseIndex = () => {
    const maxIndex = 3;
    if (leaving) return;
    setDirection(true);
    setIndex((cur) => (maxIndex === cur ? 0 : cur + 1));
    setLeaving((cur) => !cur);
  };

  const decreaseIndex = () => {
    const minIndex = 0;
    if (leaving) return;
    setDirection(false);
    setIndex((cur) => (minIndex === cur ? 3 : cur - 1));
    setLeaving((cur) => !cur);
  };

  const onClickBox = (tvId: number) => {
    history.push(`/tv/${tvId + ""}`);
  };

  const overlayClicked = () => {
    history.goBack();
  };
  const modalTvInfo =
    isTvClicked &&
    data?.results.find((tv) => tv.id === +isTvClicked.params.tvId);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImage(data?.results[0].backdrop_path || "")}>
            <TypeIt>
              <Title>{data?.results[0].name}</Title>
            </TypeIt>

            <Overview>{data?.results[0].overview}</Overview>
          </Banner>

          <Slider>
            <h3
              style={{
                fontSize: "24px",
                paddingLeft: "15px",
                fontWeight: "700",
                marginBottom: "15px",
              }}
            >
              On_Air
            </h3>
            <AnimatePresence
              initial={false}
              onExitComplete={() => setLeaving((cur) => !cur)}
            >
              <Row
                initial={{
                  x: direction ? window.outerWidth : -window.outerWidth,
                }}
                animate={{ x: 0 }}
                exit={{
                  x: direction ? -window.outerWidth : window.outerWidth,
                }}
                transition={{ type: "tween", duration: 1 }}
                key={index}
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
                  .slice(index * offSet, index * offSet + offSet)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      onClick={() => onClickBox(tv.id)}
                      transition={{ type: "tween" }}
                      variants={boxVariants}
                      initial="initial"
                      whileHover="hover"
                      key={tv.id}
                      bgphoto={makeImage(tv.backdrop_path)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          {isTvClicked ? (
            <AnimatePresence>
              <Overlay
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={overlayClicked}
              />
              <TvModalWrapper
                style={{ top: scrollY.get() + 100 }}
                layoutId={isTvClicked.params.tvId}
              >
                <TvModalImg
                  img={makeImage(modalTvInfo?.backdrop_path || "", "w500")}
                />
                <TvModalTitle>{modalTvInfo?.name}</TvModalTitle>
                <TvModalDesc>{modalTvInfo?.overview}</TvModalDesc>
              </TvModalWrapper>
            </AnimatePresence>
          ) : null}
        </>
      )}
    </Wrapper>
  );
}

export default TV;
