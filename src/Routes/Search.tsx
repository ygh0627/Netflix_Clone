import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getSearch, IGetSearchResult } from "../api";
import SearchHeader from "../Components/SearchHeader";
import { makeImage } from "../utils";
import {
  ModalDesc,
  ModalImage,
  ModalTitle,
  MovieModalInfo,
  Overlay,
} from "./Home";
const Wrapper = styled.div``;

const Loader = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
`;
const Alert = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
`;
const Body = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const Empty = styled.div`
  height: 15vh;
`;

const Container = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 80vh;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(2, 1fr);
  justify-content: center;
  gap: 0.1%;
`;

const Box = styled(motion.div)<{ bgimg: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.bgimg});
  background-position: center;
  background-size: cover;
  border-radius: 10px;
  cursor: pointer;
`;

const Info = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.7)
  );
  border-radius: 10px;
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-content: space-between;
`;

const Rating = styled.div``;

const Title = styled.div`
  width: 100%;
  height: 50%;
  text-align: center;
`;

const FooterBox = styled.div`
  width: 90%;
  height: 50%;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
`;

const Bigsearch = styled(motion.div)`
  position: absolute;
  width: 60vh;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  z-index: 51;
`;

const container = {
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

function Search() {
  const location = useLocation();
  const history = useHistory();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const bigSearchMatch = useRouteMatch<{ movieId: string }>(`/search/:movieId`);
  const { isLoading, data: searchData } = useQuery<IGetSearchResult>(
    "search",
    () => getSearch(keyword + "")
  );
  console.log(searchData);
  const { scrollY } = useViewportScroll();

  const clickedNowSearch =
    bigSearchMatch?.params.movieId &&
    searchData?.results.find(
      (movie) => movie.id + "" === bigSearchMatch?.params.movieId
    );

  const onBoxClicked = (movieId: number) => {
    history.push(`/search/${movieId}`);
  };
  const onClicked = () => {
    history.goBack();
  };
  console.log(searchData);
  return (
    <Wrapper>
      <SearchHeader />
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {searchData?.total_results === 0 ? (
            <Alert>There are no matching Datas</Alert>
          ) : (
            <>
              <Body>
                <Empty></Empty>
                <Container
                  variants={container}
                  initial="hidden"
                  animate="visible"
                >
                  {searchData?.results
                    .filter((item) => item.backdrop_path !== null)
                    .map((info, index) => {
                      return (
                        <Box
                          layoutId={info.id + ""}
                          onClick={() => onBoxClicked(info.id)}
                          // variants={item}
                          // initial="hidden"
                          // animate="visible"
                          whileHover={{ y: -20 }}
                          bgimg={makeImage(info.backdrop_path)}
                          key={info.id}
                        >
                          <Info whileHover={{ opacity: 1 }}>
                            <Title>
                              {info.original_title || info.original_name}
                            </Title>
                            <FooterBox>
                              <Rating>⭐ {info.vote_average}</Rating>
                            </FooterBox>
                          </Info>
                        </Box>
                      );
                    })}
                </Container>
              </Body>
            </>
          )}
        </>
      )}
      <AnimatePresence>
        {bigSearchMatch ? (
          <>
            <Overlay
              onClick={onClicked}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></Overlay>
            <Bigsearch
              style={{ top: scrollY.get() + 100 }}
              layoutId={bigSearchMatch.params.movieId}
            >
              {clickedNowSearch && (
                <>
                  <ModalImage
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImage(
                        clickedNowSearch.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  ></ModalImage>
                  <ModalTitle>
                    {clickedNowSearch.original_title ||
                      clickedNowSearch.original_name}
                  </ModalTitle>
                  <MovieModalInfo>{`Ratings : ⭐ ${clickedNowSearch.vote_average}`}</MovieModalInfo>
                  <h3 style={{ textAlign: "center" }}>
                    Released Date :{" "}
                    {clickedNowSearch.first_air_date ||
                      clickedNowSearch.release_date}
                  </h3>
                  <ModalDesc>{clickedNowSearch.overview}</ModalDesc>
                </>
              )}
            </Bigsearch>
          </>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Search;
