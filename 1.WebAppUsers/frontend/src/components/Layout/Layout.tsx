import styles from "./Layout.module.css";
import { AlertModal } from "../UI/AlertModal/AlertModal";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { logout } from "../../store/authSlice";
import { Button } from "../UI/Button/Button";

interface ILayout {
  children: React.ReactNode;
}

const Layout: React.FC<ILayout> = (props) => {
  const { token } = useAppSelector((state) => state.auth);
  const isAuthenticated = token !== null;
  const dispatch = useAppDispatch();
  return (
    <AlertModal>
      <div className={styles.Main}>
        <div className={styles.Main_navigation}>
          {isAuthenticated ? (
            <div className={styles.ButtonNavigator}>
              <Button
                type="button"
                color="secondary"
                onClick={() => dispatch(logout())}
              >
                Log-out
              </Button>
            </div>
          ) : null}
        </div>
        <main className={styles.Main_content}>{props.children}</main>
      </div>
    </AlertModal>
  );
};

export default Layout;
