import { set } from "lodash";
import React, {useState} from "react";
import {StyleSheet, View} from "react-native";
import {Button, Input} from "react-native-elements";
import * as firebase from "firebase";

export default function ChangeDisplayName(props){
    const {displayName, setShowModal, toastRef, setReloadUserInfo} = props;
    const [newDisplayName, setNewDisplayName] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = () => {
        setError(null);
        if(!newDisplayName){
            setError("El nombre no puede estar vacio")
        } else if (displayName === newDisplayName){
            setError("El nombre no puede ser igual al actual");
        } else{
            setIsLoading(true);
            const update= {
                displayName: newDisplayName
            }
            firebase
            .auth()
            .currentUser.updateProfile(update)
            .then(() => {
                setIsLoading(false);
                setReloadUserInfo(true);
                setShowModal(false);
            }).catch(() => {
                setError("Error al actualizar el nombre");
                setIsLoading(false);
            });
        }
    }

    return(
        <View style={styles.view}>
            <Input
                placeholder="Nombre y Apellido"
                containerStyle={styles.input}
                rightIcon={{
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#C2C2C2"
                }}
                defaultValue={displayName && displayName}
                onChange={e => setNewDisplayName(e.nativeEvent.text)}
                errorMessage={error}
            />
            <Button
                title="Cambiar nombre"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnChange}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    view:{
        alignItems:"center",
        paddingTop:10,
        paddingBottom:10,
    },
    input:{
        marginBottom:10,
    },
    btnContainer:{
        width:"95%",
        justifyContent:"center",
        marginTop:"2%",
    },
    btnChange:{
        backgroundColor:"#00A680",
        borderRadius:20,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.5,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},
    },
});