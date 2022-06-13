import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import {  useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchAllRestaurants,
  fetchRestaurant,
} from "../../../util/fetchRequest";
import { Button } from "../../UI/Button/Button";
import openSocket from "socket.io-client";
import { Spinner } from "../../UI/Spinner/Spinner";
import { ListItem } from "../ListItem/ListItem";
import styles from "./SingleRestaurant.module.css";
import { baseURL } from "../../../util/axios";
import { Distances, Restaurants } from "../../../util/models";

interface ISingleRestaurant {}

const getUnique = (array: any[]) => {
  return array.filter((value, index, self) => self.indexOf(value) === index);
};

type SocketsInfo = {
  action: "newDistance" | "updatedDistance";
  distance: Distances;
};

const SingleRestaurant: React.FC<ISingleRestaurant> = (props) => {
  const navigate = useNavigate();
  const { idRestaurant } = useParams();
  const idRes = +(idRestaurant || 1);

  const queryClient = useQueryClient();

  // Fetch the data for all the restaurants to get the name info.

  const { data: dbRestaurants, isLoading: loadingRestaurants } = useQuery(
    "fetchRestaurants",
    fetchAllRestaurants
  );

    // Fetch the data for the restaurant and their distances between each pair.

  const {
    data: dbData,
    isLoading,
    refetch: refetchData,
  } = useQuery(["fetchRestaurant", idRestaurant], () => fetchRestaurant(idRes));

  useEffect(() => {
    const socket = openSocket(baseURL!);
    const queryKey = ["fetchRestaurant", idRestaurant];
    const distanceHandler = (data: SocketsInfo) => {
      if (data.action === "newDistance") {
        // New distance so we just push the new distance onto the QueryData
        queryClient.setQueryData<{restaurant: Restaurants, distances: Distances[]}>(queryKey, (oldData)=>{
            if(!oldData) return {
              restaurant:{
                id: 1,
                name: "No Name Restaurant",
              },
              distances:[]
            } // default values
            const tempOld = {...oldData};
            if(data.distance)tempOld.distances.push(data.distance); /// push the new value into the QueryData
            return tempOld
          });

      }
      if (data.action === "updatedDistance") {
        // Updated distance so we search the index where the old data is and we update it;
        queryClient.setQueryData<{restaurant: Restaurants, distances: Distances[]}>(queryKey, (oldData)=>{
          if(!oldData) return {
            restaurant:{
              id: 1,
              name: "No Name Restaurant",
            },
            distances:[]
          }
          const tempOld = {...oldData};
          const id = idRes === data.distance.to?data.distance.from:data.distance.to;
          if(!id) return oldData;
          //Find the oldvalue and change the distance value to the new one in the database.
          const index =tempOld.distances.findIndex(item=>item.to===id);
          if(index>=0) tempOld.distances[index].distance = data.distance.distance
          return tempOld
        });
      }
    };

    socket.on("distance", distanceHandler);
    return () => {
      socket.disconnect();
    };
  }, [queryClient, idRes,refetchData]);

  const selRestaurant = dbData?.restaurant || {
    id: 1,
    name: "No Name Restaurant",
  };
  const distances = dbData?.distances || [];
  const allRestaurants = dbRestaurants || [];


  //Sort to send the Unknown values to the bottom and keep them from shortest distance to furthest distance.

  const sortedDistances = distances.sort((a, b) => {
    if (a.distance !== 0 && b.distance === 0) return -1;
    if (a.distance === 0 && b.distance !== 0) return 1;
    if (a.distance < b.distance) return -1;
    if (a.distance > b.distance) return 1;
    return 0;
  });


  const distanceUniqueRestaurants = getUnique(
    sortedDistances.map((dis) => dis.to)
  );
  const restaurantsNotInDistances = getUnique(
    allRestaurants
      .filter(
        (res) =>
          !distanceUniqueRestaurants.some(
            (dur) => dur === res.id || res.id === idRes
          )
      )
      .map((res) => res.id)
  );

  let content = null;
  if (isLoading || loadingRestaurants) content = <Spinner />;
  if (dbData)
    content = (
      <div className={styles.content}>
        {distanceUniqueRestaurants.map((dUR) => {
          const toRestaurant = allRestaurants.find((r) => r.id === dUR);
          const distance = distances.find((d) => d.to === dUR);
          // First we show the pairs that have values from shortest to farthest away.
          if (!toRestaurant || !distance) return null;
          return (
            <div className={styles.distances} key={dUR}>
              <ListItem id={selRestaurant.id} name={selRestaurant.name} />
              <div className={styles.distance_item}>
                <div className={styles.distance_item_line}></div>
              </div>
              <ListItem
                id={toRestaurant.id}
                name={toRestaurant.name}
                distance={distance.distance}
                from={selRestaurant.id}
              />
            </div>
          );
        })}
        
        {restaurantsNotInDistances.map((rND) => {
          // Then we show the distances that aren't in pair with an unknown value.
          const toRestaurant = allRestaurants.find((r) => r.id === rND);
          if (!toRestaurant) return null;
          return (
            <div className={styles.distances}>
              <ListItem
                id={selRestaurant.id}
                name={selRestaurant.name}
                key={rND}
              />
              <div className={styles.distance_item}>
                <div className={styles.distance_item_line}></div>
              </div>
              <ListItem
                id={toRestaurant.id}
                name={toRestaurant.name}
                distance={0}
                from={selRestaurant.id}
              />
            </div>
          );
        })}
      </div>
    );

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Header}>
        <Button color="black" icon={FaArrowLeft} onClick={() => navigate(-1)} />
        <div className={styles.Header_title}>{selRestaurant.name}</div>
      </div>
      {content}
    </div>
  );
};

export default SingleRestaurant;
