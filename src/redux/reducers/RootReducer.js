  
import AsyncStorage from "@react-native-community/async-storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

import itemsReducer from "./itemsReducer";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  items: itemsReducer,
});

export default persistReducer(persistConfig, rootReducer);