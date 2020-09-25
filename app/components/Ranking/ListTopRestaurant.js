import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Card, Image, Icon, Rating } from "react-native-elements";

export default function ListTopRestaurant(props) {

    const {restaurants,navigation} = props;

    return (
        <FlatList
            data={restaurants}
            renderItem={(restaurant) => <Restaurant restaurant={restaurant} navigation={navigation} />}
            keyExtractor={(item, index) => index.toString()}
        
        />
    )
}

function Restaurant(props){
    const {restaurant,navigation} = props;
    const {id, name, rating, images, description} = restaurant.item;
    const [iconColor, setIconColor] = useState("#000");


    useEffect(() => {
        if(restaurant.index === 0){
            setIconColor("#D4AF37");
        } else if(restaurant.index === 1){
            setIconColor("#E3E4E5");
        } else if (restaurant.index === 2){
            setIconColor("#CD7F32");
        }
    }, []);

    return(
        <TouchableOpacity 
            activeOpacity={1.0} 
            onPress={() => navigation.navigate("restaurants",{screen:"restaurant-info",params:{id}}) }
        >
            <Card containerStyle={styles.containerCard}>
                <Icon
                    type="material-community"
                    name="medal"
                    color={iconColor}
                    size={40}
                    containerStyle={styles.containerIcon}
                />
                <Image
                    style={styles.containerRestaurant}
                    resizeMode="cover"
                    source={
                        images[0] ? {
                            uri:images[0]
                        }: require("../../../assets/img/no-image.png")
                    }
                />
                <View style={styles.titleRating}>
                    <Text style={styles.title} >{name}</Text>
                    <Rating
                        imageSize={20}
                        startingValue={rating}
                        readonly
                    />
                </View>
                <Text>{description}</Text>
            </Card>
        </TouchableOpacity>
    )
}

//d4af37

const styles = StyleSheet.create({
    containerCard:{
        marginBottom:30,
        borderWidth:0,
        borderRadius:20,
    },
    containerIcon:{
        position:"absolute",
        top:-4,
        right:5,
        zIndex:1,
    },
    containerRestaurant:{
        width:"100%",
        height:200,
    },
    titleRating:{
        flexDirection:"row",
        marginTop:10,
        justifyContent:"space-between"
    },
    title:{
        fontSize:20,
        fontWeight:"bold",
    },
    description:{
        color:"grey",
        marginTop:0,
        textAlign:"justify",
    }
})
