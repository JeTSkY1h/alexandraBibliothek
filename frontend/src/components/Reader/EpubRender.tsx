import { useParams } from "react-router-dom";
import { useMemo } from "react";
import Reader from "./Reader";
import { Center, Spinner } from "@chakra-ui/react";
import { useUserBookLoader } from "../../hooks/UserBookUtils";


const EpubRender = () => {
  const { id: rawId } = useParams();
  const id = useMemo(() => rawId, [rawId]);
  const { userBookObj, isLoading, isError } = useUserBookLoader(id || "");  

  return (
    <>
      {(isLoading) && (
        <Center>
          <Spinner />
        </Center>
      )}
      {(isError) && <p>Error</p>}
      {userBookObj && (
        <Reader
          chapter={userBookObj.chapter|| 0}
          bookId={id || ""}
          lastReadBlock={userBookObj.lastReadBlock|| 0}
        />
      )}
    </>
  );
};

export default EpubRender;