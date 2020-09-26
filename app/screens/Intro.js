import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import Onboarding from "react-native-onboarding-swiper"; 

export default function Intro(props) {
    const {navigation} = props;
    return (
        <Onboarding
            onSkip={() => navigation.navigate("account")}        
            onDone={() => navigation.navigate("account")}
            pages={[
            {
                backgroundColor: '#BF5CED',
                image: <Image style={{width:200, height:200}} source={require('../../assets/img/grupo.png')} />,
                title: <Text style={{fontWeight:"bold",fontSize:30,color:"#FFF"}}>Bienvenido/a</Text>,
                subtitle: 'Forma parte de la gran comunidad de #FoodLovers a traves de esta app',
            },
            {
                backgroundColor: '#22A12A',
                image: <Image style={{width:200, height:200}} source={require('../../assets/img/almacenar.png')} />,
                title: 'Descubre y comparte nuevos lugares',
                subtitle: 'Comparte tus lugares favoritos para comer, con la comunidad ademas de conocer nuevos restaurantes cerca de ti',
            },
            {
                backgroundColor: '#FF7DCB',
                image: <Image style={{width:200, height:200}} source={require('../../assets/img/dieta.png')} />,
                title: 'Tus comidas favoritas',
                subtitle: "Busca donde se preparan tus comidas favoritas en tu ciudad",
            },
            ]}
        />
    )
}

const styles = StyleSheet.create({})
