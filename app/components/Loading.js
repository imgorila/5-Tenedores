import React from "react";
import {StyleSheet, View, Text, ActivityIndicator} from "react-native";
import {Overlay} from "react-native-elements";

export default function Loading(props){
    const { isVisible, text} = props;

    return(
        <Overlay
            isVisible={isVisible}
            windowBackgroundColor="rgba(0, 0, 0, 0.25)"
            overlayBackgroundColor="transparent"
            overlayStyle={styles.overlay}
        >
            <View style={styles.view}>
                <ActivityIndicator size={75} color="#00A680"/>
                {text && <Text style={styles.text}> {text} {"\n"} <Text style={styles.subtext}> Estamos trabajando en ello</Text> </Text>}
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay:{
        height: 300,
        width: "100%",
        backgroundColor: "#FFF",
        borderColor: "#00A680",
        //borderWidth:2,
        //borderRadius: 10,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: "130%"
    },
    view:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
    },
    text:{
        color:"#000000",
        textAlign: "center",
        marginTop: 15,
        fontSize: 25,
        fontFamily: "sans-serif-medium",
    },
    subtext:{
        color:"#8A8A8A",
        // textShadowColor: 'rgba(0, 0, 0, 0.25)',
        // textShadowOffset: {width: -1, height: 1},
        // textShadowRadius: 0.5,
        textAlign:"center",
        fontSize: 15,
        fontFamily: "sans-serif-thin",
    }
});