import React, {useState, useEffect} from "react";
import {StyleSheet, ScrollView, Text, View, Alert, Dimensions} from "react-native";
import {Input, Button, Icon, Avatar, Image} from "react-native-elements";
import * as Permission from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import {map, size, filter, result, set} from "lodash";
import uuid from "random-uuid-v4";
import Modal from "../Modal";

import {firebaseApp} from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props){
    const {toastRef, setIsLoading, navigation} = props;

    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantDescription, setRestaurantDescription] = useState("")
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);

    const addRestaurant = () => {
        if(!restaurantName || !restaurantAddress || !restaurantDescription){
            toastRef.current.show("Todos los campos son obligatorios",1500);
        }else if(size(imageSelected) == 0){
            toastRef.current.show("El restaurante debe tener al menos una foto",1500);
        }else if(!locationRestaurant){
            toastRef.current.show("Tienes que localizar el restaurante en el mapa",1500)
        }else{
            setIsLoading(true);
            uploadImageStorage().then( response => {
                db.collection("restaurants")
                    .add({
                        name: restaurantName,
                        address: restaurantAddress,
                        description: restaurantDescription,
                        location: locationRestaurant,
                        images: response,
                        rating: 0,
                        ratingTotal: 0,
                        quantityVoting: 0,
                        createAt: new Date(),
                        createBy: firebaseApp.auth().currentUser.uid,
                    })
                    .then(() => {
                        setIsLoading(false);
                        navigation.navigate("restaurant");
                    }).catch(() => {
                        setIsLoading(false);
                        toastRef.current.show("Error al agregar el restaurante, intentelo mas tarde")
                    })
            });
        }
    }

    const uploadImageStorage = async () => {
        const imageBlob = [];

        await Promise.all(
            map(imageSelected, async (image) => {
            const response = await fetch(image);
            const blob = await response.blob();
            const name = uuid();
            const ref = firebase.storage().ref("restaurants").child(name);
            await ref.put(blob).then( async (result) => {
                await firebase
                    .storage()
                    .ref(`restaurants/${result.metadata.name}`)
                    .getDownloadURL()
                    .then(photoUrl => {
                        imageBlob.push(photoUrl);
                    })
                })
            })
        );

        return imageBlob;
    };

    return(
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant imageRestaurant={imageSelected[0]} />
            <FormAdd
                setRestaurantName={setRestaurantName}
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantDescription={setRestaurantDescription}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />
            <UploadImage 
                toastRef={toastRef} 
                setImageSelected={setImageSelected} 
                imageSelected={imageSelected} 
            />
            <Button
                title="Agregar restaurante"
                onPress={addRestaurant}
                containerStyle={styles.btnContainerAdd}
                buttonStyle={styles.btnAdd}
            />
            <Map 
                isVisibleMap={isVisibleMap} 
                setIsVisibleMap={setIsVisibleMap} 
                setLocationRestaurant={setLocationRestaurant} 
                toastRef={toastRef}  
            />
        </ScrollView>
    )
}

function ImageRestaurant(props){
    const {imageRestaurant} = props;
    return(
        <View style={styles.viewPhoto}>
            <Image 
                source = {imageRestaurant ? {uri:imageRestaurant} : require("../../../assets/img/no-image.png")}
                style = {{width:widthScreen,height:200}}
            />
        </View>
    )
}

function FormAdd(props){
    const { setRestaurantName, setRestaurantAddress, setRestaurantDescription, setIsVisibleMap, locationRestaurant} = props;
    return(
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantName(e.nativeEvent.text)}
            />
            <Input
                placeholder="Direccion"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
                rightIcon={{
                    type:"material-community",
                    name:"map-marker-outline",
                    color: locationRestaurant ? "#00A680" : "#7A7A7A" ,
                    onPress: () => setIsVisibleMap(true),
                }} 
            />
            <Input
                placeholder="Descripcion del restaurante"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

function Map(props){
    const {isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef} = props;
    const [location, setLocation] = useState(null);

    useEffect(() => {
        ( async () => {
            const resultPermissions = await Permission.askAsync(
                Permission.LOCATION
            );
            const statusPermissions = resultPermissions.permissions.location.status;
            if(statusPermissions !== "granted"){
                toastRef.current.show("Es necesario aceptar los permisos de localizacion",3000)
            }
            else{
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                })
            }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(location);
        toastRef.current.show("Localizacion guardada con exito",2000);
        setIsVisibleMap(false);
    }

    return(
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap} >
            <View>
                {location && (
                    <MapView 
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude:location.latitude,
                                longitude:location.longitude,
                            }}
                            draggable
                        />
                    </MapView>
                )}

                <View style={styles.viewMapBtn}>
                        <Button 
                            title="Guardar Ubicacion" 
                            containerStyle={styles.btnContainerOnMap} 
                            buttonStyle={styles.btnStyleOnMap}
                            onPress={() => confirmLocation()}
                        />
                        <Button 
                            title="Cancelar Ubicacion" 
                            containerStyle={styles.btnContainerOnMap} 
                            buttonStyle={styles.btnStyleCancelOnMap}
                            onPress={() => setIsVisibleMap(false)}
                        />
                </View>
            </View>
        </Modal>
    )
}

