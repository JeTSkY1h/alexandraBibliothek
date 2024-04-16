import { useCallback, useEffect, useState } from "react"
import { getBookPath, getBooks } from "../lib/api/books";
import { Book } from "../lib/types/Book";
import { baseUrl } from "../lib/api/url";

export const useBookLoader = () => {
    const [books, setBooks] = useState<Book[]>([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState<number>(100);
    const [offset, setOffset] = useState<number>(0);

    const loadBooks = useCallback(() => {
        setLoading(true);
        getBooks(limit, offset).then((data) => {
            setBooks(data);
            setLoading(false);
        }).catch((e) => {
            setError(e);
            setLoading(false);
        });
    }, [limit, offset])

    useEffect(() => {
        loadBooks();
    }, [loadBooks])

    return {
        books,
        error,
        loading,
        limit,
        setLimit,
        offset,
        setOffset
    }
}

export const useBookfileloader = (book: Book) => {

}


export const getCoverPath = (book: Book) => {
    return `${baseUrl}/cover/${book.cover}`
}

export const getBookPathUrl = (book: Book) => {
    return `${baseUrl}/book/${book.path}`
}
