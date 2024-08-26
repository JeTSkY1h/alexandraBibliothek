import { useCallback, useEffect, useState } from "react"
import { getBook, getBookPath, getBooks, searchBooks, updateBook } from "../lib/api/books";
import { Book } from "../lib/types/Book";
import { baseUrl } from "../lib/api/url";
import { lastReadBooks } from "../lib/api/userBook";

export const useBookupdater = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const update = useCallback((book: Book) => {
        setLoading(true);
        updateBook(book).then(() => {
            setLoading(false);
        }).catch((e) => {
            console.log(e);
            setError(e);
            setLoading(false);
        });

    }, [])
    
    return {
        update,
        error,
        loading
    }
}

export const useBookLoader = (id: string) => {
    const [book, setBook] = useState<Book | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadBook = useCallback(() => {
        setIsLoading(true);
        getBook(id).then((data) => {
            setBook(data);
            setIsLoading(false);
        }).catch((e) => {
            console.log(e);
            setError(e);
            setIsLoading(false);
        });
    }, [id])

    useEffect(() => {
        loadBook();
    }, [loadBook])

    return {
        book,
        error,
        isLoading
    }

}

export const useBookPathLoader = (id: string) => {
    const [book, setBook] = useState<Book | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const loadBook = useCallback(() => {
        if(loading || book) return;
        setLoading(true);
        getBookPath(id).then((data) => {
            setBook(data);
            setLoading(false);
        }).catch((e) => {
            console.log(e);
            setError(e);
            setLoading(false);
        });
    }, [id, loading, book])

    useEffect(() => {
        loadBook();
    }, [loadBook])

    return {
        book,
        error,
        loading
    }

}

export const useLastReadBooksLoader = (limit?:number, page?:number) => {
    const [books, setBooks] = useState<Book[]>([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [limitStsate, setLimit] = useState<number>(limit||30);
    const [offset, setOffset] = useState<number>((page||0)*(limitStsate));

    const loadBooks = useCallback(() => {
        if(loading) return
        setLoading(true);
        lastReadBooks(limitStsate, offset).then((data) => {
            setBooks(data);
            setLoading(false);
        }).catch((e) => {
            console.log(e);
            setError(e);
            setLoading(false);
        });
    }, [limitStsate, offset,])

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
    


export const useBooksLoader = (limit?:number, page?:number) => {
    const [books, setBooks] = useState<Book[]>([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [limitStsate, setLimit] = useState<number>(limit||30);
    const [offset, setOffset] = useState<number>((page||0)*(limitStsate));
    const [search, setSearch] = useState<string>("");

    const loadBooks = useCallback(() => {
        if(loading) return
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
