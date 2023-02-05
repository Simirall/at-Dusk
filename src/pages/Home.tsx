import { Button } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const [, setLogin] = useLocalStorage({
    key: "login",
    defaultValue: false,
  });
  return (
    <>
      HOME
      <Button
        onClick={() => {
          setLogin(false);
          navigate("/login");
        }}
      >
        LOGOUT
      </Button>
    </>
  );
};
