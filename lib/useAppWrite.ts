import { useEffect, useState } from "react"

const useAppWrite = (fn: any) => {
    const [data, setData] = useState<any[]>([]);
    const [isloading, setIsloading] = useState(false);

    const fetchData = async () => {
        setIsloading(true);
        try {
            const result = await fn();
            setData(result);
        } catch (error: any) {
            throw new Error(error)
        }
    }
    useEffect(() => {
        fetchData();
    }, [])
    const refetch = () => fetchData();
    return { data, isloading, refetch }

}

export default useAppWrite;