import React, {
	useCallback, useEffect, useRef, useState, memo
} from 'react';
import Router from 'next/router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MUIRichTextEditor from 'mui-rte';
import moment from 'moment';

// Material UI
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Skeleton from '@material-ui/lab/Skeleton';
import MenuItem from '@material-ui/core/MenuItem';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';

// Material UI Icons
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MessageIcon from '@material-ui/icons/Message';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ThumbUpAltSharpIcon from '@material-ui/icons/ThumbUpAltSharp';
import ThumbDownAltSharpIcon from '@material-ui/icons/ThumbDownAltSharp';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import StarIcon from '@material-ui/icons/Star';

// Custom Hooks
import useDetailContent from 'hooks/storages/board/detail/useDetailContent';

moment.locale('ko');

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			backgroundColor: 'white',
			[theme.breakpoints.down('md')]: {
				padding: 0
			}
		},
		subjectBox: {
			display: 'flex',
			alignItems: 'center',
			padding: theme.spacing(2, 0, 1, 0),
			color: theme.palette.grey.A700,
			[theme.breakpoints.down('md')]: {
				padding: theme.spacing(2, 3, 0, 3)
			},
			[theme.breakpoints.down('xs')]: {
				padding: theme.spacing(2, 2, 0, 2)
			}
		},
		subjectBoxTypography: {
			[theme.breakpoints.down('md')]: {
				fontSize: '1.2rem'
			}
		},
		writerInfoBox: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			marginBottom: theme.spacing(2),
			padding: theme.spacing(1, 0),
			color: theme.palette.grey.A200,
			[theme.breakpoints.down('md')]: {
				padding: theme.spacing(1, 3, 0, 3)
			},
			[theme.breakpoints.down('xs')]: {
				padding: theme.spacing(1, 2, 0, 2)
			}
		},
		nicknameBox: {
			fontSize: 16,
			fontWeight: 700,
			color: theme.palette.grey.A700
		},
		writerAvatar: {
			[theme.breakpoints.down('md')]: {
				width: theme.spacing(4),
				height: theme.spacing(4)
			}
		},
		otherInfoBox: {
			display: 'flex',
			alignItems: 'center',
			padding: theme.spacing(2, 0),
			border: '1px solid',
			borderColor: theme.palette.grey['50'],
			borderLeft: 'none',
			borderRight: 'none',
			[theme.breakpoints.down('md')]: {
				padding: theme.spacing(2, 2)
			},
			[theme.breakpoints.down('xs')]: {
				padding: theme.spacing(2, 1)
			}
		},
		otherInfoSkeletonBox: {
			display: 'flex',
			alignItems: 'center',
			padding: theme.spacing(2, 0),
			border: '1px solid',
			borderColor: theme.palette.grey['50'],
			borderLeft: 'none',
			borderRight: 'none',
			[theme.breakpoints.down('md')]: {
				padding: theme.spacing(2, 3)
			}
		},
		adBox: {
			'& ins': {
				margin: theme.spacing(1, 0),
				marginLeft: '0 !important',
				textAlign: 'center'
			}
		},
		contentBox: {
			padding: theme.spacing(2, 0),
			'& p': {
				margin: 0
			},
			'& img': {
				maxWidth: '100%'
			},
			'& video': {
				maxWidth: '100%'
			},
			'& iframe': {
				maxWidth: '100%'
			},
			'& embed': {
				maxWidth: '100%'
			},
			'& .writing_view_box > div': {
				width: 'auto !important'
			},
			[theme.breakpoints.down('md')]: {
				padding: theme.spacing(2, 3)
			},
			[theme.breakpoints.down('xs')]: {
				padding: theme.spacing(2, 2)
			}
		},
		recommendButtonGroup: {
			marginTop: theme.spacing(1),
			'& > button': {
				padding: theme.spacing(2),
				borderRadius: '0',
				borderColor: theme.palette.grey['50'],
				color: theme.palette.grey.A200
			}
		},
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff'
		},
		popper: {
			left: '-50px !important',
			zIndex: 10,
			[theme.breakpoints.down('sm')]: {
				left: '-30px !important'
			}
		},
		avatar: {
			width: theme.spacing(3.5),
			height: theme.spacing(3.5),
			backgroundColor: theme.palette.primary.main
		}
	})
);

