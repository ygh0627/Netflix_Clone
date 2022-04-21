import { motion } from "framer-motion";
import { useQuery } from "react-query";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { getSearch, IGetSearchResult } from "../api";
import SearchHeader from "../Components/SearchHeader";
import { makeImage } from "../utils";
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
  background-image: url(${(prop) => prop.bgimg});
  background-position: center;
  background-size: cover;
  border-radius: 10px;
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

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { isLoading, data } = useQuery<IGetSearchResult>("search", () =>
    getSearch(keyword + "")
  );

  return (
    <Wrapper>
      <SearchHeader />
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {data?.total_results === 0 ? (
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
                  {data?.results.map((info, index) => {
                    return (
                      <Box
                        variants={item}
                        bgimg={makeImage(
                          info.backdrop_path || info.poster_path
                        )}
                      >
                        <Info whileHover={{ opacity: 1 }}>
                          <Title>{info.original_title}</Title>
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
    </Wrapper>
  );
}

export default Search;
