import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = React.useContext(GithubContext);

  /*
  const languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;
    if (!language) return total;
    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }
    return total;
  }, {});

  const mostUsed = Object.values(languages)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);

  // most stars per language

  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars;
    })
    .map((item) => {
      return { ...item, value: item.stars };
    })
    .slice(0, 5);

  // stars, forks

  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item;
      total.stars[stargazers_count] = { label: name, value: stargazers_count };
      total.forks[forks] = { label: name, value: forks };
      return total;
    },
    {
      stars: {},
      forks: {},
    }
  );

  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();

   */

  const languages = repos.reduce(
    (total, current) => {
      const { language, stargazers_count, forks_count, name } = current;
      if (!language) {
        return total;
      }
      if (total.languages[language]) {
        total.languages[language] += 1;
      } else {
        total.languages[language] = 1;
      }

      if (total.stars[language]) {
        total.stars[language] += stargazers_count;
      } else {
        total.stars[language] = stargazers_count;
      }

      total.pop[name] = stargazers_count;
      total.forks[name] = forks_count;

      return total;
    },
    { languages: {}, stars: {}, pop: {}, forks: {} }
  );

  const calcData = (languages, i) => {
    return [...Object.entries(Object.values(languages)[i])]
      .sort((a, b) => {
        return b[1] - a[1];
      })
      .slice(0, 5)
      .map(([label, value]) => {
        return { label, value };
      });
  };

  const [languagesData, starsData, popData, forksData] = [0, 1, 2, 3].map((i) =>
    calcData(languages, i)
  );
  // console.log(languagesData);

  // console.log(starsData);

  // console.log(popData);

  // console.log(forksData);

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={languagesData} />
        <Column3D data={popData} />
        <Doughnut2D data={starsData} />
        <Bar3D data={forksData} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
