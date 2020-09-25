import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Favorite from "../screens/Favorites";

const Stack= createStackNavigator();

export default function FavoritesStack (){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="favorites"
                component={Favorite}
                options={{
                    title:"Favoritos"
                }}
            />
        </Stack.Navigator>
    )
}