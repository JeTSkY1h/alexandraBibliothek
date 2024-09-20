import React, { useEffect, useRef, useState } from 'react';
import ePub from 'epubjs';
import {Rendition} from 'epubjs';
import { Box, Button, Progress, useColorModeValue} from '@chakra-ui/react';
import { useUserBookUtils } from '../../hooks/UserBookUtils';
import Section from 'epubjs/types/section';

interface ReaderProps {
  location?: string
  epubUrl: ArrayBuffer | string;
  bookID: string;
}

const Reader: React.FC<ReaderProps> = ({ epubUrl, bookID, location }) => {
  const bookRef = useRef<HTMLDivElement>(null);
  const [rendition, setRendition] = useState<Rendition | null>(null);
  const [progress, setProgress] = useState(0);
  const [display, setdisplay] = React.useState(false);
  const {setLocation} = useUserBookUtils(bookID);
  const bookBackground = useColorModeValue("white", "#1A202C");
  const fontColor = useColorModeValue("black", "white");

  useEffect(  () => {
    if(!bookRef.current) {
      //setError('No ref found');
      return;
    }
    if(rendition) return;
    const newBook = ePub(epubUrl);
    const rend = newBook.renderTo(bookRef.current, {
      manager: "default",
      flow: "scrolled-doc",
      width: "100%"
    })
    console.log(newBook)

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
      if(!bookRef.current) return
      rend.getContents().document
      const bookIFrame = bookRef.current.querySelector("iframe") as HTMLIFrameElement;
      const bookDoc = bookIFrame.contentDocument;

      bookDoc?.body.setAttribute("style", `background-color: ${bookBackground};`);
      if(!bookDoc) return;
      console.log(bookDoc)

      const paragraphs = bookDoc?.querySelectorAll("p");
      paragraphs.forEach((paragraph, i) => {
        paragraph.setAttribute("data-index",i.toString());
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
        console.log(viewableEntries);
        const topParagraphs = viewableEntries.sort((a, b) => 
          a.boundingClientRect.top - b.boundingClientRect.top
        );
        const topParagraph = topParagraphs[0].target;
        const lastParagraph = topParagraphs[topParagraphs.length - 1].target;
   
        if(!topParagraph) return;
        const cfi = topParagraph.getAttribute("data-cfi");
        const index = parseInt(lastParagraph.getAttribute("data-index") || "0");
        const progress = (index + 1) / paragraphs.length * 100;
        setProgress(progress);



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
      <Box
        width="100vw"
        display="flex"
        justifyContent="center"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems="center"
        padding="1rem"
      >
        <Button
          left="1px"
          bottom="1px"
          pos="fixed"
          height={{ base: '60px', md: '100vh' }}
          width={{ base: '50%', md: 'auto' }}
          onClick={prevPage}
          zIndex={1}
        >
          Prev
        </Button>
        <Box
          width={"100%"}
          position={"fixed"}
          top={0}
          left={0}
          zIndex={2}
          >
            <Progress value={progress} size="xs" w={'100%'} colorScheme="teal" />
          </Box>
        <Box
          ref={bookRef}
          minW={{ base: '100%', md: '800px' }}
          padding={{base:"0", md:"4rem"}}
          mb={{ base: '60px', md: '0' }}
          flex="1"
          zIndex={0}
        />
        <Button
          pos="fixed"
          right="1px"
          bottom="1px"
          height={{ base: '60px', md: '100vh' }}
          width={{ base: '50%', md: 'auto' }}
          onClick={nextPage}
          zIndex={1}
        >
          Next
        </Button>
      </Box>
    </>
  );
};

export default Reader;