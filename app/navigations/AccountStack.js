import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Account from "../screens/Account/Account";
import Login from "../screens/Account/Login";
import Register from "../screens/Account/Register";

const Stack = createStackNavigator();

export default function AccountStack(){
    return(
        <Stack.Navigator>
        <Stack.Screen
            name="account"
            component={Account}
            options={{
                title:"Perfil",
                headerStyle: {
                    elevation: 0, // remove shadow on Android
                    shadowOpacity: 0, // remove shadow on iOS
                },
                headerTitleStyle: {
                      fontSize: 25,
                      fontFamily:"sans-serif-condensed",
                      fontWeight:"bold",
                },
            }}
        /> 
        <Stack.Screen
            name="login"
            component={Login}
            options={{
                title:"Iniciar Sesion",
                headerStyle: {
                    elevation: 0, // remove shadow on Android
                    shadowOpacity: 0, // remove shadow on iOS
                },
                headerTitleStyle: {
                      fontSize: 25,
                      fontFamily:"sans-serif-condensed",
                      fontWeight:"bold",
                },
            }}
        />
        <Stack.Screen
            name="register"
            component={Register}
            options={{
                title:"Registrarse",
                headerStyle: {
                    elevation: 0, // remove shadow on Android
                    shadowOpacity: 0, // remove shadow on iOS
                },
                headerTitleStyle: {
                      fontSize: 25,
                      fontFamily:"sans-serif-condensed",
                      fontWeight:"bold",
                },
            }}
        />
    </Stack.Navigator>
    )
}