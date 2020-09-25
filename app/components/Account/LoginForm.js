import React, {useState} from "react";
import {StyleSheet, View} from "react-native";
import {Input, Button, Icon} from "react-native-elements";
import {isEmpty} from "lodash";
import {useNavigation} from "@react-navigation/native";
import * as firebase from "firebase";
import {validateEmail} from "../../utils/validations";
import Loading from "../Loading";

export default function LoginForm(props){
    const {toastRef} = props;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue());
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const onChange = (e,type) => {
        setFormData({...formData,[type]:e.nativeEvent.text})
    }

    const onSubtmit = () =>{
        if(isEmpty(formData.email)|| isEmpty(formData.password)){
            toastRef.current.show("Todos los campos son obligatorios");
        } else if(!validateEmail(formData.email)){
            toastRef.current.show("El email no es correcto");
        } else{
            setLoading(true);
            firebase.auth().signInWithEmailAndPassword(formData.email,formData.password).then(()=>{
                setLoading(false);
                navigation.navigate("account");
            }).catch(()=>{
                setLoading(false);
                toastRef.current.show("El email o contraseña es incorrecta");
            })
        }
    };

    return(
        <View style={styles.viewContainer}>
            <View style={styles.formContainer}>
                <Input
                    placeholder="Correo Electronico"
                    onChange={(e) => onChange(e,"email")}
                    containerStyle={styles.inputFormTop}
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
                    onChange={(e) => onChange(e,"password")}
                    containerStyle={styles.inputForm}
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
                />
            </View>
            <View>
                <Button
                    title="Iniciar Sesion"
                    containerStyle={styles.btnContainerLogin}
                    buttonStyle={styles.btnLogin}
                    onPress= {onSubtmit}
                />
            </View>
            <Loading isVisible={loading} text="Iniciando Sesion" />
        </View>
    )
}

function defaultFormValue(){
    return{
        email:"",
        password:""
    }
}
const styles= StyleSheet.create({
    viewContainer:{
        flex:1,
        justifyContent:"center",
        marginTop:30,
    },
    formContainer:{
        flex:2,
        height:200,
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
    btnContainerLogin:{
        width:"95%",
        justifyContent:"center",
        marginTop:20,
    },
    btnLogin:{
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
    iconRigth:{
        color: "#E1E3E9",
    },
    divider:{
        backgroundColor:"#00A680",
        margin:40,
        justifyContent:"center",
    }
})