import React, { memo } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// Material UI
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import NoSsr from '@material-ui/core/NoSsr';

// Material UI Icons
import WhatshotIcon from '@material-ui/icons/Whatshot';
import CastIcon from '@material-ui/icons/Cast';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import SchoolIcon from '@material-ui/icons/School';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import SportsBaseballIcon from '@material-ui/icons/SportsBaseball';
import MenuIcon from '@material-ui/icons/Menu';
import NearMeIcon from '@material-ui/icons/NearMe';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import ForumIcon from '@material-ui/icons/Forum';
import ArchiveIcon from '@material-ui/icons/Archive';

// Custom Hooks
import useMobileHeader from 'hooks/common/useMobileHeader';

// Snippets
import { getCategoryNameByCategoryId } from 'snippets/board';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			border: 'none',
			borderBottom: `1px solid ${theme.palette.grey['50']}`,
			backgroundColor: 'white'
		},
		toolbar: {
			padding: theme.spacing(0, 3),
			[theme.breakpoints.down('xs')]: {
				padding: theme.spacing(0, 2)
			}
		},
		chip: {
			marginLeft: theme.spacing(1),
			color: 'white'
		},
		appBarLogoBox: {
			flexGrow: 1
		},
		appBarLogo: {
			maxWidth: 120,
			verticalAlign: 'middle'
		},
		list: {
			width: 250,
			height: '100%',
			backgroundColor: 'inherit',
			color: 'inherit'
		},
		listItemIcon: {
			color: 'inherit'
		},
		divider: {
			backgroundColor: theme.palette.grey['50']
		},
		typography: {
			fontWeight: 700
		},
		icon: {
			verticalAlign: 'middle'
		},
		circularProgress: {
			marginLeft: theme.spacing(1),
			verticalAlign: 'middle'
		},
		avatar: {
			width: theme.spacing(4),
			height: theme.spacing(4)
		}
	})
);

type ScrollProps = {
	window?: () => Window;
	children: React.ReactElement;
};

function HideOnScroll(props: ScrollProps) {
	const { children, window } = props;
	const trigger = useScrollTrigger({ target: window ? window() : undefined });

	return (
		<Slide appear={false} direction={'down'} in={!trigger}>
			{children}
		</Slide>
	);
}

function getCategoryIconByCategoryId(categoryId: string | string[]) {
	let categoryIcon = <CastIcon />;

	switch (categoryId) {
	case 'daily_popular':
		categoryIcon = <WhatshotIcon />;
		break;
	case 'ib_new1':
		categoryIcon = <CastIcon />;
		break;
	case 'stream':
		categoryIcon = <PlayArrowIcon />;
		break;
	case 'football_new6':
		categoryIcon = <SportsSoccerIcon />;
		break;
	case 'issuezoom':
		categoryIcon = <CalendarTodayIcon />;
		break;
	case 'exam_new':
		categoryIcon = <SchoolIcon />;
		break;
	case 'extra':
		categoryIcon = <FitnessCenterIcon />;
		break;
	case 'baseball_new9':
		categoryIcon = <SportsBaseballIcon />;
		break;
	default:
		categoryIcon = <CastIcon />;
		break;
	}

	return categoryIcon;
}

