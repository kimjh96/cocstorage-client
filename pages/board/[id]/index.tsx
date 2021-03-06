import React from 'react';
import { NextPageContext } from 'next';
import Head from 'next/head';
import {
	createStyles, makeStyles, Theme, useTheme
} from '@material-ui/core/styles';

// Material UI
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Fade from '@material-ui/core/Fade';

// Modules
import { fetchBoards, handleBoardsSearchState } from 'modules/board';
import { END } from 'redux-saga';
import wrapper from 'modules/store';

// Components
import BoardListHeader from 'components/board/BoardListHeader';
import BoardList from 'components/board/BoardList';
import GoogleAdSense from 'components/common/GoogleAdSense';

// Custom Hooks
import useBoard from 'hooks/useBoard';

// Snippets
import { getCategoryNameByCategoryId } from 'snippets/board';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			backgroundColor: 'white',
			[theme.breakpoints.down('md')]: {
				padding: 0
			}
		},
		box: {
			margin: theme.spacing(1, 0, 1, 1)
		},
		adPendingBox: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			height: 600,
			margin: theme.spacing(1, 0, 0, 1),
			border: `1px solid ${theme.palette.grey['50']}`,
			'& > img': {
				maxWidth: 50
			}
		},
		noticeCardBox: {
			marginBottom: theme.spacing(2),
			[theme.breakpoints.down('md')]: {
				margin: 0,
				borderTop: `1px solid ${theme.palette.grey['50']}`
			}
		}
	})
);

function CollectBoard({ query }: NextPageContext) {
	const classes = useStyles();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const {
		categoryId,
		boardList,
		pagination,
		searchState,
		adSenseCount,
		onHandleSearchTypeMenuSelect,
		onHandleSearchValueInput,
		onHandleSearchValueInputKey,
		onHandlePagination
	} = useBoard();

	return (
		<>
			<Head>
				<meta charSet={'utf-8'} />
				<meta name={'viewport'} content={'minimum-scale=1, initial-scale=1, width=device-width'} />
				<meta httpEquiv={'content-language'} content={'ko'} />
				<meta httpEquiv={'X-UA-Compatible'} content={'IE=edge'} />
				<meta name={'author'} content={'개념글 저장소'} />
				<meta name={'title'} content={`${getCategoryNameByCategoryId(query.id)} : 개념글 저장소`} />
				<meta
					name={'description'}
					content={`${getCategoryNameByCategoryId(query.id)} 인기 게시글들을 한 눈에 확인해보세요!`}
				/>
				<meta property={'og:title'} content={`${getCategoryNameByCategoryId(query.id)} : 개념글 저장소`} />
				<meta
					property={'og:description'}
					content={`${getCategoryNameByCategoryId(query.id)} 인기 게시글들을 한 눈에 확인해보세요!`}
				/>
				<meta property={'og:type'} content={'website'} />
				<meta property={'og:image'} content={'https://static.cocstorage.com/images/icon.png'} />
				<meta property={'og:url'} content={`https://www.cocstorage.com/board/${query.id}`} />
				<meta property={'og:site_name'} content={`${getCategoryNameByCategoryId(query.id)} : 개념글 저장소`} />
				<meta property={'og:locale'} content={'ko_KR'} />
				<meta property={'twitter:title'} content={`${getCategoryNameByCategoryId(query.id)} : 개념글 저장소`} />
				<meta
					property={'twitter:description'}
					content={`${getCategoryNameByCategoryId(query.id)} 인기 게시글들을 한 눈에 확인해보세요!`}
				/>
				<meta property={'twitter:image'} content={'https://static.cocstorage.com/images/icon.png'} />
				<meta property={'twitter:url'} content={`https://www.cocstorage.com/board/${query.id}`} />
				<meta property={'twitter:card'} content={'summary'} />
				<meta
					name={'apple-mobile-web-app-title'}
					content={`${getCategoryNameByCategoryId(query.id)} : 개념글 저장소`}
				/>
				<meta name={'theme-color'} content={theme.palette.primary.main} />
				<title>{`${getCategoryNameByCategoryId(query.id)} : 개념글 저장소`}</title>
				<link rel={'canonical'} href={`https://www.cocstorage.com/board/${query.id}`} />
				<link rel={'shortcut icon'} href={'https://static.cocstorage.com/images/favicon.ico'} />
				<link rel={'apple-touch-icon'} href={'https://static.cocstorage.com/images/icon.png'} />
				<link rel={'manifest'} href={'/manifest.json'} />
				<script async src={'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'} />
			</Head>
			<BoardListHeader
				categoryId={categoryId}
				searchState={searchState}
				onHandleSearchTypeMenuSelect={onHandleSearchTypeMenuSelect}
				onHandleSearchValueInput={onHandleSearchValueInput}
				onHandleSearchValueInputKey={onHandleSearchValueInputKey}
			/>
			<Container className={classes.root} maxWidth={isMobile ? 'md' : 'lg'}>
				<Grid container>
					<Grid item xs={12} lg={9}>
						<BoardList
							categoryId={categoryId}
							boardList={boardList}
							pagination={pagination}
							searchState={searchState}
							onHandleSearchTypeMenuSelect={onHandleSearchTypeMenuSelect}
							onHandleSearchValueInput={onHandleSearchValueInput}
							onHandleSearchValueInputKey={onHandleSearchValueInputKey}
							onHandlePagination={onHandlePagination}
						/>
					</Grid>
					<Grid item xs={12} lg={3}>
						<Hidden mdDown>
							<Box className={classes.box}>
								<Fade key={`adSense-${adSenseCount}`} in>
									<GoogleAdSense
										html={
											'<ins class="adsbygoogle"'
											+ 'style="display:block"'
											+ 'data-ad-client="ca-pub-5809905264951057"'
											+ 'data-ad-slot="3880285784"'
											+ 'data-ad-format="auto"'
											+ 'data-full-width-responsive="true">'
											+ '</ins>'
										}
									/>
								</Fade>
							</Box>
						</Hidden>
					</Grid>
				</Grid>
			</Container>
		</>
	);
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store, query }) => {
	const {
		board: {
			searchState,
			pagination: { page }
		}
	} = store.getState();

	const searchStateFromServer = {
		value: String(query.value),
		type: String(query.type),
		handle: Boolean(query.handle)
	};

	store.dispatch(handleBoardsSearchState(query.value ? searchStateFromServer : searchState));
	store.dispatch(
		fetchBoards({
			categoryId: query.id,
			searchState: query.value ? searchStateFromServer : searchState,
			page: Number(query.page || page)
		})
	);

	store.dispatch(END);
	await (store as any).sagaTask.toPromise();

	return {
		props: { query }
	};
});

export default CollectBoard;
