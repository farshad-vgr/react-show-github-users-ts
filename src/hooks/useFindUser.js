import { useState } from "react";
import axios from "axios";

const useFindUser = () => {
	const [response, setResponse] = useState(null);

	const [error, setError] = useState("");

	const [isLoading, setIsLoading] = useState(false);

	// This function handles loading users by the Axios request
	const findUser = async (name) => {
		try {
			setResponse(null); // Set to default value
			setError(""); // Set to default value
			setIsLoading(true);

			const result = await axios.get(`https://api.github.com/users/${name}`);

			setResponse(result.data);
		} catch (error) {
			setError(error);

			console.log(`
		    Error:
		    ${error}
		    Please refresh this page again!
		  `);
		} finally {
			setIsLoading(false);
		}
	};

	return { findUser, response, error, isLoading };
};

export default useFindUser;
