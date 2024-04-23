import React, { useEffect, useRef } from 'react';
import ePub from 'epubjs';
import {Rendition} from 'epubjs';
import { Box, Button} from '@chakra-ui/react';

interface ReaderProps {
  epubUrl: ArrayBuffer | string;
}

const Reader: React.FC<ReaderProps> = ({ epubUrl }) => {
  const bookRef = useRef(null);
  const [error, setError] = React.useState("");
  const [rendition, setRendition] = React.useState<Rendition | null>(null);
  const [location, setLocation] = React.useState("");
  const [display, setdisplay] = React.useState(false);

  useEffect(() => {
    console.log(location)
  }, [location])

  useEffect(  () => {
    console.log(epubUrl)
    if(!bookRef.current) {
      setError('No ref found');
      return;
    }
    if(rendition) return;
    const book = ePub(epubUrl);
    const rend = book.renderTo(bookRef.current, {
      manager: "default",
      flow: "scrolled-doc",
      width: "100%"})
    
    rend.on("rendered", (section:any) => {
      const prev = section.prev()
      const next = section.next()

      if(next) {
        console.log("lol", book.navigation.get(next.href))
        console.log(next.href)
      }

      if(prev) {
        console.log(book.navigation.get(prev.href))
      }
    })

    setRendition(rend);
  }, [epubUrl]);

  useEffect(() => {
    if(display) return
    if(!rendition) return;
    rendition.display();
    setdisplay(true)
  }, [rendition]);

  const nextPage = () => {
    if(rendition) {
      rendition.next();
      console.log(rendition)
      setLocation(rendition.location.start.cfi);
    }
  }

  const prevPage = () => {
    if(rendition) {
      rendition.prev();
      setLocation(rendition.location.start.cfi);
    }
  }

  return (
    <>
      
        <Box width={"100vw"} display={"flex"} justifyContent={"center"} flexDirection={"row"}>
          <Button left={"1px"} top={"1px"} pos={"fixed"} height={"100vh"} onClick={prevPage}>Prev</Button>
          <Box ref={bookRef} minW={"800px"} padding={"4rem"}/>
          <Button pos={"fixed"} right={"1px"} top={"1px"} h={"100vh"} onClick={nextPage}>Next</Button>
        </Box>
   </>
    
    );
}

export default Reader;