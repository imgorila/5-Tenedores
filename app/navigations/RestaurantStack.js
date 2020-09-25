import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurants from "../screens/Restaurants/Restaurants";
import AddRestaurant from "../screens/Restaurants/AddRestaurant";
import Restaurant from "../components/Restaurants/Restaurant";
import AddReviewRestaurant from "../screens/Restaurants/AddReviewRestaurant";

const Stack = createStackNavigator();

export default function RestaurantStack (){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="restaurants"
                component={Restaurants}
                options={{
                    title:"Restaurantes",
                    headerStyle: {
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                    },
                    headerTitleStyle: {
                          fontSize: 20,
                    },
                }}
            />
            <Stack.Screen
                name="add-restaurant"
                component={AddRestaurant}
                options={{
                    title:"Restaurantes",
                    headerStyle: {
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                    },
                    headerTitleStyle: {
                          fontSize: 20,
                    },
                }}
            />
            <Stack.Screen
                name="restaurant-info"
                component={Restaurant}
                options={{
                    headerStyle: {
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                    },
                    headerTitleStyle: {
                          fontSize: 20,
                    },
                }}
            />
            <Stack.Screen
                name="add-review-restaurant"
                component={AddReviewRestaurant}
                options={{
                    title:"Nuevo Comentario",
                    headerStyle: {
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                    },
                    headerTitleStyle: {
                          fontSize: 20,
                    },
                }}
            />
        </Stack.Navigator>
    )
}