import { AxiosRequestConfig } from 'axios';

// Modules
import { FetchBoardPayload } from 'modules/board';

// Snippets
import { getOrderTypeByCategoryId } from 'snippet/boardDetail';
import axios from '.';

export function fetchBoards({ categoryId, page }: FetchBoardPayload) {
	const config: AxiosRequestConfig = {
		url: `/board/${categoryId}`,
		params: {
			orderType: getOrderTypeByCategoryId(categoryId),
			page
		}
	};

	return axios()(config);
}

export function fetchSearchBoards({ categoryId, searchState, page }: FetchBoardPayload) {
	const config: AxiosRequestConfig = {
		url: `/board/${categoryId}`,
		params: {
			orderType: getOrderTypeByCategoryId(categoryId),
			searchType: searchState?.type,
			searchValue: searchState?.value,
			page
		}
	};

	return axios()(config);
}

export default fetchBoards;
