import { useCallback, useEffect, useState } from "react"
import { getBookPath, getBooks, searchBooks } from "../lib/api/books";
import { Book } from "../lib/types/Book";
import { baseUrl } from "../lib/api/url";

export const useBookLoader = (id: string) => {
    const [book, setBook] = useState<Book | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const loadBook = useCallback(() => {
        setLoading(true);
        getBookPath(id).then((data) => {
            setBook(data);
            setLoading(false);
        }).catch((e) => {
            console.log(e);
            setError(e);
            setLoading(false);
        });
    }, [id])

    useEffect(() => {
        loadBook();
    }, [loadBook])

    return {
        book,
        error,
        loading
    }

}


export const useBooksLoader = (limit?:number, page?:number) => {
    const [books, setBooks] = useState<Book[]>([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [limitStsate, setLimit] = useState<number>(limit||30);
    const [offset, setOffset] = useState<number>((page||0)*(limitStsate));
    const [search, setSearch] = useState<string>("");

    const loadBooks = useCallback(() => {
        setLoading(true);
        if(search) {
            searchBooks(limitStsate, offset, search).then((data) => {
                setBooks(data);
                setLoading(false);
            }).catch((e) => {
                console.log(e);
                setError(e);
                setLoading(false);
            });
            return;
        }
        getBooks(limitStsate, offset).then((data) => {
            setBooks(data);
            setLoading(false);
        }).catch((e) => {
            console.log(e);
            setError(e);
            setLoading(false);
        });
    }, [limitStsate, offset, search])

    useEffect(() => {
        loadBooks();
    }, [loadBooks, search])

    return {
        books,
        error,
        loading,
        limit,
        setLimit,
        offset,
        setOffset,
        search,
        setSearch
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
