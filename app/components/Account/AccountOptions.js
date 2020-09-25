import React, {useState} from 'react';
import {StyleSheet,View,Text } from 'react-native';
import {ListItem} from "react-native-elements";
import {map} from "lodash";
import Modal from "../Modal";
import ChangeDisplayName from "./ChangeDisplayName";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default function AccountOptions(props){
    const {userInfo, toastRef, setReloadUserInfo} = props;
    const [showModal, setShowModal] = useState(true);
    const [renderComponent, setRenderComponent] = useState(null);

    const selectedComponent = (key) => {
        switch (key) {
            case "displayName":
                setRenderComponent(<ChangeDisplayName 
                    displayName={userInfo.displayName}
                    setShowModal={setShowModal}
                    toastRef={toastRef}
                    setReloadUserInfo={setReloadUserInfo}
                />);
                setShowModal(true);
            break;
            case "email":
                setRenderComponent(<ChangeEmailForm
                    email={userInfo.email}
                    setShowModal={setShowModal}
                    toastRef={toastRef}
                    setReloadUserInfo={setReloadUserInfo}                   
                />);
                setShowModal(true);
            break;
            case "password":
                setRenderComponent(<ChangePasswordForm
                    password={userInfo.password}
                    setShowModal={setShowModal}
                    toastRef={toastRef}
                />);
                setShowModal(true);
            break;
            default:
                setRenderComponent(null);
                setShowModal(false);
            break;
        }
    }
    const menuOptions=generateOptions(selectedComponent);

    return(
        <View>
            
            <Text style={styles.catHeader}>Cuenta</Text>
            <View style={styles.formContainer}>
                {map(menuOptions, (menu,index) => (
                    <ListItem
                        key={index}
                        title={menu.title}
                        leftIcon={{
                            type:menu.type,
                            name:menu.iconNameLeft,
                            color:menu.iconColorLeft,
                            marginLeft:-10,
                            marginRight:2,
                        }}
                        titleStyle={{fontFamily:"sans-serif-condensed"}}
                        containerStyle={styles.menuContainer}
                        onPress={menu.onPress}
                        underlayColor={'transparent'}
                    />    
                ))}

                {renderComponent && (
                    <Modal isVisible={showModal} setIsVisible={setShowModal}>
                        {renderComponent}
                    </Modal>
                )}
            </View>
        </View>
    )
}

function generateOptions (selectedComponent){
    return[
        {
            title:"Cambiar nombre y apellidos",
            iconType:"material-community",
            iconNameLeft:"account-circle",
            iconColorLeft:"#00A680",
            onPress:() => selectedComponent ("displayName")
        },
        {
            title:"Cambiar email",
            iconType:"material-community",
            iconNameLeft:"email",
            iconColorLeft:"#00A680",
            onPress:() => selectedComponent ("email")
        },
        {
            title:"Cambiar contraseña",
            iconType:"material-community",
            iconNameLeft:"autorenew",
            iconColorLeft:"#00A680",
            onPress:() => selectedComponent ("password")
        }
    ]
}


const styles = StyleSheet.create({
  menuContainer:{
      width:"90%",
      marginLeft:"5%",
      borderBottomWidth:1,
      borderBottomColor:"#CCC",
      backgroundColor:"transparent",
  },
  formContainer:{
    height:"55%",
    width:"95%",
    justifyContent:"center",
    backgroundColor:"#FFF",
    marginTop:15,
    marginBottom:20,
    marginLeft:"2.5%",
    marginRight:"2.5%",
    paddingBottom:"5%",
    borderRadius:10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.5,
    elevation: 6,
    shadowRadius: 15 ,
    shadowOffset : { width: 1, height: 13},
  },
  catHeader:{
      fontWeight:"bold",
      fontStyle:"italic",
      fontFamily:"sans-serif-condensed",
      fontSize:17.5,
      marginLeft:"5%",
      marginTop:25
  }
})