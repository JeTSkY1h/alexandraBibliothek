import React, { useEffect, useRef, useCallback, useLayoutEffect, useState } from 'react';
import { Box, Heading, Text, Image, Button } from '@chakra-ui/react';
import { useChapterLoader } from '../../hooks/BookUtils';
import { useUserBookUtils } from '../../hooks/UserBookUtils';

interface ReaderProps {
  bookId: string;
  chapter: number;
  lastReadBlock: number;
}

const Reader: React.FC<ReaderProps> = ({ bookId, chapter:initialChapter, lastReadBlock }) => {
  const scrolled = useRef(false);
  const [chapter, setChapter] = useState<number>(initialChapter);
  const { chapterObj, setChapter: setReadingChapter, isLoading } = useChapterLoader(bookId, chapter);
  const { setChapter:setTrackingChapter, setLastReadBlock } = useUserBookUtils(bookId, chapter);
  const content = chapterObj || [];
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRefs = useRef<(Element | null)[]>([]);

  const saveProgress = useCallback((index: number) => {
    setLastReadBlock(index);
  }, [setLastReadBlock]);

  useEffect(() => {
    const intersectingElems:Array<Element> = [];
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log('Element is visible');
              intersectingElems.push(entry.target)
              console.log(intersectingElems[0])
              intersectingElems[0].setAttribute("style", "color: pink")
              const index = elementRefs.current.indexOf(intersectingElems[0]);
              if (index !== -1) {
                saveProgress(index);
              }
            } else {
              intersectingElems.splice(intersectingElems.indexOf(entry.target), 1)
              entry.target.setAttribute("style", "color: var(--chakra-colors-chakra-body-text)")
            }
            
          });
        },
        { threshold: 0.5 } // Adjust the threshold as needed
      );
    }

    const currentObserver = observerRef.current;
    elementRefs.current.forEach((element) => {
      if (element) {
        currentObserver.observe(element);
      }
    });

    return () => {
      elementRefs.current.forEach((element) => {
        if (element) {
          currentObserver.unobserve(element);
        }
      });
    };
  }, [content, saveProgress]);

  const renderElement = (element: any, index: number) => {
    const { tag, children, text, attrs } = element;

    if (tag) {
      let Component;
      switch (tag) {
        case 'h1':
          Component = (props: any) => <Heading as="h1" {...props} />;
          break;
        case 'h2':
          Component = (props: any) => <Heading as="h2" {...props} />;
          break;
        case 'h3':
          Component = (props: any) => <Heading as="h3" {...props} />;
          break;
        case 'h4':
          Component = (props: any) => <Heading as="h4" {...props} />;
          break;
        case 'h5':
          Component = (props: any) => <Heading as="h5" {...props} />;
          break;
        case 'h6':
          Component = (props: any) => <Heading as="h6" {...props} />;
          break;
        case 'p':
          Component = (props: any) => <Text {...props}/>;
          break;
        case 'img':
          return (
            <Box ref={(el) => (elementRefs.current[index] = el)} key={index}>
              <Image src={attrs.src} alt="Image" />
            </Box>
          );
        default:
          Component = Box;
      }
      console.log(Component)
      console.log(children)

      return (
        <Component ref={(el) => (elementRefs.current[index] = el)} key={index}>
          {children && children.map((child: any, childIndex: number) => renderElement(child, childIndex))}
        </Component>
      );
    }

    if (text) {
      return (
        <Box ref={(el) => (elementRefs.current[index] = el)} key={index}>
          {text}
        </Box>
      );
    }

    return null;
  };

  const handlePrev = () => {
    if (chapter > 0) {
      setChapter(currChapter=>currChapter - 1);
    }
  };

  useLayoutEffect(() => {
    if (isLoading) {
      scrolled.current = false;
      return
    }
    console.log("Last read block: ", lastReadBlock);
    console.log("Scrolled: ", scrolled.current);
    if (lastReadBlock !== 0 && scrolled.current === false) {
      elementRefs.current[lastReadBlock]?.scrollIntoView();
      scrolled.current = true;
    }
  }), [isLoading];

  useEffect(()=>{
    console.log("Setting chapter", chapter);
    setReadingChapter(chapter);
    setTrackingChapter(chapter);
  }, [chapter])

  const handleNext = () => {
    setChapter(currChapter=>currChapter + 1);
  };

  return (
    <Box overflow="auto" height="100vh" p={4}>
      {isLoading && <p>Loading</p>}
      {content.map((element: any, index: number) => (
        <React.Fragment key={index}>
          {renderElement(element, index)}
        </React.Fragment>
      ))}
      <Button onClick={handlePrev}>Previous</Button>
      <Button onClick={handleNext}>Next</Button>
    </Box>
  );
};

export default Reader;