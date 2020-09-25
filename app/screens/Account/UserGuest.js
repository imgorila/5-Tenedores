import React from "react";
import {StyleSheet, ScrollView, View, Text, Image} from "react-native";
import {Button} from "react-native-elements";
import {useNavigation} from "@react-navigation/native";


export default function UserGuest(){
    const navigation = useNavigation();

    return(
        <ScrollView centerContent={true}>
            <Image
                source={require("../../../assets/img/user-guest.jpg")}
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.title}>Consulta tu perfil en 5 tenedores</Text>
            <Text style={styles.description}>
                Como describirias tu mejor restaurante? Busca y visualiza los mejores
                restaurantes de una forma sencilla, vota cual te ha gustado mas y comenta
                como ha sido tu experiencia.
            </Text>
            <View style={styles.viewBtn}>
                <Button
                    title="Ver tu perfil"
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate("login")}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        marginLeft:"25%",
        marginRight: "25%",
    },
    image:{
        height:300,
        width:"100%",
        marginBottom: 40
    },
    title:{
        fontFamily:"sans-serif-medium",
        fontSize:19,
        textAlign:"center",
        marginBottom:10,
    },
    description:{
        fontFamily:"sans-serif-thin",
        fontSize:12,
        marginBottom:20,
        textAlign:"center"
    },
    viewBtn:{
        flex:1,
        alignItems:"center",
    },
    btnStyle:{
        backgroundColor:"#00A680",
        borderRadius:25,
    },
    btnContainer:{
        width:"70%",
    }
})