function UploadImage(props){
    const {toastRef, imageSelected ,setImageSelected} = props
    
    const imageSelect = async () => {
        const resultPermissions = await Permission.askAsync(
            Permission.CAMERA_ROLL
        );        
        if(resultPermissions==="denied"){
            toastRef.current.show("Es necesario aceptar los permisos",3000);
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing:true,
                aspect:[4,4],
            });
            if(result.cancelled){
                toastRef.current.show("Han seleccionado la galeria sin seleccionar una imagen",2000)
            }else{
                //console.log(result.uri)
                setImageSelected(result.uri)
                setImageSelected([...imageSelected, result.uri]);
            }
        }        
    };

    const removeImage = (image) => {

        Alert.alert(
            "Eliminar imagen",
            "¿Esta seguro de que quieres elimnar la imagen?",
            [
                {
                    text:"Cancel",
                    style:"cancel"
                },
                {
                    text:"Eliminar",
                    onPress: () => {
                        setImageSelected(
                            filter(imageSelected, (imageUrl) => imageUrl != image )
                        );
                    }
                }
            ],
            {
                cancelable:false
            }
        )
    }
    return(
        <View style={styles.viewImage}>
            {size(imageSelected) < 5 && (
                <Icon
                    type="material-community"
                    name="file-image-outline"
                    color="#7A7A7A"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}

            {map(imageSelected, (imageRestaurant, index)=>(
                <Avatar
                    key={index}
                    style={styles.miniature}
                    source={{uri:imageRestaurant}}
                    onPress={() => removeImage(imageRestaurant)}
                />
            ))}
        </View>
    )
}

const styles= StyleSheet.create({
    scrollView:{
        backgroundColor:"#FFF",
        height:"100%",
    },
    viewForm:{
        marginLeft:10,
        marginRight:10,
    },
    input2:{
        marginBottom:10,
        marginTop:25,
    },
    textArea:{
        height:100,
        width:"100%",
        padding:0,
        margin:0,
    },
    btnContainerAdd:{
        width:"95%",
        justifyContent:"center",
        marginTop:20,
    },
    btnAdd:{
        backgroundColor:"#00A680",
        borderRadius:25,
        marginLeft:"5%",
        marginBottom:10,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.5,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},
    },
    viewImage:{
        flexDirection:"row",
        marginLeft:20,
        marginRight:20,
        marginTop:30,
    },
    containerIcon:{
        alignItems:"center",
        justifyContent:"center",
        marginRight:10,
        height:70,
        width:70,
        backgroundColor:"#E3E3E3",
        borderRadius:15,
    },
    miniature:{
        width:70,
        height:70,
        marginRight:10,

    },
    viewPhoto:{
        alignItems:"center",
        height:200,
        marginBottom:20,
    },
    mapStyle:{
        width:"100%",
        height:700,
    },
    viewMapBtn:{
        flexDirection:"column",
        position: 'absolute',//use absolute position to show button on top of the map
        top: '80%', //for center align
        left: '25%'
    },
    btnContainerOnMap:{
        width:"97.5%",
        justifyContent:"center",
        marginTop:15,
    },
    btnStyleOnMap:{
        backgroundColor:"#00A680",
        borderRadius:20,
        marginLeft:"5%",
        marginBottom:5,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.5,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},
    },
    btnStyleCancelOnMap:{
        backgroundColor:"#A60C0C",
        borderRadius:20,
        marginLeft:"5%",
        marginBottom:5,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.5,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},
    },
});