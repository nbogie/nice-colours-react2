//https://www.robinwieruch.de/local-storage-react
import { useState, useEffect } from "react";

const useStateWithLocalStorage = (localStorageKey) => {
    const [value, setValue] = useState(
        localStorage.getItem(localStorageKey) || ""
    );

    useEffect(() => {
        localStorage.setItem(localStorageKey, value);
    }, [value, localStorageKey]);

    return [value, setValue];
};
export default useStateWithLocalStorage;