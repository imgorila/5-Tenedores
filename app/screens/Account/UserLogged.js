import React, {useRef, useEffect, useState} from "react";
import {StyleSheet,View, Text} from "react-native";
import * as firebase from "firebase";
import {Button} from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";
import AccountOptions from "../../components/Account/AccountOptions";

export default function UserLogged(){
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [reloadUserInfo, setReloadUserInfo] = useState(false);
    const toastRef = useRef();

    useEffect(() => {
        (async () => {
            const user = await firebase.auth().currentUser;
            setUserInfo(user);
        })();
        setReloadUserInfo(false);
    }, [reloadUserInfo]);

    return(
        <View>
            {userInfo && (
                    <InfoUser 
                        userInfo={userInfo} 
                        toastRef={toastRef}
                        setLoading={setLoading}
                        setLoadingText={setLoadingText}
                    />
                )
            }

            <AccountOptions
                userInfo={userInfo}
                toastRef={toastRef}
                setReloadUserInfo={setReloadUserInfo}
            />
            
            <Button 
                title="Cerrar Sesion"
                titleStyle={{fontFamily:"sans-serif-condensed"}}
                containerStyle={styles.btnContainerLogout}
                buttonStyle={styles.btnLogout}
                onPress={() => firebase.auth().signOut()}
            />
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading text={loadingText} isVisible={loading} />
        </View>
    )
}

const styles = StyleSheet.create({
    btnContainerLogout:{
        width:"95%",
        justifyContent:"center",
        marginTop:"-15%",
    },
    btnLogout:{
        backgroundColor:"#00A680",
        borderRadius:25,
        marginLeft:"5%",
        marginBottom:10,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.5,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},
    },
});