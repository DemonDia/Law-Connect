import { db } from "../../config";
import {
    collection,
    getDocs,
    where,
    query,
} from "firebase/firestore";

// find user
// returns user if any
// else return null
export const findUserById = async (userId: string) => {
    const findQuery = query(
        collection(db, "users"),
        where("userId", "==", userId)
    );
    const docSnap = await getDocs(findQuery);
    let foundUser: any = null;

    docSnap.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        foundUser = doc.data();
        foundUser = { ...foundUser, id: doc.id };
    });
    return foundUser;
};

// ========== find user by userTypes ==========
// "0" for mentor
// "1" for mentee
// "2" for company
export const findUsersByUserTypes = async (userType: string) => {
    const findQuery = query(
        collection(db, "users"),
        where("userType", "==", userType)
    );
    const docSnap = await getDocs(findQuery);
    let targetUsers: any = [];

    docSnap.forEach((doc) => {
        targetUsers.push(doc.data());
    });
    return targetUsers;
};
