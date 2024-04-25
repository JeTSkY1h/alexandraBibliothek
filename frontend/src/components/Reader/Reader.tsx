import React, { useEffect, useRef } from 'react';
import ePub from 'epubjs';
import {Rendition} from 'epubjs';
import { Box, Button} from '@chakra-ui/react';
import { useUserBookUtils } from '../../hooks/UserBookUtils';

interface ReaderProps {
  location?: string
  epubUrl: ArrayBuffer | string;
  bookID: string;
}

const Reader: React.FC<ReaderProps> = ({ epubUrl, bookID, location }) => {
  const bookRef = useRef(null);
  const [error, setError] = React.useState("");
  const [rendition, setRendition] = React.useState<Rendition | null>(null);
  const [display, setdisplay] = React.useState(false);
  const {setLocation} = useUserBookUtils(bookID);


  useEffect(  () => {
    console.log(location)
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
    
    
    rend.on("relocated", (section:any) => {
      console.log("relocate", section)
      setLocation(section.start.cfi);
      console.log(rend.getContents());

    })

    rend.on("visibleLocationChanged", (cfiRange:any) => {
      console.log("Visible location changed", cfiRange)
      // Save the cfiRange to local storage or a database
      localStorage.setItem('lastLocation', cfiRange.start);
    })

    setRendition(rend);
  }, [epubUrl]);

  useEffect(() => {
    if(display) return
    if(!rendition) return;
    if(location) {
      console.log("REndering with location", location)
      rendition.display(location);
    } else {
      rendition.display();
    }
    setdisplay(true)
  }, [rendition]);

  const nextPage = () => {
    if(rendition) {
      rendition.next();
    }
  }

  const prevPage = () => {
    if(rendition) {
      rendition.prev();
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