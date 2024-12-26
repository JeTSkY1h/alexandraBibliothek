import { useCallback, useEffect, useState } from "react"
import { getBook, getBookPath, getBooks, getChapterObjects, searchBooks, updateBook } from "../lib/api/books";
import { Book } from "../lib/types/Book";
import { baseUrl } from "../lib/api/url";
import { lastReadBooks } from "../lib/api/userBook";

export const useChapterLoader = (initialBookId:string, initialChapter:number) => {
    const [isError, setError] = useState<string | null>();
    const [isLoading, setLoading] = useState(false);
    const [chapter, setChapter] = useState<number>(initialChapter);
    const [bookId, setBookId] = useState<string | null>(initialBookId);
    const [chapterObj, setChapterObj] = useState<any | null>(null);

    const loadChapter = useCallback(() => {
        console.log("Loading chapter");
        if(isLoading) return;
        if(!bookId) return;
        console.log("BookId: ", bookId);
        setLoading(true);
        getChapterObjects(bookId, chapter).then((data) => {
            console.log(data);
            setChapterObj(data);
            setLoading(false);
        }).catch((e) => {
            console.log(e);
            setError(e);
            setLoading(false);
        })
    }, [chapter, bookId, isLoading])

    useEffect(() => {
        loadChapter();
    }, [chapter, bookId])
    
    return {
        setChapter,
        chapter,
        setBookId,
        loadChapter,
        chapterObj,
        isError,
        isLoading
    }
}

export const useBookUpdater = () => {
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
    


export const useBooksLoader = (limit?:number) => {
    const [page, setPage] = useState<number>(0);
    const [books, setBooks] = useState<Book[]>([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [limitStsate, setLimit] = useState<number>(limit||30);
    const [search, setSearch] = useState<string>("");
    const [bookCount, setBookCount] = useState<number>(0);

    const loadBooks = useCallback(() => {
        const offset = page*limitStsate;
        if(loading) return
        setLoading(true);
        if(search) {
            searchBooks(limitStsate, offset, search).then((data) => {
                console.log(data);
                setBooks(data);
                setBookCount(0)
                setLoading(false);
            }).catch((e) => {
                console.log(e);
                setError(e);
                setLoading(false);
            });
            return;
        }
        getBooks(limitStsate, offset).then((data) => {
            console.log(data[0]);

            setBooks(data[0].books);
            setBookCount(data[0].count[0].count);
            setLoading(false);
        }).catch((e) => {
            console.log(e);
            setError(e);
            setLoading(false);
        });
    }, [limitStsate, search, page])

    useEffect(() => {
        loadBooks();
    }, [loadBooks, search])

    return {
        setPage,
        books,
        error,
        loading,
        limit,
        setLimit,
        search,
        setSearch,
        pageCount: Math.ceil(bookCount/limitStsate),
    }
}

export const useBookfileloader = () => {

}


export const getCoverPath = (book: Book) => {
    return `${baseUrl}/cover/${book.cover}`
}

export const getBookPathUrl = (book: Book) => {
    return `${baseUrl}/book/${book.path}`
}
