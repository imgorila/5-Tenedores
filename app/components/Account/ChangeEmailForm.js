import { identity, toUpper } from "lodash";
import React, {useState} from "react";
import {StyleSheet,View} from "react-native";
import {Button,Input} from "react-native-elements";
import * as firebase from "firebase";
import {validateEmail} from "../../utils/validations";
import {reauthenticate} from "../../utils/api";

export default function ChangeEmailForm(props){
    const {email, setShowModal, toastRef, setReloadUserInfo} = props;
    const [formData, setFormData] = useState(defaultValue());
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text})
    }

    const onSubmit = () => {
        setError({});
        if(!formData.email || email == formData.email){
            setError({
                email:"El email no ha cambiado",
            })
        }else if(!validateEmail(formData.email)){
            setError({
                email:"Email invalido"
            })
        }else if(!formData.password){
            setError({
                password:"La contraseña no puede estar vacía"
            });
        }else{
                setIsLoading(true);
                reauthenticate(formData.password).then(response => {
                firebase.auth().currentUser.updateEmail(formData.email)
                .then(()=> {
                    setIsLoading(false);
                    setReloadUserInfo(true);
                    toastRef.current.show("Email actualizado correctamente");
                    setShowModal(false);
                }).catch(()=>{
                    setError({email: "Error al actualizar el email."});
                    setIsLoading(false);
                })
            }).catch(() => {
                setIsLoading(false);
                setError({password: "La contraseña no es correcta"})
            })
        }
        console.log("Formulario enviado...");
        console.log(formData);
    };

    return(
        <View style={styles.view}>
            <Input
                placeholder="Correo Electronico"
                containerStyle={styles.input}
                defaultValue={email || ""}
                rightIcon={{
                    type:"material-community",
                    name:"at",
                    color:"#C2C2C2",
                }}
                onChange={(e) => onChange(e, "email")}
                errorMessage={error.email}
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type:"material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color:"#C2C2C2",
                    onPress: () => setShowPassword(!showPassword),
                }}
                onChange={(e) => onChange(e,"password")}
                errorMessage={error.password}
            />
            <Button
                title="Cambiar email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnChange}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    );
}

function defaultValue(){
    return{
        email:"",
        password:""
    }
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