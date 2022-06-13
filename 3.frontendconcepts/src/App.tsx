import React, { useState } from "react";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import styles from "./App.module.css";
import { useWindowDimensions } from "./useWindowsDimension";

function App() {
  const mobile = useWindowDimensions();
  const [selectedId, setSelectedId] = useState(1);
  const carrucel = [
    {
      id: 1,
      code: (
        <div className={styles.panel}>
          <h3 className={styles.panel_title}>Static</h3>
          <div className={styles.panel_content}>
            An static component isn't affected by CSS attributes like Top,
            Bottom, Left or Right, it just go with the component flow.
          </div>
          <div className={styles.panel_example_static}>
            <div>1</div>
            <div className={styles.panel_static_red}>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
          </div>
          <div className={styles.panel_content}>
            This is the one that will be used the most, it's the default value
            and the one that works how you expect it to work.
          </div>
        </div>
      ),
    },
    {
      id: 2,
      code: (
        <div className={styles.panel}>
          <h3 className={styles.panel_title}>Relative</h3>
          <div className={styles.panel_content}>
            A relative component will be affected by CSS attributes like top,
            bottom, left or right, but other components surrounding it will
            still see the component as it it was in a static position
          </div>
          <div className={styles.panel_example_relative}>
            <div>1</div>
            <div>2</div>
            <div className={styles.panel_relative_red}>3</div>
            <div>4</div>
            <div>5</div>
          </div>
          <div className={styles.panel_content}>
            As you can see in the example above, the 3rd element is moved
            relative to its position from the bottom: 0.5em and from the left:
            0.25em, the other elements still see it as it was normally placed.
          </div>
          <div className={styles.panel_content}>
            Relative it's mostly used when one of the children component is an
            Absolute component, but there are some usecases for relative, most
            notably to make neat effects with an element and another with some
            offset.
          </div>
        </div>
      ),
    },
    {
      id: 3,
      code: (
        <div className={styles.panel}>
          <h3 className={styles.panel_title}>Absolute</h3>
          <div className={styles.panel_content}>
            The absolute position works like the relative position, it's still
            affected by attributes like top, bottom, left or right, but it sees
            if it has an absolute/relative parent component, if it doesn't it
            uses the overall document to position itself. The major difference
            between the two is that other components don't see the absolute
            component as an static component, so other components can take its
            place.
          </div>
          <div className={styles.panel_example_absolute}>
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div className={styles.panel_absolute_red}>4</div>
            <div>5</div>
          </div>
          <div className={styles.panel_content}>
            As you can see in the example above, the 4th element isn't in the
            component flow, the 5th div takes it place instead, the absolute
            component is floating bottom: 1.5em, right: 2.4em.
          </div>
          <div className={styles.panel_content}>
            This one I used it in this project for the right and left buttons,
            they are in an absolute position and move with the parent content,
            they are really helpful for this kind of components.
          </div>
        </div>
      ),
    },
    {
      id: 4,
      code: (
        <div className={styles.panel}>
          <h3 className={styles.panel_title}>Fixed</h3>
          <div className={styles.panel_content}>
            A fixed element is positioned relative to the viewport, it will
            always stay in the same position even if you scroll the page, it's
            affected by CSS attributes like top, right, bottom and left.
          </div>
          <div className={styles.panel_example_fixed}>
            <div>1</div>
            <div className={selectedId === 4 ? styles.panel_fixed_red : ""}>
              2
            </div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
          </div>
          <div className={styles.panel_content}>
            The component takes the document height and width to determine its
            position, with top: 0 and right: 0, it's positioned on the top-right
            corner of the screen. Like an absolute component, others element
            don't see the fixed component as static, so they take the space that
            was left.
          </div>
          <div className={styles.panel_content}>
            Fixed can be used for some popups, like alerts and other messages
            that you want to show the user, no matter in which page he or she
            is.
          </div>
        </div>
      ),
    },
    {
      id: 5,
      code: (
        <div className={styles.panel}>
          <h3 className={styles.panel_title}>Sticky</h3>
          <div className={styles.panel_content}>
            An sticky component will change between relative position and sticky
            position when necesary, the trigger being if you scroll far away
            from the component, if this happens it will change to sticky and
            stay in the same original position, even if other components are
            trying to take its place.
          </div>
          <div className={styles.panel_example_sticky}>
            <div>1</div>
            <div>2</div>
            <div className={styles.panel_sticky_red}>3</div>
            <div>4</div>
            <div>5</div>
            {selectedId === 5 ? (
              <>
                <div>6</div>
                <div>7</div>
                <div>8</div>
                <div>9</div>
                <div>10</div>
                <div>11</div>
                <div>12</div>
                <div>13</div>
                <div>14</div>
                <div>15</div>
              </>
            ) : null}
          </div>
          <div className={styles.panel_content}>
            In the example above the 3rd element is in the 3rd position
            initially, but if you scroll pass it, it sticks to the left, the
            other elements see it as an floating component and ignore it.
          </div>
          <div className={styles.panel_content}>
            Sticky is mostly used when you have a scrollable page, if you want
            your header or titles to stick to the top even when you scroll, you
            can use it.
          </div>
        </div>
      ),
    },
  ];

  //* action = 0  === prev // action =1 === next
  const nextPrevSlideHandler = (action: boolean) => {
    const max = carrucel.length - 1;
    const currIndex = carrucel.findIndex((sl) => sl.id === selectedId);
    if (currIndex < 0) return;
    if (action) {
      return carrucel[currIndex === max ? 0 : currIndex + 1];
    } else {
      return carrucel[currIndex === 0 ? max : currIndex - 1];
    }
  };

  const nextSlideHandler = () => {
    const nextSlide = nextPrevSlideHandler(true);
    setSelectedId(nextSlide?.id || 1);
  };

  const prevSlideHandler = () => {
    const prevSlide = nextPrevSlideHandler(false);
    setSelectedId(prevSlide?.id || 1);
  };
  const prevPanel = carrucel.find(
    (panel) => panel === nextPrevSlideHandler(false)
  );
  const currPanel = carrucel.find((panel) => panel.id === selectedId);
  const nextPanel = carrucel.find(
    (panel) => panel === nextPrevSlideHandler(true)
  );

  return (
    <div className={styles.Wrapper}>
      <h1 className={styles.Title}>3. Front-End Concepts</h1>
      <div className={styles.slider}>
        <div className={styles.sliderContainer}>
        <div className={styles.left_arrow} onClick={prevSlideHandler}>
          <FaArrowLeft />
        </div>
        <div className={styles.right_arrow} onClick={nextSlideHandler}>
          <FaArrowRight />
        </div>
          {mobile ? null : (
            <div className={styles.slide___small}>{prevPanel?.code}</div>
          )}
          <div className={styles.slide}>{currPanel?.code}</div>
          {mobile ? null : (
            <div className={styles.slide___small}>{nextPanel?.code}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
