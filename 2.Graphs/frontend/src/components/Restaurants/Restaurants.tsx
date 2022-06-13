import { useQuery } from "react-query";
import { fetchAllRestaurants, populateData } from "../../util/fetchRequest";
import { Button } from "../UI/Button/Button";
import { ListItem } from "./ListItem/ListItem";
import styles from "./Restaurants.module.css";

interface IRestaurants {}

const Restaurants: React.FC<IRestaurants> = (props) => {
  const { data: dbRestaurants, refetch } = useQuery(
    "fetchRestaurants",
    fetchAllRestaurants
  );

  const restaurants = dbRestaurants ?? [];

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Header}>
        <div className={styles.Header_title}>List of Restaurants</div>
        <Button
          type="button"
          onClick={() => {
            populateData().then(() => refetch());
          }}
          color="secondary"
        >
          Populate with dummy data
        </Button>
      </div>
      <div className={styles.WrapperRestaurants}>
        {restaurants.map((res) => (
          <ListItem key={res.id} isLink id={res.id} name={res.name} />
        ))}
      </div>
    </div>
  );
};

export default Restaurants;
