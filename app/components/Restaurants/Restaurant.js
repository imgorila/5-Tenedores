import React, {useState,  useEffect, useCallback, useRef    } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions} from 'react-native';
import {Rating, ListItem, Icon} from "react-native-elements";
import {useFocusEffect} from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import {map} from "lodash";
import {useFonts} from "expo-font";

import {firebaseApp} from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

import Loading from "../../components/Loading";
import Carousel from "../../components/Carousel";
import Map from "../../components/Map";
import ListReview from "../../components/Restaurants/ListReview";

const db = firebase.firestore(firebaseApp);

export default function Restaurant(props) {
    const {navigation, route} = props;
    const {id,name} = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const toastRef = useRef();

    navigation.setOptions({ title: name,
    });

    firebase.auth().onAuthStateChanged((user) =>{
        user ? setUserLogged(true) : setUserLogged(false);
    });

    useFocusEffect(
        useCallback(() => {
            db.collection("restaurants")
                .doc(id)
                .get()
                .then((response)=>{
                    const data = response.data();
                    data.id = response.id;
                    setRestaurant(data);
                    setRating(data.rating);
                });
        }, [])
    );

    useEffect(() => {
        if(userLogged && restaurant){
            db.collection("favorites")
                .where("idRestaurant", "==", restaurant.id)
                .where("idUser", "==", firebase.auth().currentUser.uid)
                .get()
                .then((response)=>{
                    if(response.docs.length === 1){
                        setIsFavorite(true);
                    }
                });
        }
    }, [userLogged, restaurant])

    const addFavorites = () => {
        if(!userLogged){
            toastRef.current.show("Para usar el sistema de favoritos es necesario iniciar sesion");
        }else{
            const payload = {
                idUser: firebase.auth().currentUser.uid,
                idRestaurant: restaurant.id,
            }

            db.collection("favorites")
                .add(payload)
                .then(()=>{
                    setIsFavorite(true);
                    toastRef.current.show("Restaurante agregado a favoritos")
                }).catch(()=> {
                    toastRef.current.show("Error al agregar a favoritos el restaurante")
                })
        }
    };

    const removeFavorites = () => {
        db.collection("favorites")
            .where("idRestaurant", "==", restaurant.id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get()
            .then((response)=>{
                response.forEach((doc) => {
                    const idFavorite = doc.id;
                    db.collection("favorites")
                        .doc(idFavorite)
                        .delete()
                        .then(()=>{
                            setIsFavorite(false);
                            toastRef.current.show("Restaurante eliminado de favoritos");
                        }).catch(() => {
                            toastRef.current.show("Error al eliminar de favoritos el restaurante");
                        })
                })
            })
    };

    if(!restaurant) return <Loading isVisible={true} text="Cargando restaurante"/>;

    return (
        <ScrollView vertical style={styles.viewBody}>
            <View  style={styles.viewFavorite}>
                <Icon
                    type="material-community"
                    name={isFavorite ? "tag-heart" : "tag-heart-outline"}
                    onPress={isFavorite ? removeFavorites : addFavorites }
                    color={isFavorite ? "#00A680" : "#C3C3C3"}
                    size={30}
                    underlayColor="transparent"
                />
            </View>
            <Carousel 
                arrayImages={restaurant.images}
                height={250}
                width= {Dimensions.get("window").width}
            />
            <TitleRestaurant
                name={restaurant.name}
                description={restaurant.description}
                rating={rating}
            />
            <RestaurantInfo
                location={restaurant.location}
                name={restaurant.name}
                address={restaurant.address}
            />
            <ListReview
                navigation = {navigation}
                idRestaurant = {restaurant.id}
            />
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </ScrollView>
    )
}

function TitleRestaurant(props){
    const {name,description,rating} = props;

    return(
        <View style={styles.titleRestaurant}>
            <View style={{flexDirection:"row"}}>
                <Text style={styles.name}>{name}</Text>
                <Rating 
                    style={styles.rating}
                    imageSize={25}
                    type='custom'
                    ratingColor="#00A680"
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.description}>{description}</Text>
        </View>
    )
}


function RestaurantInfo(props){
    const {location,name,address} = props;

    const listInfo = [
        {
            text: address,
            iconName: "map-marker",
            iconType: "material-community",
            action: null,
        },
        {
            text: "000111222333",
            iconName: "phone",
            iconType: "material-community",
            action: null,
        },
        {
            text: "prueba@gmail.com",
            iconName: "at",
            iconType: "material-community",
            action: null,
        },
    ];

    return(
        <View style={styles.infoRestaurant}>
            <Text style={styles.infoTitleRestaurant}>Informacion del restaurante</Text>
            <View style={styles.mapView}>
                <Map location={location} name={name} height={100} />
            </View>
            {map(listInfo, (item,index)=>(
                <ListItem
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name: item.iconName,
                        type: item.iconType,
                        color: "#00A680",
                    }}
                    containerStyle={styles.containerListItem}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1,
        backgroundColor:"#FFF",
    },
    titleRestaurant:{
        padding:15,
    },
    name:{
        fontWeight:"bold",
        fontSize:20,
    },
    description:{
        marginTop:5,
        color:"grey",
    },
    rating:{
        marginTop:15,
        borderColor:"#FFF",
        position:"absolute",
        right:0,
    },
    infoRestaurant:{
        margin:15,
        marginTop:25,
    },
    infoTitleRestaurant:{
        fontSize:20,
        fontWeight:"bold",
        marginBottom:10,
    },
    mapView:{
        alignItems:"center",
    },
    containerListItem:{
        borderBottomColor: "#D8D8D8",
        borderBottomWidth:1, 
    },
    viewFavorite:{
        position:"absolute",
        top:0,
        right:0,
        zIndex:2,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15,
    }
})
