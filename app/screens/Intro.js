import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import Onboarding from "react-native-onboarding-swiper"; 
import {useFonts} from "expo-font";

export default function Intro(props) {
    const {navigation} = props;
    const [loaded] = useFonts({
        KumbhSans: require('../../assets/fonts/KumbhSans-Regular.ttf'),
        'KumbhSans-Bold': require('../../assets/fonts/KumbhSans-Bold.ttf'),
        'KumbhSans-Light': require('../../assets/fonts/KumbhSans-Light.ttf'),
      });
    
      if (!loaded) {
        return null;
      }

    return (
        <Onboarding
            onSkip={() => navigation.navigate("account")}        
            onDone={() => navigation.navigate("account")}
            pages={[
            {
                backgroundColor: '#BF5CED',
                image: <Image style={{width:200, height:200}} source={require('../../assets/img/grupo.png')} />,
                title: <Text style={{fontSize:30,color:"#FFF",fontFamily:"KumbhSans-Bold"}}>Bienvenido/a</Text>,
                subtitle: 
                <Text style={{fontSize:15,color:"#FFF",fontFamily:"KumbhSans",textAlign:"center"}}>
                    Forma parte de la gran comunidad de #FoodLovers a traves de esta app
                </Text>,
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
