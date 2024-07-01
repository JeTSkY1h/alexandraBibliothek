import React, { useEffect, useRef, useState } from 'react';
import ePub from 'epubjs';
import {Rendition} from 'epubjs';
import { Box, Button, useColorMode, useColorModeValue} from '@chakra-ui/react';
import { useUserBookUtils } from '../../hooks/UserBookUtils';
import Section from 'epubjs/types/section';

interface ReaderProps {
  location?: string
  epubUrl: ArrayBuffer | string;
  bookID: string;
}

const Reader: React.FC<ReaderProps> = ({ epubUrl, bookID, location }) => {
  const bookRef = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<Section | null >(null);
  const [error, setError] = useState("");
  const [rendition, setRendition] = useState<Rendition | null>(null);
  const [display, setdisplay] = React.useState(false);
  const {setLocation} = useUserBookUtils(bookID);
  const bookBackground = useColorModeValue("white", "#1A202C");
  const fontColor = useColorModeValue("black", "white");


  useEffect(  () => {
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

    const scrollToElement = () => {
      if(!bookRef.current) return
      const bookIFrame = bookRef.current.querySelector("iframe") as HTMLIFrameElement;
      const bookDoc = bookIFrame.contentDocument;
      if(!bookDoc) return;
      const paragraphs = bookDoc?.querySelectorAll("p");
      const paragraph = Array.from(paragraphs).find((p) => p.getAttribute("data-cfi") === location);
      if(paragraph) {
        paragraph.scrollIntoView();
      }
      setdisplay(true);
    }
    
    rend.on("rendered", (section:Section) => {
      setSection(section);
      if(!bookRef.current) return
      rend.getContents().document
      const bookIFrame = bookRef.current.querySelector("iframe") as HTMLIFrameElement;
      const bookDoc = bookIFrame.contentDocument;
      bookDoc?.body.setAttribute("style", `background-color: ${bookBackground};`);
      if(!bookDoc) return;
      console.log(bookDoc)

      const paragraphs = bookDoc?.querySelectorAll("p");
      paragraphs.forEach(paragraph => {
        paragraph.setAttribute("data-cfi", section.cfiFromElement(paragraph as HTMLElement));
        paragraph.setAttribute("style", `background-color: ${bookBackground};`);
        paragraph.setAttribute("style", `color: ${fontColor};`);
      });
      //if first time, scroll to location
      if(!display) {
        scrollToElement();
      }

      const observer = new IntersectionObserver((entries) => {
       
        const viewableEntries = entries.filter(entry => entry.isIntersecting);
    
        const topParagraph = viewableEntries.sort((a, b) => 
          a.boundingClientRect.top - b.boundingClientRect.top
        )[0].target;

        const cfi = topParagraph.getAttribute("data-cfi");

        if(cfi) {
          setLocation(cfi);
        } else {
          setLocation(section.cfiFromElement(topParagraph as HTMLElement));
        }
      }, { root: null, rootMargin:"0px 0px -75% 0px", threshold: 0.1 }); // Adjust threshold as needed
    
      paragraphs.forEach(paragraph => observer.observe(paragraph));
    });
    
    rend.on("relocated", (sectionREl:any) => {
      setLocation(sectionREl.start.cfi);
      })

    setRendition(rend);
  }, [epubUrl]);

  useEffect(() => {
    if(display) return
    if(!rendition) return;
    if(location) {
      rendition.display(location);
    } else {
      rendition.display();
      setdisplay(true)
    }
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