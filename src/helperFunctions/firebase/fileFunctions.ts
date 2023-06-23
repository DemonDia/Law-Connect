import { db } from "../../config"
import {
    addDoc,
    collection,
    getDocs,
    where,
    query,
    doc,
    getDoc,
} from "firebase/firestore"

// ================= folder =================
// add folder (take in folder name and company Id)
export const addFolder = async (folderName: string, companyId: string) => {
    const folderRef = await addDoc(collection(db, "folders"), {
        folderName,
        companyId,
    })
    return folderRef.id
}

// display folder (take in company id)
export const getFoldersByCompanyId = async (companyId: string) => {
    const findQuery = query(
        collection(db, "folders"),
        where("companyId", "==", companyId),
    )
    const querySnapshot = await getDocs(findQuery)
    const folders: any[] = []
    querySnapshot.forEach((doc: any) => {
        const { folderName } = doc.data()
        folders.push({ folderId: doc.id, folderName })
    })
    return folders.sort(function (a, b) {
        var textA = a.folderName.toUpperCase()
        var textB = b.folderName.toUpperCase()
        return textA < textB ? -1 : textA > textB ? 1 : 0
    })
}

// take folder by Id
export const getFolderByFolderId = async (folderId: string) => {
    const docRef = doc(db, "folders", folderId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        return docSnap.data()
    }
    return null
}

// ================= file =================

// get all files in folder
export const getAllFilesFromFolder = async (folderId: string) => {
    const findQuery = query(
        collection(db, "file"),
        where("folderId", "==", folderId),
    )
    const querySnapshot = await getDocs(findQuery)
    const files: any[] = []
    querySnapshot.forEach((doc: any) => {
        files.push(doc.data())
    })
    return files.sort(function (a, b) {
        var textA = a.fileName.toUpperCase()
        var textB = b.fileName.toUpperCase()
        return textA < textB ? -1 : textA > textB ? 1 : 0
    })
}
