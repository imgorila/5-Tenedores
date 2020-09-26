import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Intro from "../screens/Intro";
import { BottomTabBar } from "@react-navigation/bottom-tabs";

const Stack= createStackNavigator();

export default function FavoritesStack (){
    return(
        <Stack.Navigator
            headerMode="none"
        >
            <Stack.Screen
                name="intro-comp"
                component={Intro}
            />
        </Stack.Navigator>
    )
}