function MobileHeader() {
	const classes = useStyles();
	const {
		user: { nickname, avatarUrl, isAuthenticated },
		id,
		storage,
		pending,
		isBoardDetail,
		isNewStorage,
		isNotices,
		drawerOpen,
		onHandleSignInDialog,
		onDeleteSignOut,
		onHandleLogo,
		onHandleStorageChip,
		onHandleNoticeChip,
		onHandleChip,
		onHandleStorageDrawerMenu,
		onHandleCollectStorageDrawerMenu,
		onHandleNoticeDrawerMenu,
		onHandleMyPageDrawerMenu,
		onHandleDrawer
	} = useMobileHeader();

	return (
		<>
			<HideOnScroll>
				<AppBar className={classes.root} position={'fixed'} variant={'outlined'}>
					<Toolbar className={classes.toolbar}>
						<Box className={classes.appBarLogoBox}>
							<Box>
								<Box component={'span'} onClick={onHandleLogo}>
									<img
										className={classes.appBarLogo}
										src={'https://static.cocstorage.com/images/logo_text.png'}
										alt={'Logo Img'}
									/>
								</Box>
								{isNewStorage
									&& (pending ? (
										<CircularProgress className={classes.circularProgress} color={'primary'} size={20} />
									) : (
										<Chip
											className={classes.chip}
											color={'primary'}
											label={storage.name}
											avatar={(
												<Avatar src={storage.avatarUrl || ''}>
													<InsertPhotoIcon className={classes.icon} />
												</Avatar>
											)}
											onClick={onHandleStorageChip}
											size={'small'}
										/>
									))}
								{isBoardDetail && (
									<Chip
										className={classes.chip}
										color={'primary'}
										label={getCategoryNameByCategoryId(id)}
										icon={getCategoryIconByCategoryId(id)}
										onClick={onHandleChip}
										size={'small'}
									/>
								)}
								{isNotices && (
									<Chip
										className={classes.chip}
										color={'primary'}
										label={'새로운 소식'}
										icon={<NearMeIcon />}
										onClick={onHandleNoticeChip}
										size={'small'}
									/>
								)}
							</Box>
						</Box>
						<IconButton edge={'end'} color={'inherit'} onClick={onHandleDrawer}>
							<MenuIcon color={'action'} />
						</IconButton>
					</Toolbar>
				</AppBar>
			</HideOnScroll>
			<Toolbar className={classes.toolbar} />
			<SwipeableDrawer anchor={'right'} onClose={onHandleDrawer} onOpen={onHandleDrawer} open={drawerOpen}>
				<div className={classes.list} role={'presentation'}>
					<NoSsr>
						{isAuthenticated ? (
							<Box>
								<Box display={'flex'} alignItems={'center'} p={2}>
									<Box>
										<Avatar className={classes.avatar} src={avatarUrl}>
											{nickname.charAt(0)}
										</Avatar>
									</Box>
									<Box flex={1} ml={2}>
										<Typography className={classes.typography} variant={'body1'}>
											{nickname}
										</Typography>
									</Box>
									<Box>
										<IconButton onClick={onHandleMyPageDrawerMenu}>
											<SettingsIcon className={classes.icon} color={'action'} />
										</IconButton>
									</Box>
								</Box>
								<Divider className={classes.divider} />
								<List>
									<ListItem button onClick={onDeleteSignOut}>
										<ListItemIcon>
											<ExitToAppIcon />
										</ListItemIcon>
										<ListItemText primary={'로그아웃'} />
									</ListItem>
								</List>
							</Box>
						) : (
							<List>
								<ListItem button onClick={onHandleSignInDialog}>
									<ListItemIcon>
										<ExitToAppIcon />
									</ListItemIcon>
									<ListItemText primary={'로그인/회원가입'} />
								</ListItem>
							</List>
						)}
					</NoSsr>
					<Divider className={classes.divider} />
					<List>
						<ListItem button onClick={onHandleStorageDrawerMenu}>
							<ListItemIcon>
								<ForumIcon />
							</ListItemIcon>
							<ListItemText primary={'커뮤니티 저장소'} />
						</ListItem>
					</List>
					<Divider className={classes.divider} />
					<List>
						<ListItem button onClick={onHandleCollectStorageDrawerMenu}>
							<ListItemIcon>
								<ArchiveIcon />
							</ListItemIcon>
							<ListItemText primary={'수집 저장소'} />
						</ListItem>
					</List>
					<Divider className={classes.divider} />
					<List>
						<ListItem button onClick={onHandleNoticeDrawerMenu}>
							<ListItemIcon>
								<NearMeIcon />
							</ListItemIcon>
							<ListItemText primary={'새로운 소식'} />
						</ListItem>
					</List>
				</div>
			</SwipeableDrawer>
		</>
	);
}

export default memo(MobileHeader);
