import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Flex, Button, Box } from "@chakra-ui/react";

interface PaginatorProps {
    page: string;
    length: number;
    pages: number;
    setPage: (newPage: string) => void;
}

const Paginator = ({page, length, pages, setPage}:PaginatorProps) => {

    const handlePrev = () => {
        if(parseInt(page) === 0) return;
        setPage((parseInt(page)-1).toString())
    }

    const handleNext = () => {
        if(length < 30) return;
        setPage((parseInt(page)+1).toString())
    }

    const renderPageNumbers = (page:number) => {
        const pageButtons = [];
        const renderbutton = (i:number, page:number) => {
            return (
                <Button
                    key={i}
                    onClick={() => setPage(i.toString())}
                    isActive={page === i}
                >{i}</Button>
            )
        }

        for (let i = Math.max(1, page - 5); i < Math.min(Math.max(page + 5, 11), pages); i++) {
            pageButtons.push(
                renderbutton(i, page)
            );
        }
        return pageButtons;
    };


    return (
        
            <Flex w={"100%"} gap={6} justifyContent={"center"} alignItems={"center"} pb={6}>
                {<Button isDisabled={page === "0"} onClick={handlePrev}><ChevronLeftIcon/></Button>}
                <Box>{renderPageNumbers(parseInt(page))}</Box>
                <Button isDisabled={length < 30} onClick={handleNext}><ChevronRightIcon/></Button>
            </Flex>
            
    )
}

export default Paginator