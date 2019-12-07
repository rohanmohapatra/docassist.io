import React, {Component} from 'react';
import {
    Grid,
    Typography,
    withStyles,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    CardActions,
    Button
} from '@material-ui/core';
import Avatar from 'avataaars';
import GitHub from '../../icons/GitHub';
import theme from '../../theme';
const styles = {
    root:{
    },
    banner:{
        height: 300,
    },
    steps:{
        height: 300,
    },
    container:{
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '91.5vh',
        width: '1500px'
    },
    bannerText:{
        fontFamily : 'Montserrat',
        fontWeight: 800,
        position: 'absolute',
        top: 280,
        left: 180,
    },
    stepsText:{
        fontFamily : 'Montserrat',
        fontWeight: 800,
        fontSize: 20,
        marginTop: 20,
        marginLeft: 10,
    },
    teamText:{
        fontFamily : 'Montserrat',
        fontWeight: 800,
        fontSize: 70,
        marginTop: 20,
        marginLeft: 10,
        marginBottom: 40
    },
    teamBackground:{
        paddingBottom: 30,
        backgroundColor : '#F8F6F9',
    },
    gridCard:{
        marginLeft: 20

    },
    card: {
        maxWidth: 200,
      },
    media: {
        height: 300,
    },
    avatar:{
        maxWidth: 345,
    }
};



class Home extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const classes = this.props.classes;
        return (
            <div>
            <div className={classes.root}>
                <Grid
                    container
                    className={classes.container}
                >
                    <Grid
                    item
                    lg={6}
                    className={classes.banner}
                    >
                        <img 
                            src = '/images/logos/docassist.io.png'
                            height='300'
                            className = {classes.bannerImage}
                        />
                        <Typography variant='h2' className = {classes.bannerText}> Making document generation easier. </Typography>
                    </Grid>
                    <Grid
                    item
                    lg={6}
                    className={classes.steps}
                    >
                        <Typography variant='h2' className = {classes.stepsText}> Steps </Typography>
                        <Grid
                        container
                        >
                            <Grid
                            item
                            lg={3}
                            className={classes.gridCard}
                            >
                                <Card className={classes.card}>
                                <CardActionArea>
                                    <CardMedia
                                    className={classes.media}
                                    image="/images/steps/features_stage1.png"
                                    title="Contemplative Reptile"
                                    />
                                    <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Upload a document
                                    </Typography>
                                    </CardContent>
                                </CardActionArea>
                                </Card>
                            </Grid>
                            <Grid
                            item
                            lg={3}
                            className={classes.gridCard}
                            >
                                <Card className={classes.card}>
                                <CardActionArea>
                                    <CardMedia
                                    className={classes.media}
                                    image="/images/steps/features_stage2.png"
                                    title="Contemplative Reptile"
                                    />
                                    <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                    Fill in User Details
                                    </Typography>
                                    </CardContent>
                                </CardActionArea>
                                </Card>
                            </Grid>
                            <Grid
                            item
                            lg={3}
                            className={classes.gridCard}
                            >
                                <Card className={classes.card}>
                                <CardActionArea>
                                    <CardMedia
                                    className={classes.media}
                                    image="/images/steps/features_stage3.png"
                                    title="Contemplative Reptile"
                                    />
                                    <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Voila!
                                    </Typography>
                                    </CardContent>
                                </CardActionArea>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                
                </Grid>
            </div>
            <div>
            <Grid
            container
            className = {classes.teamBackground}
            >
                <Typography variant="h2" className={classes.teamText}>
                    Team
                </Typography>
                <Grid
                container
                >
                    <Grid
                    item
                    lg={3}
                    >
                        <Card className={classes.avatar}>
                            <CardContent>
                            <Avatar
                                avatarStyle='Transparent'
                                topType='ShortHairShortFlat'
                                accessoriesType='Prescription02'
                                hairColor='Black'
                                facialHairType='Blank'
                                clotheType='Hoodie'
                                clotheColor='Heather'
                                eyeType='WinkWacky'
                                eyebrowType='RaisedExcitedNatural'
                                mouthType='Tongue'
                                skinColor='Pale'
                                />
                            <Typography gutterBottom variant="h5" component="h2" className={classes.teamCardText}>
                                Rohan Mohapatra
                            </Typography>
                            <Button
                                color={theme.palette.navbar.dark}
                                size="large"
                                variant="contained"
                                href="https://www.github.com/rohanmohapatra"
                                >
                                <GitHub />
                                /rohanmohapatra
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid
                    item
                    lg={3}
                    >
                        <Card className={classes.avatar}>
                            <CardContent>
                            <Avatar
                                avatarStyle='Transparent'
                                topType='ShortHairShortWaved'
                                accessoriesType='Blank'
                                hairColor='Black'
                                facialHairType='Blank'
                                clotheType='ShirtCrewNeck'
                                clotheColor='Red'
                                eyeType='Squint'
                                eyebrowType='DefaultNatural'
                                mouthType='Smile'
                                skinColor='Light'
                                />

                            <Typography gutterBottom variant="h5" component="h2" className={classes.teamCardText}>
                                Rohan Rajesh Talesara
                            </Typography>
                            <Button
                                color={theme.palette.navbar.dark}
                                size="large"
                                variant="contained"
                                href="https://www.github.com/rohantalesara"
                                >
                                <GitHub />
                                /rohantalesara
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid
                    item
                    lg={3}
                    >
                        <Card className={classes.avatar}>
                            <CardContent>
                            <Avatar
                                avatarStyle='Transparent'
                                topType='ShortHairShortCurly'
                                accessoriesType='Prescription02'
                                hairColor='Black'
                                facialHairType='BeardLight'
                                facialHairColor='Black'
                                clotheType='BlazerShirt'
                                eyeType='Happy'
                                eyebrowType='Default'
                                mouthType='Default'
                                skinColor='Light'
                                />
                            <Typography gutterBottom variant="h5" component="h2"className={classes.teamCardText} >
                                Sanat Bhandarkar
                            </Typography>
                            <Button
                                color={theme.palette.navbar.dark}
                                size="large"
                                variant="contained"
                                href="https://www.github.com/sanatb97"
                                >
                                <GitHub />
                                /sanatb97
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid
                    item
                    lg={3}
                    >
                        <Card className={classes.avatar}>
                            <CardContent>
                            <Avatar
                                avatarStyle='Transparent'
                                topType='ShortHairShortWaved'
                                accessoriesType='Blank'
                                hairColor='Black'
                                facialHairType='MoustacheFancy'
                                facialHairColor='Black'
                                clotheType='BlazerSweater'
                                eyeType='EyeRoll'
                                eyebrowType='DefaultNatural'
                                mouthType='Concerned'
                                skinColor='Light'
                                />
                            <Typography gutterBottom variant="h5" component="h2"className={classes.teamCardText}>
                                Sankarshana Rao
                            </Typography>
                            <Button
                                color={theme.palette.navbar.dark}
                                size="large"
                                variant="contained"
                                href="https://www.github.com/sankarshanarao"
                                >
                                <GitHub />
                                /sankarshanarao
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

            </Grid>
            
        </div>
        </div>
        );
    }
}

export default withStyles(styles)(Home);