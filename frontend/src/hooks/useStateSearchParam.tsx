import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"

export const useStateSearchParam = (paramString: string, defaultString:string): [string, React.Dispatch<React.SetStateAction<string>>] => {
    const [search, setSearch] = useSearchParams();
    const [param, setParam] = useState(search.get(paramString) || defaultString);

    useEffect(() => {
        search.set(paramString, param);
        setSearch(search);
    }, [param])

    return [param, setParam]

}