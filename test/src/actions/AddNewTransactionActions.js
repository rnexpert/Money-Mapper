import { Actions, ActionConst } from 'react-native-router-flux';
import axios from 'axios';
import { UPDATE_TRANSACTION_DATE, UPDATE_LOCATION } from '../actions/types';
import baseurl from '../url';


// action dispatched when user clicks Done button on Add New Subcategory page
export const addNewTransaction = (token, date, subcategory_id, description, location, amount) => {

    return (dispatch) => {
        const axiosData = {
            token: token,
            date: date,
            subcategoryid: subcategory_id,
            description: description,
            location: location,
            amount: amount
        };

        const endpoint = baseurl + "/api/addnewtransaction";
        console.log('Axios data', axiosData);
        axios.post(endpoint, axiosData)
            .then(response => {
                // After everything is successful re-route the user to the home page
                Actions.home({type: ActionConst.RESET});
            })
            .catch(err => {
                console.log('error: ', err);
            });
    };
};

export const updateTransactionDate = (date) => {
    return {
        type: UPDATE_TRANSACTION_DATE,
        payload: date
    }
}

export const updateLocation = (location) => {
    return {
        type: UPDATE_LOCATION,
        payload: location
    }
}
