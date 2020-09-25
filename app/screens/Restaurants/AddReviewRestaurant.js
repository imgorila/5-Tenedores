import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Button, Input, AirbnbRating} from "react-native-elements";
import Toast from "react-native-easy-toast";

import Loading from "../../components/Loading";
import {firebaseApp} from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddReviewRestaurant(props) {
    const {route, navigation} = props;
    const {idRestaurant} = route.params;

    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const toastRef = useRef();

    const addReview = () => {
        if(!rating){
            toastRef.current.show("No has dado ninguna puntuacion");
        }else if(!title){
            toastRef.current.show("El titulo es obligatorio");
        }else if(!review){
            toastRef.current.show("El comentario es obligatorio");
        }else{
            setIsLoading(true);
            const user = firebase.auth().currentUser;
            const payload = {
                idUser: user.uid,
                avatar: user.photoURL,
                idRestaurant: idRestaurant,
                title: title,
                review: review,
                rating: rating,
                createAt: new Date(),
            };

            db.collection("reviews")
                .add(payload)
                .then(() => {
                    updateRestaurant();
                })
                .catch(() => {
                    toastRef.current.show("Error al enviar su comentario");
                    setIsLoading(false);
                })
        }
    };

    const updateRestaurant = () => {
        const restaurantRef = db.collection("restaurants").doc(idRestaurant);

        restaurantRef.get().then((response)=>{
            const restaurantData = response.data();
            const ratingTotal = restaurantData.ratingTotal + rating;
            const quantityVoting = restaurantData.quantityVoting + 1;
            const ratingResult= ratingTotal / quantityVoting;

            restaurantRef.update({
                rating: ratingResult,
                ratingTotal,
                quantityVoting
            }).then(() => {
                setIsLoading(false);
                navigation.goBack();
            })
        })
    }
 
    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                    <AirbnbRating
                        count={5.0}
                        reviews={[
                            "Pesimo",
                            "Deficiente",
                            "Normal",
                            "Muy Bueno",
                            "Excelente"
                        ]}
                        defaultRating={0}
                        size={45}
                        onFinishRating={(value) => {setRating(value)}}
                    />
            </View>
            <View style={styles.viewForm}>
                    <Input
                        placeholder="Titulo de su comentario"
                        containerStyle={styles.containerInput}
                        onChange={(e) => setTitle(e.nativeEvent.text)}
                    />
                    <Input
                        placeholder="Escriba su comentario"
                        multiline={true}
                        inputContainerStyle={styles.containerTextArea}
                        onChange={(e) => setReview(e.nativeEvent.text)}
                    />
                    <Button
                        title="Enviar comentario"
                        containerStyle={styles.btnContainerSend}
                        buttonStyle={styles.btnSend}
                        onPress={addReview}
                    />
            </View>
            <Toast
                ref={toastRef} position="center" opacity={0.9}
            />
            <Loading
                isVisible={isLoading} text="Enviando comentario"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1,
    },
    viewRating:{
        height:110,
        backgroundColor:"#F2F2F2",
    },
    viewForm:{
        flex:1,
        alignItems:"center",
        margin:10,
        marginTop:40,
    },
    containerInput:{
        marginBottom:10,
    },
    containerTextArea:{
        height:150,
        width: "100%",
        padding:0,
        margin:0,
    },
    btnContainerSend:{
        width:"75%",
        justifyContent:"center",
        marginTop:20,
    },
    btnSend:{
        backgroundColor:"#00A680",
        borderRadius:25,
        marginTop:10,
        marginLeft:"2.5%",
        marginBottom:10,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.5,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},
    },
})
