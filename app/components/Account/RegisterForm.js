import React, {useState} from "react";
import {StyleSheet, View, Text} from "react-native";
import {Input, Icon, Button} from "react-native-elements";
import {validateEmail} from "../../utils/validations";
import {size, isEmpty} from "lodash";
import * as firebase from "firebase";
import {Divider} from "react-native-elements";

import {useNavigation} from "@react-navigation/native";

import Loading from "../Loading";


export default function RegisterForm (props){
    const {toastRef} = props;
    const [showPassword, setShowPassword]  = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const navigation = useNavigation();

    const [formData, setFormData] = useState(defaultFormValue)
    const [loading, setLoading] = useState(false)

    const onSubmit = () => {
        if( isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword)){
            toastRef.current.show("Todos los campos son obligatorios");
        }else if(!validateEmail(formData.email)){
            toastRef.current.show("El email es incorrecto");
        }else if (formData.password !== formData.repeatPassword){
            toastRef.current.show("Las contrasenias deben ser iguales");
        }else if(size(formData.password)<6){
            toastRef.current.show("La contrasenia debe tener al menos 6 caracteres");
        }
        else{
            setLoading(true);
            firebase.auth().createUserWithEmailAndPassword(formData.email,formData.password).then(() => {
                setLoading(false);
                navigation.navigate("account");
            }).catch((err)=>{
                setLoading(false);
                toastRef.current.show("El email esta en uso, pruebe con otro");
            });
        }
    };

    const onChange = (e,type) => {
        setFormData({...formData,[type]:e.nativeEvent.text});
    };

    return(
        <View style={styles.viewContainer}>
            <View style={styles.formContainer}>
                <Input
                    placeholder="Correo Electronico"
                    containerStyle={styles.inputFormTop}
                    onChange={e=>onChange(e,"email")}
                    rightIcon={
                        <Icon
                            iconStyle={styles.iconRigth}
                            type="material-community"
                            name="at"
                        />
                    }
                    inputContainerStyle={styles.inputInside}
                />
                <Input
                    placeholder="Contraseña"
                    containerStyle={styles.inputForm}
                    onChange={e=>onChange(e,"password")}
                    password={true}
                    secureTextEntry={showPassword ? false : true}
                    rightIcon={
                        <Icon
                            iconStyle={styles.iconRigth}
                            type="material-community"
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            onPress={()=> setShowPassword(!showPassword)}
                        />
                    }
                    inputContainerStyle={styles.inputInside}
                    // underlineColorAndroid={
                    //     useIsFocused ? "#00A680" : LIGHT_GRAY
                    // }
                />
                <Input
                    placeholder="Repetir Contraseña"
                    containerStyle={styles.inputForm}
                    onChange={e=>onChange(e,"repeatPassword")}
                    password={true}
                    secureTextEntry={showRepeatPassword ? false : true}
                    rightIcon={
                        <Icon
                            iconStyle={styles.iconRigth}
                            type="material-community"
                            name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
                            onPress={()=> setShowRepeatPassword(!showRepeatPassword)}
                        />
                    }
                    inputContainerStyle={styles.inputInside}
                />
            </View>
                <Button
                    title="Unirse"
                    buttonStyle={styles.btnStyleRegister}
                    containerStyle={styles.btnContainerRegister}
                    onPress= {onSubmit}
                />
            <Divider style={styles.divider} />
            <Text>Social Login</Text>
                <Loading isVisible={loading} text="Creando Cuenta" />
        </View>
    );
}

function defaultFormValue(){
    return{
        email:"",
        password:"",
        repeatPassword:"",
    };
}

const styles = StyleSheet.create ({
    viewContainer:{
        flex:1,
        flexDirection: "column",
        justifyContent:"center",
        marginTop: 30,
    },
    formContainer:{
        flex:2,
        height:250,
        justifyContent:"center",
        backgroundColor:"#FFF",
        marginTop:15,
        marginBottom:20,
        borderRadius:25,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.5,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},
    },
    inputFormTop:{
        width:"90%",
        justifyContent:"center",
        marginLeft:"5%",
    },
    inputForm:{
        width:"90%",
        justifyContent:"center",
        marginLeft:"5%",
        marginTop:30,
    },
    inputInside:{
        borderWidth: 0, 
        borderBottomWidth: 1, 
        borderBottomColor: "#00A680",
    },
    btnContainerRegister:{
        width:"95%",
        justifyContent:"center",
        marginTop:20,
    },
    btnStyleRegister:{
        backgroundColor:"#00A680",
        borderRadius:20,
        marginLeft:"5%",
        marginBottom:10,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.5,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},
    },
    iconRigth:{
        color: "#E1E3E9",
    },
    divider:{
        backgroundColor:"#00A680",
        margin:40
    }
});