function DetailContent() {
	const classes = useStyles();
	const {
		pending,
		detail: {
			id: storageBoardId,
			subject,
			storage,
			user,
			nickname: nonMemberNickname,
			content,
			thumbUp,
			thumbDown,
			viewCount,
			isMember,
			isPopular,
			createdIp,
			createdAt,
			commentTotalCount
		},
		recommend: { pending: recommendPending },
		id,
		isAuthenticated,
		onPutStorageBoardDetailRecommend,
		onPutNonMemberStorageBoardDetailRecommend,
		onHandleDeleteAuthDialog,
		onDeleteStorageBoardDetail
	} = useDetailContent();

	const [open, setOpen] = useState(false);
	const anchorRef = useRef<HTMLButtonElement>(null);

	const handleEditRouter = useCallback(
		() => Router.push('/storages/[path]/edit/[id]', `/storages/${storage.path}/edit/${storageBoardId}/`).then(),
		[storage.path, storageBoardId]
	);

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event: React.MouseEvent<EventTarget>) => {
		if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
			return;
		}

		setOpen(false);
	};

	function handleListKeyDown(event: React.KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpen(false);
		}
	}

	// return focus to the button when we transitioned from !open -> open
	const prevOpen = useRef(open);
	useEffect(() => {
		if (prevOpen.current && !open) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			anchorRef.current!.focus();
		}

		prevOpen.current = open;
	}, [open]);

	return (
		<>
			{pending && (
				<Grow in>
					<Box className={classes.root}>
						<Box className={classes.subjectBox}>
							{isPopular && (
								<Box mr={1}>
									<Skeleton animation={'wave'} width={30} height={50} />
								</Box>
							)}
							<Box flex={1}>
								<Typography component={'h5'} variant={'h5'}>
									<Skeleton animation={'wave'} height={50} />
								</Typography>
							</Box>
						</Box>
						<Box
							className={classes.writerInfoBox}
							display={'flex'}
							alignItems={'center'}
							justifyContent={'space-between'}
							mb={2}
							pt={1}
							pb={1}
						>
							<Box display={'flex'} alignItems={'center'}>
								<Box>
									<Skeleton variant={'circle'} animation={'wave'} width={35} height={35} />
								</Box>
								<Box ml={1}>
									<Skeleton animation={'wave'} width={50} />
								</Box>
							</Box>
							<Box>
								<Skeleton animation={'wave'} width={100} />
							</Box>
						</Box>
						<Box className={classes.otherInfoSkeletonBox}>
							<Grid container alignItems={'center'}>
								<Grid item xs={10}>
									<Box display={'flex'} alignItems={'center'}>
										<Box>
											<Skeleton variant={'circle'} animation={'wave'} width={20} height={20} />
										</Box>
										<Box ml={1} mr={1}>
											<Skeleton animation={'wave'} width={35} />
										</Box>
										<Box>
											<Skeleton variant={'circle'} animation={'wave'} width={20} height={20} />
										</Box>
										<Box ml={1} mr={1}>
											<Skeleton animation={'wave'} width={35} />
										</Box>
										<Box>
											<Skeleton variant={'circle'} animation={'wave'} width={20} height={20} />
										</Box>
										<Box ml={1} mr={1}>
											<Skeleton animation={'wave'} width={35} />
										</Box>
										<Box>
											<Skeleton variant={'circle'} animation={'wave'} width={20} height={20} />
										</Box>
										<Box ml={1}>
											<Skeleton animation={'wave'} width={35} />
										</Box>
									</Box>
								</Grid>
								<Grid item xs={2}>
									<Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
										<Skeleton animation={'wave'} width={30} />
									</Box>
								</Grid>
							</Grid>
						</Box>
						<Box className={classes.contentBox}>
							<Skeleton animation={'wave'} />
							<Skeleton animation={'wave'} />
							<Skeleton animation={'wave'} />
							<Box mt={1}>
								<Skeleton variant={'rect'} animation={'wave'} height={250} />
							</Box>
							<Box textAlign={'center'}>
								<Box>
									<Box maxWidth={150} m={'auto'} mt={2}>
										<Skeleton variant={'rect'} animation={'wave'} width={170} height={58} />
									</Box>
								</Box>
							</Box>
						</Box>
					</Box>
				</Grow>
			)}
			{!pending && (
				<Grow in>
					<Box className={classes.root}>
						<Box className={classes.subjectBox}>
							{isPopular && (
								<Box mr={1}>
									<Avatar className={classes.avatar} variant={'rounded'}>
										<StarIcon />
									</Avatar>
								</Box>
							)}
							<Box flex={1}>
								<Typography className={classes.subjectBoxTypography} variant={'h5'}>
									{subject}
								</Typography>
							</Box>
						</Box>
						<Box className={classes.writerInfoBox}>
							<Grid container alignItems={'center'}>
								<Grid item xs={12} sm={6}>
									<Box display={'flex'} alignItems={'center'}>
										{isMember ? (
											<>
												<Avatar className={classes.writerAvatar} src={user?.avatarUrl || ''}>
													{!user?.avatarUrl && user?.nickname.toString().charAt(0)}
												</Avatar>
												<Box ml={1}>
													<Box className={classes.nicknameBox} component={'span'}>
														{user?.nickname}
													</Box>
												</Box>
											</>
										) : (
											<>
												<Avatar className={classes.writerAvatar}>
													{nonMemberNickname && nonMemberNickname.toString().charAt(0)}
												</Avatar>
												<Box ml={1}>
													<Box className={classes.nicknameBox} component={'span'}>
														{nonMemberNickname}
													</Box>
													<Box component={'span'} ml={0.5}>
														{`(${createdIp})`}
													</Box>
												</Box>
											</>
										)}
									</Box>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Box textAlign={'right'}>
										<Box>{moment(createdAt).format('YYYY. MM. DD HH:mm:ss')}</Box>
									</Box>
								</Grid>
							</Grid>
						</Box>
						<Box className={classes.otherInfoBox}>
							<Box flex={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
								<Box flex={1}>
									<Button startIcon={<MessageIcon />} disabled>
										{commentTotalCount}
									</Button>
									<Button startIcon={<VisibilityIcon />} disabled>
										{viewCount}
									</Button>
									<Button startIcon={<ThumbUpAltSharpIcon />} disabled>
										{thumbUp}
									</Button>
									<Button startIcon={<ThumbDownAltSharpIcon />} disabled>
										{thumbDown}
									</Button>
								</Box>
								<Box>
									{!isMember && (
										<>
											<IconButton ref={anchorRef} onClick={handleToggle}>
												<MoreVertIcon />
											</IconButton>
											<Popper
												className={classes.popper}
												open={open}
												anchorEl={anchorRef.current}
												role={undefined}
												transition
												disablePortal
											>
												{({ TransitionProps, placement }) => (
													<Grow
														{...TransitionProps}
														style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
													>
														<Paper>
															<ClickAwayListener onClickAway={handleClose}>
																<MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
																	<MenuItem onClick={handleEditRouter}>
																		<ListItemIcon>
																			<EditIcon />
																		</ListItemIcon>
																		{'수정'}
																	</MenuItem>
																	<MenuItem
																		onClick={onHandleDeleteAuthDialog}
																		data-id={storageBoardId}
																		data-sub-title={'개념글 삭제'}
																		data-type={'boardDetail'}
																	>
																		<ListItemIcon>
																			<DeleteIcon />
																		</ListItemIcon>
																		{'삭제'}
																	</MenuItem>
																</MenuList>
															</ClickAwayListener>
														</Paper>
													</Grow>
												)}
											</Popper>
										</>
									)}
									{isMember && user?.id === id && (
										<>
											<IconButton ref={anchorRef} onClick={handleToggle}>
												<MoreVertIcon />
											</IconButton>
											<Popper
												className={classes.popper}
												open={open}
												anchorEl={anchorRef.current}
												role={undefined}
												transition
												disablePortal
											>
												{({ TransitionProps, placement }) => (
													<Grow
														{...TransitionProps}
														style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
													>
														<Paper>
															<ClickAwayListener onClickAway={handleClose}>
																<MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
																	<MenuItem onClick={handleEditRouter}>
																		<ListItemIcon>
																			<EditIcon />
																		</ListItemIcon>
																		{'수정'}
																	</MenuItem>
																	<MenuItem onClick={onDeleteStorageBoardDetail}>
																		<ListItemIcon>
																			<DeleteIcon />
																		</ListItemIcon>
																		{'삭제'}
																	</MenuItem>
																</MenuList>
															</ClickAwayListener>
														</Paper>
													</Grow>
												)}
											</Popper>
										</>
									)}
								</Box>
							</Box>
						</Box>
						<Box className={classes.contentBox}>
							<MUIRichTextEditor toolbar={false} value={content} readOnly />
							<Box textAlign={'center'}>
								<Box>
									<ButtonGroup className={classes.recommendButtonGroup}>
										<Button
											endIcon={<ThumbUpAltSharpIcon />}
											data-thumbs-type={0}
											onClick={
												isAuthenticated ? onPutStorageBoardDetailRecommend : onPutNonMemberStorageBoardDetailRecommend
											}
											disabled={recommendPending}
										>
											{thumbUp}
										</Button>
										<Button
											startIcon={<ThumbDownAltSharpIcon />}
											data-thumbs-type={1}
											onClick={
												isAuthenticated ? onPutStorageBoardDetailRecommend : onPutNonMemberStorageBoardDetailRecommend
											}
											disabled={recommendPending}
										>
											{thumbDown}
										</Button>
									</ButtonGroup>
								</Box>
							</Box>
						</Box>
					</Box>
				</Grow>
			)}
		</>
	);
}

export default memo(DetailContent);
