import { motion } from "framer-motion";
import { useQuery } from "react-query";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { getSearch, IGetSearchResult } from "../api";
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
function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { isLoading, data } = useQuery<IGetSearchResult>("search", () =>
    getSearch(keyword + "")
  );
  console.log(data);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {data?.total_results === 0 ? (
            <Alert>Sorry, couldn't find the matching Data</Alert>
          ) : (
            <span>There are some datas</span>
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Search;
