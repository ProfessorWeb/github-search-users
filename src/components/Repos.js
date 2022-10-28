import React from "react";
import styled from "styled-components";
import { useGlobalContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = useGlobalContext();

  const languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item; // object destructure

    if (!language) return total; // guard clauses
    if (!total[language]) {
      // if total not exist create object
      total[language] = { label: language, value: 1, stars: stargazers_count };
    }

    if (total[language]) {
      // if total exist change value
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }
    return total;
  }, {});

  // take all the value in objects languages then sort him and slice
  // Remember we use slice because some developers use 20 languages ​​and this can weigh on the chart

  const mostUsed = Object.values(languages)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars;
    })
    .map((item) => {
      return { ...item, value: item.stars }; // beacuse remember my chart is looking for the value property
    });

  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { forks, name, stargazers_count } = item;

      /* 
      Change the object to a data.   
      iterate over stargazers_count and then put in the data and property you need in object.

        total.forks[forks] = { label: name, value: forks };

      */
      total.stars[stargazers_count] = { label: name, value: stargazers_count };
      total.forks[forks] = { label: name, value: forks };
      return total; // total returns us an object
    },
    {
      stars: {}, // empty object
      forks: {}, // empty object
    }
  );

  // assign variable then take object value then slice 5 last from array
  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={mostUsed} />
        <Column3D data={stars} />
        <Doughnut2D data={mostPopular} />
        <Bar3D data={forks} />
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
