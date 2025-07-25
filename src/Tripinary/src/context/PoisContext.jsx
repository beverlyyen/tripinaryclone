import React from "react";

const poisFormat = {
  food_drinks: [],
  attractions_sightseeing: [],
  activities_recreation: [],
  shopping: [],
};

const PoisContext = React.createContext({
  pois: poisFormat,
  findPois: () => {},
  deletePois: () => {},
  isPoisEmpty: () => {}
});

export default PoisContext;