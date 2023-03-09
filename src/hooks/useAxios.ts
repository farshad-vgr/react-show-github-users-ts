import { useState, useCallback } from "react";
import axios from "axios";

const useAxios = (numberOfUsers: React.MutableRefObject<number>) => {
	const [requestNumber, setRequestNumber] = useState<string>("?"); // Max number of requests is 60

	const [response, setResponse] = useState();

	const [error, setError] = useState<string>("");

	const [isLoading, setIsLoading] = useState(false);

	// This function handles loading users by the Axios request
	const loadUsers = useCallback(
		async (page: number) => {
			try {
				setIsLoading(true);

				const result = await axios.get(`https://api.github.com/users?since=${(page + 1) * 10}&per_page=${numberOfUsers.current}`);

				setResponse(result.data);

				// Determining how many requests remains
				setRequestNumber(result.headers["x-ratelimit-remaining"] as string);
			} catch (error: any) {
				setError(error);

				console.log(`
		    Error:
		    ${error}
		    Please refresh this page again!
		  `);
			} finally {
				setIsLoading(false);
			}
		},
		[numberOfUsers],
	);

	return { loadUsers, requestNumber, response, error, isLoading };
};

export default useAxios;
