import React, {useEffect, useState} from "react";
import {StyleSheet, View, Text, FlatList} from "react-native";
import {SearchBar,ListItem,Icon, Image} from "react-native-elements";
import {FireSQL} from "firesql";
import firebase from "firebase/app";

const fireSQL = new FireSQL(firebase.firestore(),{includeId:"id"});

export default function Search (props){
    const {navigation} = props;

    const [search, setSearch] = useState("");
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        if(search){
            fireSQL.query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
            .then((response)=>{
                setRestaurants(response);
            })
        }
    }, [search]);
    
    return(
        <View>
            <SearchBar
                placeholder="Busca tu restaurante..."
                onChangeText={(e)=>{
                    setSearch(e)
                }}
                containerStyle={styles.containerBar}
            />
            { restaurants.length === 0 ? (<NotFoundRestaurant/>) : 
                (<View>
                    <FlatList
                        data={restaurants}
                        renderItem={(restaurant) => <Restaurant restaurant={restaurant} navigation={navigation} />}
                        keyExtractor={(item,index)=> index.toString()}
                    />
                </View>) 
            }
        </View>
    );
}

function NotFoundRestaurant(){
    return(
        <View style={{flex:1, position:"absolute", top:250, right:110}}>
            <Image
                source={require("../../assets/img/error-404.png")}
                resizeMode="cover"
                style={{width:200,height:200}}
            />
        </View>
    )
}

function Restaurant(props){
    const {restaurant, navigation} = props;
    const {id, name, images} = restaurant.item;

    return(
     <ListItem
        title={name}
        leftAvatar={{
            source: images[0] ? {uri:images[0]} : require("../../assets/img/no-image.png")
        }}
        rightIcon={<Icon
            type="material-community"
            name="chevron-right"
        />}
        onPress={() => navigation.navigate("restaurants",{screen:"restaurant-info", params:{id, name}})}
     />
     )
}

const styles = StyleSheet.create({
    containerBar:{
        marginTop:"7.5%",
        marginBottom:20,
    }
})