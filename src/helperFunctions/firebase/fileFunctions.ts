import { db } from "../../config"
import { addDoc, collection, getDocs, where, query } from "firebase/firestore"

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
    return folders
}

// select folder (take in folderId)

// ================= file =================
// add file (take in file, folderId)

//
