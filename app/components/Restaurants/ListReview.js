import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button, Avatar, Rating} from "react-native-elements";

import {firebaseApp} from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { map, result } from 'lodash';

const db = firebase.firestore(firebaseApp);


export default function ListReview(props) {
    const {navigation, idRestaurant} = props;
    const [userLogged, setUserLogged] = useState(false);
    const [reviews, setReviews] = useState([]);

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });

    useEffect(() => {
        db.collection("reviews")
            .where("idRestaurant", "==", idRestaurant)
            .get()
            .then((response) => {
                const resultReview = [];
                response.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    resultReview.push(data);
                });
                setReviews(resultReview);
            })
    }, []);

    return (
        <ScrollView>
            { userLogged ? (
                <Button
                    title="Escribe una opinion"
                    buttonStyle={styles.btnStyleOpinion}
                    icon={{
                        type:"material-community",
                        name:"square-edit-outline",
                        color:"#FFF",
                    }}
                    onPress = {() => navigation.navigate("add-review-restaurant", {idRestaurant:idRestaurant})}
                />
            ) : (
                <View>
                    <Text style={{
                        marginTop:-20,
                        textAlign:"center", 
                        color:"#00A680", 
                        padding:20
                    }} onPress={() => navigation.navigate("login")}>
                        Para escribir una opinion es necesario estar loggeado{" "}
                        <Text style={{fontWeight:"bold"}}>
                            Pulsa AQUI para iniciar sesion
                        </Text>
                    </Text>
                </View> 
            )}

            {map(reviews, (review, index) => (
                    <Review key={index} review={review} />
            ))}

        </ScrollView>
    );
}

function Review(props){
    const {title, review, rating, createAt, avatarUser} = props.review;
    const createReview = new Date(createAt.seconds * 1000);
    return(
        <View style={styles.viewReview}>
            <View style={styles.viewAvatar}>
                <Avatar
                    size="large"
                    rounded
                    containerStyle={styles.avatarContainer}
                    source={avatarUser ? {uri: avatarUser} : require("../../../assets/img/avatar-default.jpg")}
                    
                />
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>{title}</Text>
                <Text style={styles.reviewText}>{review}</Text>
                <Rating imageSize={15} startingValue={rating} readonly />
                <Text style={styles.reviewDate}> {createReview.getDate()}-{createReview.getMonth()+1}-{createReview.getFullYear()} </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    btnStyleOpinion:{
        width:"75%",
        backgroundColor:"#00A680",
        borderRadius:20,
        marginLeft:"12.5%",
        marginBottom:"5%",
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.5,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},
    },
    viewReview:{
        flexDirection:"row",
        padding:10,
        paddingBottom:10,
        borderBottomColor:"#E3E3E3",
        borderBottomWidth:1,
    },
    viewAvatar:{
        marginRight:15,
    },
    avatarContainer:{
        height:50,
        width:50,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.6,
        elevation: 10,
        shadowRadius: 25 ,
        shadowOffset : { width: 13, height: 1},
    },
    viewInfo:{
        flex:1,
        alignItems:"flex-start",
    },
    reviewTitle:{
        fontWeight:"bold",
        marginTop:-2,
    },
    reviewText:{
        paddingTop:2,
        color:"grey",
        marginBottom:5,
    },
    reviewDate:{
        marginTop:5,
        color:"grey",
        fontSize:12,
        position:"absolute",
        right:0,
        bottom:0,
    }
})
