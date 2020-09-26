import React from "react";
import { NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
//Stacks of screens
import RestaurantStack from "./RestaurantStack";
import FavoritesStack from "./FavoritesStack";
import AccountStack from "./AccountStack";
import SearchStack from "./SearchStack"
import TopRestaurantStack from "./TopRestaurantStack";
import IntroStack from "./IntroStack";

const Tab= createBottomTabNavigator();


export default function Navigation () {

    return(
            <NavigationContainer>
                
                <Tab.Navigator
                    initialRouteName="intro"
                    tabBarOptions={{
                        inactiveTintColor: "#646464",
                        activeTintColor: "#00A680",
                        style:{
                            backgroundColor: '#F2F2F2',
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                        }
                    }}
                    screenOptions= {({ route }) => ({
                        tabBarIcon: ({ color }) => screenOptions(route, color),
                    })}        
                >
                    <Tab.Screen
                        name="intro"
                        component={IntroStack}
                        options={{
                            tabBarButton: () => null,
                            tabBarVisible: false, // if you don't want to see the tab bar
                        }}
                    />
                    <Tab.Screen 
                        name="restaurants" 
                        component={RestaurantStack}
                        options= {{
                            title:"Restaurante",
                        }}
                    />
                    <Tab.Screen 
                        name="favorites" 
                        component={FavoritesStack}
                        options={{
                            title:"Favoritos",
                        }}
                    />
                    <Tab.Screen 
                        name="search" 
                        component={SearchStack}
                        options={{title: "Buscar"}}
                    />
                    <Tab.Screen 
                        name="top-restaurant" 
                        component={TopRestaurantStack}
                        options={{title:"Top Restaurantes"}}
                    />
                    <Tab.Screen 
                        name="account" 
                        component={AccountStack}
                        options={{title:"Perfil"}}
                    />
                </Tab.Navigator>
            </NavigationContainer>
    );
}

function screenOptions(route, color){
    let iconName;

    switch (route.name) {
        case "restaurants":
            iconName="compass-outline"
        break;
        
        case "favorites":
            iconName="heart-outline"
        break;

        case "search":
            iconName="magnify"
        break;

        case "top-restaurant":
            iconName="star-outline"
        break;

        case "account":
            iconName="account-outline"
        break;

        default:
        break;
    }

    return(
        <Icon type="material-community" name={iconName} size={22} color={color}/>
    )
}