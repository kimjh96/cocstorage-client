import { useSelector } from 'react-redux';

// Modules
import { RootState } from 'modules';

export default function useBoardList() {
	const storageBoardState = useSelector((state: RootState) => state.storageBoard);

	return {
		...storageBoardState
	};
}
