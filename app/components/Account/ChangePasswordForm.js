import React, {useState} from "react";
import {StyleSheet, View,Text} from "react-native";
import {Input, Button} from "react-native-elements";
import {size} from "lodash";
import * as firebase from "firebase";
import {reauthenticate} from "../../utils/api";

export default function ChangePasswordForm(props){
    const {setShowModal, toastRef} = props;

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultValueForm());
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e,type) => {
        setFormData({...formData, [type]: e.nativeEvent.text});
    };

    const onSubmit = async () => {
        let isSetError = true;
        let errorTemp = {};
        setError({});

        if(!formData.password || !formData.newPassword || !formData.repeatNewPassword){
            errorTemp = {
                password:!formData.password ? "La contrasena no puede esta vacia" : " ",
                newPassword: !formData.newPassword ? "La contrasena no puede esta vacia" : " ",
                repeatNewPassword: !formData.repeatNewPassword ?  "La contrasena no puede esta vacia" : " ",
            }
        } else if (formData.newPassword !== formData.repeatNewPassword){
            errorTemp={
                newPassword:"Las contrasenas no coinciden",
                repeatNewPassword: "Las contrasena no coinciden"
            }
        } else if(size(formData.newPassword) < 6){
            errorTemp={
                newPassword:"La contrasena debe tener mas de 5 caracteres",
                repeatNewPassword:"La contrasena debe tener mas de 5 caracteres",
            }
        }else{
            setIsLoading(true);
            await reauthenticate(formData.password).then(async ()=>{
                await firebase.auth().currentUser.updatePassword(formData.newPassword).then(() => {
                    isSetError = false;
                    setIsLoading(false);
                    setShowModal(false);
                    firebase.auth().signOut();
                }).catch(() => {
                    errorTemp = {
                        other: "Error al actualizar la contrasena"
                    }
                    setIsLoading(false);
                })
            }).catch(() => {
                errorTemp={
                    password: "Contrasena incorrecta"
                };
                setIsLoading(false);
            })
        }

        isSetError && setError(errorTemp);
    }
    
    return(
        <View style={styles.view}>
            <Input
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type:"material-community",
                    name:showPassword ? "eye-off-outline" : "eye-outline",
                    color:"#C2C2C2",
                    onPress: () => setShowPassword(!showPassword),
                }}
                onChange= {e => onChange(e, "password")}
                errorMessage={error.password}
            />
            <Input
                placeholder="Nueva contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type:"material-community",
                    name:showPassword ? "eye-off-outline" : "eye-outline",
                    color:"#C2C2C2",
                    onPress: () => setShowPassword(!showPassword),
                }}
                onChange= {e => onChange(e, "newPassword")}
                errorMessage={error.newPassword}
            />
            <Input
                placeholder="Repetir nueva contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type:"material-community",
                    name:showPassword ? "eye-off-outline" : "eye-outline",
                    color:"#C2C2C2",
                    onPress: () => setShowPassword(!showPassword),
                }}
                onChange= {e => onChange(e, "repeatNewPassword")}
                errorMessage={error.repeatNewPassword}
            />
            <Button
                title="Cambiar email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnChange}
                onPress={onSubmit}
                loading={isLoading}
            />
            <Text>{error.other}</Text>
        </View>
    )
}

function defaultValueForm(){
    return {
        password: "",
        newPassword:"",
        repeatNewPassword:"",
    }
};

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