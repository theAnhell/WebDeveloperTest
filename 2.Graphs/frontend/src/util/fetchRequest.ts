import { server } from "./axios";
import { Distances, Restaurants } from "./models";

export const fetchRestaurant = async (idRestaurant: number) => {
  const response = await server.get<{
    restaurant: Restaurants;
    distances: Distances[];
  }>(`/restaurants/${idRestaurant}`);

  return {
    restaurant: response.data.restaurant,
    distances: response.data.distances,
  };
};

export const fetchAllRestaurants = async () => {
  const response = await server.get<{ restaurants: Restaurants[] }>(
    "/restaurants"
  );
  return response.data.restaurants;
};
export const populateData = async () => {
  await server.get("/populate");
};
