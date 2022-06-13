import {  useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../../UI/Input/Input";

import styles from "./ListItem.module.css";
import { useDebounce } from "../../../util/hooks";
import { server } from "../../../util/axios";

interface IListItem {
  id: number;
  name: string;
  isLink?: boolean;
  from?: number;
  distance?: number;
}

// Made List item into its own component because I wanted to use it in the Restaurant page and in the Single Restaurant page
export const ListItem: React.FC<IListItem> = (props) => {
  const [input, setInput] = useState<number | string>(props.distance || "");
  // with this hook you can change the input in an interval of 1 second as many times as you like, and after 1 second of staying in the same value it will save it,
  // and be able to trigger the use effect side-effect.
  const debouncedInput = useDebounce(input, 1000);
  const [flag, setFlag] = useState(false);

  //Helper for the debounced effect
  useEffect(() => {
    setFlag(true);
  }, [debouncedInput]);

  useEffect(() => {
    if (props.from && flag) {
      setFlag(false);
      // Everytime the debounced data becomes available, make the request to the server to save the new distance value
      server.patch(`/distance/${props.from}/${props.id}`, {
        distance: debouncedInput,
      });
    }
  }, [debouncedInput, flag, props.from, props.id]);

  const content = (
    <>
      <div className={styles.ListItem_number}>{props.id}</div>
      <div className={styles.ListItem_name}>{props.name}</div>
      {props.distance !== undefined ? (
        <div className={styles.ListItem_distance}>
          <Input
            placeholder="Unknown"
            title="Distance"
            inline
            value={input}
            type="number"
            onChange={(event) => {
              const val = event.target.value;
              if (+val === 0 || val === "") setInput("");
              else setInput(+val);
            }}
          />
        </div>
      ) : null}
    </>
  );

  if (props.isLink) {
    return (
      <Link to={`/restaurants/${props.id}`} className={styles.ListItem}>
        {content}
      </Link>
    );
  }

  return <div className={styles.ListItem}>{content}</div>;
};
