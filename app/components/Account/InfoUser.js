import React, {useState} from "react";
import {StyleSheet, View, Text} from "react-native";
import {Avatar, Icon} from "react-native-elements";
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker"; 

export default function InfoUser(props){
    const {
        userInfo:{
            uid,
            photoURL,
            displayName,
            email
        },
        toastRef,
        setLoading,
        setLoadingText,
    } = props;

    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(
          Permissions.CAMERA_ROLL
        );
        const resultPermissionCamera =
          resultPermission.permissions.cameraRoll.status;
    
        if (resultPermissionCamera === "denied") {
          toastRef.current.show("Es necesario aceptar los permisos de la galeria");
        } else {
          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 4],
          });
    
          if (result.cancelled) {
            toastRef.current.show("Has cerrado la seleccion de imagenes");
          } else {
            uploadImage(result.uri)
              .then(() => {
                updatePhotoUrl();
              })
              .catch(() => {
                toastRef.current.show("Error al actualizar el avatar.");
              });
          }
        }
      };

      const uploadImage = async (uri) => {
        setLoadingText("Actualizando Avatar");
        setLoading(true);
    
        const response = await fetch(uri);
        const blob = await response.blob();
    
        const ref = firebase.storage().ref().child(`avatar/${uid}`);
        return ref.put(blob);
      };

    const updatePhotoUrl = () => {
        firebase
          .storage()
          .ref(`avatar/${uid}`)
          .getDownloadURL()
          .then(async (response) => {
            const update = {
              photoURL: response,
            };
            await firebase.auth().currentUser.updateProfile(update);
            setLoading(false);
          })
          .catch(() => {
            toastRef.current.show("Error al actualizar el avatar.");
          });
      };
    
    return(
        <View style={styles.viewContainer}>
             <Avatar
                rounded
                size={100}
                showEditButton
                onEditPress={changeAvatar}
                containerStyle={styles.avatarContainer}
                source= {photoURL ? {uri : photoURL} : require ("../../../assets/img/avatar-default.jpg")}
            />
            <View>
                <Text style={styles.textName}>
                    {displayName ? displayName : "Anónimo"}
                </Text>
                <Text style={styles.textEmail}>
                    {email ? email : "Social Login"}
                </Text>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    viewContainer:{
        flexDirection:"row",
    },
    avatarContainer:{
        marginLeft:"7.5%",
        marginTop:"7.5%",
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.6,
        elevation: 10,
        shadowRadius: 25 ,
        shadowOffset : { width: 13, height: 1},
    },
    textName:{
        marginTop:"30%",
        marginBottom:"5%",
        marginLeft:"15%",
        fontWeight: "bold",
        fontFamily:"sans-serif-condensed",
        fontSize:17,
    },
    textEmail:{
        fontStyle:"italic",
        marginLeft:"15%",
        fontFamily:"sans-serif-condensed",
        fontSize:17,
    },  
})