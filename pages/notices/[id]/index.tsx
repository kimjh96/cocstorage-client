import React, { useEffect } from 'react';
import Head from 'next/head';
import {
	createStyles, makeStyles, Theme, useTheme
} from '@material-ui/core/styles';

// Material UI
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Pagination from '@material-ui/lab/Pagination';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Modules
import { fetchNoticeDetail } from 'modules/notices/detail';
import wrapper from 'modules/store';
import { END } from 'redux-saga';

// Components
import DetailContent from 'components/notices/detail/DetailContent';
import DetailCommentList from 'components/notices/detail/DetailCommentList';
import DetailCommentWriteForm from 'components/notices/detail/DetailCommentWriteForm';
import PasswordAuthDialog from 'components/common/PasswordAuthDialog';

// Custom Hooks
import useNoticeDetail from 'hooks/notices/detail/useNoticeDetail';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			backgroundColor: 'white',
			[theme.breakpoints.down('md')]: {
				padding: 0
			}
		},
		grid: {
			borderRight: '1px solid rgba(0, 0, 0, 0.23)',
			[theme.breakpoints.down('md')]: {
				borderColor: '#EAEAEA'
			}
		},
		pagination: {
			padding: theme.spacing(2),
			'& > ul': {
				justifyContent: 'center',
				'& *': {
					color: 'rgba(0, 0, 0, 0.5)'
				},
				'& .Mui-selected': {
					color: 'white'
				}
			}
		},
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff'
		}
	})
);

function NoticeDetail() {
	const classes = useStyles();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const {
		detail: {
			id: noticeId, user, subject, description, thumbnailUrl
		},
		comments: { pagination },
		manage: {
			pending: deleteAuthPending,
			deleteAuth: { open: deleteAuthDialogOpen, subTitle }
		},
		deleteAuthDialogBody,
		showPassword,
		onShowDeleteAuthDialogPassword,
		onFetchNoticeDetailComments,
		onHandleNoticeDetailCommentsPagination,
		onHandleDeleteAuthDialog,
		onHandleDeleteAuthDialogTextField,
		onDeleteNonMemberNoticeDetail
	} = useNoticeDetail();

	useEffect(() => {
		if (noticeId !== 0) {
			onFetchNoticeDetailComments();
		}
	}, [noticeId, onFetchNoticeDetailComments]);

	return (
		<>
			<Head>
				<meta charSet={'utf-8'} />
				<meta name={'viewport'} content={'minimum-scale=1, initial-scale=1, width=device-width'} />
				<meta httpEquiv={'content-language'} content={'ko'} />
				<meta httpEquiv={'X-UA-Compatible'} content={'IE=edge'} />
				<meta name={'author'} content={user.nickname} />
				<meta name={'title'} content={subject ? `${subject} : 개념글 저장소` : '개념글 저장소'} />
				<meta name={'description'} content={description} />
				<meta property={'og:title'} content={subject ? `${subject} : 개념글 저장소` : '개념글 저장소'} />
				<meta property={'og:description'} content={description} />
				<meta property={'og:type'} content={'website'} />
				<meta property={'og:image'} content={thumbnailUrl || 'https://static.cocstorage.com/images/icon.png'} />
				<meta property={'og:url'} content={`https://www.cocstorage.com/notices/${noticeId}`} />
				<meta property={'og:site_name'} content={'새로운 소식 : 개념글 저장소'} />
				<meta property={'og:locale'} content={'ko_KR'} />
				<meta property={'twitter:title'} content={subject ? `${subject} : 개념글 저장소` : '개념글 저장소'} />
				<meta property={'twitter:description'} content={description} />
				<meta property={'twitter:image'} content={thumbnailUrl || 'https://static.cocstorage.com/images/icon.png'} />
				<meta property={'twitter:url'} content={`https://www.cocstorage.com/notices/${noticeId}`} />
				<meta property={'twitter:card'} content={'summary'} />
				<meta name={'apple-mobile-web-app-title'} content={subject ? `${subject} : 개념글 저장소` : '개념글 저장소'} />
				<meta name={'theme-color'} content={theme.palette.primary.main} />
				<title>{subject ? `${subject} : 개념글 저장소` : '개념글 저장소'}</title>
				<link rel={'canonical'} href={`https://www.cocstorage.com/notices/${noticeId}`} />
				<link rel={'shortcut icon'} href={'https://static.cocstorage.com/images/favicon.ico'} />
				<link rel={'apple-touch-icon'} href={'https://static.cocstorage.com/images/icon.png'} />
				<link rel={'manifest'} href={'/manifest.json'} />
			</Head>
			<Container className={classes.root} maxWidth={isMobile ? 'md' : 'lg'}>
				<Grid container>
					<Grid item xs={12}>
						<DetailContent />
						<DetailCommentWriteForm />
						<DetailCommentList />
						{pagination.totalPages > 0 && (
							<Pagination
								className={classes.pagination}
								page={pagination.currentPage}
								count={pagination.totalPages}
								color={'primary'}
								shape={'rounded'}
								onChange={onHandleNoticeDetailCommentsPagination}
								size={isMobile ? 'small' : 'medium'}
								siblingCount={isMobile ? 0 : 2}
							/>
						)}
					</Grid>
				</Grid>
			</Container>
			<PasswordAuthDialog
				open={deleteAuthDialogOpen}
				pending={deleteAuthPending}
				subTitle={subTitle}
				passwordAuthDialogBody={deleteAuthDialogBody}
				showPassword={showPassword}
				onShowPasswordAuthDialogPassword={onShowDeleteAuthDialogPassword}
				onHandlePasswordAuthDialogTextField={onHandleDeleteAuthDialogTextField}
				onHandlePasswordAuthDialog={onHandleDeleteAuthDialog}
				onRequestPasswordAuth={onDeleteNonMemberNoticeDetail}
			/>
		</>
	);
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store, query }) => {
	store.dispatch(fetchNoticeDetail(Number(query.id || 0)));

	store.dispatch(END);
	await (store as any).sagaTask.toPromise();

	return {
		props: {}
	};
});

export default NoticeDetail;
